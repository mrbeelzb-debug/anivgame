import * as THREE from 'three';
import './styles.css';

const canvas = document.querySelector('#game');
const memoryCount = document.querySelector('#memory-count');
const stick = document.querySelector('#touch-stick');
const knob = document.querySelector('#touch-knob');
const mainMenu = document.querySelector('#main-menu');
const startButton = document.querySelector('#start-button');
const startTransition = document.querySelector('#start-transition');
const menuButton = document.querySelector('#menu-button');

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x101417);
scene.fog = new THREE.Fog(0x101417, 16, 42);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 4.2, 9);

const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  powerPreference: 'high-performance',
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

function requestFullscreen() {
  const target = document.documentElement;
  const fullscreen =
    target.requestFullscreen ||
    target.webkitRequestFullscreen ||
    target.msRequestFullscreen;
  if (!document.fullscreenElement && fullscreen) {
    fullscreen.call(target).catch?.(() => {});
  }
}

const hemi = new THREE.HemisphereLight(0xccefff, 0x3b2d22, 2.2);
scene.add(hemi);

const sun = new THREE.DirectionalLight(0xffe0b0, 3.4);
sun.position.set(-5, 8, 7);
sun.castShadow = true;
sun.shadow.mapSize.set(1024, 1024);
sun.shadow.camera.near = 1;
sun.shadow.camera.far = 24;
scene.add(sun);

const root = new THREE.Group();
scene.add(root);

const islandMaterial = new THREE.MeshStandardMaterial({ color: 0x4d8a62, roughness: 0.85 });
const edgeMaterial = new THREE.MeshStandardMaterial({ color: 0x7f6850, roughness: 0.9 });
const pathMaterial = new THREE.MeshStandardMaterial({ color: 0xd9caa0, roughness: 0.95 });
const glowMaterial = new THREE.MeshStandardMaterial({
  color: 0xffb7c8,
  emissive: 0xff6f9d,
  emissiveIntensity: 0.9,
  roughness: 0.4,
});

function createHeartGeometry() {
  const heartShape = new THREE.Shape();
  heartShape.moveTo(0, 0.18);
  heartShape.bezierCurveTo(0, 0.42, -0.38, 0.42, -0.38, 0.12);
  heartShape.bezierCurveTo(-0.38, -0.12, -0.12, -0.27, 0, -0.42);
  heartShape.bezierCurveTo(0.12, -0.27, 0.38, -0.12, 0.38, 0.12);
  heartShape.bezierCurveTo(0.38, 0.42, 0, 0.42, 0, 0.18);

  const geometry = new THREE.ExtrudeGeometry(heartShape, {
    depth: 0.12,
    bevelEnabled: true,
    bevelThickness: 0.035,
    bevelSize: 0.035,
    bevelSegments: 5,
    curveSegments: 18,
  });
  geometry.center();
  return geometry;
}

const island = new THREE.Mesh(new THREE.CylinderGeometry(8.2, 7.2, 1.4, 72), islandMaterial);
island.position.y = -0.7;
island.receiveShadow = true;
island.castShadow = true;
root.add(island);

const islandEdge = new THREE.Mesh(new THREE.CylinderGeometry(7.4, 6.6, 1.2, 72, 1, true), edgeMaterial);
islandEdge.position.y = -1.05;
islandEdge.receiveShadow = true;
root.add(islandEdge);

const path = new THREE.Mesh(new THREE.RingGeometry(3.38, 3.82, 96), pathMaterial);
path.rotation.x = -Math.PI / 2;
path.position.y = 0.018;
path.receiveShadow = true;
root.add(path);

const center = new THREE.Mesh(new THREE.CylinderGeometry(1.05, 1.2, 0.06, 40), pathMaterial);
center.position.y = 0.032;
center.receiveShadow = true;
root.add(center);

