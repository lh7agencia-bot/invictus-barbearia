import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { ChevronDown, ChevronUp, Pause, Play, RotateCcw } from 'lucide-react';

type CameraPresetId = 'overview' | 'pole' | 'razor' | 'shears';
type FinishPresetId = 'brushed' | 'graphite' | 'chrome';

interface CameraPreset {
  id: CameraPresetId;
  label: string;
  position: [number, number, number];
  target: [number, number, number];
}

const CAMERA_PRESETS: CameraPreset[] = [
  { id: 'overview', label: 'Geral', position: [3.2, 2.25, 4.1], target: [0, 1.05, 0] },
  { id: 'pole', label: 'Poste', position: [1.85, 1.75, 2.35], target: [-0.85, 1.45, -0.15] },
  { id: 'razor', label: 'Navalha', position: [1.65, 1.15, 2.15], target: [0.55, 0.36, 0.45] },
  { id: 'shears', label: 'Tesoura', position: [1.85, 1.25, 1.65], target: [0.92, 0.34, -0.45] },
];

const FINISH_PRESETS: { id: FinishPresetId; label: string; color: number; metalness: number; roughness: number }[] = [
  { id: 'brushed', label: 'Aço', color: 0xcfd2d6, metalness: 0.92, roughness: 0.24 },
  { id: 'graphite', label: 'Grafite', color: 0x4a4a4a, metalness: 0.65, roughness: 0.52 },
  { id: 'chrome', label: 'Cromo', color: 0xedeef0, metalness: 0.98, roughness: 0.08 },
];

function createStripeTexture(maxAnisotropy: number): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#F5F4F0';
  ctx.fillRect(0, 0, 512, 512);

  // Diagonal classic barber stripes in Preto Elegante (#1A1A1A) and Cinza Grafite (#4A4A4A)
  const stripeWidth = 64;
  ctx.save();
  ctx.translate(256, 256);
  ctx.rotate(-Math.PI / 4);
  for (let x = -768; x < 768; x += stripeWidth * 4) {
    ctx.fillStyle = '#1A1A1A';
    ctx.fillRect(x, -768, stripeWidth, 1536);

    ctx.fillStyle = '#4A4A4A';
    ctx.fillRect(x + stripeWidth * 2, -768, stripeWidth, 1536);
  }
  ctx.restore();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 2);
  texture.anisotropy = maxAnisotropy;
  return texture;
}

function createBrushedMetalBumpTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#808080';
  ctx.fillRect(0, 0, 256, 256);

  for (let y = 0; y < 256; y += 2) {
    const shade = 110 + ((y * 17) % 36);
    ctx.fillStyle = `rgb(${shade},${shade},${shade})`;
    ctx.fillRect(0, y, 256, 1);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 2);
  return texture;
}

function createContactShadowTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;
  const grad = ctx.createRadialGradient(128, 128, 14, 128, 128, 124);
  grad.addColorStop(0, 'rgba(0, 0, 0, 0.72)');
  grad.addColorStop(0.55, 'rgba(0, 0, 0, 0.32)');
  grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 256);
  return new THREE.CanvasTexture(canvas);
}

