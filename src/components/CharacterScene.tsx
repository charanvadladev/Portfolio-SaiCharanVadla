import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useReducedMotion } from '../hooks/useReducedMotion';

export type CharacterPoseMode = 'hero' | 'about' | 'workspace';

interface CharacterSceneProps {
  poseMode: CharacterPoseMode;
  visible: boolean;
}

interface ClipSpec {
  id: CharacterPoseMode;
  src: string;
  poster: string;
  aspectRatio: string;
}

const CHARACTER_CLIPS: ClipSpec[] = [
  {
    id: 'hero',
    src: '/assets/clips/hero-idle.mp4',
    poster: '/assets/clips/hero-poster.jpg',
    aspectRatio: '560 / 580',
  },
  {
    id: 'about',
    src: '/assets/clips/about-focus.mp4',
    poster: '/assets/clips/about-poster.jpg',
    aspectRatio: '460 / 470',
  },
  {
    id: 'workspace',
    src: '/assets/clips/workspace-typing.mp4',
    poster: '/assets/clips/workspace-poster.jpg',
    aspectRatio: '1080 / 676',
  },
];

interface StageTransform {
  x: string;
  y: string;
  width: string;
}

function getStageTransform(mode: CharacterPoseMode, isDesktop: boolean): StageTransform {
  if (!isDesktop) {
    if (mode === 'workspace') {
      return { x: '0vw', y: '4vh', width: 'min(92vw, 460px)' };
    }
    if (mode === 'about') {
      return { x: '0vw', y: '-14vh', width: 'min(76vw, 310px)' };
    }
    return { x: '0vw', y: '-2vh', width: 'min(82vw, 340px)' };
  }

  if (mode === 'about') {
    return {
      x: '-23vw',
      y: '1.5vh',
      width: 'min(36vw, 430px)',
    };
  }
  if (mode === 'workspace') {
    return {
      x: '-4.2vw',
      y: '2vh',
      width: 'min(42vw, 535px)',
    };
  }
  // Hero: centered bust between left & right intro columns
  return {
    x: '0vw',
    y: '1.5vh',
    width: 'min(35vw, 435px)',
  };
}

/**
 * CharacterScene:
 * Integrates curated, trimmed, cropped, and seamlessly looping Google Flow
 * character video clips into the persistent scroll-choreographed stage.
 * Keeps smooth GSAP scroll transitions between Hero, About, and What I Do
 * while blending cleanly into the #050407 obsidian canvas.
 */
export const CharacterScene: React.FC<CharacterSceneProps> = ({
  poseMode,
  visible,
}) => {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const tiltRef = useRef<HTMLDivElement | null>(null);
  const videoRefs = useRef<Record<CharacterPoseMode, HTMLVideoElement | null>>({
    hero: null,
    about: null,
    workspace: null,
  });

  const reducedMotion = useReducedMotion();
  const [isDesktop, setIsDesktop] = useState<boolean>(() =>
    typeof window !== 'undefined' ? window.innerWidth >= 1024 : true,
  );
  const [videoFailed, setVideoFailed] = useState<Record<CharacterPoseMode, boolean>>({
    hero: false,
    about: false,
    workspace: false,
  });

  // Track responsive desktop/mobile stage coordinates on resize
  useEffect(() => {
    const onResize = () => setIsDesktop(window.innerWidth >= 1024);
    onResize();
    window.addEventListener('resize', onResize, { passive: true });
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Keep original smooth GSAP scroll transition between Hero -> About -> Workspace
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

  // Subtle interactive depth parallax reacting to cursor position
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
      rotY(nx * 3.2);
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

  // Play only the active section's clip when visible and tab is active
  useEffect(() => {
    const syncPlayback = () => {
      (Object.keys(videoRefs.current) as CharacterPoseMode[]).forEach((mode) => {
        const vid = videoRefs.current[mode];
        if (!vid) return;

        const shouldPlay =
          visible &&
          !reducedMotion &&
          !document.hidden &&
          mode === poseMode &&
          !videoFailed[mode];

        if (shouldPlay) {
          if (vid.paused) {
            vid.play().catch(() => {
              // Ignore browser autoplay block; crisp poster frame remains visible underneath
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
  }, [poseMode, visible, reducedMotion, videoFailed]);

  const activeClip = CHARACTER_CLIPS.find((c) => c.id === poseMode) ?? CHARACTER_CLIPS[0];

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
            aspectRatio: activeClip.aspectRatio,
            transformStyle: 'preserve-3d',
            maskImage:
              'radial-gradient(ellipse 74% 80% at 50% 48%, rgba(0,0,0,1) 56%, rgba(0,0,0,0.6) 78%, rgba(0,0,0,0) 99%)',
            WebkitMaskImage:
              'radial-gradient(ellipse 74% 80% at 50% 48%, rgba(0,0,0,1) 56%, rgba(0,0,0,0.6) 78%, rgba(0,0,0,0) 99%)',
          }}
        >
          {CHARACTER_CLIPS.map((clip) => {
            const isActive = clip.id === poseMode;
            const showFallbackPoster = reducedMotion || videoFailed[clip.id];

            return (
              <div
                key={clip.id}
                className={`absolute inset-0 flex items-center justify-center transition-opacity duration-500 ${
                  isActive ? 'opacity-100' : 'opacity-0'
                }`}
              >
                {showFallbackPoster ? (
                  <img
                    src={clip.poster}
                    alt=""
                    className="h-full w-full object-contain select-none"
                  />
                ) : (
                  <video
                    ref={(el) => {
                      videoRefs.current[clip.id] = el;
                    }}
                    src={clip.src}
                    poster={clip.poster}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="auto"
                    disablePictureInPicture
                    onError={() =>
                      setVideoFailed((prev) => ({ ...prev, [clip.id]: true }))
                    }
                    className="h-full w-full object-contain select-none"
                  />
                )}
              </div>
            );
          })}

          {/* Subtle radial edge scrim ensuring seamless blend into #050407 obsidian */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse 76% 80% at 50% 48%, transparent 56%, rgba(5,4,7,0.68) 84%, #050407 100%)',
            }}
          />
        </div>
      </div>
    </div>
  );
};