const skinMaterial = new THREE.MeshStandardMaterial({ color: 0xf0b8a9, roughness: 0.7 });
const blushMaterial = new THREE.MeshBasicMaterial({ color: 0xff9fb2, transparent: true, opacity: 0.42 });
const hairMaterial = new THREE.MeshStandardMaterial({ color: 0x15151b, roughness: 0.86 });
const dressMaterial = new THREE.MeshStandardMaterial({ color: 0x7b2231, roughness: 0.72 });
const jeansMaterial = new THREE.MeshStandardMaterial({ color: 0x527393, roughness: 0.82 });
const trimMaterial = new THREE.MeshStandardMaterial({ color: 0xf7f3ee, roughness: 0.62 });
const flowerCenterMaterial = new THREE.MeshStandardMaterial({ color: 0xffc743, roughness: 0.58 });
const shoeMaterial = new THREE.MeshStandardMaterial({ color: 0x8b2732, roughness: 0.78 });
const soleMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.62 });
const denimStitchMaterial = new THREE.MeshStandardMaterial({ color: 0xc79562, roughness: 0.8 });
const navelMaterial = new THREE.MeshBasicMaterial({ color: 0x8f5a4f });

const player = new THREE.Group();
const avatar = new THREE.Group();
player.add(avatar);

function addPart(parent, geometry, material, position, scale = [1, 1, 1], rotation = [0, 0, 0]) {
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(...position);
  mesh.scale.set(...scale);
  mesh.rotation.set(...rotation);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}

function drawFace(context, blinkAmount = 0) {
  context.clearRect(0, 0, 512, 512);

  function eye(x, y) {
    if (blinkAmount > 0.86) {
      context.strokeStyle = '#221a20';
      context.lineWidth = 11;
      context.lineCap = 'round';
      context.beginPath();
      context.moveTo(x - 38, y);
      context.quadraticCurveTo(x, y + 18, x + 38, y);
      context.stroke();
      return;
    }

    const openScale = THREE.MathUtils.lerp(1, 0.18, blinkAmount);
    const gradient = context.createRadialGradient(x - 9, y - 10, 5, x, y, 48);
    gradient.addColorStop(0, '#ffffff');
    gradient.addColorStop(0.28, '#7b513c');
    gradient.addColorStop(0.58, '#3a261f');
    gradient.addColorStop(1, '#120e0d');
    context.fillStyle = gradient;
    context.beginPath();
    context.ellipse(x, y, 39, 49 * openScale, 0, 0, Math.PI * 2);
    context.fill();
    if (blinkAmount < 0.35) {
      context.fillStyle = '#ffffff';
      context.beginPath();
      context.arc(x - 13, y - 18, 11, 0, Math.PI * 2);
      context.arc(x + 10, y + 9, 5, 0, Math.PI * 2);
      context.fill();
    }
  }

  eye(176, 214);
  eye(336, 214);

  context.strokeStyle = '#221a20';
  context.lineWidth = 8;
  context.lineCap = 'round';
  context.beginPath();
  context.arc(176, 171, 38, Math.PI * 1.05, Math.PI * 1.82);
  context.arc(336, 171, 38, Math.PI * 1.18, Math.PI * 1.95);
  context.stroke();

  context.fillStyle = '#ff8fa5';
  context.globalAlpha = 0.38;
  context.beginPath();
  context.ellipse(125, 280, 34, 20, -0.1, 0, Math.PI * 2);
  context.ellipse(387, 280, 34, 20, 0.1, 0, Math.PI * 2);
  context.fill();
  context.globalAlpha = 1;

  context.strokeStyle = '#b75565';
  context.lineWidth = 8;
  context.lineCap = 'round';
  context.beginPath();
  context.moveTo(220, 304);
  context.quadraticCurveTo(256, 334, 292, 304);
  context.stroke();
}

function createFacePlane() {
  const faceCanvas = document.createElement('canvas');
  faceCanvas.width = 512;
  faceCanvas.height = 512;
  const context = faceCanvas.getContext('2d');
  drawFace(context);

  const texture = new THREE.CanvasTexture(faceCanvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true });
  const plane = new THREE.Mesh(new THREE.PlaneGeometry(0.55, 0.55), material);
  plane.castShadow = false;
  plane.userData.faceContext = context;
  plane.userData.faceTexture = texture;
  plane.userData.lastBlinkAmount = 0;
  return plane;
}

