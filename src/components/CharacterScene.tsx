import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useReducedMotion } from '../hooks/useReducedMotion';

export type CharacterPoseMode = 'hero' | 'about' | 'workspace';

interface CharacterSceneProps {
  poseMode: CharacterPoseMode;
  visible: boolean;
}

type ClipKey = 'hero' | 'about-fold' | 'about-hold' | 'workspace';

interface ClipSpec {
  key: ClipKey;
  mode: CharacterPoseMode;
  src: string;
  poster: string;
  loop: boolean;
}

const CHARACTER_CLIPS: ClipSpec[] = [
  {
    key: 'hero',
    mode: 'hero',
    src: '/assets/clips/hero-idle.mp4',
    poster: '/assets/clips/hero-poster.jpg',
    loop: true,
  },
  {
    key: 'about-fold',
    mode: 'about',
    src: '/assets/clips/about-fold.mp4',
    poster: '/assets/clips/about-poster.jpg',
    loop: false,
  },
  {
    key: 'about-hold',
    mode: 'about',
    src: '/assets/clips/about-hold.mp4',
    poster: '/assets/clips/about-poster.jpg',
    loop: true,
  },
  {
    key: 'workspace',
    mode: 'workspace',
    src: '/assets/clips/workspace-typing.mp4',
    poster: '/assets/clips/workspace-poster.jpg',
    loop: true,
  },
];

const MODE_ASPECT: Record<CharacterPoseMode, string> = {
  hero: '960 / 540',
  about: '960 / 540',
  workspace: '960 / 534',
};

interface StageTransform {
  x: string;
  y: string;
  width: string;
}

function getStageTransform(mode: CharacterPoseMode, isDesktop: boolean): StageTransform {
  if (!isDesktop) {
    if (mode === 'workspace') {
      return { x: '0vw', y: '4vh', width: 'min(96vw, 500px)' };
    }
    if (mode === 'about') {
      return { x: '0vw', y: '-14vh', width: 'min(92vw, 420px)' };
    }
    return { x: '0vw', y: '-2vh', width: 'min(98vw, 480px)' };
  }

  if (mode === 'about') {
    return {
      x: '-20vw',
      y: '2vh',
      width: 'min(54vw, 700px)',
    };
  }
  if (mode === 'workspace') {
    return {
      x: '-3vw',
      y: '2vh',
      width: 'min(56vw, 720px)',
    };
  }
  // Hero: wide uncropped 16:9 stage centered between flanks so waving hand stays 100% clear
  return {
    x: '0vw',
    y: '2vh',
    width: 'min(64vw, 820px)',
  };
}

const VERTEX_SHADER_SRC = `
  attribute vec2 aPos;
  varying vec2 vUv;
  void main() {
    vUv = aPos * 0.5 + 0.5;
    gl_Position = vec4(aPos, 0.0, 1.0);
  }
`;

// Real-time luma-alpha cutout shader: turns studio black (#000) into true transparent alpha
// so characters render like transparent PNG / GLB cutouts over the scene background.
const FRAGMENT_SHADER_SRC = `
  precision mediump float;
  varying vec2 vUv;
  uniform sampler2D uTexA;
  uniform sampler2D uTexB;
  uniform float uMix;

  vec4 keyFrame(vec4 tex, vec2 uv) {
    float luma = max(tex.r, max(tex.g, tex.b));
    float alpha = smoothstep(0.012, 0.048, luma);
    vec3 rgb = max(tex.rgb - vec3(0.005), 0.0) / 0.995;
    // Soft bottom torso fade only (bottom 15%), leaving waving fingers and head 100% crisp
    float bottomFade = smoothstep(0.0, 0.15, uv.y);
    return vec4(rgb, alpha * bottomFade);
  }

  void main() {
    vec4 ca = keyFrame(texture2D(uTexA, vUv), vUv);
    if (uMix <= 0.001) {
      gl_FragColor = vec4(ca.rgb * ca.a, ca.a);
      return;
    }
    vec4 cb = keyFrame(texture2D(uTexB, vUv), vUv);
    float a = mix(ca.a, cb.a, uMix);
    vec3 rgb = mix(ca.rgb * ca.a, cb.rgb * cb.a, uMix);
    gl_FragColor = vec4(rgb, a);
  }
`;

