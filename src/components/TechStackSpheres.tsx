import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import {
  SKILL_CATEGORIES,
  SKILLS_DATA,
  SkillCategory,
  SkillNode,
} from '../data/skills';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { revealSectionElements } from '../animations/scrollAnimations';

interface TechBadgeSpec {
  skillId: string;
  shortLabel: string;
  accentHex: string;
}

const FEATURED_SPHERES: TechBadgeSpec[] = [
  { skillId: 'react', shortLabel: 'REACT', accentHex: '#38bdf8' },
  { skillId: 'angular', shortLabel: 'ANGULAR', accentHex: '#a78bfa' },
  { skillId: 'typescript', shortLabel: 'TS', accentHex: '#38bdf8' },
  { skillId: 'dotnet', shortLabel: '.NET 8', accentHex: '#a78bfa' },
  { skillId: 'csharp', shortLabel: 'C#', accentHex: '#818cf8' },
  { skillId: 'java', shortLabel: 'JAVA', accentHex: '#38bdf8' },
  { skillId: 'fastapi', shortLabel: 'FASTAPI', accentHex: '#34d399' },
  { skillId: 'postgresql', shortLabel: 'POSTGRES', accentHex: '#38bdf8' },
  { skillId: 'mongodb', shortLabel: 'MONGO', accentHex: '#34d399' },
  { skillId: 'azure', shortLabel: 'AZURE', accentHex: '#38bdf8' },
  { skillId: 'aws', shortLabel: 'AWS', accentHex: '#f59e0b' },
  { skillId: 'docker', shortLabel: 'DOCKER', accentHex: '#38bdf8' },
  { skillId: 'kubernetes', shortLabel: 'K8S', accentHex: '#818cf8' },
  { skillId: 'terraform', shortLabel: 'TERRAFORM', accentHex: '#a78bfa' },
  { skillId: 'generative-ai', shortLabel: 'GEN AI', accentHex: '#a78bfa' },
  { skillId: 'computer-vision', shortLabel: 'VISION', accentHex: '#34d399' },
  { skillId: 'rabbitmq', shortLabel: 'RABBITMQ', accentHex: '#f59e0b' },
  { skillId: 'github-actions', shortLabel: 'CI/CD', accentHex: '#38bdf8' },
];

function createSphereBadgeTexture(
  label: string,
  category: string,
  accentHex: string,
  maxAnisotropy: number,
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    // Rich dark obsidian ceramic sphere finish
    const grad = ctx.createLinearGradient(0, 0, 512, 256);
    grad.addColorStop(0, '#101726');
    grad.addColorStop(0.5, '#0b101b');
    grad.addColorStop(1, '#161b2e');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 256);

    // Equator accent stripe
    ctx.fillStyle = accentHex;
    ctx.globalAlpha = 0.22;
    ctx.fillRect(0, 114, 512, 28);
    ctx.globalAlpha = 1;

    ctx.strokeStyle = accentHex;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, 114);
    ctx.lineTo(512, 114);
    ctx.moveTo(0, 142);
    ctx.lineTo(512, 142);
    ctx.stroke();

    // Draw label mirrored cleanly onto front & back of the sphere equators
    const drawEmblem = (cx: number) => {
      ctx.fillStyle = '#090d16';
      ctx.beginPath();
      ctx.arc(cx, 128, 56, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = accentHex;
      ctx.lineWidth = 4;
      ctx.stroke();

      ctx.fillStyle = '#f8fafc';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = label.length > 6 ? '700 18px sans-serif' : '700 24px sans-serif';
      ctx.fillText(label, cx, 122);

      ctx.fillStyle = accentHex;
      ctx.font = '600 11px monospace';
      ctx.fillText(category.toUpperCase().slice(0, 10), cx, 148);
    };

    drawEmblem(128);
    drawEmblem(384);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = maxAnisotropy;
  tex.needsUpdate = true;
  return tex;
}

// Pre-allocated math helpers (zero GC inside animation loop)
const _rayMouse = new THREE.Vector2();
const _cursorWorld = new THREE.Vector3();
const _deltaVec = new THREE.Vector3();
const _rayPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);