function createTextPlane(text, width, height, fontSize = 54) {
  const labelCanvas = document.createElement('canvas');
  labelCanvas.width = 512;
  labelCanvas.height = 128;
  const context = labelCanvas.getContext('2d');
  context.clearRect(0, 0, labelCanvas.width, labelCanvas.height);
  context.fillStyle = '#f7f3ee';
  context.font = `900 ${fontSize}px Arial, sans-serif`;
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillText(text, labelCanvas.width / 2, labelCanvas.height / 2);

  const texture = new THREE.CanvasTexture(labelCanvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true });
  const plane = new THREE.Mesh(new THREE.PlaneGeometry(width, height), material);
  plane.castShadow = false;
  return plane;
}

function addDaisy(parent, position, scale = 1) {
  const flower = new THREE.Group();
  for (let i = 0; i < 8; i += 1) {
    const angle = (i / 8) * Math.PI * 2;
    addPart(
      flower,
      new THREE.SphereGeometry(0.026 * scale, 10, 8),
      trimMaterial,
      [Math.cos(angle) * 0.045 * scale, Math.sin(angle) * 0.045 * scale, 0],
      [1.15, 0.55, 0.2],
      [0, 0, angle],
    );
  }
  addPart(flower, new THREE.SphereGeometry(0.027 * scale, 10, 8), flowerCenterMaterial, [0, 0, 0.006]);
  flower.position.set(...position);
  parent.add(flower);
  return flower;
}

const rig = {
  leftLeg: new THREE.Group(),
  rightLeg: new THREE.Group(),
  leftArm: new THREE.Group(),
  rightArm: new THREE.Group(),
  torso: new THREE.Group(),
  head: new THREE.Group(),
  skirt: new THREE.Group(),
  leftTwinTail: new THREE.Group(),
  rightTwinTail: new THREE.Group(),
  bangs: [],
};

rig.leftLeg.position.set(-0.15, 0.86, 0);
rig.rightLeg.position.set(0.15, 0.86, 0);
avatar.add(rig.leftLeg, rig.rightLeg);
addPart(rig.leftLeg, new THREE.CylinderGeometry(0.13, 0.16, 0.84, 24), jeansMaterial, [0, -0.42, 0], [1, 1, 0.82]);
addPart(rig.rightLeg, new THREE.CylinderGeometry(0.13, 0.16, 0.84, 24), jeansMaterial, [0, -0.42, 0], [1, 1, 0.82]);
addPart(rig.leftLeg, new THREE.CylinderGeometry(0.17, 0.15, 0.13, 24), jeansMaterial, [0, -0.85, 0], [1, 1, 0.86]);
addPart(rig.rightLeg, new THREE.CylinderGeometry(0.17, 0.15, 0.13, 24), jeansMaterial, [0, -0.85, 0], [1, 1, 0.86]);
addPart(rig.leftLeg, new THREE.CapsuleGeometry(0.105, 0.24, 12, 18), soleMaterial, [0, -0.955, 0.065], [1.18, 0.5, 1.55], [Math.PI / 2, 0, 0]);
addPart(rig.rightLeg, new THREE.CapsuleGeometry(0.105, 0.24, 12, 18), soleMaterial, [0, -0.955, 0.065], [1.18, 0.5, 1.55], [Math.PI / 2, 0, 0]);
addPart(rig.leftLeg, new THREE.CapsuleGeometry(0.085, 0.19, 12, 16), shoeMaterial, [0, -0.92, 0.095], [1.12, 0.42, 1.4], [Math.PI / 2, 0, 0]);
addPart(rig.rightLeg, new THREE.CapsuleGeometry(0.085, 0.19, 12, 16), shoeMaterial, [0, -0.92, 0.095], [1.12, 0.42, 1.4], [Math.PI / 2, 0, 0]);

