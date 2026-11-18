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

const FEATURED_SKILL_IDS: string[] = [
  'javascript',
  'typescript',
  'react',
  'angular',
  'csharp',
  'dotnet',
  'java',
  'fastapi',
  'postgresql',
  'mongodb',
  'azure',
  'aws',
  'docker',
  'kubernetes',
  'terraform',
  'rabbitmq',
  'github-actions',
  'generative-ai',
];

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function drawFrameworkSymbol(
  ctx: CanvasRenderingContext2D,
  skillId: string,
  cx: number,
  cy: number,
) {
  ctx.save();
  ctx.translate(cx, cy);

  switch (skillId) {
    case 'javascript': {
      // Iconic JS yellow square with bold bottom-right black JS typography
      drawRoundedRect(ctx, -64, -64, 128, 128, 14);
      ctx.fillStyle = '#F7DF1E';
      ctx.fill();
      ctx.fillStyle = '#111111';
      ctx.font = '900 72px "Plus Jakarta Sans", Arial, sans-serif';
      ctx.textAlign = 'right';
      ctx.textBaseline = 'bottom';
      ctx.fillText('JS', 54, 56);
      break;
    }

    case 'typescript': {
      // Iconic TS blue square with bold bottom-right white TS typography
      drawRoundedRect(ctx, -64, -64, 128, 128, 14);
      ctx.fillStyle = '#3178C6';
      ctx.fill();
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '900 70px "Plus Jakarta Sans", Arial, sans-serif';
      ctx.textAlign = 'right';
      ctx.textBaseline = 'bottom';
      ctx.fillText('TS', 54, 56);
      break;
    }

    case 'react': {
      // Iconic React 3-orbit atom symbol + center nucleus
      ctx.strokeStyle = '#087EA4';
      ctx.lineWidth = 7;
      for (let i = 0; i < 3; i++) {
        ctx.save();
        ctx.rotate((i * Math.PI) / 3);
        ctx.beginPath();
        ctx.ellipse(0, -10, 62, 23, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }
      ctx.fillStyle = '#087EA4';
      ctx.beginPath();
      ctx.arc(0, -10, 12, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#0f172a';
      ctx.font = '700 26px "Plus Jakarta Sans", Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText('React', 0, 48);
      break;
    }

    case 'angular': {
      // Iconic Angular shield + bold geometric A
      ctx.beginPath();
      ctx.moveTo(0, -68);
      ctx.lineTo(60, -46);
      ctx.lineTo(50, 26);
      ctx.lineTo(0, 56);
      ctx.lineTo(-50, 26);
      ctx.lineTo(-60, -46);
      ctx.closePath();
      ctx.fillStyle = '#DD0031';
      ctx.fill();

      // Darker right half of shield
      ctx.beginPath();
      ctx.moveTo(0, -68);
      ctx.lineTo(60, -46);
      ctx.lineTo(50, 26);
      ctx.lineTo(0, 56);
      ctx.closePath();
      ctx.fillStyle = '#C3002F';
      ctx.fill();

      // White crisp geometric A
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 11;
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(-27, 24);
      ctx.lineTo(0, -38);
      ctx.lineTo(27, 24);
      ctx.moveTo(-17, 4);
      ctx.lineTo(17, 4);
      ctx.stroke();

      ctx.fillStyle = '#111827';
      ctx.font = '700 22px "Plus Jakarta Sans", Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText('Angular', 0, 62);
      break;
    }

    case 'dotnet': {
      // .NET purple badge + clean white .NET wordmark
      drawRoundedRect(ctx, -68, -46, 136, 92, 16);
      ctx.fillStyle = '#512BD4';
      ctx.fill();
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '800 46px "Plus Jakarta Sans", Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('.NET', 0, 2);
      break;
    }

    case 'csharp': {
      // Purple C# hexagon emblem
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const a = (i * Math.PI) / 3 - Math.PI / 6;
        const x = Math.cos(a) * 64;
        const y = Math.sin(a) * 64;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fillStyle = '#68217A';
      ctx.fill();
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '900 54px "Plus Jakarta Sans", Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('C#', 0, 3);
      break;
    }

    case 'java': {
      // Classic Java cup & two wavy steam lines + wordmark
      ctx.strokeStyle = '#EA2D2E';
      ctx.lineWidth = 6;
      ctx.lineCap = 'round';
      // Steam waves
      ctx.beginPath();
      ctx.moveTo(-10, -24);
      ctx.quadraticCurveTo(-24, -44, -6, -64);
      ctx.moveTo(10, -24);
      ctx.quadraticCurveTo(24, -42, 8, -60);
      ctx.stroke();

      // Cup + saucer
      ctx.strokeStyle = '#007396';
      ctx.lineWidth = 7;
      ctx.beginPath();
      ctx.moveTo(-30, -8);
      ctx.lineTo(26, -8);
      ctx.quadraticCurveTo(24, 24, -2, 24);
      ctx.quadraticCurveTo(-28, 24, -30, -8);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(27, 4, 11, -Math.PI / 2, Math.PI / 2);
      ctx.stroke();

      ctx.beginPath();
      ctx.ellipse(-2, 34, 38, 6, 0, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = '#007396';
      ctx.font = '700 25px Georgia, serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText('Java', 0, 48);
      break;
    }

    case 'fastapi': {
      // FastAPI teal circle + white lightning bolt
      ctx.fillStyle = '#009688';
      ctx.beginPath();
      ctx.arc(0, -10, 50, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.moveTo(6, -42);
      ctx.lineTo(-18, -6);
      ctx.lineTo(0, -6);
      ctx.lineTo(-8, 22);
      ctx.lineTo(20, -14);
      ctx.lineTo(2, -14);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#00796B';
      ctx.font = '700 24px "Plus Jakarta Sans", Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText('FastAPI', 0, 48);
      break;
    }

    case 'postgresql': {
      // PostgreSQL crisp elephant emblem + wordmark
      ctx.strokeStyle = '#336791';
      ctx.fillStyle = '#336791';
      ctx.lineWidth = 7;
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.arc(-16, -20, 24, Math.PI * 0.85, Math.PI * 2.15);
      ctx.arc(16, -20, 24, Math.PI * 0.85, Math.PI * 2.15);
      ctx.stroke();
      // Trunk
      ctx.beginPath();
      ctx.moveTo(0, -16);
      ctx.lineTo(0, 22);
      ctx.quadraticCurveTo(0, 34, 14, 30);
      ctx.stroke();
      // Eyes
      ctx.beginPath();
      ctx.arc(-12, -20, 4, 0, Math.PI * 2);
      ctx.arc(12, -20, 4, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#336791';
      ctx.font = '700 22px "Plus Jakarta Sans", Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText('PostgreSQL', 0, 48);
      break;
    }

    case 'mongodb': {
      // Iconic two-tone MongoDB leaf + wordmark
      ctx.beginPath();
      ctx.moveTo(0, -64);
      ctx.quadraticCurveTo(36, -20, 0, 32);
      ctx.closePath();
      ctx.fillStyle = '#47A248';
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(0, -64);
      ctx.quadraticCurveTo(-36, -20, 0, 32);
      ctx.closePath();
      ctx.fillStyle = '#13AA52';
      ctx.fill();

      ctx.fillStyle = '#8B8B8B';
      ctx.fillRect(-2.5, 22, 5, 18);

      ctx.fillStyle = '#116149';
      ctx.font = '700 23px "Plus Jakarta Sans", Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText('MongoDB', 0, 48);
      break;
    }

    case 'azure': {
      // Azure stylized angled geometric A + label
      ctx.beginPath();
      ctx.moveTo(-4, -56);
      ctx.lineTo(-48, 22);
      ctx.lineTo(-16, 22);
      ctx.lineTo(14, -34);
      ctx.closePath();
      ctx.fillStyle = '#0078D4';
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(10, -40);
      ctx.lineTo(-18, 22);
      ctx.lineTo(48, 22);
      ctx.closePath();
      ctx.fillStyle = '#39A0ED';
      ctx.fill();

      ctx.fillStyle = '#0078D4';
      ctx.font = '700 25px "Plus Jakarta Sans", Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText('Azure', 0, 44);
      break;
    }

    case 'aws': {
      // Iconic bold AWS lowercase typography + orange smile arrow
      ctx.fillStyle = '#18181b';
      ctx.font = '800 54px "Plus Jakarta Sans", Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('aws', 0, -14);

      ctx.strokeStyle = '#FF9900';
      ctx.lineWidth = 8;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(-48, 24);
      ctx.quadraticCurveTo(0, 48, 46, 20);
      ctx.stroke();

      // Arrow tip
      ctx.fillStyle = '#FF9900';
      ctx.beginPath();
      ctx.moveTo(52, 16);
      ctx.lineTo(36, 14);
      ctx.lineTo(44, 30);
      ctx.closePath();
      ctx.fill();
      break;
    }

    case 'docker': {
      // Iconic Docker container blocks + whale silhouette
      ctx.fillStyle = '#2496ED';
      const box = 16;
      const gap = 3;
      const startX = -38;
      const startY = -36;
      // Top row container (2 blocks)
      ctx.fillRect(startX + (box + gap), startY, box, box);
      ctx.fillRect(startX + (box + gap) * 2, startY, box, box);
      // Bottom row containers (4 blocks)
      for (let i = 0; i < 4; i++) {
        ctx.fillRect(startX + i * (box + gap), startY + box + gap, box, box);
      }
      // Whale hull
      ctx.beginPath();
      ctx.moveTo(-48, 4);
      ctx.lineTo(44, 4);
      ctx.quadraticCurveTo(42, 36, -6, 36);
      ctx.quadraticCurveTo(-48, 36, -48, 4);
      ctx.closePath();
      ctx.fill();
      // Tail
      ctx.beginPath();
      ctx.moveTo(42, 8);
      ctx.quadraticCurveTo(64, -4, 58, -18);
      ctx.quadraticCurveTo(44, -8, 38, 6);
      ctx.fill();

      ctx.fillStyle = '#0b66b2';
      ctx.font = '700 24px "Plus Jakarta Sans", Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText('docker', 0, 48);
      break;
    }

    case 'kubernetes': {
      // Kubernetes 7-spoke wheel + K8s label
      const r = 46;
      ctx.beginPath();
      for (let i = 0; i < 7; i++) {
        const a = (i * Math.PI * 2) / 7 - Math.PI / 2;
        const x = Math.cos(a) * r;
        const y = Math.sin(a) * r - 10;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fillStyle = '#326CE5';
      ctx.fill();

      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 4.5;
      ctx.beginPath();
      ctx.arc(0, -10, 22, 0, Math.PI * 2);
      ctx.stroke();

      for (let i = 0; i < 7; i++) {
        const a = (i * Math.PI * 2) / 7 - Math.PI / 2;
        ctx.beginPath();
        ctx.moveTo(0, -10);
        ctx.lineTo(Math.cos(a) * 34, Math.sin(a) * 34 - 10);
        ctx.stroke();
      }

      ctx.fillStyle = '#1e40af';
      ctx.font = '700 21px "Plus Jakarta Sans", Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText('Kubernetes', 0, 46);
      break;
    }

    case 'terraform': {
      // Terraform staggered isometric cubes
      ctx.fillStyle = '#7B42BC';
      const drawPrism = (ox: number, oy: number, fill: string) => {
        ctx.fillStyle = fill;
        ctx.beginPath();
        ctx.moveTo(ox, oy);
        ctx.lineTo(ox + 24, oy + 12);
        ctx.lineTo(ox + 24, oy + 38);
        ctx.lineTo(ox, oy + 26);
        ctx.closePath();
        ctx.fill();
      };
      drawPrism(-38, -50, '#7B42BC');
      drawPrism(-10, -36, '#7B42BC');
      drawPrism(-10, -4, '#7B42BC');
      drawPrism(18, -50, '#5C4EE5');

      ctx.fillStyle = '#4c1d95';
      ctx.font = '700 22px "Plus Jakarta Sans", Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText('Terraform', 0, 46);
      break;
    }

    case 'rabbitmq': {
      // RabbitMQ orange geometric rabbit badge
      drawRoundedRect(ctx, -46, -54, 92, 92, 12);
      ctx.fillStyle = '#FF6600';
      ctx.fill();

      ctx.fillStyle = '#FFFFFF';
      // Ears
      ctx.fillRect(-30, -42, 14, 34);
      ctx.fillRect(-6, -42, 14, 34);
      // Body
      ctx.fillRect(-30, -12, 60, 38);
      ctx.fillStyle = '#FF6600';
      ctx.fillRect(6, 0, 12, 12);

      ctx.fillStyle = '#c2410c';
      ctx.font = '700 22px "Plus Jakarta Sans", Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText('RabbitMQ', 0, 48);
      break;
    }

    case 'github-actions': {
      // GitHub Actions blue play/branch emblem
      ctx.fillStyle = '#2088FF';
      ctx.beginPath();
      ctx.arc(0, -12, 44, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.moveTo(-10, -30);
      ctx.lineTo(22, -12);
      ctx.lineTo(-10, 6);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#18181b';
      ctx.font = '700 22px "Plus Jakarta Sans", Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText('CI / CD', 0, 46);
      break;
    }

    default: {
      // Generative AI crisp four-point star emblem
      ctx.fillStyle = '#18181b';
      ctx.beginPath();
      ctx.moveTo(0, -56);
      ctx.quadraticCurveTo(6, -16, 46, -10);
      ctx.quadraticCurveTo(6, -4, 0, 36);
      ctx.quadraticCurveTo(-6, -4, -46, -10);
      ctx.quadraticCurveTo(-6, -16, 0, -56);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#27272a';
      ctx.font = '700 23px "Plus Jakarta Sans", Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText('Gen AI', 0, 46);
      break;
    }
  }

  ctx.restore();
}

function createWhiteBrandSphereTexture(
  skillId: string,
  maxAnisotropy: number,
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    // Pure crisp ceramic white background
    const grad = ctx.createLinearGradient(0, 0, 0, 512);
    grad.addColorStop(0, '#ffffff');
    grad.addColorStop(0.5, '#fafafa');
    grad.addColorStop(1, '#e4e4e7');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1024, 512);

    // Subtle soft studio rim shading around poles
    ctx.fillStyle = 'rgba(24, 24, 27, 0.04)';
    ctx.fillRect(0, 0, 1024, 34);
    ctx.fillRect(0, 478, 1024, 34);

    // Draw official symbol/font on front & back meridians of UV map
    drawFrameworkSymbol(ctx, skillId, 256, 256);
    drawFrameworkSymbol(ctx, skillId, 768, 256);
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

  // Three.js Interactive Large White Tech Spheres Canvas (Transparent Backdrop)
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

    const width = container.clientWidth || 1080;
    const height = container.clientHeight || 560;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 60);
    camera.position.set(0, 0.08, 12.6);

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

    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envTex = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTex;
    scene.environmentIntensity = 0.72;
    pmremGenerator.dispose();

    // Neutral monochrome studio lighting for clean white ceramic spheres
    const hemi = new THREE.HemisphereLight(0xffffff, 0x3f3f46, 1.35);
    scene.add(hemi);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.75);
    keyLight.position.set(5, 7, 7);
    keyLight.castShadow = !isSoftwareGl;
    keyLight.shadow.mapSize.set(1024, 1024);
    keyLight.shadow.bias = -0.0005;
    keyLight.shadow.normalBias = 0.02;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xf4f4f5, 1.15);
    rimLight.position.set(-6, 3, -5);
    scene.add(rimLight);

    const maxAniso = renderer.capabilities.getMaxAnisotropy();
    const sphereGeo = new THREE.SphereGeometry(0.84, 48, 36);
    const materials: THREE.Material[] = [];
    const textures: THREE.Texture[] = [];
    const bodies: SphereBody[] = [];
    const clickableMeshes: THREE.Mesh[] = [];

    const skillLookup = new Map(SKILLS_DATA.map((s) => [s.id, s]));
    const cols = 6;

    FEATURED_SKILL_IDS.forEach((skillId, idx) => {
      const skill = skillLookup.get(skillId);
      if (!skill) return;

      const tex = createWhiteBrandSphereTexture(skillId, maxAniso);
      textures.push(tex);

      const mat = new THREE.MeshPhysicalMaterial({
        map: tex,
        color: 0xffffff,
        roughness: 0.22,
        metalness: 0.04,
        clearcoat: 0.88,
        clearcoatRoughness: 0.12,
        emissive: new THREE.Color(0xffffff),
        emissiveIntensity: 0.05,
      });
      materials.push(mat);

      const mesh = new THREE.Mesh(sphereGeo, mat);
      const col = idx % cols;
      const row = Math.floor(idx / cols);
      const staggerX = row % 2 === 1 ? 0.55 : -0.45;
      const ax = (col - (cols - 1) / 2) * 2.18 + staggerX;
      const ay = (1 - row) * 2.04;
      const az = ((idx % 3) - 1) * 0.55;

      const baseScale = idx % 4 === 0 ? 1.06 : 0.94 + (idx % 3) * 0.04;
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
          const body = bodies.find((b) => b.mesh === hitMesh);
          if (body) {
            body.velocity.z += 2.4;
          }
        }
      }
    };

    renderer.domElement.addEventListener('pointermove', onPointerMove);
    renderer.domElement.addEventListener('pointerleave', onPointerLeave);
    renderer.domElement.addEventListener('click', onClick);

    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth || 1080;
      const h = container.clientHeight || 560;
      camera.aspect = w / h;
      camera.position.z = w < 640 ? 18.2 : w < 1024 ? 14.8 : 12.6;
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
        const floatY = reducedMotion ? 0 : Math.sin(elapsed * 1.05 + b.phase) * 0.16;
        const floatX = reducedMotion ? 0 : Math.cos(elapsed * 0.75 + b.phase) * 0.1;

        const targetX = b.anchor.x + floatX;
        const targetY = b.anchor.y + floatY;
        const targetZ = b.anchor.z;

        b.velocity.x += (targetX - b.mesh.position.x) * 11 * dt;
        b.velocity.y += (targetY - b.mesh.position.y) * 11 * dt;
        b.velocity.z += (targetZ - b.mesh.position.z) * 11 * dt;

        if (pointerInside && !reducedMotion) {
          _deltaVec.set(
            b.mesh.position.x - _cursorWorld.x,
            b.mesh.position.y - _cursorWorld.y,
            b.mesh.position.z - _cursorWorld.z,
          );
          const dist = _deltaVec.length();
          if (dist < 2.65 && dist > 0.001) {
            const push = (1 - dist / 2.65) * 15 * dt;
            _deltaVec.normalize();
            b.velocity.addScaledVector(_deltaVec, push);
          }
        }

        const dampFactor = Math.exp(-4.6 * dt);
        b.velocity.multiplyScalar(dampFactor);
        b.mesh.position.addScaledVector(b.velocity, dt);

        if (!reducedMotion) {
          b.mesh.rotation.y = Math.sin(elapsed * 0.6 + b.phase) * 0.28;
          b.mesh.rotation.x = Math.cos(elapsed * 0.5 + b.phase) * 0.12;
        }

        const isHovered = hoveredMesh === b.mesh;
        const matchesFilter = activeCat === 'All' || b.skill.category === activeCat;
        const targetScale = b.baseScale * (isHovered ? 1.18 : matchesFilter ? 1 : 0.72);
        const s = THREE.MathUtils.damp(b.mesh.scale.x, targetScale, 8, dt);
        b.mesh.scale.setScalar(s);

        const mat = b.mesh.material as THREE.MeshPhysicalMaterial;
        const targetEmissive = isHovered ? 0.22 : matchesFilter ? 0.06 : 0.01;
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
      aria-label="Techstack"
      className="relative border-t border-white/10 py-24 lg:py-32"
    >
      <div className="mx-auto max-w-[1320px] px-6 lg:px-12">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div
            data-techstack-reveal
            className="text-xs font-mono-tech uppercase tracking-[0.2em] text-white"
          >
            05. My Techstack
          </div>

          {/* Interactive Layer Filter Tabs */}
          <div
            data-techstack-reveal
            role="tablist"
            aria-label="Filter technologies by layer"
            className="inline-flex flex-wrap items-center gap-1 rounded-xl border border-white/12 bg-[#0a0b0f] p-1"
          >
            <button
              type="button"
              role="tab"
              aria-selected={selectedCategory === 'All'}
              onClick={() => setSelectedCategory('All')}
              className={`min-h-[36px] rounded-lg px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                selectedCategory === 'All'
                  ? 'bg-white text-[#050407]'
                  : 'text-[#a1a1aa] hover:text-white'
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
                    ? 'bg-white text-[#050407]'
                    : 'text-[#a1a1aa] hover:text-white'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Transparent Interactive Large White 3D Tech Spheres Stage */}
        <div data-techstack-reveal className="relative mt-6 bg-transparent">
          <div
            ref={canvasWrapRef}
            aria-label="Interactive 3D technology spheres stage"
            className="relative h-[430px] w-full bg-transparent sm:h-[510px] lg:h-[580px]"
          />

          {/* Bottom Node Inspector Bar */}
          <div className="mt-2 rounded-2xl border border-white/10 bg-[#09090d]/90 px-6 py-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono-tech text-[#a1a1aa]">
                  <span className="text-white">{activeSkill.category}</span>
                  <span aria-hidden="true" className="text-[#52525b]">
                    ·
                  </span>
                  <span>
                    {hoveredSkillId === activeSkill.id
                      ? 'Active sphere focus'
                      : 'Hover or click any sphere'}
                  </span>
                </div>
                <div className="mt-1 font-display text-lg font-bold text-white">
                  {activeSkill.name}
                </div>
                <p className="mt-0.5 text-sm text-[#a1a1aa]">{activeSkill.description}</p>
              </div>

              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-mono-tech text-[#e4e4e7] sm:max-w-xs sm:justify-end">
                <span className="text-[#71717a]">Links:</span>
                {connectedNames.map((name, idx) => (
                  <React.Fragment key={name}>
                    <span className="text-white">{name}</span>
                    {idx < connectedNames.length - 1 && (
                      <span aria-hidden="true" className="text-[#52525b]">
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
          className="mt-6 grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6"
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
                    ? 'border-white bg-white/15 text-white'
                    : isLinked
                      ? 'border-white/35 bg-white/[0.06] text-white'
                      : 'border-white/10 bg-[#09090d]/85 text-[#d4d4d8] hover:border-white/30'
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