interface SphereBody {
  mesh: THREE.Mesh;
  skill: SkillNode;
  anchor: THREE.Vector3;
  velocity: THREE.Vector3;
  phase: number;
  baseScale: number;
}

export const TechStackSpheres: React.FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const canvasWrapRef = useRef<HTMLDivElement | null>(null);
  const reducedMotion = useReducedMotion();

  const [selectedCategory, setSelectedCategory] = useState<'All' | SkillCategory>('All');
  const [activeSkill, setActiveSkill] = useState<SkillNode>(SKILLS_DATA[0]);
  const [hoveredSkillId, setHoveredSkillId] = useState<string | null>(null);

  const selectedCategoryRef = useRef(selectedCategory);
  const onSelectSkillRef = useRef<(skill: SkillNode) => void>(() => {});

  useEffect(() => {
    selectedCategoryRef.current = selectedCategory;
  }, [selectedCategory]);

  onSelectSkillRef.current = (skill: SkillNode) => {
    setActiveSkill(skill);
  };

  useScrollAnimation(
    sectionRef,
    () => {
      if (sectionRef.current) {
        revealSectionElements(sectionRef.current, '[data-techstack-reveal]', reducedMotion);
      }
    },
    [reducedMotion],
  );

  // Three.js Interactive Floating Tech Spheres Canvas
  useEffect(() => {
    const container = canvasWrapRef.current;
    if (!container) return;

    const isSoftwareGl = (() => {
      try {
        const probe = document.createElement('canvas').getContext('webgl2');
        if (!probe) return true;
        const ext = probe.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : probe.RENDERER;
        const gpu = String(probe.getParameter(param));
        probe.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return true;
      }
    })();

    const width = container.clientWidth || 960;
    const height = container.clientHeight || 420;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x07090d, 0.032);

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 50);
    camera.position.set(0, 0.15, 11.2);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: !isSoftwareGl,
        powerPreference: 'high-performance',
      });
    } catch {
      return;
    }

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envTex = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTex;
    pmremGenerator.dispose();

    // Studio 3-point lighting
    const hemi = new THREE.HemisphereLight(0xa78bfa, 0x0f172a, 0.9);
    scene.add(hemi);

    const keyLight = new THREE.DirectionalLight(0xfff1e6, 2.1);
    keyLight.position.set(4, 6, 5);
    keyLight.castShadow = !isSoftwareGl;
    keyLight.shadow.mapSize.set(1024, 1024);
    keyLight.shadow.bias = -0.0005;
    keyLight.shadow.normalBias = 0.02;
    scene.add(keyLight);

    const rimCyan = new THREE.DirectionalLight(0x38bdf8, 1.9);
    rimCyan.position.set(-5, 2, -4);
    scene.add(rimCyan);

    const maxAniso = renderer.capabilities.getMaxAnisotropy();
    const sphereGeo = new THREE.SphereGeometry(0.56, 32, 24);
    const materials: THREE.Material[] = [];
    const textures: THREE.Texture[] = [];
    const bodies: SphereBody[] = [];
    const clickableMeshes: THREE.Mesh[] = [];

    const skillLookup = new Map(SKILLS_DATA.map((s) => [s.id, s]));
    const cols = 6;

    FEATURED_SPHERES.forEach((spec, idx) => {
      const skill = skillLookup.get(spec.skillId);
      if (!skill) return;

      const tex = createSphereBadgeTexture(
        spec.shortLabel,
        skill.category,
        spec.accentHex,
        maxAniso,
      );
      textures.push(tex);

      const mat = new THREE.MeshPhysicalMaterial({
        map: tex,
        roughness: 0.18,
        metalness: 0.25,
        clearcoat: 0.92,
        clearcoatRoughness: 0.12,
        emissive: new THREE.Color(spec.accentHex),
        emissiveIntensity: 0.08,
      });
      materials.push(mat);

      const mesh = new THREE.Mesh(sphereGeo, mat);
      const col = idx % cols;
      const row = Math.floor(idx / cols);
      const staggerX = row % 2 === 1 ? 0.55 : -0.4;
      const ax = (col - (cols - 1) / 2) * 1.65 + staggerX;
      const ay = (1 - row) * 1.48;
      const az = ((idx % 3) - 1) * 0.55;

      const baseScale = idx % 4 === 0 ? 1.08 : 0.92 + (idx % 3) * 0.06;
      mesh.position.set(ax, ay, az);
      mesh.scale.setScalar(baseScale);
      mesh.castShadow = !isSoftwareGl;
      mesh.userData.skill = skill;
      scene.add(mesh);
      clickableMeshes.push(mesh);

      bodies.push({
        mesh,
        skill,
        anchor: new THREE.Vector3(ax, ay, az),
        velocity: new THREE.Vector3(),
        phase: idx * 0.72,
        baseScale,
      });
    });

    const raycaster = new THREE.Raycaster();
    let pointerInside = false;
    let hoveredMesh: THREE.Mesh | null = null;
    let lastRaycastMs = 0;

    const updateMouseCoords = (clientX: number, clientY: number) => {
      const rect = renderer.domElement.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      _rayMouse.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      _rayMouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;
    };

    const onPointerMove = (e: PointerEvent) => {
      pointerInside = true;
      updateMouseCoords(e.clientX, e.clientY);

      const now = performance.now();
      if (now - lastRaycastMs < 40) return;
      lastRaycastMs = now;

      raycaster.setFromCamera(_rayMouse, camera);
      raycaster.ray.intersectPlane(_rayPlane, _cursorWorld);

      const hits = raycaster.intersectObjects(clickableMeshes, false);
      if (hits.length > 0) {
        const hitMesh = hits[0].object as THREE.Mesh;
        if (hoveredMesh !== hitMesh) {
          hoveredMesh = hitMesh;
          const skill = hitMesh.userData.skill as SkillNode | undefined;
          if (skill) {
            setHoveredSkillId(skill.id);
            onSelectSkillRef.current(skill);
          }
        }
        renderer.domElement.style.cursor = 'pointer';
      } else {
        if (hoveredMesh) {
          hoveredMesh = null;
          setHoveredSkillId(null);
        }
        renderer.domElement.style.cursor = 'grab';
      }
    };

    const onPointerLeave = () => {
      pointerInside = false;
      hoveredMesh = null;
      setHoveredSkillId(null);
      renderer.domElement.style.cursor = 'default';
    };

    const onClick = (e: MouseEvent) => {
      updateMouseCoords(e.clientX, e.clientY);
      raycaster.setFromCamera(_rayMouse, camera);
      const hits = raycaster.intersectObjects(clickableMeshes, false);
      if (hits.length > 0) {
        const hitMesh = hits[0].object as THREE.Mesh;
        const skill = hitMesh.userData.skill as SkillNode | undefined;
        if (skill) {
          onSelectSkillRef.current(skill);
          // Give gentle radial impulse on click
          const body = bodies.find((b) => b.mesh === hitMesh);
          if (body) {
            body.velocity.z += 2.2;
          }
        }
      }
    };

    renderer.domElement.addEventListener('pointermove', onPointerMove);
    renderer.domElement.addEventListener('pointerleave', onPointerLeave);
    renderer.domElement.addEventListener('click', onClick);

    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth || 960;
      const h = container.clientHeight || 420;
      camera.aspect = w / h;
      camera.position.z = w < 640 ? 15.8 : w < 1024 ? 13.2 : 11.2;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    onResize();
    window.addEventListener('resize', onResize);

    const clock = new THREE.Clock();
    let frameId = 0;
    let disposed = false;

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      if (!gl || !gl.fenceSync) {
        frameId = window.setTimeout(cb, 80);
        return;
      }
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        if (disposed) return;
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          if (sync) gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    const tick = () => {
      if (disposed) return;
      const dt = Math.min(0.05, clock.getDelta());
      const elapsed = clock.getElapsedTime();
      const activeCat = selectedCategoryRef.current;

      for (let i = 0; i < bodies.length; i++) {
        const b = bodies[i];
        const floatY = reducedMotion ? 0 : Math.sin(elapsed * 1.15 + b.phase) * 0.14;
        const floatX = reducedMotion ? 0 : Math.cos(elapsed * 0.8 + b.phase) * 0.08;

        // Spring pull back toward anchor
        const targetX = b.anchor.x + floatX;
        const targetY = b.anchor.y + floatY;
        const targetZ = b.anchor.z;

        b.velocity.x += (targetX - b.mesh.position.x) * 12 * dt;
        b.velocity.y += (targetY - b.mesh.position.y) * 12 * dt;
        b.velocity.z += (targetZ - b.mesh.position.z) * 12 * dt;

        // Soft cursor magnetic repulsion
        if (pointerInside && !reducedMotion) {
          _deltaVec.set(
            b.mesh.position.x - _cursorWorld.x,
            b.mesh.position.y - _cursorWorld.y,
            b.mesh.position.z - _cursorWorld.z,
          );
          const dist = _deltaVec.length();
          if (dist < 2.25 && dist > 0.001) {
            const push = (1 - dist / 2.25) * 14 * dt;
            _deltaVec.normalize();
            b.velocity.addScaledVector(_deltaVec, push);
          }
        }

        // Damping
        const dampFactor = Math.exp(-4.8 * dt);
        b.velocity.multiplyScalar(dampFactor);

        b.mesh.position.addScaledVector(b.velocity, dt);

        // Slow spin keeping badge facing mostly forward with gentle sway
        if (!reducedMotion) {
          b.mesh.rotation.y = Math.sin(elapsed * 0.65 + b.phase) * 0.38;
          b.mesh.rotation.x = Math.cos(elapsed * 0.55 + b.phase) * 0.14;
        }

        const isHovered = hoveredMesh === b.mesh;
        const matchesFilter = activeCat === 'All' || b.skill.category === activeCat;
        const targetScale = b.baseScale * (isHovered ? 1.24 : matchesFilter ? 1 : 0.72);
        const s = THREE.MathUtils.damp(b.mesh.scale.x, targetScale, 8, dt);
        b.mesh.scale.setScalar(s);

        const mat = b.mesh.material as THREE.MeshPhysicalMaterial;
        const targetEmissive = isHovered ? 0.42 : matchesFilter ? 0.1 : 0.02;
        mat.emissiveIntensity = THREE.MathUtils.damp(mat.emissiveIntensity, targetEmissive, 8, dt);
      }

      renderer.render(scene, camera);

      if (isSoftwareGl) afterDraw(tick);
      else frameId = requestAnimationFrame(tick);
    };

    tick();

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      renderer.domElement.removeEventListener('pointermove', onPointerMove);
      renderer.domElement.removeEventListener('pointerleave', onPointerLeave);
      renderer.domElement.removeEventListener('click', onClick);
      window.removeEventListener('resize', onResize);

      sphereGeo.dispose();
      materials.forEach((m) => m.dispose());
      textures.forEach((t) => t.dispose());
      envTex.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [reducedMotion]);

  const visibleSkills = useMemo(
    () =>
      selectedCategory === 'All'
        ? SKILLS_DATA
        : SKILLS_DATA.filter((s) => s.category === selectedCategory),
    [selectedCategory],
  );

  const connectedNames = useMemo(() => {
    const set = new Set(activeSkill.connections);
    return SKILLS_DATA.filter((s) => set.has(s.id)).map((s) => s.name);
  }, [activeSkill]);

  return (
    <section
      id="skills"
      ref={sectionRef}
      aria-labelledby="techstack-heading"
      className="relative border-t border-white/10 py-24 lg:py-32"
    >
      <div className="mx-auto max-w-[1320px] px-6 lg:px-12">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div data-techstack-reveal className="text-xs font-mono-tech uppercase tracking-[0.2em] text-[#38bdf8]">
              05. My Techstack
            </div>
            <h2
              id="techstack-heading"
              data-techstack-reveal
              className="mt-3 font-display text-3xl font-bold tracking-tight text-[#f3f6fa] sm:text-4xl lg:text-5xl"
            >
              Interactive 3D engineering ecosystem.
            </h2>
          </div>

          {/* Interactive Layer Filter Tabs */}
          <div
            data-techstack-reveal
            role="tablist"
            aria-label="Filter technologies by layer"
            className="inline-flex flex-wrap items-center gap-1 rounded-xl border border-white/10 bg-[#0d1118] p-1"
          >
            <button
              type="button"
              role="tab"
              aria-selected={selectedCategory === 'All'}
              onClick={() => setSelectedCategory('All')}
              className={`min-h-[36px] rounded-lg px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                selectedCategory === 'All'
                  ? 'bg-[#38bdf8] text-[#07090d]'
                  : 'text-[#94a3b8] hover:text-[#f3f6fa]'
              }`}
            >
              All
            </button>
            {SKILL_CATEGORIES.map((category) => (
              <button
                key={category}
                type="button"
                role="tab"
                aria-selected={selectedCategory === category}
                onClick={() => setSelectedCategory(category)}
                className={`min-h-[36px] rounded-lg px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                  selectedCategory === category
                    ? 'bg-[#38bdf8] text-[#07090d]'
                    : 'text-[#94a3b8] hover:text-[#f3f6fa]'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Interactive 3D Floating Tech Spheres Stage */}
        <div
          data-techstack-reveal
          className="relative mt-10 overflow-hidden rounded-2xl border border-white/10 bg-[#090c14]"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'radial-gradient(circle at 50% 45%, rgba(167,139,250,0.14), rgba(56,189,248,0.08) 42%, transparent 72%)',
            }}
          />

          <div
            ref={canvasWrapRef}
            aria-label="Interactive 3D technology spheres stage"
            className="relative h-[320px] w-full sm:h-[380px] lg:h-[430px]"
          />

          {/* Bottom Integrated Node Inspector Bar (Zero backdrop-filter over WebGL) */}
          <div className="border-t border-white/10 bg-[#0c101a] px-6 py-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono-tech text-[#94a3b8]">
                  <span className="text-[#38bdf8]">{activeSkill.category}</span>
                  <span aria-hidden="true" className="text-[#475569]">
                    ·
                  </span>
                  <span>
                    {hoveredSkillId === activeSkill.id
                      ? 'Active sphere focus'
                      : 'Hover or click any sphere'}
                  </span>
                </div>
                <div className="mt-1 font-display text-lg font-bold text-[#f3f6fa]">
                  {activeSkill.name}
                </div>
                <p className="mt-0.5 text-sm text-[#94a3b8]">{activeSkill.description}</p>
              </div>

              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-mono-tech text-[#cbd5e1] sm:max-w-xs sm:justify-end">
                <span className="text-[#64748b]">Links:</span>
                {connectedNames.map((name, idx) => (
                  <React.Fragment key={name}>
                    <span className="text-[#a78bfa]">{name}</span>
                    {idx < connectedNames.length - 1 && (
                      <span aria-hidden="true" className="text-[#475569]">
                        ·
                      </span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Accessible Keyboard & Mobile Layer Matrix */}
        <div
          data-techstack-reveal
          className="mt-8 grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6"
        >
          {visibleSkills.map((skill) => {
            const isSelected = activeSkill.id === skill.id;
            const isLinked = activeSkill.connections.includes(skill.id);

            return (
              <button
                key={skill.id}
                type="button"
                onClick={() => setActiveSkill(skill)}
                onMouseEnter={() => setActiveSkill(skill)}
                className={`flex min-h-[44px] items-center justify-between rounded-xl border px-3.5 py-2 text-left transition-colors ${
                  isSelected
                    ? 'border-[#38bdf8] bg-[#38bdf8]/12 text-[#f3f6fa]'
                    : isLinked
                      ? 'border-[#a78bfa]/50 bg-[#a78bfa]/10 text-[#f3f6fa]'
                      : 'border-white/10 bg-[#0d1118]/75 text-[#cbd5e1] hover:border-white/25'
                }`}
              >
                <span className="truncate text-xs font-mono-tech font-medium">
                  {skill.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