avatar.add(rig.torso);
addPart(rig.torso, new THREE.CylinderGeometry(0.2, 0.18, 0.23, 32), skinMaterial, [0, 0.82, 0], [1, 0.86, 0.64]);
addPart(rig.torso, new THREE.CylinderGeometry(0.27, 0.235, 0.34, 40), dressMaterial, [0, 1.12, 0], [1, 1, 0.68]);
addPart(rig.torso, new THREE.CylinderGeometry(0.29, 0.32, 0.18, 36), jeansMaterial, [0, 0.67, 0], [1, 0.72, 0.74]);
addPart(rig.torso, new THREE.TorusGeometry(0.29, 0.015, 8, 42), trimMaterial, [0, 0.76, 0], [1, 0.52, 0.13], [Math.PI / 2, 0, 0]);
addPart(rig.torso, new THREE.SphereGeometry(0.018, 12, 8), navelMaterial, [0, 0.81, 0.142], [0.65, 1, 0.24]);
addPart(rig.torso, new THREE.SphereGeometry(0.026, 14, 10), trimMaterial, [0, 0.745, 0.17], [1, 1, 0.22]);
addPart(rig.torso, new THREE.BoxGeometry(0.014, 0.15, 0.014), denimStitchMaterial, [0, 0.6, 0.17]);
addPart(rig.torso, new THREE.BoxGeometry(0.095, 0.034, 0.018), trimMaterial, [-0.045, 1.315, 0.19], [1, 1, 1], [0, 0, -0.62]);
addPart(rig.torso, new THREE.BoxGeometry(0.095, 0.034, 0.018), trimMaterial, [0.045, 1.315, 0.19], [1, 1, 1], [0, 0, 0.62]);
addPart(rig.torso, new THREE.BoxGeometry(0.018, 0.24, 0.018), trimMaterial, [-0.215, 1.08, 0.19], [1, 1, 1], [0, 0, -0.03]);
addPart(rig.torso, new THREE.BoxGeometry(0.018, 0.24, 0.018), trimMaterial, [0.215, 1.08, 0.19], [1, 1, 1], [0, 0, 0.03]);
const shirtText = createTextPlane('SPRINGS', 0.5, 0.13, 56);
shirtText.position.set(0, 1.095, 0.195);
rig.torso.add(shirtText);
const charm = addPart(rig.torso, new THREE.IcosahedronGeometry(0.05, 1), glowMaterial, [0.35, 0.63, 0.11], [1, 1, 0.38]);
charm.rotation.z = Math.PI / 4;
charm.visible = false;

rig.leftArm.position.set(-0.31, 1.17, 0.02);
rig.rightArm.position.set(0.31, 1.17, 0.02);
avatar.add(rig.leftArm, rig.rightArm);
rig.leftArm.rotation.z = -0.58;
rig.rightArm.rotation.z = 0.58;
addPart(rig.leftArm, new THREE.CapsuleGeometry(0.07, 0.5, 8, 16), skinMaterial, [-0.08, -0.24, 0.04], [0.95, 1, 0.95], [0.18, 0, 0.25]);
addPart(rig.rightArm, new THREE.CapsuleGeometry(0.07, 0.5, 8, 16), skinMaterial, [0.08, -0.24, 0.04], [0.95, 1, 0.95], [0.18, 0, -0.25]);
rig.leftArm.visible = true;
rig.rightArm.visible = true;

