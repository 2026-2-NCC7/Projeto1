import React, { useEffect, useRef, useState } from 'react';
import { BOOK_SEQUENCE_STEPS, PLATFORM_SCREENS } from '../../data/qiMatchLandingData';

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    THREE?: any;
  }
}

interface ThreeBookStageProps {
  onExploreScreens: () => void;
  onSelectScreen?: (idx: number) => void;
}

const clamp = (v: number, min: number, max: number) => (v < min ? min : v > max ? max : v);
const smoothstep = (e0: number, e1: number, x: number) => {
  const t = clamp((x - e0) / (e1 - e0), 0, 1);
  return t * t * (3 - 2 * t);
};
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export const ThreeBookStage: React.FC<ThreeBookStageProps> = ({ onExploreScreens, onSelectScreen }) => {
  const stageWrapRef = useRef<HTMLDivElement | null>(null);
  const hostRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const screensPlateRef = useRef<HTMLDivElement | null>(null);

  const [activeStepIdx, setActiveStepIdx] = useState<number>(0); // Starts closed (Step 01 - A proposta em um volume)
  const targetProgressRef = useRef<number>(BOOK_SEQUENCE_STEPS[0].progress);
  const manualLockUntilRef = useRef<number>(0);
  const [webglReady, setWebglReady] = useState<boolean>(true);

  // Guarantee screens plate always starts scrolled to top showing Telas 01, 02 and 03
  useEffect(() => {
    if (activeStepIdx === 3 && screensPlateRef.current) {
      screensPlateRef.current.scrollTop = 0;
    }
  }, [activeStepIdx]);

  const selectStep = (idx: number) => {
    const safeIdx = clamp(idx, 0, BOOK_SEQUENCE_STEPS.length - 1);
    setActiveStepIdx(safeIdx);
    targetProgressRef.current = BOOK_SEQUENCE_STEPS[safeIdx].progress;
  };

  const wheelAccumulatorRef = useRef<number>(0);
  const lastWheelTimeRef = useRef<number>(0);

  // Dedicated Division Wheel Controller:
  // - Global page scroll never forces the book open or closed.
  // - Only rolling the wheel INSIDE this division animates and opens the book step-by-step.
  // - Outside this division, page scrolls completely normally.
  useEffect(() => {
    const wrap = stageWrapRef.current;
    if (!wrap) return;

    const onWheel = (e: WheelEvent) => {
      // If user is inside the 9-screens plate at Step 04:
      if (activeStepIdx === 3 && screensPlateRef.current) {
        const plate = screensPlateRef.current;
        const isScrollingDown = e.deltaY > 0;
        const isScrollingUp = e.deltaY < 0;
        const canScrollDown = plate.scrollTop + plate.clientHeight < plate.scrollHeight - 5;
        const canScrollUp = plate.scrollTop > 5;

        // Allow natural scroll inside the screens plate if it has room
        if (isScrollingDown && canScrollDown) return;
        if (isScrollingUp && canScrollUp) return;

        // If at the very top of plate and scrolls up, return to Step 2 (Critérios)
        if (isScrollingUp && !canScrollUp) {
          e.preventDefault();
          selectStep(2);
          return;
        }

        // If at the bottom and scrolling down, allow page to continue scrolling down
        if (isScrollingDown && !canScrollDown) {
          return;
        }
      }

      // Inside book division: scroll down advances the book (0 -> 1 -> 2 -> 3)
      if (e.deltaY > 0) {
        if (activeStepIdx < 3) {
          e.preventDefault();
          const now = performance.now();
          wheelAccumulatorRef.current += Math.abs(e.deltaY);
          if (wheelAccumulatorRef.current > 45 || now - lastWheelTimeRef.current > 300) {
            wheelAccumulatorRef.current = 0;
            lastWheelTimeRef.current = now;
            selectStep(activeStepIdx + 1);
          }
        }
      } else if (e.deltaY < 0) {
        // Inside book division: scroll up reverses the book (3 -> 2 -> 1 -> 0)
        if (activeStepIdx > 0) {
          e.preventDefault();
          const now = performance.now();
          wheelAccumulatorRef.current += Math.abs(e.deltaY);
          if (wheelAccumulatorRef.current > 45 || now - lastWheelTimeRef.current > 300) {
            wheelAccumulatorRef.current = 0;
            lastWheelTimeRef.current = now;
            selectStep(activeStepIdx - 1);
          }
        }
        // If activeStepIdx === 0, scrolling up does NOT preventDefault, allowing normal page scroll up!
      }
    };

    wrap.addEventListener('wheel', onWheel, { passive: false });
    return () => wrap.removeEventListener('wheel', onWheel);
  }, [activeStepIdx]);

  // Real Three.js 3D Hardcover Book + Volumetric Spotlight + Golden Dust Motes + Floating Modules
  useEffect(() => {
    const THREE = window.THREE;
    const host = hostRef.current;
    const canvas = canvasRef.current;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!THREE || !host || !canvas || reduced) {
      setWebglReady(false);
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let renderer: any;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      });
    } catch {
      setWebglReady(false);
      return;
    }

    if (!renderer.getContext()) {
      setWebglReady(false);
      return;
    }

    setWebglReady(true);

    const getW = () => Math.max(300, host.clientWidth || 720);
    const getH = () => Math.max(380, host.clientHeight || 520);

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(getW(), getH(), false);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.44;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(31, getW() / getH(), 0.1, 100);
    camera.position.set(0, 0.35, 5.25);

    const keyLight = new THREE.DirectionalLight(0xc9d2de, 0.45);
    keyLight.position.set(3.2, 2.2, 4.5);
    const rimLight = new THREE.DirectionalLight(0xffe4a8, 1.55);
    rimLight.position.set(3.8, -0.8, -6.5);
    const hemi = new THREE.HemisphereLight(0xdce2ec, 0x0b0b0e, 0.28);
    scene.add(keyLight, rimLight, hemi);

    // Procedural Studio Reflection Environment
    const envCv = document.createElement('canvas');
    envCv.width = 512;
    envCv.height = 256;
    const ectx = envCv.getContext('2d');
    if (ectx) {
      const g = ectx.createLinearGradient(0, 0, 0, 256);
      g.addColorStop(0, '#0d0d11');
      g.addColorStop(0.45, '#252730');
      g.addColorStop(0.55, '#0c0c0f');
      g.addColorStop(1, '#020204');
      ectx.fillStyle = g;
      ectx.fillRect(0, 0, 512, 256);
      ectx.fillStyle = 'rgba(255,255,255,0.85)';
      ectx.fillRect(170, 20, 160, 52);
      ectx.fillStyle = 'rgba(220,180,52,0.52)';
      ectx.fillRect(310, 140, 90, 24);
    }
    const envTex = new THREE.CanvasTexture(envCv);
    envTex.colorSpace = THREE.SRGBColorSpace;
    envTex.mapping = THREE.EquirectangularReflectionMapping;
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envTarget = pmrem.fromEquirectangular(envTex);
    scene.environment = envTarget.texture;
    pmrem.dispose();
    envTex.dispose();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const disposables: Array<{ dispose: () => void }> = [envTarget];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const track = <T extends { dispose: () => void }>(obj: T): T => {
      disposables.push(obj);
      return obj;
    };

    const makeTex = (cv: HTMLCanvasElement, srgb = true) => {
      const t = track(new THREE.CanvasTexture(cv));
      if (srgb) t.colorSpace = THREE.SRGBColorSpace;
      t.anisotropy = renderer.capabilities.getMaxAnisotropy();
      return t;
    };

    const bookW = 1.62;
    const bookH = 1.12;
    const spineInset = 0.018;
    const coverW = bookW - spineInset;
    const blockThickness = 0.148;
    const fontStack = '"Inter Tight", -apple-system, sans-serif';

    // Front Cover Gold-Foil Texture ("Q.I. MATCH")
    const covCv = document.createElement('canvas');
    covCv.width = 1024;
    covCv.height = 720;
    const cctx = covCv.getContext('2d')!;
    cctx.fillStyle = '#15161b';
    cctx.fillRect(0, 0, 1024, 720);
    for (let i = 0; i < 6500; i++) {
      cctx.fillStyle = `rgba(255,255,255,${(Math.random() * 0.025).toFixed(3)})`;
      cctx.fillRect(Math.random() * 1024, Math.random() * 720, 2, 2);
    }
    const foilGrad = cctx.createLinearGradient(120, 80, 900, 640);
    foilGrad.addColorStop(0, '#F3DC92');
    foilGrad.addColorStop(0.5, '#C9A227');
    foilGrad.addColorStop(1, '#8E6D16');
    cctx.strokeStyle = foilGrad;
    cctx.lineWidth = 3;
    cctx.strokeRect(48, 42, 928, 636);
    cctx.lineWidth = 1.2;
    cctx.strokeRect(60, 54, 904, 612);

    // Emblem Q
    cctx.fillStyle = foilGrad;
    cctx.beginPath();
    cctx.arc(512, 225, 48, 0, Math.PI * 2);
    cctx.stroke();
    cctx.font = `600 54px ${fontStack}`;
    cctx.textAlign = 'center';
    cctx.textBaseline = 'middle';
    cctx.fillText('Q', 512, 227);

    cctx.font = `600 92px ${fontStack}`;
    cctx.fillText('Q.I. MATCH', 512, 392);
    cctx.font = `500 26px ${fontStack}`;
    cctx.fillStyle = 'rgba(235, 214, 155, 0.82)';
    cctx.fillText('Talentos e oportunidades em tecnologia', 512, 454);
    cctx.font = `400 20px ${fontStack}`;
    cctx.fillStyle = 'rgba(255,255,255,0.42)';
    cctx.fillText('Nove telas previstas da plataforma', 512, 594);
    const coverTex = makeTex(covCv);

    // Spine Texture
    const spCv = document.createElement('canvas');
    spCv.width = 160;
    spCv.height = 1024;
    const sctx = spCv.getContext('2d')!;
    sctx.fillStyle = '#14151a';
    sctx.fillRect(0, 0, 160, 1024);
    sctx.fillStyle = '#C9A227';
    [96, 112, 904, 920].forEach((y) => sctx.fillRect(24, y, 112, 4));
    sctx.save();
    sctx.translate(80, 512);
    sctx.rotate(Math.PI / 2);
    sctx.font = `600 44px ${fontStack}`;
    sctx.textAlign = 'center';
    sctx.textBaseline = 'middle';
    sctx.fillText('Q.I. MATCH', 0, 0);
    sctx.restore();
    const spineTex = makeTex(spCv);

    // Gilded Page Block Texture
    const pgCv = document.createElement('canvas');
    pgCv.width = 16;
    pgCv.height = 512;
    const pctx = pgCv.getContext('2d')!;
    pctx.fillStyle = '#d7b14a';
    pctx.fillRect(0, 0, 16, 512);
    for (let y = 0; y < 512; y += 3) {
      pctx.fillStyle = `rgba(55,36,0,${(0.18 + Math.random() * 0.2).toFixed(2)})`;
      pctx.fillRect(0, y, 16, 1);
    }
    const gildedTex = makeTex(pgCv);
    gildedTex.wrapS = THREE.RepeatWrapping;

    // Inside Spread Texture (Left explanation + Right module slots)
    const inCv = document.createElement('canvas');
    inCv.width = 1400;
    inCv.height = 960;
    const ictx = inCv.getContext('2d')!;
    ictx.fillStyle = '#131419';
    ictx.fillRect(0, 0, 1400, 960);
    // Center crease shadow
    const crease = ictx.createLinearGradient(665, 0, 735, 0);
    crease.addColorStop(0, 'rgba(0,0,0,0)');
    crease.addColorStop(0.5, 'rgba(0,0,0,0.68)');
    crease.addColorStop(1, 'rgba(0,0,0,0)');
    ictx.fillStyle = crease;
    ictx.fillRect(660, 0, 80, 960);

    ictx.fillStyle = '#DCB434';
    ictx.font = `600 22px ${fontStack}`;
    ictx.fillText('EXPERIÊNCIA PREVISTA', 78, 120);
    ictx.fillStyle = '#FFFFFF';
    ictx.font = `600 62px ${fontStack}`;
    ictx.fillText('Q.I. Match', 78, 200);
    ictx.fillStyle = 'rgba(255,255,255,0.68)';
    ictx.font = `400 25px ${fontStack}`;
    [
      'Jornada pensada para unir',
      'conhecimento, comportamento',
      'e interesse real das duas partes.',
      '',
      'Veja abaixo as 9 telas em tamanho',
      'ampliado para leitura completa.',
    ].forEach((ln, idx) => ictx.fillText(ln, 78, 274 + idx * 40));

    // Right page dashed slots
    ictx.strokeStyle = 'rgba(201,162,39,0.52)';
    ictx.lineWidth = 2;
    ictx.setLineDash([7, 6]);
    [
      [770, 110, 540, 130],
      [770, 275, 255, 145],
      [1055, 275, 255, 145],
      [770, 455, 540, 140],
      [770, 630, 255, 200],
      [1055, 630, 255, 200],
    ].forEach(([rx, ry, rw, rh]) => {
      ictx.strokeRect(rx, ry, rw, rh);
    });
    ictx.setLineDash([]);
    const spreadTex = makeTex(inCv);

    // Scene Hierarchy
    const rootGroup = new THREE.Group();
    const bookGroup = new THREE.Group();
    rootGroup.add(bookGroup);
    scene.add(rootGroup);

    const clothMat = track(
      new THREE.MeshPhysicalMaterial({
        color: 0x17181f,
        roughness: 0.78,
        metalness: 0.12,
        sheen: 0.55,
        sheenColor: 0x3b3b46,
      })
    );
    const frontMat = track(
      new THREE.MeshPhysicalMaterial({
        map: coverTex,
        roughness: 0.46,
        metalness: 0.35,
        clearcoat: 0.25,
      })
    );
    const spineMat = track(
      new THREE.MeshPhysicalMaterial({
        map: spineTex,
        roughness: 0.52,
        metalness: 0.35,
      })
    );
    const gildedMat = track(
      new THREE.MeshPhysicalMaterial({
        map: gildedTex,
        color: 0xffffff,
        metalness: 0.92,
        roughness: 0.36,
        clearcoat: 0.3,
      })
    );
    const spreadMat = track(
      new THREE.MeshStandardMaterial({
        map: spreadTex,
        roughness: 0.74,
      })
    );

    // Back board (stationary right side)
    const boardGeo = track(new THREE.BoxGeometry(coverW, 0.022, bookH));
    boardGeo.translate(coverW / 2, 0, 0);

    const backBoard = new THREE.Mesh(boardGeo, clothMat);
    backBoard.position.set(-bookW / 2 + spineInset, -blockThickness / 2 - 0.011, 0);
    backBoard.castShadow = true;
    backBoard.receiveShadow = true;
    bookGroup.add(backBoard);

    // Page block
    const pageBlockGeo = track(new THREE.BoxGeometry(coverW - 0.03, blockThickness, bookH - 0.04));
    const pageBlock = new THREE.Mesh(pageBlockGeo, gildedMat);
    pageBlock.position.set(0.01, 0, 0);
    pageBlock.castShadow = true;
    pageBlock.receiveShadow = true;
    bookGroup.add(pageBlock);

    // Interior open spread plane on top of page block
    const spreadGeo = track(new THREE.PlaneGeometry(coverW * 1.9, bookH - 0.05));
    spreadGeo.rotateX(-Math.PI / 2);
    const spreadPlane = new THREE.Mesh(spreadGeo, spreadMat);
    spreadPlane.position.set(-coverW * 0.44, blockThickness / 2 + 0.002, 0);
    spreadPlane.visible = false;
    bookGroup.add(spreadPlane);

    // Rounded Spine
    const spineGeo = track(
      new THREE.CylinderGeometry(blockThickness * 0.58, blockThickness * 0.58, bookH, 28, 1, true, Math.PI, Math.PI)
    );
    spineGeo.rotateX(Math.PI / 2);
    const spineMesh = new THREE.Mesh(spineGeo, spineMat);
    spineMesh.scale.x = 0.38;
    spineMesh.position.set(-bookW / 2 + 0.01, 0, 0);
    bookGroup.add(spineMesh);

    // Front Cover Pivot Group (hinged on left spine edge)
    const frontPivot = new THREE.Group();
    frontPivot.position.set(-bookW / 2 + spineInset, blockThickness / 2 + 0.011, 0);
    bookGroup.add(frontPivot);

    const frontBoard = new THREE.Mesh(boardGeo, [
      clothMat,
      clothMat,
      frontMat,
      clothMat,
      clothMat,
      clothMat,
    ]);
    frontBoard.castShadow = true;
    frontBoard.receiveShadow = true;
    frontPivot.add(frontBoard);

    // Silk Bookmark Ribbon
    const ribGeo = track(new THREE.PlaneGeometry(0.038, 0.34));
    ribGeo.rotateX(-Math.PI / 2);
    const ribMat = track(
      new THREE.MeshStandardMaterial({ color: 0xb89020, roughness: 0.4, side: THREE.DoubleSide })
    );
    const ribbon = new THREE.Mesh(ribGeo, ribMat);
    ribbon.position.set(-0.22, -blockThickness / 2 + 0.004, bookH / 2 + 0.12);
    ribbon.rotation.z = 0.14;
    bookGroup.add(ribbon);

    // Ground Contact Shadow
    const shCv = document.createElement('canvas');
    shCv.width = 128;
    shCv.height = 128;
    const shCtx = shCv.getContext('2d')!;
    const shGrad = shCtx.createRadialGradient(64, 64, 0, 64, 64, 64);
    shGrad.addColorStop(0, 'rgba(0,0,0,0.82)');
    shGrad.addColorStop(0.65, 'rgba(0,0,0,0.38)');
    shGrad.addColorStop(1, 'rgba(0,0,0,0)');
    shCtx.fillStyle = shGrad;
    shCtx.fillRect(0, 0, 128, 128);
    const shadowPlane = new THREE.Mesh(
      track(new THREE.PlaneGeometry(2.6, 1.8)),
      track(new THREE.MeshBasicMaterial({ map: makeTex(shCv, false), transparent: true, depthWrite: false }))
    );
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.set(-0.18, -blockThickness / 2 - 0.04, 0);
    bookGroup.add(shadowPlane);

    // Volumetric Golden Spotlight Cone + Rising Golden Dust Motes
    const coneGeo = track(new THREE.ConeGeometry(1.15, 2.35, 48, 1, true));
    coneGeo.translate(0, -1.175, 0);
    const coneMat = track(
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
          uI: { value: 0 },
          uC: { value: new THREE.Color(0xffdf9a) },
        },
        vertexShader: `
          varying vec3 vN;
          varying vec3 vV;
          varying float vH;
          void main() {
            vec4 mv = modelViewMatrix * vec4(position, 1.0);
            vN = normalize(normalMatrix * normal);
            vV = normalize(-mv.xyz);
            vH = -position.y / 2.35;
            gl_Position = projectionMatrix * mv;
          }
        `,
        fragmentShader: `
          uniform float uI;
          uniform vec3 uC;
          varying vec3 vN;
          varying vec3 vV;
          varying float vH;
          void main() {
            float f = pow(abs(dot(vN, vV)), 2.0);
            float a = f * smoothstep(0.0, 0.2, vH) * (1.0 - smoothstep(0.55, 1.0, vH)) * uI;
            gl_FragColor = vec4(uC * a, a);
          }
        `,
      })
    );
    const coneMesh = new THREE.Mesh(coneGeo, coneMat);
    coneMesh.position.set(-0.2, 2.1, 0);
    rootGroup.add(coneMesh);

    const moteCount = 180;
    const motePos = new Float32Array(moteCount * 3);
    const moteSeed = new Float32Array(moteCount);
    for (let i = 0; i < moteCount; i++) {
      const ang = Math.random() * Math.PI * 2;
      const rad = Math.sqrt(Math.random()) * 0.95;
      motePos[i * 3] = Math.cos(ang) * rad - 0.15;
      motePos[i * 3 + 1] = 0.12 + Math.random() * 1.45;
      motePos[i * 3 + 2] = Math.sin(ang) * rad * 0.65;
      moteSeed[i] = Math.random();
    }
    const moteGeo = track(new THREE.BufferGeometry());
    moteGeo.setAttribute('position', new THREE.BufferAttribute(motePos, 3));
    moteGeo.setAttribute('aSeed', new THREE.BufferAttribute(moteSeed, 1));
    const moteMat = track(
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
          uTime: { value: 0 },
          uI: { value: 0 },
          uPx: { value: Math.min(window.devicePixelRatio || 1, 2) },
        },
        vertexShader: `
          attribute float aSeed;
          uniform float uTime;
          uniform float uI;
          uniform float uPx;
          varying float vA;
          void main() {
            vec3 p = position;
            float t = uTime * 0.35 + aSeed * 6.283;
            p.x += sin(t * 1.2 + aSeed * 15.0) * 0.05;
            p.y = mod(p.y + uTime * (0.08 + aSeed * 0.06), 1.55) + 0.08;
            vec4 mv = modelViewMatrix * vec4(p, 1.0);
            gl_Position = projectionMatrix * mv;
            gl_PointSize = uPx * (2.0 + aSeed * 3.2) * (5.5 / -mv.z);
            vA = uI * (0.3 + 0.7 * abs(sin(t * 2.1 + aSeed * 30.0)));
          }
        `,
        fragmentShader: `
          varying float vA;
          void main() {
            float d = length(gl_PointCoord - 0.5);
            float a = smoothstep(0.5, 0.0, d) * vA;
            gl_FragColor = vec4(vec3(1.0, 0.9, 0.68) * a, a);
          }
        `,
      })
    );
    const motes = new THREE.Points(moteGeo, moteMat);
    rootGroup.add(motes);

    // 6 Floating 3D Platform Cards lifting out of the open book
    const cardSpecs = [
      { title: '01 · Perfil & Sigilo', sub: 'Modo Discreto', rest: [0.18, 0.1, -0.3], fly: [-0.82, 0.78, 0.18], tilt: [0.12, 0.22, -0.04] },
      { title: '02 · Áudio ou Texto', sub: 'Mesmo peso', rest: [0.48, 0.1, -0.06], fly: [-0.26, 0.98, -0.08], tilt: [0.08, 0.06, 0.03] },
      { title: '04 · Síntese Clara', sub: 'Trechos reais', rest: [0.18, 0.1, 0.18], fly: [0.36, 0.94, 0.08], tilt: [0.1, -0.14, -0.03] },
      { title: '06 · Salário Visível', sub: 'Faixa aberta', rest: [0.48, 0.1, 0.32], fly: [0.82, 0.68, 0.24], tilt: [0.14, -0.24, 0.04] },
      { title: '07 · Compatibilidade', sub: '50 / 30 / 20%', rest: [0.22, 0.1, 0.02], fly: [-0.48, 0.46, 0.44], tilt: [0.18, 0.14, -0.02] },
      { title: '08 · Interesse Mútuo', sub: 'Aceite das 2 partes', rest: [0.46, 0.1, -0.22], fly: [0.44, 0.44, 0.46], tilt: [0.18, -0.14, 0.02] },
    ];

    const floatingCards = cardSpecs.map((sp) => {
      const cv = document.createElement('canvas');
      cv.width = 512;
      cv.height = 240;
      const ctx = cv.getContext('2d')!;
      ctx.fillStyle = '#121319';
      ctx.fillRect(0, 0, 512, 240);
      ctx.strokeStyle = 'rgba(220,180,52,0.72)';
      ctx.lineWidth = 4;
      ctx.strokeRect(4, 4, 504, 232);
      ctx.fillStyle = '#DCB434';
      ctx.font = `600 26px ${fontStack}`;
      ctx.fillText(sp.sub.toUpperCase(), 32, 74);
      ctx.fillStyle = '#FFFFFF';
      ctx.font = `600 40px ${fontStack}`;
      ctx.fillText(sp.title, 32, 142);
      ctx.fillStyle = 'rgba(255,255,255,0.22)';
      ctx.fillRect(32, 178, 320, 8);
      const tex = makeTex(cv);
      const geo = track(new THREE.BoxGeometry(0.58, 0.016, 0.28));
      const mat = track(
        new THREE.MeshPhysicalMaterial({
          map: tex,
          emissiveMap: tex,
          emissive: 0xffffff,
          emissiveIntensity: 0.35,
          roughness: 0.28,
          clearcoat: 0.7,
          transparent: true,
          opacity: 0,
        })
      );
      const mesh = new THREE.Mesh(geo, [clothMat, clothMat, mat, clothMat, clothMat, clothMat]);
      mesh.castShadow = true;
      rootGroup.add(mesh);
      return { sp, mesh, topMat: mat };
    });

    let curProg = targetProgressRef.current;
    let pointerX = 0;
    let pointerY = 0;
    let rafId = 0;
    let isVisible = true;
    const startClock = performance.now();

    const onResize = () => {
      const w = getW();
      const h = getH();
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    };
    const ro = new ResizeObserver(onResize);
    ro.observe(host);

    const onPointerMove = (e: PointerEvent) => {
      const r = host.getBoundingClientRect();
      if (!r.width || !r.height) return;
      pointerX = clamp(((e.clientX - r.left) / r.width - 0.5) * 2, -1, 1);
      pointerY = clamp(((e.clientY - r.top) / r.height - 0.5) * 2, -1, 1);
    };
    host.addEventListener('pointermove', onPointerMove, { passive: true });

    const renderFrame = (now: number) => {
      rafId = 0;
      const elapsed = (now - startClock) / 1000;
      curProg += 0.075 * (targetProgressRef.current - curProg);

      // Cover opens between p = 0.08 and p = 0.45 (0 -> -176 deg)
      const openT = smoothstep(0.06, 0.46, curProg);
      frontPivot.rotation.z = openT * (Math.PI * 0.96);
      spreadPlane.visible = openT > 0.24;

      // Center open book nicely in enlarged viewport
      const shiftRight = lerp(-0.12, 0.36, openT);
      bookGroup.position.set(shiftRight, -0.34, 0);

      // Gentle camera & book presentation angle + subtle pointer tilt
      rootGroup.rotation.x = lerp(0.56, 0.44, openT) + pointerY * 0.06;
      rootGroup.rotation.y = lerp(-0.34, 0.02, openT) + pointerX * 0.14 + Math.sin(elapsed * 0.5) * 0.025;

      // Spotlight & rising golden dust motes intensity
      const glowT = smoothstep(0.2, 0.58, curProg);
      coneMat.uniforms.uI.value = 0.18 * glowT;
      moteMat.uniforms.uI.value = 0.85 * glowT;
      moteMat.uniforms.uTime.value = elapsed;

      // Floating 3D UI cards lift out between 0.34 and 0.82
      const liftT = smoothstep(0.32, 0.78, curProg);
      floatingCards.forEach(({ sp, mesh, topMat }, idx) => {
        const bob = Math.sin(elapsed * 1.4 + idx * 1.1) * 0.025 * liftT;
        mesh.visible = openT > 0.35;
        topMat.opacity = smoothstep(0.3, 0.48, curProg);
        mesh.position.set(
          lerp(sp.rest[0], sp.fly[0], liftT),
          lerp(sp.rest[1], sp.fly[1], liftT) + bob,
          lerp(sp.rest[2], sp.fly[2], liftT)
        );
        mesh.rotation.set(
          sp.tilt[0] * liftT,
          sp.tilt[1] * liftT,
          sp.tilt[2] * liftT
        );
      });

      renderer.render(scene, camera);
      if (isVisible) {
        rafId = requestAnimationFrame(renderFrame);
      }
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible && !rafId) {
          rafId = requestAnimationFrame(renderFrame);
        } else if (!isVisible && rafId) {
          cancelAnimationFrame(rafId);
          rafId = 0;
        }
      },
      { rootMargin: '120px' }
    );
    io.observe(host);

    rafId = requestAnimationFrame(renderFrame);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      ro.disconnect();
      io.disconnect();
      host.removeEventListener('pointermove', onPointerMove);
      disposables.forEach((d) => {
        try {
          d.dispose();
        } catch {
          // ignore
        }
      });
      renderer.dispose();
    };
  }, []);

  const currentStep = BOOK_SEQUENCE_STEPS[activeStepIdx] || BOOK_SEQUENCE_STEPS[0];

  return (
    <div ref={stageWrapRef} className="qi-book-stage-wrap">
      {/* Controles de Etapa da Apresentação */}
      <div className="qi-book-rail">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span style={{ fontSize: 11.5, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--amber-hi)', fontWeight: 700 }}>
            Livro interativo da plataforma
          </span>
          <p style={{ margin: 0, fontSize: 13, color: 'var(--slate)', lineHeight: 1.45 }}>
            Alterne os momentos abaixo para abrir o volume ou ir direto às 9 telas ampliadas.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {BOOK_SEQUENCE_STEPS.map((st, idx) => (
            <button
              key={st.step}
              type="button"
              onClick={() => selectStep(idx)}
              className={`qi-book-step ${activeStepIdx === idx ? 'is-on' : ''}`}
            >
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', color: activeStepIdx === idx ? 'var(--amber-hi)' : 'var(--slate)' }}>
                ETAPA {st.step}
              </span>
              <strong style={{ fontSize: 14, color: 'var(--bone)', fontWeight: 600 }}>{st.label}</strong>
              <span style={{ fontSize: 12, color: 'var(--slate)', lineHeight: 1.35 }}>{st.description}</span>
            </button>
          ))}
        </div>

        <button type="button" className="qi-btn qi-btn--brass" onClick={() => selectStep(3)}>
          <span className="qi-roll">
            <span>Ver as 9 telas no palco</span>
            <span aria-hidden="true">Abrir 9 páginas do livro →</span>
          </span>
        </button>
      </div>

      {/* Palco 3D Ampliado (com fallback automático caso sem aceleração gráfica) */}
      <div ref={hostRef} className="qi-book-canvas-host">
        {webglReady ? (
          <canvas ref={canvasRef} aria-label="Livro interativo da Q.I. Match abrindo os módulos previstos da plataforma" />
        ) : (
          <div style={{ padding: 36, textAlign: 'center', maxWidth: 460 }}>
            <div
              style={{
                margin: '0 auto 18px',
                width: 220,
                height: 150,
                borderRadius: 12,
                border: '1px solid rgba(201,162,39,0.6)',
                background: 'linear-gradient(135deg, #1b1c24, #0c0c10)',
                display: 'grid',
                placeItems: 'center',
                boxShadow: '0 20px 50px rgba(0,0,0,0.75)',
              }}
            >
              <div>
                <strong style={{ display: 'block', color: 'var(--amber-hi)', letterSpacing: '0.16em', fontSize: 12 }}>
                  VOLUME INTERATIVO
                </strong>
                <span style={{ fontSize: 22, fontWeight: 700, color: 'var(--bone)' }}>Q.I. MATCH</span>
              </div>
            </div>
            <strong style={{ color: 'var(--bone)', fontSize: 16 }}>{currentStep.label}</strong>
            <p style={{ margin: '8px 0 0', fontSize: 14, color: 'var(--slate)' }}>{currentStep.description}</p>
          </div>
        )}

        {/* Etapa 04: As 9 Telas Abertas Diretamente no Palco onde o Livro Está */}
        {activeStepIdx === 3 && (
          <div
            ref={screensPlateRef}
            className="qi-stage-screens-plate"
            role="region"
            aria-label="As 9 telas da plataforma abertas no palco"
          >
            {/* Topbar com retorno rápido ao Livro 3D e título das 9 telas */}
            <div className="qi-stage-screens-topbar">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--amber-hi)' }}>
                  As 9 Telas Previstas
                </span>
                <span style={{ fontSize: 11, color: 'var(--slate)' }}>
                  (Telas 01 a 09)
                </span>
              </div>
              <button
                type="button"
                onClick={() => selectStep(2)}
                className="qi-stage-back-btn"
                title="Voltar para a visão do Livro 3D"
              >
                ← Voltar ao Livro 3D
              </button>
            </div>

            <div className="qi-stage-screens-grid">
              {PLATFORM_SCREENS.map((scr, idx) => (
                <div
                  key={scr.id}
                  className="qi-plate-item"
                  role="button"
                  tabIndex={0}
                  onClick={() => onSelectScreen?.(idx)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onSelectScreen?.(idx);
                    }
                  }}
                  aria-label={`${scr.number}: ${scr.title} — clique para ampliar`}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6, marginBottom: 4 }}>
                      <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', color: 'var(--amber-hi)' }}>
                        {scr.number}
                      </span>
                      <span className={`qi-status-pill qi-status-pill--${scr.statusTone}`} style={{ fontSize: 10, padding: '2px 7px' }}>
                        {scr.statusBadge}
                      </span>
                    </div>
                    <strong style={{ display: 'block', fontSize: 13, color: 'var(--bone)', lineHeight: 1.25 }}>
                      {scr.title}
                    </strong>
                    <span style={{ display: 'block', marginTop: 3, fontSize: 11, color: 'var(--amber-hi)' }}>
                      {scr.actor}
                    </span>
                    <p style={{ margin: '3px 0 0', fontSize: 11, color: 'var(--slate)', lineHeight: 1.35, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {scr.purpose}
                    </p>
                  </div>
                  <span style={{ fontSize: 11, color: 'var(--amber-hi)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
                    Inspecionar detalhes ⤢
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div
          style={{
            position: 'absolute',
            bottom: 16,
            left: 20,
            right: 20,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
            pointerEvents: 'none',
            flexWrap: 'wrap',
            zIndex: 9,
          }}
        >
          <span
            style={{
              padding: '6px 12px',
              borderRadius: 999,
              background: 'rgba(8,8,11,0.85)',
              border: '1px solid var(--hair-strong)',
              fontSize: 12,
              color: 'var(--bone)',
            }}
          >
            <strong style={{ color: 'var(--amber-hi)' }}>Etapa {currentStep.step}:</strong> {currentStep.label}
          </span>
          <span style={{ fontSize: 12, color: 'var(--slate)', background: 'rgba(8,8,11,0.82)', padding: '5px 10px', borderRadius: 999 }}>
            {activeStepIdx === 3 ? 'Clique em qualquer tela para abrir a visão ampliada em tela cheia' : 'Role o scroll nesta área ou clique nos passos para abrir o livro'}
          </span>
        </div>
      </div>
    </div>
  );
};