function compileShader(
  gl: WebGLRenderingContext,
  type: number,
  source: string,
): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

/**
 * CharacterScene:
 * GLB-style transparent cutout character stage driven by uncropped keyframe clips
 * composited via a real-time WebGL luma-alpha shader over #000000 studio lighting.
 */
export const CharacterScene: React.FC<CharacterSceneProps> = ({
  poseMode,
  visible,
}) => {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const tiltRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const videoRefs = useRef<Record<ClipKey, HTMLVideoElement | null>>({
    hero: null,
    'about-fold': null,
    'about-hold': null,
    workspace: null,
  });

  const reducedMotion = useReducedMotion();
  const [isDesktop, setIsDesktop] = useState<boolean>(() =>
    typeof window !== 'undefined' ? window.innerWidth >= 1024 : true,
  );
  const [aboutPhase, setAboutPhase] = useState<'fold' | 'hold'>('fold');
  const [webglReady, setWebglReady] = useState(true);
  const [firstFrameDrawn, setFirstFrameDrawn] = useState(false);
  const firstFrameRef = useRef(false);
  const [videoFailed, setVideoFailed] = useState<Record<ClipKey, boolean>>({
    hero: false,
    'about-fold': false,
    'about-hold': false,
    workspace: false,
  });

  const activeClipKey: ClipKey =
    poseMode === 'about' ? (aboutPhase === 'fold' ? 'about-fold' : 'about-hold') : poseMode;

  const transitionRef = useRef<{
    fromKey: ClipKey;
    toKey: ClipKey;
    mix: number;
    lastSwitchMs: number;
  }>({
    fromKey: 'hero',
    toKey: 'hero',
    mix: 0,
    lastSwitchMs: 0,
  });

  // Track responsive desktop/mobile stage coordinates on resize
  useEffect(() => {
    const onResize = () => setIsDesktop(window.innerWidth >= 1024);
    onResize();
    window.addEventListener('resize', onResize, { passive: true });
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Re-trigger arm-folding keyframes cleanly from frame 0 whenever scrolling into About
  useEffect(() => {
    if (poseMode === 'about') {
      setAboutPhase('fold');
      const foldVid = videoRefs.current['about-fold'];
      if (foldVid) foldVid.currentTime = 0;
      const holdVid = videoRefs.current['about-hold'];
      if (holdVid) holdVid.currentTime = 0;
    }
  }, [poseMode]);

  // Record smooth crossfade source/target whenever activeClipKey changes
  useEffect(() => {
    const tr = transitionRef.current;
    if (tr.toKey !== activeClipKey) {
      const isInstantAboutHandoff =
        tr.toKey === 'about-fold' && activeClipKey === 'about-hold';
      tr.fromKey = tr.toKey;
      tr.toKey = activeClipKey;
      tr.mix = isInstantAboutHandoff ? 1 : 0;
      tr.lastSwitchMs = performance.now();
    }
  }, [activeClipKey]);

  // Smooth GSAP scroll transition between Hero -> About -> Workspace
  useEffect(() => {
    const stageEl = stageRef.current;
    if (!stageEl) return;

    const target = getStageTransform(poseMode, isDesktop);
    if (reducedMotion) {
      gsap.set(stageEl, {
        x: target.x,
        y: target.y,
        width: target.width,
      });
      return;
    }

    gsap.to(stageEl, {
      x: target.x,
      y: target.y,
      width: target.width,
      duration: 0.95,
      ease: 'power3.out',
      overwrite: 'auto',
    });
  }, [poseMode, isDesktop, reducedMotion]);

  // Subtle interactive 3D depth parallax reacting to cursor position
  useEffect(() => {
    const tiltEl = tiltRef.current;
    if (!tiltEl || reducedMotion || !isDesktop) return;

    const rotY = gsap.quickTo(tiltEl, 'rotateY', { duration: 0.6, ease: 'power2.out' });
    const rotX = gsap.quickTo(tiltEl, 'rotateX', { duration: 0.6, ease: 'power2.out' });
    const shiftX = gsap.quickTo(tiltEl, 'x', { duration: 0.7, ease: 'power2.out' });
    const shiftY = gsap.quickTo(tiltEl, 'y', { duration: 0.7, ease: 'power2.out' });

    const onPointerMove = (e: PointerEvent) => {
      if (!visible) return;
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      rotY(nx * 3.4);
      rotX(-ny * 2.4);
      shiftX(nx * 8);
      shiftY(ny * 6);
    };

    const onPointerLeave = () => {
      rotY(0);
      rotX(0);
      shiftX(0);
      shiftY(0);
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    document.addEventListener('mouseleave', onPointerLeave);

    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('mouseleave', onPointerLeave);
      gsap.killTweensOf(tiltEl);
    };
  }, [reducedMotion, isDesktop, visible]);

  // Play only the active clip keyframe state when visible and tab is active
  useEffect(() => {
    const syncPlayback = () => {
      (Object.keys(videoRefs.current) as ClipKey[]).forEach((key) => {
        const vid = videoRefs.current[key];
        if (!vid) return;

        const shouldPlay =
          visible &&
          !reducedMotion &&
          !document.hidden &&
          key === activeClipKey &&
          !videoFailed[key];

        if (shouldPlay) {
          if (vid.paused) {
            vid.play().catch(() => {
              // Ignore browser autoplay block; poster or canvas remains visible
            });
          }
        } else if (!vid.paused) {
          vid.pause();
        }
      });
    };

    syncPlayback();
    document.addEventListener('visibilitychange', syncPlayback);
    return () => document.removeEventListener('visibilitychange', syncPlayback);
  }, [activeClipKey, visible, reducedMotion, videoFailed]);

  // Real-time WebGL transparent alpha cutout render loop
  useEffect(() => {
    if (reducedMotion) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl', {
      alpha: true,
      premultipliedAlpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });

    if (!gl) {
      setWebglReady(false);
      return;
    }

    const vs = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER_SRC);
    const fs = compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER_SRC);
    if (!vs || !fs) {
      setWebglReady(false);
      return;
    }

    const program = gl.createProgram();
    if (!program) {
      setWebglReady(false);
      return;
    }
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      setWebglReady(false);
      return;
    }

    gl.useProgram(program);

    const quadBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quadBuf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW,
    );

    const aPos = gl.getAttribLocation(program, 'aPos');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const createVideoTexture = (unit: number) => {
      const tex = gl.createTexture();
      gl.activeTexture(unit);
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      return tex;
    };

    const texA = createVideoTexture(gl.TEXTURE0);
    const texB = createVideoTexture(gl.TEXTURE1);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);

    const uTexA = gl.getUniformLocation(program, 'uTexA');
    const uTexB = gl.getUniformLocation(program, 'uTexB');
    const uMix = gl.getUniformLocation(program, 'uMix');
    gl.uniform1i(uTexA, 0);
    gl.uniform1i(uTexB, 1);

    gl.clearColor(0, 0, 0, 0);

    let rafId = 0;
    const render = (now: number) => {
      rafId = requestAnimationFrame(render);
      if (!visible || document.hidden) return;

      const tr = transitionRef.current;
      const vidA = videoRefs.current[tr.fromKey];
      const vidB = videoRefs.current[tr.toKey];

      if (!vidB || vidB.readyState < 2) return;

      const elapsed = now - tr.lastSwitchMs;
      const mix = tr.fromKey === tr.toKey ? 0 : Math.min(1, elapsed / 320);

      if (mix >= 1) {
        tr.fromKey = tr.toKey;
      }

      const activeVid = mix === 0 ? vidB : vidA && vidA.readyState >= 2 ? vidA : vidB;

      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, texA);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, activeVid);

      if (tr.fromKey !== tr.toKey && mix > 0 && mix < 1 && vidB.readyState >= 2) {
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, texB);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, vidB);
        gl.uniform1f(uMix, mix);
      } else {
        gl.uniform1f(uMix, 0);
      }

      gl.drawArrays(gl.TRIANGLES, 0, 6);
      if (!firstFrameRef.current) {
        firstFrameRef.current = true;
        setFirstFrameDrawn(true);
      }
    };

    rafId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafId);
      gl.deleteTexture(texA);
      gl.deleteTexture(texB);
      gl.deleteBuffer(quadBuf);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteProgram(program);
    };
  }, [reducedMotion, visible]);

  const activeClip =
    CHARACTER_CLIPS.find((c) => c.key === activeClipKey) ?? CHARACTER_CLIPS[0];

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none fixed inset-0 z-10 flex items-center justify-center overflow-hidden transition-opacity duration-500 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div
        ref={stageRef}
        className="relative flex items-center justify-center will-change-transform"
        style={{ perspective: '1100px' }}
      >
        <div
          ref={tiltRef}
          className="relative w-full will-change-transform"
          style={{
            aspectRatio: MODE_ASPECT[poseMode],
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Subtle violet-charcoal studio aura matching character shoulder rim light */}
          <div
            className="pointer-events-none absolute inset-x-[14%] inset-y-[6%] -z-10 rounded-full blur-3xl"
            style={{
              background:
                'radial-gradient(circle at 50% 42%, rgba(139, 92, 246, 0.16) 0%, rgba(88, 28, 135, 0.06) 45%, transparent 74%)',
            }}
          />

          {/* Hidden buffered video sources driving the transparent WebGL cutout */}
          {CHARACTER_CLIPS.map((clip) => (
            <video
              key={clip.key}
              ref={(el) => {
                videoRefs.current[clip.key] = el;
              }}
              src={clip.src}
              poster={clip.poster}
              autoPlay={clip.key === 'hero'}
              muted
              loop={clip.loop}
              playsInline
              preload="auto"
              crossOrigin="anonymous"
              disablePictureInPicture
              onEnded={() => {
                if (clip.key === 'about-fold') {
                  setAboutPhase('hold');
                }
              }}
              onError={() =>
                setVideoFailed((prev) => ({ ...prev, [clip.key]: true }))
              }
              className={
                !reducedMotion && webglReady && !videoFailed[clip.key]
                  ? 'pointer-events-none absolute h-px w-px opacity-0'
                  : `absolute inset-0 h-full w-full object-contain mix-blend-screen select-none transition-opacity duration-300 ${
                      clip.key === activeClipKey ? 'opacity-100' : 'opacity-0'
                    }`
              }
            />
          ))}

          {(reducedMotion || videoFailed[activeClipKey] || !firstFrameDrawn || !webglReady) && (
            <img
              src={activeClip.poster}
              alt=""
              className="absolute inset-0 h-full w-full object-contain mix-blend-screen select-none"
              style={{
                maskImage: 'linear-gradient(to bottom, black 84%, transparent 100%)',
                WebkitMaskImage: 'linear-gradient(to bottom, black 84%, transparent 100%)',
              }}
            />
          )}

          {!reducedMotion && webglReady && !videoFailed[activeClipKey] && (
            <canvas
              ref={canvasRef}
              width={960}
              height={540}
              className="relative h-full w-full object-contain select-none"
            />
          )}
        </div>
      </div>
    </div>
  );
};