rig.head.position.set(0, 1.24, 0);
avatar.add(rig.head);
addPart(rig.head, new THREE.CylinderGeometry(0.09, 0.1, 0.14, 18), skinMaterial, [0, 0, 0]);
const head = addPart(rig.head, new THREE.SphereGeometry(0.36, 40, 28), skinMaterial, [0, 0.36, 0.035], [0.98, 1.04, 0.88]);
head.rotation.x = -0.03;
const face = createFacePlane();
face.position.set(0, 0.34, 0.345);
rig.head.add(face);
addPart(rig.head, new THREE.SphereGeometry(0.06, 16, 12), blushMaterial, [-0.24, 0.29, 0.35], [1.4, 0.55, 0.12]);
addPart(rig.head, new THREE.SphereGeometry(0.06, 16, 12), blushMaterial, [0.24, 0.29, 0.35], [1.4, 0.55, 0.12]);
addPart(rig.head, new THREE.SphereGeometry(0.4, 40, 26), hairMaterial, [0, 0.49, 0.02], [1.04, 0.74, 0.9]);
addPart(rig.head, new THREE.SphereGeometry(0.34, 36, 22), hairMaterial, [0, 0.57, 0.18], [1.05, 0.45, 0.62]);
addPart(rig.head, new THREE.CapsuleGeometry(0.115, 0.42, 10, 18), hairMaterial, [-0.31, 0.23, 0.03], [1, 1, 0.86], [0.02, 0, 0.18]);
addPart(rig.head, new THREE.CapsuleGeometry(0.115, 0.42, 10, 18), hairMaterial, [0.31, 0.23, 0.03], [1, 1, 0.86], [0.02, 0, -0.18]);
addPart(rig.head, new THREE.CapsuleGeometry(0.12, 0.36, 10, 18), hairMaterial, [-0.17, 0.18, -0.21], [1, 1, 0.78], [0.04, 0.12, -0.08]);
addPart(rig.head, new THREE.CapsuleGeometry(0.12, 0.36, 10, 18), hairMaterial, [0.17, 0.18, -0.21], [1, 1, 0.78], [0.04, -0.12, 0.08]);
addPart(rig.head, new THREE.CapsuleGeometry(0.11, 0.31, 10, 18), hairMaterial, [0, 0.14, -0.25], [1, 1, 0.74], [0.06, 0, 0]);
addPart(rig.head, new THREE.SphereGeometry(0.19, 24, 16), hairMaterial, [-0.17, 0.58, 0.19], [0.72, 0.34, 0.5], [0, 0, 0.32]);
addPart(rig.head, new THREE.SphereGeometry(0.19, 24, 16), hairMaterial, [0.17, 0.58, 0.19], [0.72, 0.34, 0.5], [0, 0, -0.32]);
addPart(rig.head, new THREE.CapsuleGeometry(0.06, 0.42, 8, 16), hairMaterial, [-0.17, 0.39, 0.29], [1, 1, 0.78], [0.03, 0, -0.32]);
addPart(rig.head, new THREE.CapsuleGeometry(0.06, 0.42, 8, 16), hairMaterial, [0.17, 0.39, 0.29], [1, 1, 0.78], [0.03, 0, 0.32]);
addPart(rig.head, new THREE.BoxGeometry(0.028, 0.32, 0.018), new THREE.MeshBasicMaterial({ color: 0xf0b8a9 }), [0, 0.53, 0.335], [1, 1, 1], [0, 0, 0.02]);

rig.leftTwinTail.position.set(-0.34, 0.22, -0.02);
rig.rightTwinTail.position.set(0.34, 0.22, -0.02);
rig.head.add(rig.leftTwinTail, rig.rightTwinTail);
addPart(rig.leftTwinTail, new THREE.CapsuleGeometry(0.075, 0.36, 10, 16), hairMaterial, [0, -0.18, 0], [1, 1, 0.72], [0.06, 0, 0.06]);
addPart(rig.rightTwinTail, new THREE.CapsuleGeometry(0.075, 0.36, 10, 16), hairMaterial, [0, -0.18, 0], [1, 1, 0.72], [0.06, 0, -0.06]);

rig.bangs = [];
avatar.add(rig.skirt);
scene.add(player);

const markers = [];
const heartGeometry = createHeartGeometry();
for (let i = 0; i < 5; i += 1) {
  const angle = (i / 5) * Math.PI * 2 + 0.35;
  const marker = new THREE.Group();
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.48, 0.055, 32), pathMaterial);
  const heart = new THREE.Mesh(heartGeometry, glowMaterial);
  heart.position.y = 0.58;
  heart.rotation.x = -0.08;
  heart.scale.setScalar(0.62);
  base.castShadow = true;
  base.receiveShadow = true;
  heart.castShadow = true;
  marker.add(base, heart);
  marker.position.set(Math.cos(angle) * 4.7, 0.055, Math.sin(angle) * 4.7);
  marker.userData.heart = heart;
  marker.userData.collected = false;
  root.add(marker);
  markers.push(marker);
}

for (let i = 0; i < 42; i += 1) {
  const angle = Math.random() * Math.PI * 2;
  const radius = 1.8 + Math.random() * 5.7;
  const flower = new THREE.Group();
  const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.02, 0.24, 8), new THREE.MeshStandardMaterial({ color: 0x5f9f55 }));
  const bloom = new THREE.Mesh(new THREE.SphereGeometry(0.055, 8, 8), new THREE.MeshStandardMaterial({ color: i % 2 ? 0xffd166 : 0xff8fab }));
  stem.position.y = 0.18;
  bloom.position.y = 0.32;
  flower.add(stem, bloom);
  flower.position.set(Math.cos(angle) * radius, 0.05, Math.sin(angle) * radius);
  root.add(flower);
}