export function BarberAtelier3D() {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [activeCamera, setActiveCamera] = useState<CameraPresetId>('overview');
  const [activeFinish, setActiveFinish] = useState<FinishPresetId>('brushed');
  const [isSpinning, setIsSpinning] = useState(true);
  const [dockCollapsed, setDockCollapsed] = useState(false);
  const [webglFailed, setWebglFailed] = useState(false);

  const controlsApiRef = useRef<{
    setCameraPreset: (id: CameraPresetId) => void;
    setFinishPreset: (id: FinishPresetId) => void;
    setSpinning: (spinning: boolean) => void;
  } | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Detect software WebGL (SwiftShader / llvmpipe / WARP)
    const isSoftwareGl = (() => {
      try {
        const probeCanvas = document.createElement('canvas');
        const gl = probeCanvas.getContext('webgl2') || probeCanvas.getContext('webgl');
        if (!gl) return true;
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param));
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return true;
      }
    })();

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl,
        powerPreference: 'high-performance',
      });
    } catch {
      setWebglFailed(true);
      return;
    }

    const width = container.clientWidth || 960;
    const height = container.clientHeight || 520;
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';

    const handleContextLost = (e: Event) => {
      e.preventDefault();
      setWebglFailed(true);
    };
    const handleContextRestored = () => {
      setWebglFailed(false);
    };
    renderer.domElement.addEventListener('webglcontextlost', handleContextLost);
    renderer.domElement.addEventListener('webglcontextrestored', handleContextRestored);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x161616);
    scene.fog = new THREE.FogExp2(0x161616, 0.095);

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envRenderTarget = pmremGenerator.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = envRenderTarget.texture;
    pmremGenerator.dispose();

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 60);
    camera.position.set(3.2, 2.25, 4.1);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 1.05, 0);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.06;
    controls.enablePan = false;
    controls.minDistance = 1.9;
    controls.maxDistance = 7.2;
    controls.maxPolarAngle = Math.PI / 2 - 0.05;
    controls.minPolarAngle = 0.25;
    controls.update();

    // Studio 3-point warm/cool lighting rig
    const hemiLight = new THREE.HemisphereLight(0xd8e4f0, 0x1e1e1e, 0.75);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfff0dc, 2.3);
    keyLight.position.set(4.5, 6.5, 4.2);
    keyLight.castShadow = !isSoftwareGl;
    keyLight.shadow.mapSize.set(1024, 1024);
    keyLight.shadow.camera.near = 1;
    keyLight.shadow.camera.far = 18;
    keyLight.shadow.camera.left = -3.8;
    keyLight.shadow.camera.right = 3.8;
    keyLight.shadow.camera.top = 3.8;
    keyLight.shadow.camera.bottom = -3.8;
    keyLight.shadow.bias = -0.0005;
    keyLight.shadow.normalBias = 0.02;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xc2d4ea, 1.1);
    rimLight.position.set(-4.0, 3.8, -3.5);
    scene.add(rimLight);

    // Track disposable resources
    const geometries: THREE.BufferGeometry[] = [];
    const materials: THREE.Material[] = [];
    const textures: THREE.Texture[] = [];

    const maxAniso = renderer.capabilities.getMaxAnisotropy();
    const stripeTex = createStripeTexture(maxAniso);
    const metalBumpTex = createBrushedMetalBumpTexture();
    const contactShadowTex = createContactShadowTexture();
    textures.push(stripeTex, metalBumpTex, contactShadowTex);

    // Materials with calibrated roughness/metalness contrast
    const plinthObsidianMat = new THREE.MeshStandardMaterial({
      color: 0x1a1a1a,
      roughness: 0.78,
      metalness: 0.12,
    });
    const graphiteTrimMat = new THREE.MeshStandardMaterial({
      color: 0x4a4a4a,
      roughness: 0.45,
      metalness: 0.55,
      bumpMap: metalBumpTex,
      bumpScale: 0.004,
    });
    const brushedSteelMat = new THREE.MeshPhysicalMaterial({
      color: 0xcfd2d6,
      metalness: 0.92,
      roughness: 0.24,
      anisotropy: 0.8,
      bumpMap: metalBumpTex,
      bumpScale: 0.003,
    });
    const darkWalnutMat = new THREE.MeshStandardMaterial({
      color: 0x262320,
      roughness: 0.74,
      metalness: 0.06,
    });
    const poleStripeMat = new THREE.MeshStandardMaterial({
      map: stripeTex,
      color: 0xffffff,
      roughness: 0.35,
      metalness: 0.08,
    });
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xf5f7fa,
      metalness: 0.0,
      roughness: 0.06,
      transmission: isSoftwareGl ? 0 : 0.9,
      transparent: true,
      opacity: isSoftwareGl ? 0.32 : 1,
      ior: 1.52,
      thickness: 0.2,
      clearcoat: 1.0,
      depthWrite: false,
    });
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x161616,
      roughness: 0.88,
      metalness: 0.05,
    });
    const contactShadowMat = new THREE.MeshBasicMaterial({
      map: contactShadowTex,
      transparent: true,
      opacity: 0.45,
      depthWrite: false,
    });
    materials.push(
      plinthObsidianMat,
      graphiteTrimMat,
      brushedSteelMat,
      darkWalnutMat,
      poleStripeMat,
      glassMat,
      floorMat,
      contactShadowMat
    );

    // Ground & Architectural Plinth (y = 0)
    const floorGeo = new THREE.CircleGeometry(28, 48);
    geometries.push(floorGeo);
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    const plinthGroup = new THREE.Group();
    const baseDiscGeo = new THREE.CylinderGeometry(2.35, 2.48, 0.14, 48);
    const upperStepGeo = new THREE.CylinderGeometry(1.95, 2.02, 0.12, 48);
    const inlayRingGeo = new THREE.TorusGeometry(1.96, 0.014, 12, 64);
    const contactShadowGeo = new THREE.CircleGeometry(2.7, 32);
    geometries.push(baseDiscGeo, upperStepGeo, inlayRingGeo, contactShadowGeo);

    const contactShadow = new THREE.Mesh(contactShadowGeo, contactShadowMat);
    contactShadow.rotation.x = -Math.PI / 2;
    contactShadow.position.y = 0.015;
    plinthGroup.add(contactShadow);

    const baseDisc = new THREE.Mesh(baseDiscGeo, plinthObsidianMat);
    baseDisc.position.y = 0.07;
    baseDisc.receiveShadow = true;
    baseDisc.castShadow = true;
    plinthGroup.add(baseDisc);

    const upperStep = new THREE.Mesh(upperStepGeo, plinthObsidianMat);
    upperStep.position.y = 0.2;
    upperStep.receiveShadow = true;
    upperStep.castShadow = true;
    plinthGroup.add(upperStep);

    const inlayRing = new THREE.Mesh(inlayRingGeo, graphiteTrimMat);
    inlayRing.rotation.x = Math.PI / 2;
    inlayRing.position.y = 0.262;
    plinthGroup.add(inlayRing);
    scene.add(plinthGroup);

    // 1. Composite Classic Barber Pole (10 distinct parts, grounded on plinth top y = 0.26)
    const barberPoleGroup = new THREE.Group();
    barberPoleGroup.position.set(-0.85, 0.26, -0.15);

    const polePedestalPoints = [
      new THREE.Vector2(0, 0),
      new THREE.Vector2(0.32, 0),
      new THREE.Vector2(0.32, 0.06),
      new THREE.Vector2(0.24, 0.12),
      new THREE.Vector2(0.21, 0.22),
      new THREE.Vector2(0.25, 0.28),
      new THREE.Vector2(0, 0.28),
    ];
    const poleBaseGeo = new THREE.LatheGeometry(polePedestalPoints, 32);
    const poleCollarGeo = new THREE.TorusGeometry(0.245, 0.025, 16, 36);
    const innerStripeGeo = new THREE.CylinderGeometry(0.185, 0.185, 1.48, 32);
    const outerGlassGeo = new THREE.CylinderGeometry(0.22, 0.22, 1.5, 32, 1, true);
    const crownDomePoints = [
      new THREE.Vector2(0.25, 0),
      new THREE.Vector2(0.23, 0.06),
      new THREE.Vector2(0.16, 0.16),
      new THREE.Vector2(0.06, 0.22),
      new THREE.Vector2(0, 0.23),
    ];
    const crownDomeGeo = new THREE.LatheGeometry(crownDomePoints, 32);
    const finialGeo = new THREE.SphereGeometry(0.065, 24, 16);
    const bracketShaftGeo = new THREE.CylinderGeometry(0.032, 0.032, 0.34, 16);
    const bracketPlateGeo = new THREE.BoxGeometry(0.18, 0.36, 0.05);
    geometries.push(
      poleBaseGeo,
      poleCollarGeo,
      innerStripeGeo,
      outerGlassGeo,
      crownDomeGeo,
      finialGeo,
      bracketShaftGeo,
      bracketPlateGeo
    );

    const poleBase = new THREE.Mesh(poleBaseGeo, brushedSteelMat);
    poleBase.castShadow = true;
    poleBase.receiveShadow = true;
    barberPoleGroup.add(poleBase);

    const lowerCollar = new THREE.Mesh(poleCollarGeo, graphiteTrimMat);
    lowerCollar.rotation.x = Math.PI / 2;
    lowerCollar.position.y = 0.29;
    barberPoleGroup.add(lowerCollar);

    const stripeCore = new THREE.Mesh(innerStripeGeo, poleStripeMat);
    stripeCore.position.y = 1.04;
    stripeCore.castShadow = true;
    barberPoleGroup.add(stripeCore);

    const glassSleeve = new THREE.Mesh(outerGlassGeo, glassMat);
    glassSleeve.position.y = 1.04;
    glassSleeve.renderOrder = 2;
    barberPoleGroup.add(glassSleeve);

    const upperCollar = new THREE.Mesh(poleCollarGeo, graphiteTrimMat);
    upperCollar.rotation.x = Math.PI / 2;
    upperCollar.position.y = 1.79;
    barberPoleGroup.add(upperCollar);

    const crownDome = new THREE.Mesh(crownDomeGeo, brushedSteelMat);
    crownDome.position.y = 1.8;
    crownDome.castShadow = true;
    barberPoleGroup.add(crownDome);

    const finial = new THREE.Mesh(finialGeo, brushedSteelMat);
    finial.position.y = 2.08;
    finial.castShadow = true;
    barberPoleGroup.add(finial);

    const lowerBracket = new THREE.Mesh(bracketShaftGeo, graphiteTrimMat);
    lowerBracket.rotation.x = Math.PI / 2;
    lowerBracket.position.set(0, 0.36, -0.26);
    barberPoleGroup.add(lowerBracket);

    const upperBracket = new THREE.Mesh(bracketShaftGeo, graphiteTrimMat);
    upperBracket.rotation.x = Math.PI / 2;
    upperBracket.position.set(0, 1.72, -0.26);
    barberPoleGroup.add(upperBracket);

    const backPlate = new THREE.Mesh(bracketPlateGeo, plinthObsidianMat);
    backPlate.position.set(0, 1.04, -0.43);
    backPlate.castShadow = true;
    barberPoleGroup.add(backPlate);

    scene.add(barberPoleGroup);

    // 2. Composite Straight Razor on Sculpted Stand (6 distinct parts)
    const razorGroup = new THREE.Group();
    razorGroup.position.set(0.55, 0.26, 0.45);
    razorGroup.rotation.y = -0.42;

    const standGeo = new THREE.BoxGeometry(0.95, 0.08, 0.34);
    const bladeShape = new THREE.Shape();
    bladeShape.moveTo(-0.36, 0);
    bladeShape.lineTo(0.32, 0.01);
    bladeShape.quadraticCurveTo(0.42, 0.04, 0.39, 0.13);
    bladeShape.lineTo(-0.32, 0.12);
    bladeShape.quadraticCurveTo(-0.38, 0.06, -0.36, 0);

    const bladeGeo = new THREE.ExtrudeGeometry(bladeShape, {
      depth: 0.022,
      bevelEnabled: true,
      bevelThickness: 0.008,
      bevelSize: 0.006,
      bevelSegments: 3,
    });
    bladeGeo.center();

    const handleShape = new THREE.Shape();
    handleShape.moveTo(-0.42, -0.04);
    handleShape.quadraticCurveTo(0, -0.075, 0.42, -0.03);
    handleShape.quadraticCurveTo(0.48, 0.01, 0.42, 0.055);
    handleShape.quadraticCurveTo(0, 0.035, -0.42, 0.045);
    handleShape.quadraticCurveTo(-0.47, 0.0, -0.42, -0.04);

    const handleGeo = new THREE.ExtrudeGeometry(handleShape, {
      depth: 0.036,
      bevelEnabled: true,
      bevelThickness: 0.01,
      bevelSize: 0.008,
      bevelSegments: 3,
    });
    handleGeo.center();

    const pivotPinGeo = new THREE.CylinderGeometry(0.024, 0.024, 0.075, 16);
    const tangGeo = new THREE.CylinderGeometry(0.018, 0.022, 0.18, 16);
    geometries.push(standGeo, bladeGeo, handleGeo, pivotPinGeo, tangGeo);

    const razorStand = new THREE.Mesh(standGeo, darkWalnutMat);
    razorStand.position.y = 0.04;
    razorStand.castShadow = true;
    razorStand.receiveShadow = true;
    razorGroup.add(razorStand);

    const razorScale = new THREE.Mesh(handleGeo, graphiteTrimMat);
    razorScale.position.set(-0.08, 0.13, 0);
    razorScale.rotation.z = 0.09;
    razorScale.castShadow = true;
    razorGroup.add(razorScale);

    const razorBlade = new THREE.Mesh(bladeGeo, brushedSteelMat);
    razorBlade.position.set(0.16, 0.25, 0.035);
    razorBlade.rotation.z = 0.34;
    razorBlade.rotation.y = 0.12;
    razorBlade.castShadow = true;
    razorGroup.add(razorBlade);

    const razorTang = new THREE.Mesh(tangGeo, brushedSteelMat);
    razorTang.rotation.z = Math.PI / 2 + 0.34;
    razorTang.position.set(-0.21, 0.16, 0.025);
    razorGroup.add(razorTang);

    const pivotPin = new THREE.Mesh(pivotPinGeo, brushedSteelMat);
    pivotPin.rotation.x = Math.PI / 2;
    pivotPin.position.set(-0.29, 0.145, 0.01);
    razorGroup.add(pivotPin);

    scene.add(razorGroup);

    // 3. Composite Barber Shears on Low Rest (6 distinct parts)
    const shearsGroup = new THREE.Group();
    shearsGroup.position.set(0.92, 0.26, -0.45);
    shearsGroup.rotation.y = 0.55;

    const shearSaddleGeo = new THREE.CylinderGeometry(0.24, 0.28, 0.07, 24);
    const shearBladeShape = new THREE.Shape();
    shearBladeShape.moveTo(0, -0.016);
    shearBladeShape.lineTo(0.58, -0.004);
    shearBladeShape.lineTo(0.62, 0.01);
    shearBladeShape.lineTo(0, 0.028);
    shearBladeShape.closePath();

    const shearBladeGeo = new THREE.ExtrudeGeometry(shearBladeShape, {
      depth: 0.012,
      bevelEnabled: true,
      bevelThickness: 0.004,
      bevelSize: 0.004,
      bevelSegments: 2,
    });
    const fingerRingGeo = new THREE.TorusGeometry(0.105, 0.018, 14, 32);
    const tensionScrewGeo = new THREE.CylinderGeometry(0.026, 0.026, 0.045, 18);
    const pinkyCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.34, 0.01, 0.08),
      new THREE.Vector3(-0.44, 0.03, 0.14),
      new THREE.Vector3(-0.5, 0.055, 0.11),
    ]);
    const pinkyTangGeo = new THREE.TubeGeometry(pinkyCurve, 16, 0.013, 10, false);
    geometries.push(shearSaddleGeo, shearBladeGeo, fingerRingGeo, tensionScrewGeo, pinkyTangGeo);

    const shearSaddle = new THREE.Mesh(shearSaddleGeo, darkWalnutMat);
    shearSaddle.position.set(0, 0.035, 0);
    shearSaddle.castShadow = true;
    shearSaddle.receiveShadow = true;
    shearsGroup.add(shearSaddle);

    const bladeA = new THREE.Mesh(shearBladeGeo, brushedSteelMat);
    bladeA.position.set(-0.08, 0.095, 0);
    bladeA.rotation.set(Math.PI / 2, 0, -0.18);
    bladeA.castShadow = true;
    shearsGroup.add(bladeA);

    const bladeB = new THREE.Mesh(shearBladeGeo, brushedSteelMat);
    bladeB.position.set(-0.08, 0.112, 0);
    bladeB.rotation.set(Math.PI / 2, 0, 0.18);
    bladeB.castShadow = true;
    shearsGroup.add(bladeB);

    const ringA = new THREE.Mesh(fingerRingGeo, brushedSteelMat);
    ringA.rotation.x = Math.PI / 2;
    ringA.position.set(-0.24, 0.095, -0.11);
    ringA.castShadow = true;
    shearsGroup.add(ringA);

    const ringB = new THREE.Mesh(fingerRingGeo, brushedSteelMat);
    ringB.rotation.x = Math.PI / 2;
    ringB.position.set(-0.24, 0.112, 0.11);
    ringB.castShadow = true;
    shearsGroup.add(ringB);

    const screw = new THREE.Mesh(tensionScrewGeo, graphiteTrimMat);
    screw.position.set(-0.05, 0.105, 0);
    shearsGroup.add(screw);

    const pinkyTang = new THREE.Mesh(pinkyTangGeo, brushedSteelMat);
    pinkyTang.position.set(0, 0.1, 0);
    shearsGroup.add(pinkyTang);

    scene.add(shearsGroup);

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    // Reusable scratch vectors (zero GC in loop)
    const _targetCamPos = new THREE.Vector3(3.2, 2.25, 4.1);
    const _targetLookAt = new THREE.Vector3(0, 1.05, 0);

    let isTransitioning = false;
    let spinning = true;
    let frameId = 0;
    let renderBusy = false;
    let renderDirty = false;
    let lastTime = performance.now();
    let disposed = false;

    const afterDraw = (cb: () => void) => {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      if (gl && typeof gl.fenceSync === 'function') {
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
      } else {
        frameId = window.setTimeout(cb, 80);
      }
    };

    const stepScene = (dt: number) => {
      if (spinning) {
        stripeCore.rotation.y += dt * 0.9;
      }

      if (isTransitioning) {
        const alpha = 1 - Math.exp(-5.5 * dt);
        camera.position.lerp(_targetCamPos, alpha);
        controls.target.lerp(_targetLookAt, alpha);

        if (
          camera.position.distanceTo(_targetCamPos) < 0.015 &&
          controls.target.distanceTo(_targetLookAt) < 0.015
        ) {
          camera.position.copy(_targetCamPos);
          controls.target.copy(_targetLookAt);
          isTransitioning = false;
        }
      }
      controls.update();
    };

    const requestRender = () => {
      if (disposed) return;
      if (renderBusy) {
        renderDirty = true;
        return;
      }
      renderBusy = true;
      frameId = requestAnimationFrame(() => {
        if (disposed) return;
        const now = performance.now();
        const dt = Math.min((now - lastTime) / 1000, 0.1);
        lastTime = now;
        renderDirty = false;

        stepScene(dt);
        renderer.render(scene, camera);

        const done = () => {
          renderBusy = false;
          if (!disposed && (renderDirty || spinning || isTransitioning)) {
            requestRender();
          }
        };

        if (isSoftwareGl) {
          afterDraw(done);
        } else {
          done();
        }
      });
    };

    controls.addEventListener('start', () => {
      isTransitioning = false;
    });
    controls.addEventListener('change', () => {
      if (!spinning && !isTransitioning) {
        requestRender();
      }
    });

    const handleResize = () => {
      if (!container || disposed) return;
      const w = container.clientWidth || 960;
      const h = container.clientHeight || 520;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      requestRender();
    };
    window.addEventListener('resize', handleResize);

    controlsApiRef.current = {
      setCameraPreset: (id: CameraPresetId) => {
        const preset = CAMERA_PRESETS.find((p) => p.id === id);
        if (!preset) return;
        _targetCamPos.set(...preset.position);
        _targetLookAt.set(...preset.target);
        isTransitioning = true;
        requestRender();
      },
      setFinishPreset: (id: FinishPresetId) => {
        const finish = FINISH_PRESETS.find((f) => f.id === id);
        if (!finish) return;
        brushedSteelMat.color.setHex(finish.color);
        brushedSteelMat.metalness = finish.metalness;
        brushedSteelMat.roughness = finish.roughness;
        requestRender();
      },
      setSpinning: (nextSpinning: boolean) => {
        spinning = nextSpinning;
        if (spinning) {
          lastTime = performance.now();
          requestRender();
        }
      },
    };

    // Start initial draw
    requestRender();

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('webglcontextlost', handleContextLost);
      renderer.domElement.removeEventListener('webglcontextrestored', handleContextRestored);
      controls.dispose();
      geometries.forEach((g) => g.dispose());
      materials.forEach((m) => m.dispose());
      textures.forEach((t) => t.dispose());
      envRenderTarget.dispose();
      renderer.dispose();
    };
  }, []);

  const handleSelectCamera = (id: CameraPresetId) => {
    setActiveCamera(id);
    controlsApiRef.current?.setCameraPreset(id);
  };

  const handleSelectFinish = (id: FinishPresetId) => {
    setActiveFinish(id);
    controlsApiRef.current?.setFinishPreset(id);
  };

  const handleToggleSpin = () => {
    const next = !isSpinning;
    setIsSpinning(next);
    controlsApiRef.current?.setSpinning(next);
  };

  return (
    <section
      id="atelie-3d"
      className="scroll-mt-16 bg-[#161616] text-[#F5F4F0] border-b border-[#4A4A4A]/40"
    >
      <div className="max-w-6xl mx-auto px-5 sm:px-8 pt-14 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold tracking-[0.14em] text-[#A8A6A0] mb-2">
            Oficina &amp; Instrumentos
          </p>
          <h2
            className="font-display font-bold text-[#F5F4F0] leading-tight"
            style={{ fontSize: 'clamp(1.65rem, 2.8vw, 2.35rem)', textWrap: 'balance' }}
          >
            Símbolos de arte e precisão em 3D
          </h2>
        </div>
        <p className="text-sm text-[#B8B5AE] max-w-[46ch]">
          Arraste para girar a bancada interativa ou escolha um ângulo e acabamento de aço nos controles abaixo.
        </p>
      </div>

      {/* Interactive 3D Canvas Container */}
      <div className="relative w-full h-[440px] sm:h-[520px] lg:h-[560px] overflow-hidden border-t border-[#4A4A4A]/35">
        {webglFailed ? (
          <div className="w-full h-full flex flex-col items-center justify-center bg-[#161616] text-center px-6">
            <p className="font-display text-xl text-[#F5F4F0] mb-2">
              Visualização 3D indisponível neste dispositivo
            </p>
            <p className="text-sm text-[#A8A6A0] max-w-md">
              Seu navegador não disponibilizou aceleração WebGL para o modelo interativo.
            </p>
          </div>
        ) : (
          <div
            ref={mountRef}
            data-testid="barber-3d-canvas"
            aria-label="Cena 3D interativa com poste de barbearia, navalha e tesoura"
            className="w-full h-full cursor-grab active:cursor-grabbing"
          />
        )}

        {/* Collapsible Bottom Control Dock (solid rgba, zero backdrop-filter over WebGL) */}
        <div
          className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center"
          style={{ maxWidth: 'min(920px, 94vw)' }}
        >
          <button
            type="button"
            onClick={() => setDockCollapsed((prev) => !prev)}
            aria-expanded={!dockCollapsed}
            className="mb-1.5 inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-[#F5F4F0] rounded-sm border border-[#4A4A4A] cursor-pointer transition-colors"
            style={{ backgroundColor: 'rgba(26, 26, 26, 0.94)' }}
          >
            {dockCollapsed ? (
              <>
                <ChevronUp className="w-3.5 h-3.5" aria-hidden="true" />
                Mostrar controles 3D
              </>
            ) : (
              <>
                <ChevronDown className="w-3.5 h-3.5" aria-hidden="true" />
                Recolher controles
              </>
            )}
          </button>

          {!dockCollapsed && (
            <div
              className="px-3.5 py-2 rounded-sm border border-[#4A4A4A] flex flex-wrap md:flex-nowrap items-center justify-center gap-2.5 sm:gap-3"
              style={{ backgroundColor: 'rgba(26, 26, 26, 0.94)' }}
            >
              {/* Camera presets */}
              <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Ângulos de câmera">
                {CAMERA_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleSelectCamera(preset.id)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-sm transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      activeCamera === preset.id
                        ? 'bg-[#F5F4F0] text-[#1A1A1A]'
                        : 'bg-[#262626] text-[#D4D2CC] hover:text-white border border-[#4A4A4A]/50'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>

              <span className="hidden sm:inline-block w-px h-5 bg-[#4A4A4A]/60" aria-hidden="true" />

              {/* Finish presets */}
              <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Acabamento do aço">
                {FINISH_PRESETS.map((finish) => (
                  <button
                    key={finish.id}
                    type="button"
                    onClick={() => handleSelectFinish(finish.id)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-sm transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      activeFinish === finish.id
                        ? 'bg-[#4A4A4A] text-white border border-[#8C8A84]'
                        : 'bg-[#262626] text-[#D4D2CC] hover:text-white border border-[#4A4A4A]/50'
                    }`}
                  >
                    {finish.label}
                  </button>
                ))}
              </div>

              <span className="hidden sm:inline-block w-px h-5 bg-[#4A4A4A]/60" aria-hidden="true" />

              {/* Spin + Reset */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleToggleSpin}
                  aria-label={isSpinning ? 'Pausar rotação do poste' : 'Retomar rotação do poste'}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#F5F4F0] bg-[#262626] hover:bg-[#333333] border border-[#4A4A4A]/60 rounded-sm transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  {isSpinning ? (
                    <>
                      <Pause className="w-3.5 h-3.5" aria-hidden="true" />
                      Pausar
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5" aria-hidden="true" />
                      Girar
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectCamera('overview')}
                  aria-label="Redefinir visão 3D"
                  className="inline-flex items-center justify-center w-8 h-8 text-[#D4D2CC] hover:text-white bg-[#262626] hover:bg-[#333333] border border-[#4A4A4A]/60 rounded-sm transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