const clouds = [];
const cloudMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.8 });
for (let i = 0; i < 7; i += 1) {
  const cloud = new THREE.Group();
  for (let j = 0; j < 4; j += 1) {
    const puff = new THREE.Mesh(new THREE.SphereGeometry(0.35 + Math.random() * 0.35, 12, 12), cloudMaterial);
    puff.position.set(j * 0.45, Math.random() * 0.2, Math.random() * 0.3);
    cloud.add(puff);
  }
  cloud.position.set(-12 + Math.random() * 24, 6 + Math.random() * 4, -9 - Math.random() * 8);
  cloud.scale.setScalar(0.85 + Math.random() * 0.8);
  scene.add(cloud);
  clouds.push(cloud);
}

const keys = new Set();
const move = new THREE.Vector2();
const pointer = {
  active: false,
  id: null,
  origin: new THREE.Vector2(),
  current: new THREE.Vector2(),
};
const pinchPointers = new Map();
let lastPinchDistance = 0;
let collected = 0;
let yaw = 0;
let draggingLook = false;
let lastX = 0;
let walkStrength = 0;
let blinkStart = 1.8;
let nextBlinkAt = 2.9;
let gameStarted = false;
let cameraDistance = 6.2;
const avatarGroundOffset = 0.14;

function stopMovementInput() {
  keys.clear();
  move.set(0, 0);
  pointer.active = false;
  pointer.id = null;
  pinchPointers.clear();
  lastPinchDistance = 0;
  draggingLook = false;
  knob.style.transform = 'translate(-50%, -50%)';
}

function getPinchDistance() {
  const points = [...pinchPointers.values()];
  if (points.length < 2) return 0;
  return points[0].distanceTo(points[1]);
}

function lerpAngle(from, to, amount) {
  const delta = Math.atan2(Math.sin(to - from), Math.cos(to - from));
  return from + delta * amount;
}

function updateFace(time) {
  const duration = 0.18;
  let blinkAmount = 0;

  if (time >= nextBlinkAt) {
    blinkStart = time;
    nextBlinkAt = time + 2.4 + Math.random() * 2.8;
  }

  const blinkTime = time - blinkStart;
  if (blinkTime >= 0 && blinkTime <= duration) {
    blinkAmount = Math.sin((blinkTime / duration) * Math.PI);
  }

  if (Math.abs(blinkAmount - face.userData.lastBlinkAmount) > 0.04 || blinkAmount === 0) {
    drawFace(face.userData.faceContext, blinkAmount);
    face.userData.faceTexture.needsUpdate = true;
    face.userData.lastBlinkAmount = blinkAmount;
  }
}

window.addEventListener('keydown', (event) => keys.add(event.key.toLowerCase()));
window.addEventListener('keyup', (event) => keys.delete(event.key.toLowerCase()));

startButton.addEventListener('click', () => {
  requestFullscreen();
  mainMenu.classList.add('is-hidden');
  startTransition.classList.add('is-active');
  stopMovementInput();
  setTimeout(() => {
    gameStarted = true;
    document.body.classList.add('game-started');
    startTransition.classList.remove('is-active');
  }, 850);
});

menuButton.addEventListener('click', () => {
  gameStarted = false;
  stopMovementInput();
  document.body.classList.remove('game-started');
  mainMenu.classList.remove('is-hidden');
});

canvas.addEventListener('pointerdown', (event) => {
  if (!gameStarted) return;
  if (event.pointerType === 'touch') {
    pinchPointers.set(event.pointerId, new THREE.Vector2(event.clientX, event.clientY));
    if (pinchPointers.size === 2) {
      lastPinchDistance = getPinchDistance();
    }
    canvas.setPointerCapture(event.pointerId);
    return;
  }
  draggingLook = true;
  lastX = event.clientX;
  canvas.setPointerCapture(event.pointerId);
});

canvas.addEventListener('pointermove', (event) => {
  if (event.pointerType === 'touch') {
    if (!pinchPointers.has(event.pointerId)) return;
    pinchPointers.get(event.pointerId).set(event.clientX, event.clientY);
    if (pinchPointers.size >= 2) {
      const pinchDistance = getPinchDistance();
      if (lastPinchDistance > 0) {
        cameraDistance = THREE.MathUtils.clamp(cameraDistance - (pinchDistance - lastPinchDistance) * 0.018, 3.4, 10);
      }
      lastPinchDistance = pinchDistance;
    }
    return;
  }

  if (!draggingLook) return;
  yaw -= (event.clientX - lastX) * 0.006;
  lastX = event.clientX;
});

function endCanvasPointer(event) {
  if (event.pointerType === 'touch') {
    pinchPointers.delete(event.pointerId);
    lastPinchDistance = pinchPointers.size >= 2 ? getPinchDistance() : 0;
    return;
  }
  draggingLook = false;
}

canvas.addEventListener('pointerup', endCanvasPointer);
canvas.addEventListener('pointercancel', endCanvasPointer);

canvas.addEventListener(
  'wheel',
  (event) => {
    if (!gameStarted) return;
    event.preventDefault();
    cameraDistance = THREE.MathUtils.clamp(cameraDistance + event.deltaY * 0.004, 3.4, 10);
  },
  { passive: false },
);

stick.addEventListener('pointerdown', (event) => {
  if (!gameStarted) return;
  pointer.active = true;
  pointer.id = event.pointerId;
  pointer.origin.set(event.clientX, event.clientY);
  pointer.current.copy(pointer.origin);
  stick.setPointerCapture(event.pointerId);
});

stick.addEventListener('pointermove', (event) => {
  if (!pointer.active || pointer.id !== event.pointerId) return;
  pointer.current.set(event.clientX, event.clientY);
});

stick.addEventListener('pointerup', (event) => {
  if (pointer.id !== event.pointerId) return;
  pointer.active = false;
  pointer.id = null;
  knob.style.transform = 'translate(-50%, -50%)';
});

function updateInput() {
  move.set(0, 0);
  if (!gameStarted) return;
  if (keys.has('w') || keys.has('arrowup')) move.y += 1;
  if (keys.has('s') || keys.has('arrowdown')) move.y -= 1;
  if (keys.has('a') || keys.has('arrowleft')) move.x -= 1;
  if (keys.has('d') || keys.has('arrowright')) move.x += 1;

  if (pointer.active) {
    const delta = pointer.current.clone().sub(pointer.origin);
    const length = Math.min(delta.length(), 46);
    const angle = Math.atan2(delta.y, delta.x);
    const x = Math.cos(angle) * length;
    const y = Math.sin(angle) * length;
    knob.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
    move.set(x / 46, -y / 46);
  }

  if (move.lengthSq() > 1) move.normalize();
}

function updatePlayer(delta) {
  const speed = 3.2;
  const forward = new THREE.Vector3(-Math.sin(yaw), 0, -Math.cos(yaw));
  const right = new THREE.Vector3(Math.cos(yaw), 0, -Math.sin(yaw));
  const step = new THREE.Vector3()
    .addScaledVector(forward, move.y)
    .addScaledVector(right, move.x);

  const isMoving = step.lengthSq() > 0.001;
  if (isMoving) {
    step.normalize();
    player.position.addScaledVector(step, speed * delta);
    player.rotation.y = Math.atan2(step.x, step.z);
  }

  walkStrength = THREE.MathUtils.lerp(walkStrength, isMoving ? 1 : 0, isMoving ? 0.12 : 0.08);

  const motion = performance.now() * 0.0072;
  const stride = Math.sin(motion);
  const counterStride = Math.sin(motion + Math.PI);
  const softBounce = Math.abs(stride) * 0.014 * walkStrength;
  const idleBreath = Math.sin(motion * 0.35) * 0.004 * (1 - walkStrength);

  avatar.position.y = avatarGroundOffset + softBounce + idleBreath;
  avatar.rotation.z = Math.sin(motion * 0.5) * (0.006 + walkStrength * 0.006);
  rig.torso.rotation.x = Math.sin(motion * 0.55) * 0.006 * (1 - walkStrength);
  rig.torso.rotation.z = Math.sin(motion) * 0.008 * walkStrength;

  rig.leftLeg.rotation.x = stride * 0.28 * walkStrength;
  rig.rightLeg.rotation.x = counterStride * 0.28 * walkStrength;
  rig.leftLeg.rotation.z = Math.sin(motion + 0.6) * 0.018 * walkStrength;
  rig.rightLeg.rotation.z = Math.sin(motion + Math.PI + 0.6) * 0.018 * walkStrength;

  const idleArmPose = 1 - walkStrength;
  rig.leftArm.rotation.z = -0.58 * idleArmPose - 0.18 * walkStrength;
  rig.rightArm.rotation.z = 0.58 * idleArmPose + 0.18 * walkStrength;
  rig.leftArm.rotation.x = stride * 0.36 * walkStrength + 0.05 * idleArmPose;
  rig.rightArm.rotation.x = counterStride * 0.36 * walkStrength + 0.05 * idleArmPose;

  rig.head.rotation.x = -0.018 + Math.sin(motion * 0.35) * 0.003 * (1 - walkStrength);
  rig.head.rotation.z = Math.sin(motion * 0.35) * 0.003 * (1 - walkStrength);
  rig.skirt.rotation.y = 0;
  rig.skirt.scale.x = 1;
  rig.skirt.scale.z = 1;

  rig.leftTwinTail.rotation.z = 0.08 + Math.sin(motion * 0.62 + 0.8) * 0.025;
  rig.rightTwinTail.rotation.z = -0.08 + Math.sin(motion * 0.62 + Math.PI - 0.8) * 0.025;
  rig.leftTwinTail.rotation.x = Math.sin(motion * 0.5) * 0.018;
  rig.rightTwinTail.rotation.x = Math.sin(motion * 0.5 + Math.PI) * 0.018;
  rig.bangs.forEach((bang, index) => {
    bang.rotation.x = 0.08 + Math.sin(motion * 0.6 + index * 0.42) * 0.01;
    bang.position.y = 0.49 - Math.abs(index - 4) * 0.008;
  });

  const maxRadius = 6.7;
  const flat = new THREE.Vector2(player.position.x, player.position.z);
  if (flat.length() > maxRadius) {
    flat.setLength(maxRadius);
    player.position.x = flat.x;
    player.position.z = flat.y;
  }
}

function updateCamera() {
  const height = THREE.MathUtils.mapLinear(cameraDistance, 3.4, 10, 2.5, 5.8);
  const cameraOffset = new THREE.Vector3(Math.sin(yaw) * cameraDistance, height, Math.cos(yaw) * cameraDistance);
  const targetPosition = player.position.clone().add(cameraOffset);
  camera.position.lerp(targetPosition, 0.08);
  camera.lookAt(player.position.x, player.position.y + 0.75, player.position.z);
}

function updateMarkers(time) {
  markers.forEach((marker, index) => {
    marker.userData.heart.rotation.y += 0.045;
    marker.userData.heart.position.y = 0.52 + Math.sin(time * 2.2 + index) * 0.06;

    if (!marker.userData.collected && marker.position.distanceTo(player.position) < 0.75) {
      marker.userData.collected = true;
      marker.userData.heart.material = marker.userData.heart.material.clone();
      marker.userData.heart.material.color.set(0xb9fbc0);
      marker.userData.heart.material.emissive.set(0x52ff88);
      collected += 1;
      memoryCount.textContent = String(collected);
    }
  });
}

function resize() {
  const width = window.visualViewport?.width || window.innerWidth;
  const height = window.visualViewport?.height || window.innerHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
}

window.addEventListener('resize', resize);
window.visualViewport?.addEventListener('resize', resize);

const clock = new THREE.Clock();

function tick() {
  const delta = Math.min(clock.getDelta(), 0.033);
  const time = clock.elapsedTime;

  updateInput();
  updatePlayer(delta);
  updateCamera();
  updateMarkers(time);
  updateFace(time);

  root.rotation.y = Math.sin(time * 0.15) * 0.025;
  clouds.forEach((cloud, index) => {
    cloud.position.x += delta * (0.12 + index * 0.015);
    if (cloud.position.x > 14) cloud.position.x = -14;
  });

  renderer.render(scene, camera);
  requestAnimationFrame(tick);
}

tick();
