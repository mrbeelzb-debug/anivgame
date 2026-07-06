import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { STLLoader } from 'three/addons/loaders/STLLoader.js';
import { ColladaLoader } from 'three/addons/loaders/ColladaLoader.js';
import './styles.css';

const canvas = document.querySelector('#game');
const memoryCount = document.querySelector('#memory-count');
const memoryTotal = document.querySelector('#memory-total');
const missionStatus = document.querySelector('#mission-status');
const stick = document.querySelector('#touch-stick');
const knob = document.querySelector('#touch-knob');
const mainMenu = document.querySelector('#main-menu');
const startButton = document.querySelector('#start-button');
const startTransition = document.querySelector('#start-transition');
const menuButton = document.querySelector('#menu-button');
const tutorial = document.querySelector('#tutorial');
const tutorialText = document.querySelector('#tutorial-text');
const tutorialNext = document.querySelector('#tutorial-next');
const tutorialSkip = document.querySelector('#tutorial-skip');
const dogBubble = document.querySelector('#dog-bubble');
const cuddleButton = document.querySelector('#cuddle-button');
const doorButton = document.querySelector('#door-button');
const phoneButton = document.querySelector('#phone-button');
const loveGameButton = document.querySelector('#love-game-button');
const loadingScreen = document.querySelector('#loading-screen');
const sceneWipe = document.querySelector('#scene-wipe');
const proposalEnding = document.querySelector('#proposal-ending');
const proposalFireworks = document.querySelector('#proposal-fireworks');
const proposalEndingLine = document.querySelector('#proposal-ending-line');
const finalEndingActions = document.querySelector('#final-ending-actions');
const finalYes = document.querySelector('#final-yes');
const finalNo = document.querySelector('#final-no');
const mazeGame = document.querySelector('#maze-game');
const mazeCanvas = document.querySelector('#maze-canvas');
const mazeUp = document.querySelector('#maze-up');
const mazeLeft = document.querySelector('#maze-left');
const mazeDown = document.querySelector('#maze-down');
const mazeRight = document.querySelector('#maze-right');
const roomEditor = document.querySelector('#room-editor');
const editorToggle = document.querySelector('#editor-toggle');
const editorSave = document.querySelector('#editor-save');
const editorFinish = document.querySelector('#editor-finish');
const editorAdd = document.querySelector('#editor-add');
const editorAddModel = document.querySelector('#editor-add-model');
const editorAddTexture = document.querySelector('#editor-add-texture');
const editorModelInput = document.querySelector('#editor-model-input');
const editorTextureInput = document.querySelector('#editor-texture-input');
const assetPalette = document.querySelector('#asset-palette');
const editorRotate = document.querySelector('#editor-rotate');
const editorSmaller = document.querySelector('#editor-smaller');
const editorBigger = document.querySelector('#editor-bigger');
const editorUp = document.querySelector('#editor-up');
const editorDown = document.querySelector('#editor-down');
const editorDelete = document.querySelector('#editor-delete');
const bumbleApp = document.querySelector('#bumble-app');
const bumblePhone = document.querySelector('.bumble-phone');
const bumbleClose = document.querySelector('#bumble-close');
const bumbleCardStack = document.querySelector('#bumble-card-stack');
const bumbleCards = Array.from(document.querySelectorAll('.bumble-card'));
const bumbleInstruction = document.querySelector('#bumble-instruction');
const bumbleLeft = document.querySelector('#bumble-left');
const bumbleRight = document.querySelector('#bumble-right');
const bumbleReady = document.querySelector('#bumble-ready');
const bumbleReadyYes = document.querySelector('#bumble-ready-yes');
const bumbleMessagePop = document.querySelector('#bumble-message-pop');
const chatScene = document.querySelector('#chat-scene');
const chatPanel = document.querySelector('.chat-panel');
const chatClose = document.querySelector('#chat-close');
const chatThread = document.querySelector('#chat-thread');
const chatChoices = document.querySelector('#chat-choices');
const chatFeedback = document.querySelector('#chat-feedback');
const chatHearts = document.querySelector('#chat-hearts');
const chatBody = document.querySelector('.chat-body');
const puzzleScene = document.querySelector('#puzzle-scene');
const puzzlePicker = document.querySelector('#puzzle-picker');
const puzzlePickButton = document.querySelector('#puzzle-pick-button');
const puzzleFileInput = document.querySelector('#puzzle-file-input');
const puzzleGrid = document.querySelector('#puzzle-grid');
const puzzleStatus = document.querySelector('#puzzle-status');
const puzzleClose = document.querySelector('#puzzle-close');
const meetupChoices = document.querySelector('#meetup-choices');
const mediaViewer = document.querySelector('#media-viewer');
const mediaStage = document.querySelector('#media-stage');
const mediaTitle = document.querySelector('#media-title');
const mediaCounter = document.querySelector('#media-counter');
const mediaClose = document.querySelector('#media-close');
const mediaPrev = document.querySelector('#media-prev');
const mediaNext = document.querySelector('#media-next');
const phoneLaunch = document.querySelector('#phone-launch');
const phoneLaunchClose = document.querySelector('#phone-launch-close');
const phoneLaunchBumble = document.querySelector('#phone-launch-bumble');

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x8ed8ff);
scene.fog = new THREE.Fog(0x8ed8ff, 18, 46);

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

const raycaster = new THREE.Raycaster();
const pointerNdc = new THREE.Vector2();
const textureLoader = new THREE.TextureLoader();
const gltfLoader = new GLTFLoader();
const fbxLoader = new FBXLoader();
const objLoader = new OBJLoader();
const stlLoader = new STLLoader();
const colladaLoader = new ColladaLoader();
const phoneLogoTexture = textureLoader.load('/bumble-1.svg');
const bumbleWordmarkTexture = textureLoader.load('/bumble.png');
const bigPhoneTexture = textureLoader.load('/bumble-slide/phone.png');
bigPhoneTexture.colorSpace = THREE.SRGBColorSpace;
bigPhoneTexture.anisotropy = 8;
const roomFocusMode = false;
const blankRoomMode = false;
const chatFocusMode = false;
const puzzleFocusMode = false;
const outdoorFocusMode = false;
const starbucksFocusMode = false;
const postStarbucksMemoryFocusMode = false;
const mazeFocusMode = false;
const finalChoiceFocusMode = false;
const showGirlCoffeeCup = false;

function updateAppViewport() {
  const height = window.visualViewport?.height || window.innerHeight;
  document.documentElement.style.setProperty('--app-height', `${height}px`);
}

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

updateAppViewport();

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
const doorMaterial = new THREE.MeshStandardMaterial({ color: 0x9c5a3c, roughness: 0.78 });
const doorTrimMaterial = new THREE.MeshStandardMaterial({ color: 0xffe1a8, roughness: 0.62 });
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

function createRoundedRectGeometry(width, height, depth, radius) {
  const x = -width / 2;
  const y = -height / 2;
  const shape = new THREE.Shape();
  shape.moveTo(x + radius, y);
  shape.lineTo(x + width - radius, y);
  shape.quadraticCurveTo(x + width, y, x + width, y + radius);
  shape.lineTo(x + width, y + height - radius);
  shape.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  shape.lineTo(x + radius, y + height);
  shape.quadraticCurveTo(x, y + height, x, y + height - radius);
  shape.lineTo(x, y + radius);
  shape.quadraticCurveTo(x, y, x + radius, y);

  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: true,
    bevelThickness: 0.015,
    bevelSize: 0.018,
    bevelSegments: 6,
    curveSegments: 12,
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

function roundRectPath(context, x, y, width, height, radius) {
  context.beginPath();
  context.moveTo(x + radius, y);
  context.lineTo(x + width - radius, y);
  context.quadraticCurveTo(x + width, y, x + width, y + radius);
  context.lineTo(x + width, y + height - radius);
  context.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  context.lineTo(x + radius, y + height);
  context.quadraticCurveTo(x, y + height, x, y + height - radius);
  context.lineTo(x, y + radius);
  context.quadraticCurveTo(x, y, x + radius, y);
  context.closePath();
}

function wrapCanvasText(context, text, maxWidth) {
  const words = text.split(' ');
  const lines = [];
  let line = '';
  words.forEach((word) => {
    const testLine = line ? `${line} ${word}` : word;
    if (context.measureText(testLine).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = testLine;
    }
  });
  if (line) lines.push(line);
  return lines;
}

const typedBubblePlanes = [];

function createMeetupBubblePlane(side = 'guy', parent = outdoorArea) {
  const canvasBubble = document.createElement('canvas');
  canvasBubble.width = 768;
  canvasBubble.height = 256;
  const texture = new THREE.CanvasTexture(canvasBubble);
  texture.colorSpace = THREE.SRGBColorSpace;
  const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true, depthWrite: false });
  const plane = new THREE.Mesh(new THREE.PlaneGeometry(2.55, 0.85), material);
  plane.visible = false;
  plane.userData.context = canvasBubble.getContext('2d');
  plane.userData.texture = texture;
  plane.userData.side = side;
  plane.userData.typingText = '';
  plane.userData.typedText = '';
  plane.userData.typingStartedAt = 0;
  plane.userData.typing = false;
  typedBubblePlanes.push(plane);
  parent.add(plane);
  return plane;
}

function drawMeetupBubble(plane, text, showCaret = false) {
  const context = plane.userData.context;
  const isGirl = plane.userData.side === 'girl';
  const isBarista = plane.userData.side === 'barista';
  context.clearRect(0, 0, 768, 256);
  context.font = '900 42px Arial, sans-serif';
  const prefix = isGirl ? 'M: ' : isBarista ? 'Barrista: ' : '?: ';
  const caret = showCaret ? '|' : '';
  let fontSize = 42;
  let lines = wrapCanvasText(context, `${prefix}${text}${caret}`, 650);
  if (lines.length > 3 || lines.some((line) => context.measureText(line).width > 650)) {
    fontSize = 36;
    context.font = `900 ${fontSize}px Arial, sans-serif`;
    lines = wrapCanvasText(context, `${prefix}${text}${caret}`, 670);
  }
  lines = lines.slice(0, 4);
  const lineHeight = fontSize + 8;
  const bubbleHeight = Math.min(214, Math.max(160, 52 + lines.length * lineHeight));
  roundRectPath(context, 24, 24, 720, bubbleHeight, 46);
  context.fillStyle = isGirl ? '#fff8ed' : '#ffd447';
  context.shadowColor = 'rgba(0, 0, 0, 0.24)';
  context.shadowBlur = 18;
  context.shadowOffsetY = 8;
  context.fill();
  context.shadowColor = 'transparent';
  context.fillStyle = '#201314';
  context.textBaseline = 'top';
  lines.forEach((line, index) => {
    context.fillText(line, 58, 52 + index * lineHeight);
  });
  plane.userData.texture.needsUpdate = true;
  plane.visible = true;
}

function typeMeetupBubble(plane, text) {
  plane.userData.typingText = text;
  plane.userData.typedText = '';
  plane.userData.typingStartedAt = clock?.elapsedTime || 0;
  plane.userData.typingSpeed = plane === guyMeetupBubble || plane === girlMeetupBubble ? 16 : 28;
  plane.userData.typing = true;
  drawMeetupBubble(plane, '', true);
}

function updateTypedBubbles(time) {
  typedBubblePlanes.forEach((plane) => {
    if (!plane.userData.typing || !plane.visible) return;
    const fullText = plane.userData.typingText || '';
    const typedLength = Math.min(fullText.length, Math.floor((time - plane.userData.typingStartedAt) * (plane.userData.typingSpeed || 28)));
    const nextText = fullText.slice(0, typedLength);
    const stillTyping = typedLength < fullText.length;
    if (nextText !== plane.userData.typedText || stillTyping !== plane.userData.lastTypingState) {
      plane.userData.typedText = nextText;
      plane.userData.lastTypingState = stillTyping;
      drawMeetupBubble(plane, nextText, stillTyping);
    }
    if (!stillTyping) plane.userData.typing = false;
  });
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

const playerPhone = new THREE.Group();
const handheldPhoneMaterial = new THREE.MeshStandardMaterial({ color: 0x202027, roughness: 0.46 });
const handheldPhoneScreenMaterial = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  emissive: 0xfff4d8,
  emissiveIntensity: 0.75,
  roughness: 0.28,
});
const handheldPhoneImageMaterial = new THREE.MeshBasicMaterial({
  map: bigPhoneTexture,
  transparent: true,
  toneMapped: false,
});
addPart(playerPhone, new THREE.BoxGeometry(0.32, 0.46, 0.035), handheldPhoneMaterial, [0, 0, 0]);
addPart(playerPhone, new THREE.BoxGeometry(0.26, 0.36, 0.012), handheldPhoneScreenMaterial, [0, 0, 0.024]);
const handheldPhoneImage = new THREE.Mesh(new THREE.PlaneGeometry(0.205, 0.34), handheldPhoneImageMaterial);
handheldPhoneImage.position.set(0, 0, 0.033);
handheldPhoneImage.castShadow = false;
handheldPhoneImage.receiveShadow = false;
playerPhone.add(handheldPhoneImage);
playerPhone.position.set(0, 1.02, 0.26);
playerPhone.rotation.x = -0.22;
playerPhone.visible = false;
avatar.add(playerPhone);
scene.add(player);

const dogMaterial = new THREE.MeshStandardMaterial({ color: 0x7b4a2d, roughness: 0.82 });
const dogDarkMaterial = new THREE.MeshStandardMaterial({ color: 0x3d2418, roughness: 0.85 });
const dogNoseMaterial = new THREE.MeshStandardMaterial({ color: 0x17100c, roughness: 0.6 });

const dog = new THREE.Group();
const dogBody = addPart(dog, new THREE.CapsuleGeometry(0.16, 0.34, 8, 16), dogMaterial, [0, 0.28, 0], [1.35, 0.82, 0.82], [0, 0, Math.PI / 2]);
const dogHead = addPart(dog, new THREE.SphereGeometry(0.18, 18, 14), dogMaterial, [0.28, 0.38, 0], [1, 0.92, 0.9]);
addPart(dog, new THREE.SphereGeometry(0.07, 12, 10), dogNoseMaterial, [0.42, 0.36, 0], [1, 0.72, 0.72]);
addPart(dog, new THREE.SphereGeometry(0.018, 8, 8), dogNoseMaterial, [0.39, 0.43, -0.06]);
addPart(dog, new THREE.SphereGeometry(0.018, 8, 8), dogNoseMaterial, [0.39, 0.43, 0.06]);
addPart(dog, new THREE.CapsuleGeometry(0.045, 0.18, 8, 12), dogDarkMaterial, [0.23, 0.33, -0.15], [1, 1, 0.75], [0.22, 0, -0.45]);
addPart(dog, new THREE.CapsuleGeometry(0.045, 0.18, 8, 12), dogDarkMaterial, [0.23, 0.33, 0.15], [1, 1, 0.75], [0.22, 0, 0.45]);

const dogLegs = [
  addPart(dog, new THREE.CapsuleGeometry(0.035, 0.2, 6, 10), dogDarkMaterial, [-0.15, 0.11, -0.1]),
  addPart(dog, new THREE.CapsuleGeometry(0.035, 0.2, 6, 10), dogDarkMaterial, [-0.15, 0.11, 0.1]),
  addPart(dog, new THREE.CapsuleGeometry(0.035, 0.2, 6, 10), dogDarkMaterial, [0.16, 0.11, -0.1]),
  addPart(dog, new THREE.CapsuleGeometry(0.035, 0.2, 6, 10), dogDarkMaterial, [0.16, 0.11, 0.1]),
];
const dogTail = addPart(dog, new THREE.CapsuleGeometry(0.035, 0.22, 6, 10), dogDarkMaterial, [-0.32, 0.36, 0], [1, 1, 0.8], [0, 0, -0.72]);
dog.position.set(1.8, 0.03, 2.2);
dog.rotation.y = -0.8;
scene.add(dog);

const dogTarget = new THREE.Vector3(1.8, 0.03, 2.2);
const dogScreenPosition = new THREE.Vector3();
const dogBubbleMessages = [
  "woof! follow the hearts",
  "mot mot is watching!",
  "try walking around",
  "hearts unlock memories",
];
const dogFreeRoamMessages = [
  "maddy smell badd",
  "i love bryan!",
  "i need pet pet",
  "where snack?",
  "mot mot is baby",
  "wait for meee!",
  "tiny legs, big adventure",
  "i am helping!",
  "can we cuddle now?",
  "woof woof! that's important",
  "i found a smell!",
  "bryan is my bestie",
  "maddy owes me treats",
  "look! i can hop!",
  "no thoughts, only walkies",
  "pet me for good luck",
];
let dogNextMessageAt = 0;
let dogPlayful = false;
let cuddleUntil = 0;
let lastDogPlayful = false;

function pickDogTarget() {
  const angle = Math.random() * Math.PI * 2;
  const radius = 0.7 + Math.random() * 5.9;
  dogTarget.set(Math.cos(angle) * radius, 0.03, Math.sin(angle) * radius);
}

function startDogCuddle() {
  if (!gameStarted || tutorialActive) return;
  const distanceToPlayer = dog.position.distanceTo(player.position);
  if (distanceToPlayer > 2.2) return;
  cuddleUntil = clock.elapsedTime + 2.4;
  dogBubble.textContent = "mot mot loves cuddles!";
  dogNextMessageAt = cuddleUntil + 1.2;
}

function isPointerOnDog(event) {
  const width = window.visualViewport?.width || window.innerWidth;
  const height = window.visualViewport?.height || window.innerHeight;
  pointerNdc.set((event.clientX / width) * 2 - 1, -(event.clientY / height) * 2 + 1);
  raycaster.setFromCamera(pointerNdc, camera);
  return raycaster.intersectObjects(dog.children, true).length > 0;
}

function setPointerRay(event) {
  const width = window.visualViewport?.width || window.innerWidth;
  const height = window.visualViewport?.height || window.innerHeight;
  pointerNdc.set((event.clientX / width) * 2 - 1, -(event.clientY / height) * 2 + 1);
  raycaster.setFromCamera(pointerNdc, camera);
}

function isPointerOnBumbleLogo(event) {
  if (currentArea !== 'bedroom' || !bumbleLogo.visible) return false;
  setPointerRay(event);
  return raycaster.intersectObjects([bumbleLogo.userData.hitBox], true).length > 0;
}

function isPlayerNearBumbleLogo() {
  const logoFlat = new THREE.Vector2(bumbleLogo.position.x, bumbleLogo.position.z);
  const playerFlat = new THREE.Vector2(player.position.x, player.position.z);
  return logoFlat.distanceTo(playerFlat) < 2.3;
}

function isPlayerNearBigPhone() {
  const phoneFlat = new THREE.Vector2(bigPhone.position.x, bigPhone.position.z);
  const playerFlat = new THREE.Vector2(player.position.x, player.position.z);
  return phoneFlat.distanceTo(playerFlat) < 2.45;
}

function isPointerOnBigPhone(event) {
  if (currentArea !== 'bedroom' || !bigPhone.visible) return false;
  setPointerRay(event);
  return raycaster.intersectObjects([bigPhone.userData.hitBox], true).length > 0;
}

function activateBigPhone() {
  if (currentArea !== 'bedroom' || !isPlayerNearBigPhone()) return;
  bigPhoneLight.intensity = 4.2;
  openPhoneLaunch();
}

function activateBumbleLogo() {
  if (currentArea !== 'bedroom' || !isPlayerNearBumbleLogo()) return;
  bumbleLogoPulseUntil = clock.elapsedTime + 1.4;
  bigPhoneScreenMaterial.emissive.set(0xffffff);
  bigPhoneScreenMaterial.emissiveIntensity = 1.25;
  bigPhoneGlowMaterial.emissiveIntensity = 1.55;
  bigPhoneLight.intensity = 4.4;
  openBumbleApp();
}

const nextDoor = new THREE.Group();
const doorDropStartY = 6.4;
const doorGroundY = 0.02;
addPart(nextDoor, new THREE.BoxGeometry(1.34, 2.12, 0.18), doorMaterial, [0, 1.18, 0]);
addPart(nextDoor, new THREE.BoxGeometry(1.62, 0.16, 0.22), doorTrimMaterial, [0, 2.32, 0.01]);
addPart(nextDoor, new THREE.BoxGeometry(0.16, 2.34, 0.22), doorTrimMaterial, [-0.8, 1.22, 0.01]);
addPart(nextDoor, new THREE.BoxGeometry(0.16, 2.34, 0.22), doorTrimMaterial, [0.8, 1.22, 0.01]);
const doorHeart = new THREE.Mesh(createHeartGeometry(), glowMaterial);
doorHeart.position.set(0, 1.35, 0.13);
doorHeart.scale.setScalar(0.42);
nextDoor.add(doorHeart);
nextDoor.position.set(0, doorDropStartY, -5.35);
nextDoor.rotation.y = Math.PI;
nextDoor.visible = false;
root.add(nextDoor);

const room = new THREE.Group();
room.visible = false;
scene.add(room);

const roomWidth = 18;
const roomDepth = 14;
const roomHalfWidth = roomWidth / 2;
const roomHalfDepth = roomDepth / 2;
const roomWallHeight = 4.2;
const bumbleLogoBasePosition = new THREE.Vector3(5.95, 2.86, -2.36);

const roomFloorMaterial = new THREE.MeshStandardMaterial({ color: 0xf3d0bd, roughness: 0.86 });
const roomWallMaterial = new THREE.MeshStandardMaterial({ color: 0xffc8dd, roughness: 0.8, transparent: true, opacity: 1 });
const roomCeilingMaterial = new THREE.MeshStandardMaterial({
  color: 0xf7d8ff,
  roughness: 0.82,
  transparent: true,
  opacity: 0.94,
});
const roomBackWallMaterial = roomWallMaterial.clone();
const roomLeftWallMaterial = roomWallMaterial.clone();
const roomRightWallMaterial = roomWallMaterial.clone();
const bedMaterial = new THREE.MeshStandardMaterial({ color: 0xffb7c8, roughness: 0.74 });
const blanketMaterial = new THREE.MeshStandardMaterial({ color: 0x8fb8ff, roughness: 0.78 });
const pillowMaterial = new THREE.MeshStandardMaterial({ color: 0xfff4e8, roughness: 0.7 });
const cabinetMaterial = new THREE.MeshStandardMaterial({ color: 0xffdf9e, roughness: 0.78 });
const shelfMaterial = new THREE.MeshStandardMaterial({ color: 0xd88f6c, roughness: 0.8 });
const rugMaterial = new THREE.MeshStandardMaterial({ color: 0xaedff7, roughness: 0.84 });
const vanityMaterial = new THREE.MeshStandardMaterial({ color: 0xffd7e8, roughness: 0.76 });
const mirrorMaterial = new THREE.MeshStandardMaterial({ color: 0xd9f7ff, metalness: 0.12, roughness: 0.2 });
const goldAccentMaterial = new THREE.MeshStandardMaterial({ color: 0xffd166, metalness: 0.18, roughness: 0.48 });
const heartPinkMaterial = new THREE.MeshStandardMaterial({ color: 0xff8fab, emissive: 0xff5f94, emissiveIntensity: 0.22, roughness: 0.54 });
const softLilacMaterial = new THREE.MeshStandardMaterial({ color: 0xd8c7ff, roughness: 0.76 });
const clothesMaterials = [
  new THREE.MeshStandardMaterial({ color: 0xff8fab, roughness: 0.78 }),
  new THREE.MeshStandardMaterial({ color: 0xb8f2e6, roughness: 0.78 }),
  new THREE.MeshStandardMaterial({ color: 0xffd166, roughness: 0.78 }),
  new THREE.MeshStandardMaterial({ color: 0xcdb4db, roughness: 0.78 }),
];
const phoneMaterial = new THREE.MeshStandardMaterial({ color: 0x202027, roughness: 0.46 });
const phoneScreenMaterial = new THREE.MeshStandardMaterial({ color: 0x8fd8ff, emissive: 0x4db8ff, emissiveIntensity: 0.75, roughness: 0.36 });
const bigPhoneGlowMaterial = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  emissive: 0xfff4d8,
  emissiveIntensity: 1.05,
  roughness: 0.22,
});
const bigPhoneScreenMaterial = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  emissive: 0xffffff,
  emissiveIntensity: 0.72,
  roughness: 0.18,
});
const bigPhoneImageMaterial = new THREE.MeshBasicMaterial({
  map: bigPhoneTexture,
  transparent: false,
  toneMapped: false,
  depthWrite: false,
  polygonOffset: true,
  polygonOffsetFactor: -4,
  polygonOffsetUnits: -4,
});
const bumbleLogoMaterial = new THREE.MeshBasicMaterial({
  map: bumbleWordmarkTexture,
  transparent: true,
  side: THREE.DoubleSide,
});
const bumbleLogoGlowMaterial = new THREE.MeshStandardMaterial({
  color: 0xffd044,
  emissive: 0xffb000,
  emissiveIntensity: 0.65,
  roughness: 0.35,
});

const roomFloor = addPart(room, new THREE.BoxGeometry(roomWidth, 0.12, roomDepth), roomFloorMaterial, [0, -0.02, 0]);
roomFloor.receiveShadow = false;
roomFloor.castShadow = false;
const roomBackWall = addPart(room, new THREE.BoxGeometry(roomWidth, roomWallHeight, 0.12), roomBackWallMaterial, [0, roomWallHeight / 2 - 0.08, -roomHalfDepth]);
const roomLeftWall = addPart(room, new THREE.BoxGeometry(0.12, roomWallHeight, roomDepth), roomLeftWallMaterial, [-roomHalfWidth, roomWallHeight / 2 - 0.08, 0]);
const roomRightWall = addPart(room, new THREE.BoxGeometry(0.12, roomWallHeight, roomDepth), roomRightWallMaterial, [roomHalfWidth, roomWallHeight / 2 - 0.08, 0]);
const roomCeiling = addPart(room, new THREE.BoxGeometry(roomWidth, 0.12, roomDepth), roomCeilingMaterial, [0, roomWallHeight, 0]);
roomCeiling.castShadow = false;
roomCeiling.receiveShadow = false;
const roomWalls = [roomBackWall, roomLeftWall, roomRightWall, roomCeiling];
roomWalls.forEach((wall) => {
  wall.castShadow = false;
});

const roomFillLight = new THREE.PointLight(0xffedf7, 1.55, 18, 1.9);
roomFillLight.position.set(0, roomWallHeight - 0.55, 0.4);
roomFillLight.castShadow = false;
room.add(roomFillLight);

const editorFloorTarget = new THREE.Mesh(
  new THREE.PlaneGeometry(roomWidth, roomDepth),
  new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false }),
);
editorFloorTarget.rotation.x = -Math.PI / 2;
editorFloorTarget.position.y = 0.08;
room.add(editorFloorTarget);

const editorBackWallTarget = new THREE.Mesh(
  new THREE.PlaneGeometry(roomWidth - 0.5, roomWallHeight - 0.7),
  new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false }),
);
editorBackWallTarget.position.set(0, 2, -roomHalfDepth + 0.08);
room.add(editorBackWallTarget);

const defaultRoomDecorStartIndex = room.children.length;

addPart(room, new THREE.CylinderGeometry(1.45, 1.45, 0.035, 48), rugMaterial, [0.15, 0.05, 1.1], [1.9, 1, 1.25]);
addPart(room, new THREE.BoxGeometry(3.7, 0.42, 2), bedMaterial, [-4.6, 0.22, -4.55]);
addPart(room, new THREE.BoxGeometry(3.7, 0.2, 2), blanketMaterial, [-4.6, 0.66, -4.55]);
addPart(room, new THREE.BoxGeometry(1.05, 0.2, 1.38), pillowMaterial, [-5.98, 0.78, -4.55]);
addPart(room, new THREE.BoxGeometry(1.25, 0.1, 0.6), phoneMaterial, [-4.45, 1.1, -4.55], [1, 1, 1], [0, 0, 0.2]);
const bedPhoneScreen = addPart(room, new THREE.BoxGeometry(1.05, 0.108, 0.44), phoneScreenMaterial, [-4.45, 1.16, -4.55], [1, 1, 1], [0, 0, 0.2]);

addPart(room, new THREE.BoxGeometry(1.4, 2.65, 0.64), cabinetMaterial, [7.55, 1.33, -6.25]);
addPart(room, new THREE.BoxGeometry(1.34, 0.055, 0.68), shelfMaterial, [7.55, 2.2, -5.86]);
addPart(room, new THREE.BoxGeometry(1.34, 0.055, 0.68), shelfMaterial, [7.55, 1.44, -5.86]);
addPart(room, new THREE.BoxGeometry(0.05, 2.3, 0.7), shelfMaterial, [7.55, 1.33, -5.84]);
for (let i = 0; i < 4; i += 1) {
  addPart(room, new THREE.BoxGeometry(0.25, 0.58, 0.08), clothesMaterials[i], [6.98 + i * 0.38, 1.84, -5.45], [1, 1, 1], [0, 0, -0.08 + i * 0.05]);
}

addPart(room, new THREE.BoxGeometry(2.65, 0.12, 0.34), shelfMaterial, [-6.35, 1.95, -6.5]);
addPart(room, new THREE.SphereGeometry(0.13, 16, 12), clothesMaterials[0], [-7.2, 2.15, -6.42]);
addPart(room, new THREE.SphereGeometry(0.13, 16, 12), clothesMaterials[2], [-6.6, 2.15, -6.42]);
addPart(room, new THREE.BoxGeometry(0.56, 0.42, 0.08), clothesMaterials[3], [-5.55, 2.18, -6.42]);

const bigPhone = new THREE.Group();
bigPhone.position.set(5.95, 1.34, -2.72);
bigPhone.rotation.x = 0.08;
bigPhone.rotation.y = -0.42;
room.add(bigPhone);

const bigPhoneHitBox = new THREE.Mesh(
  new THREE.BoxGeometry(1.55, 2.3, 0.36),
  new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false }),
);
bigPhone.userData.hitBox = bigPhoneHitBox;
bigPhone.add(bigPhoneHitBox);

addPart(
  bigPhone,
  createRoundedRectGeometry(1.28, 2.08, 0.16, 0.14),
  phoneMaterial,
  [0, 0, 0],
);
addPart(
  bigPhone,
  createRoundedRectGeometry(1.08, 1.76, 0.05, 0.095),
  bigPhoneGlowMaterial,
  [0, -0.02, 0.095],
);
const bigPhoneScreen = addPart(
  bigPhone,
  createRoundedRectGeometry(1.0, 1.62, 0.035, 0.08),
  bigPhoneScreenMaterial,
  [0, -0.03, 0.128],
);
const bigPhoneImage = new THREE.Mesh(new THREE.PlaneGeometry(0.78, 1.68), bigPhoneImageMaterial);
bigPhoneImage.position.set(0, -0.03, 0.185);
bigPhoneImage.castShadow = false;
bigPhoneImage.receiveShadow = false;
bigPhone.add(bigPhoneImage);
addPart(bigPhone, new THREE.CapsuleGeometry(0.04, 0.2, 8, 16), phoneMaterial, [0, 0.86, 0.16], [1, 0.42, 1], [0, 0, Math.PI / 2]);
addPart(bigPhone, new THREE.SphereGeometry(0.035, 14, 10), new THREE.MeshStandardMaterial({ color: 0x111116, roughness: 0.42 }), [0.28, 0.86, 0.158]);
addPart(bigPhone, new THREE.BoxGeometry(0.025, 0.32, 0.05), phoneMaterial, [-0.66, 0.26, 0.01], [1, 1, 1]);
addPart(bigPhone, new THREE.BoxGeometry(0.025, 0.24, 0.05), phoneMaterial, [0.66, 0.08, 0.01], [1, 1, 1]);
const bigPhoneLight = new THREE.PointLight(0xffd447, 2.6, 5.2);
bigPhoneLight.position.set(0, -0.12, 0.55);
bigPhone.add(bigPhoneLight);

addPart(room, new THREE.BoxGeometry(1.8, 0.14, 0.72), shelfMaterial, [3.85, 0.62, 2.85]);
for (const x of [3.12, 4.58]) {
  for (const z of [2.57, 3.13]) {
    addPart(room, new THREE.CylinderGeometry(0.035, 0.04, 0.58, 12), shelfMaterial, [x, 0.3, z]);
  }
}
addPart(room, new THREE.CylinderGeometry(0.18, 0.16, 0.44, 20), clothesMaterials[1], [3.35, 0.94, 2.85]);
addPart(room, new THREE.SphereGeometry(0.18, 16, 12), clothesMaterials[0], [4.35, 0.94, 2.85]);
addPart(room, new THREE.BoxGeometry(0.58, 0.75, 0.08), new THREE.MeshStandardMaterial({ color: 0xfff0f7, roughness: 0.72 }), [-8.92, 1.9, -1.6], [1, 1, 1], [0, Math.PI / 2, 0]);

addPart(room, new THREE.BoxGeometry(1.7, 0.1, 0.42), shelfMaterial, [-7.25, 0.82, 3.75]);
addPart(room, new THREE.BoxGeometry(0.9, 1.15, 0.44), cabinetMaterial, [-7.3, 0.57, 4.35]);
addPart(room, new THREE.CylinderGeometry(0.72, 0.72, 0.04, 36), new THREE.MeshStandardMaterial({ color: 0xfff3ba, roughness: 0.82 }), [-3.2, 0.055, 3.9], [1.8, 1, 1.12]);
addPart(room, new THREE.BoxGeometry(1.05, 1.05, 0.08), new THREE.MeshStandardMaterial({ color: 0xffd9eb, roughness: 0.7 }), [0.1, 1.76, -6.86]);
addPart(room, new THREE.BoxGeometry(1.05, 1.05, 0.08), new THREE.MeshStandardMaterial({ color: 0xd7f4ff, roughness: 0.7 }), [1.45, 1.76, -6.86]);

addPart(room, new THREE.BoxGeometry(2.55, 0.16, 0.78), vanityMaterial, [3.15, 0.78, -6.25]);
addPart(room, new THREE.BoxGeometry(0.18, 0.76, 0.18), vanityMaterial, [2.0, 0.36, -5.92]);
addPart(room, new THREE.BoxGeometry(0.18, 0.76, 0.18), vanityMaterial, [4.3, 0.36, -5.92]);
addPart(room, new THREE.BoxGeometry(0.18, 0.76, 0.18), vanityMaterial, [2.0, 0.36, -6.58]);
addPart(room, new THREE.BoxGeometry(0.18, 0.76, 0.18), vanityMaterial, [4.3, 0.36, -6.58]);
addPart(room, new THREE.BoxGeometry(1.55, 0.58, 0.16), vanityMaterial, [3.15, 0.48, -5.82]);
addPart(room, new THREE.CylinderGeometry(0.52, 0.52, 0.16, 40), softLilacMaterial, [3.15, 0.18, -5.15], [1.0, 1, 0.82]);
addPart(room, new THREE.CylinderGeometry(0.12, 0.16, 0.42, 20), goldAccentMaterial, [3.15, 0.45, -5.15]);
addPart(room, new THREE.BoxGeometry(1.25, 1.0, 0.055), mirrorMaterial, [3.15, 2.05, -6.88]);
addPart(room, new THREE.BoxGeometry(1.42, 1.16, 0.045), goldAccentMaterial, [3.15, 2.05, -6.9]);
addPart(room, new THREE.BoxGeometry(1.16, 0.9, 0.06), mirrorMaterial, [3.15, 2.05, -6.86]);
addPart(room, new THREE.SphereGeometry(0.12, 16, 12), heartPinkMaterial, [2.3, 0.98, -5.85]);
addPart(room, new THREE.SphereGeometry(0.11, 16, 12), clothesMaterials[2], [3.82, 0.98, -5.86]);
addPart(room, new THREE.BoxGeometry(0.38, 0.14, 0.28), goldAccentMaterial, [3.48, 0.93, -5.82]);

addPart(room, new THREE.BoxGeometry(2.7, 2.25, 0.58), softLilacMaterial, [-7.48, 1.14, 0.6]);
addPart(room, new THREE.BoxGeometry(0.08, 2.12, 0.62), goldAccentMaterial, [-7.48, 1.16, 0.92]);
addPart(room, new THREE.CapsuleGeometry(0.06, 0.78, 8, 12), clothesMaterials[0], [-7.9, 1.55, 1.02], [1, 1, 0.72], [0, 0, 0.18]);
addPart(room, new THREE.CapsuleGeometry(0.06, 0.74, 8, 12), clothesMaterials[1], [-7.45, 1.55, 1.02], [1, 1, 0.72], [0, 0, -0.08]);
addPart(room, new THREE.CapsuleGeometry(0.06, 0.7, 8, 12), clothesMaterials[3], [-7.0, 1.55, 1.02], [1, 1, 0.72], [0, 0, 0.1]);

for (let i = 0; i < 9; i += 1) {
  const x = -3.6 + i * 0.86;
  const y = 3.24 + Math.sin(i * 0.9) * 0.08;
  addPart(room, new THREE.SphereGeometry(0.075, 12, 10), i % 2 ? heartPinkMaterial : goldAccentMaterial, [x, y, -6.88]);
}
for (const [x, y, scale] of [[-2.0, 2.82, 0.34], [-1.35, 2.35, 0.24], [2.35, 2.82, 0.3], [3.0, 2.28, 0.22]]) {
  const wallHeart = new THREE.Mesh(createHeartGeometry(), heartPinkMaterial);
  wallHeart.position.set(x, y, -6.88);
  wallHeart.scale.setScalar(scale);
  wallHeart.rotation.x = 0;
  wallHeart.castShadow = false;
  room.add(wallHeart);
}

const bumbleLogo = new THREE.Group();
const bumbleLogoPlane = new THREE.Mesh(new THREE.PlaneGeometry(1.65, 0.46), bumbleLogoMaterial);
const bumbleLogoHitBox = new THREE.Mesh(
  new THREE.BoxGeometry(1.85, 0.62, 0.16),
  new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false }),
);
addPart(bumbleLogo, new THREE.TorusGeometry(0.48, 0.025, 8, 48), bumbleLogoGlowMaterial, [0, -0.13, -0.03], [1.72, 0.2, 1], [0, 0, 0]);
bumbleLogoPlane.position.z = 0.045;
bumbleLogoPlane.position.y = 0.18;
bumbleLogoHitBox.position.z = 0.035;
bumbleLogo.add(bumbleLogoPlane, bumbleLogoHitBox);
bumbleLogo.position.copy(bumbleLogoBasePosition);
bumbleLogo.rotation.y = 0;
bumbleLogo.userData.hitBox = bumbleLogoHitBox;
room.add(bumbleLogo);

const puzzleHeart = new THREE.Group();
const puzzleHeartBaseMaterial = new THREE.MeshStandardMaterial({
  color: 0xfff4d5,
  emissive: 0xffd447,
  emissiveIntensity: 0.18,
  roughness: 0.58,
});
const puzzleHeartMesh = new THREE.Mesh(createHeartGeometry(), heartPinkMaterial.clone());
const puzzleHeartBase = new THREE.Mesh(new THREE.CylinderGeometry(0.54, 0.62, 0.075, 36), puzzleHeartBaseMaterial);
puzzleHeartMesh.position.y = 0.68;
puzzleHeartMesh.rotation.x = -0.08;
puzzleHeartMesh.scale.setScalar(0.72);
puzzleHeartMesh.castShadow = true;
puzzleHeartBase.castShadow = true;
puzzleHeartBase.receiveShadow = true;
puzzleHeart.add(puzzleHeartBase, puzzleHeartMesh);
puzzleHeart.position.set(0, 6.4, 0.25);
puzzleHeart.visible = false;
room.add(puzzleHeart);

const bedroomDoor = new THREE.Group();
addPart(bedroomDoor, new THREE.BoxGeometry(1.34, 2.12, 0.18), doorMaterial, [0, 1.18, 0]);
addPart(bedroomDoor, new THREE.BoxGeometry(1.62, 0.16, 0.22), doorTrimMaterial, [0, 2.32, 0.01]);
addPart(bedroomDoor, new THREE.BoxGeometry(0.16, 2.34, 0.22), doorTrimMaterial, [-0.8, 1.22, 0.01]);
addPart(bedroomDoor, new THREE.BoxGeometry(0.16, 2.34, 0.22), doorTrimMaterial, [0.8, 1.22, 0.01]);
bedroomDoor.position.set(-0.2, doorDropStartY, 4.15);
bedroomDoor.rotation.y = Math.PI;
bedroomDoor.visible = false;
room.add(bedroomDoor);

function createFallingDoor() {
  const door = new THREE.Group();
  addPart(door, new THREE.BoxGeometry(1.34, 2.12, 0.18), doorMaterial, [0, 1.18, 0]);
  addPart(door, new THREE.BoxGeometry(1.62, 0.16, 0.22), doorTrimMaterial, [0, 2.32, 0.01]);
  addPart(door, new THREE.BoxGeometry(0.16, 2.34, 0.22), doorTrimMaterial, [-0.8, 1.22, 0.01]);
  addPart(door, new THREE.BoxGeometry(0.16, 2.34, 0.22), doorTrimMaterial, [0.8, 1.22, 0.01]);
  return door;
}

const outdoorArea = new THREE.Group();
outdoorArea.visible = false;
scene.add(outdoorArea);

const outdoorGrassMaterial = new THREE.MeshStandardMaterial({ color: 0x7abf86, roughness: 0.9 });
const outdoorPathMaterial = new THREE.MeshStandardMaterial({ color: 0xf1d6b3, roughness: 0.86 });
const outdoorBenchMaterial = new THREE.MeshStandardMaterial({ color: 0xd58b5f, roughness: 0.78 });
const outdoorBenchLegMaterial = new THREE.MeshStandardMaterial({ color: 0x5b4638, roughness: 0.72 });
const outdoorTableMaterial = new THREE.MeshStandardMaterial({ color: 0x141b1f, roughness: 0.62, metalness: 0.1 });
const outdoorChairMaterial = new THREE.MeshStandardMaterial({ color: 0x2f3a42, roughness: 0.62, metalness: 0.12 });
const outdoorPaverMaterial = new THREE.MeshStandardMaterial({ color: 0xd8cabc, roughness: 0.82 });
const outdoorBuildingMaterial = new THREE.MeshStandardMaterial({ color: 0xd4c1b8, roughness: 0.78 });
const outdoorBuildingAccentMaterial = new THREE.MeshStandardMaterial({ color: 0x9e6575, roughness: 0.76 });
const outdoorGlassMaterial = new THREE.MeshStandardMaterial({
  color: 0xc9eef2,
  transparent: true,
  opacity: 0.42,
  roughness: 0.18,
  metalness: 0.08,
});
const outdoorFrameMaterial = new THREE.MeshStandardMaterial({ color: 0xd7c9ad, roughness: 0.48, metalness: 0.18 });
const outdoorHedgeMaterial = new THREE.MeshStandardMaterial({ color: 0x4f9b5b, roughness: 0.92 });
const outdoorDarkLeafMaterial = new THREE.MeshStandardMaterial({ color: 0x2f6f3e, roughness: 0.94 });
const guySkinMaterial = new THREE.MeshStandardMaterial({ color: 0xd49a82, roughness: 0.72 });
const guyHairMaterial = new THREE.MeshStandardMaterial({ color: 0x161210, roughness: 0.88 });
const guyShirtMaterial = new THREE.MeshStandardMaterial({ color: 0xf6f1e7, roughness: 0.82 });
const guyGraphicMaterial = new THREE.MeshStandardMaterial({ color: 0xf28a2d, roughness: 0.78 });
const guyPantsMaterial = new THREE.MeshStandardMaterial({ color: 0x5f7790, roughness: 0.86 });
const guyGlassesMaterial = new THREE.MeshStandardMaterial({ color: 0x101010, roughness: 0.34, metalness: 0.18 });

addPart(outdoorArea, new THREE.BoxGeometry(22, 0.12, 17), outdoorGrassMaterial, [0, -0.06, 0]);
addPart(outdoorArea, new THREE.BoxGeometry(7.2, 0.05, 15.8), outdoorPaverMaterial, [0.2, 0.01, 0.15]);
addPart(outdoorArea, new THREE.BoxGeometry(2.1, 0.055, 15.8), outdoorPathMaterial, [3.95, 0.025, 0.15]);

function createOutdoorChair(parent, x, z, rotation = 0) {
  const chair = new THREE.Group();
  addPart(chair, new THREE.BoxGeometry(0.62, 0.08, 0.56), outdoorChairMaterial, [0, 0.45, 0]);
  addPart(chair, new THREE.BoxGeometry(0.62, 0.08, 0.08), outdoorChairMaterial, [0, 0.78, -0.25]);
  for (const [lx, lz] of [[-0.24, -0.2], [0.24, -0.2], [-0.24, 0.2], [0.24, 0.2]]) {
    addPart(chair, new THREE.CylinderGeometry(0.025, 0.03, 0.86, 8), outdoorChairMaterial, [lx, 0.06, lz]);
  }
  chair.position.set(x, 0, z);
  chair.rotation.y = rotation;
  parent.add(chair);
  return chair;
}

function createOutdoorTableSet(parent, x, z, rotation = 0, active = false) {
  const set = new THREE.Group();
  addPart(set, new THREE.CylinderGeometry(active ? 0.92 : 0.72, active ? 0.92 : 0.72, 0.09, 48), outdoorTableMaterial, [0, 0.64, 0]);
  addPart(set, new THREE.CylinderGeometry(0.055, 0.07, 0.68, 12), outdoorBenchLegMaterial, [0, 0.28, 0]);
  addPart(set, new THREE.CylinderGeometry(0.36, 0.46, 0.06, 32), outdoorBenchLegMaterial, [0, 0.05, 0]);
  if (active) {
    for (const side of [-1, 1]) {
      addPart(set, new THREE.BoxGeometry(1.45, 0.14, 0.42), outdoorBenchMaterial, [0, 0.43, side * 1.12]);
      addPart(set, new THREE.BoxGeometry(1.56, 0.08, 0.12), outdoorBenchLegMaterial, [0, 0.54, side * 1.33], [1, 1, 1], [0.16 * side, 0, 0]);
      addPart(set, new THREE.CylinderGeometry(0.045, 0.055, 0.42, 10), outdoorBenchLegMaterial, [-0.56, 0.22, side * 1.0]);
      addPart(set, new THREE.CylinderGeometry(0.045, 0.055, 0.42, 10), outdoorBenchLegMaterial, [0.56, 0.22, side * 1.0]);
      addPart(set, new THREE.CylinderGeometry(0.045, 0.055, 0.42, 10), outdoorBenchLegMaterial, [-0.56, 0.22, side * 1.24]);
      addPart(set, new THREE.CylinderGeometry(0.045, 0.055, 0.42, 10), outdoorBenchLegMaterial, [0.56, 0.22, side * 1.24]);
    }
  }
  set.position.set(x, 0, z);
  set.rotation.y = rotation;
  parent.add(set);
  return set;
}

createOutdoorTableSet(outdoorArea, 0, -0.08, 0, true);
for (const [x, z, ry] of [
  [-3.1, -2.6, 0.12],
  [-3.8, 0.3, -0.08],
  [-2.2, 2.7, 0.18],
  [5.3, -2.7, -0.18],
  [5.7, 0.2, 0.1],
  [4.7, 2.8, -0.08],
]) {
  createOutdoorTableSet(outdoorArea, x, z, ry);
}

addPart(outdoorArea, new THREE.BoxGeometry(0.72, 2.6, 15.5), outdoorBuildingAccentMaterial, [-8.2, 1.3, 0]);
addPart(outdoorArea, new THREE.BoxGeometry(2.3, 3.8, 15.5), outdoorBuildingMaterial, [-7.25, 1.9, 0]);
for (let floor = 0; floor < 3; floor += 1) {
  for (let row = 0; row < 6; row += 1) {
    addPart(outdoorArea, new THREE.BoxGeometry(0.05, 0.48, 0.72), outdoorGlassMaterial, [-6.08, 0.95 + floor * 1.05, -5.6 + row * 2.05]);
  }
}

function createGadingWalkLogo() {
  const logo = new THREE.Group();
  addPart(logo, new THREE.BoxGeometry(4.6, 1.25, 0.12), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.34 }), [0, 0, -0.06]);

  const colors = [0xff3d3d, 0xffcf00, 0x1da8ff];
  const offsets = [-1.25, 0, 1.25];
  offsets.forEach((offset, index) => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-1.04 + offset, 0.24, 0.08),
      new THREE.Vector3(-0.58 + offset, 0.52, 0.12),
      new THREE.Vector3(-0.12 + offset, -0.12, 0.12),
      new THREE.Vector3(0.38 + offset, 0.34, 0.12),
      new THREE.Vector3(0.82 + offset, 0.02, 0.08),
    ]);
    const tube = new THREE.Mesh(
      new THREE.TubeGeometry(curve, 32, 0.08, 12, false),
      new THREE.MeshStandardMaterial({ color: colors[index], emissive: colors[index], emissiveIntensity: 0.08, roughness: 0.32 }),
    );
    logo.add(tube);
  });

  const text = createTextPlane('Gading Walk', 2.3, 0.42, 56);
  text.position.set(0, -0.42, 0.11);
  logo.add(text);
  for (const x of [-1.85, 1.85]) {
    addPart(logo, new THREE.CylinderGeometry(0.055, 0.07, 2.7, 16), outdoorFrameMaterial, [x, -1.95, -0.12]);
    addPart(logo, new THREE.BoxGeometry(0.34, 0.08, 0.34), outdoorFrameMaterial, [x, -3.28, -0.12]);
  }
  logo.position.set(0.2, 3.25, -4.4);
  logo.rotation.y = 0;
  return logo;
}

outdoorArea.add(createGadingWalkLogo());

addPart(outdoorArea, new THREE.BoxGeometry(0.22, 3.2, 15.5), outdoorFrameMaterial, [6.45, 1.6, 0]);
addPart(outdoorArea, new THREE.BoxGeometry(0.18, 0.16, 15.5), outdoorFrameMaterial, [5.3, 2.95, 0]);
for (let i = 0; i < 7; i += 1) {
  addPart(outdoorArea, new THREE.BoxGeometry(1.55, 1.45, 0.045), outdoorGlassMaterial, [5.72, 2.12, -6 + i * 2], [1, 1, 1], [0, 0.12, 0]);
  addPart(outdoorArea, new THREE.BoxGeometry(0.08, 1.6, 0.08), outdoorFrameMaterial, [5.12, 1.84, -6 + i * 2]);
}
addPart(outdoorArea, new THREE.BoxGeometry(1.6, 0.12, 15.5), outdoorFrameMaterial, [5.75, 1.03, 0]);

for (const [x, z, sx, sz] of [[-4.8, -5.6, 1.4, 0.7], [-4.9, 5.2, 1.2, 0.75], [3.2, -5.7, 1.0, 0.65], [6.1, 4.4, 0.82, 0.72]]) {
  addPart(outdoorArea, new THREE.BoxGeometry(1.6 * sx, 0.92, 1.1 * sz), outdoorHedgeMaterial, [x, 0.46, z]);
}
for (const [x, z, scale] of [[-4.8, -3.4, 1.35], [-4.4, 2.4, 1.1], [3.7, 4.4, 1.08]]) {
  addPart(outdoorArea, new THREE.CylinderGeometry(0.15, 0.23, 1.85 * scale, 14), outdoorBenchLegMaterial, [x, 0.78 * scale, z]);
  const crown = new THREE.Group();
  for (const [ox, oy, oz, s] of [[0, 0, 0, 1], [-0.42, -0.08, 0.15, 0.82], [0.48, -0.02, -0.12, 0.78], [0.06, 0.38, 0.05, 0.74]]) {
    addPart(crown, new THREE.SphereGeometry(0.86 * scale * s, 18, 14), outdoorDarkLeafMaterial, [ox * scale, oy * scale, oz * scale]);
  }
  crown.position.set(x, 1.92 * scale, z);
  outdoorArea.add(crown);
}

function createRandomGuy() {
  const guy = new THREE.Group();
  const leftLeg = new THREE.Group();
  const rightLeg = new THREE.Group();
  const torso = new THREE.Group();
  const headGroup = new THREE.Group();
  guy.add(leftLeg, rightLeg, torso, headGroup);
  leftLeg.position.set(-0.13, 0.82, 0);
  rightLeg.position.set(0.13, 0.82, 0);
  addPart(leftLeg, new THREE.CylinderGeometry(0.13, 0.15, 0.82, 18), guyPantsMaterial, [0, -0.41, 0], [1, 1, 0.82]);
  addPart(rightLeg, new THREE.CylinderGeometry(0.13, 0.15, 0.82, 18), guyPantsMaterial, [0, -0.41, 0], [1, 1, 0.82]);
  addPart(leftLeg, new THREE.BoxGeometry(0.16, 0.035, 0.03), new THREE.MeshStandardMaterial({ color: 0xdde5ef, roughness: 0.7 }), [0.04, -0.2, 0.11], [1, 1, 1], [0, 0, -0.16]);
  addPart(rightLeg, new THREE.BoxGeometry(0.16, 0.035, 0.03), new THREE.MeshStandardMaterial({ color: 0xdde5ef, roughness: 0.7 }), [-0.04, -0.3, 0.11], [1, 1, 1], [0, 0, 0.14]);
  addPart(leftLeg, new THREE.CapsuleGeometry(0.09, 0.2, 8, 12), shoeMaterial, [0, -0.82, 0.08], [1.12, 0.44, 1.35], [Math.PI / 2, 0, 0]);
  addPart(rightLeg, new THREE.CapsuleGeometry(0.09, 0.2, 8, 12), shoeMaterial, [0, -0.82, 0.08], [1.12, 0.44, 1.35], [Math.PI / 2, 0, 0]);
  addPart(torso, new THREE.CylinderGeometry(0.32, 0.25, 0.68, 32), guyShirtMaterial, [0, 1.02, 0], [1, 1, 0.76]);
  addPart(torso, new THREE.BoxGeometry(0.28, 0.34, 0.035), guyGraphicMaterial, [0.02, 1.05, 0.235], [1, 1, 1], [0.02, 0, 0.08]);
  addPart(torso, new THREE.BoxGeometry(0.12, 0.18, 0.04), new THREE.MeshStandardMaterial({ color: 0x2f74b8, roughness: 0.72 }), [0.1, 0.98, 0.26], [1, 1, 1], [0, 0, -0.16]);
  const leftArm = new THREE.Group();
  const rightArm = new THREE.Group();
  leftArm.position.set(-0.31, 1.17, 0.02);
  rightArm.position.set(0.31, 1.17, 0.02);
  leftArm.rotation.z = -0.58;
  rightArm.rotation.z = 0.58;
  torso.add(leftArm, rightArm);
  addPart(leftArm, new THREE.CapsuleGeometry(0.07, 0.5, 8, 16), guySkinMaterial, [-0.08, -0.24, 0.04], [0.95, 1, 0.95], [0.18, 0, 0.25]);
  addPart(rightArm, new THREE.CapsuleGeometry(0.07, 0.5, 8, 16), guySkinMaterial, [0.08, -0.24, 0.04], [0.95, 1, 0.95], [0.18, 0, -0.25]);
  headGroup.position.set(0, 1.35, 0);
  addPart(headGroup, new THREE.CylinderGeometry(0.08, 0.09, 0.13, 16), guySkinMaterial, [0, 0, 0]);
  addPart(headGroup, new THREE.SphereGeometry(0.32, 28, 20), guySkinMaterial, [0, 0.3, 0.03], [0.96, 1.02, 0.9]);
  addPart(headGroup, new THREE.SphereGeometry(0.34, 30, 20), guyHairMaterial, [0, 0.52, -0.01], [1.06, 0.6, 0.92]);
  addPart(headGroup, new THREE.SphereGeometry(0.16, 18, 12), guyHairMaterial, [-0.16, 0.66, 0.12], [1.05, 0.7, 0.7], [0, 0, -0.2]);
  addPart(headGroup, new THREE.SphereGeometry(0.15, 18, 12), guyHairMaterial, [0.1, 0.68, 0.14], [1, 0.72, 0.68], [0, 0, 0.18]);
  addPart(headGroup, new THREE.TorusGeometry(0.09, 0.01, 8, 24), guyGlassesMaterial, [-0.12, 0.32, 0.32], [1.18, 0.86, 1]);
  addPart(headGroup, new THREE.TorusGeometry(0.09, 0.01, 8, 24), guyGlassesMaterial, [0.12, 0.32, 0.32], [1.18, 0.86, 1]);
  addPart(headGroup, new THREE.BoxGeometry(0.08, 0.014, 0.014), guyGlassesMaterial, [0, 0.32, 0.32]);
  guy.userData.leftLeg = leftLeg;
  guy.userData.rightLeg = rightLeg;
  guy.userData.leftArm = leftArm;
  guy.userData.rightArm = rightArm;
  guy.userData.torso = torso;
  guy.userData.head = headGroup;
  return guy;
}

const randomGuy = createRandomGuy();
randomGuy.position.set(-5.4, 0, 1.75);
randomGuy.rotation.y = Math.PI / 2;
randomGuy.visible = false;
outdoorArea.add(randomGuy);

const starbucksArea = new THREE.Group();
starbucksArea.visible = false;
scene.add(starbucksArea);

const coffeeFloorMaterial = new THREE.MeshStandardMaterial({ color: 0xc8a883, roughness: 0.84 });
const coffeeWallMaterial = new THREE.MeshStandardMaterial({ color: 0xf2e2cf, roughness: 0.8 });
const coffeeWoodMaterial = new THREE.MeshStandardMaterial({ color: 0x7a4f32, roughness: 0.72 });
const coffeeDarkWoodMaterial = new THREE.MeshStandardMaterial({ color: 0x3a281f, roughness: 0.7 });
const coffeeGreenMaterial = new THREE.MeshStandardMaterial({ color: 0x0b6b43, roughness: 0.58 });
const coffeeCreamMaterial = new THREE.MeshStandardMaterial({ color: 0xfff4dd, roughness: 0.76 });
const baristaApronMaterial = new THREE.MeshStandardMaterial({ color: 0x0b5f3c, roughness: 0.74 });

const starbucksOutdoorArea = new THREE.Group();
starbucksOutdoorArea.visible = false;
scene.add(starbucksOutdoorArea);
const patioStoneMaterial = new THREE.MeshStandardMaterial({ color: 0xd6c3a5, roughness: 0.88 });
const patioRoadMaterial = new THREE.MeshStandardMaterial({ color: 0x30383a, roughness: 0.8 });
const patioGlassMaterial = new THREE.MeshStandardMaterial({ color: 0xbfe9ed, transparent: true, opacity: 0.42, roughness: 0.12, metalness: 0.06 });
const patioUmbrellaMaterial = new THREE.MeshStandardMaterial({ color: 0x0b6b43, roughness: 0.72 });
const roadMarkMaterial = new THREE.MeshStandardMaterial({ color: 0xffe6a6, roughness: 0.62 });

addPart(starbucksOutdoorArea, new THREE.BoxGeometry(18, 0.12, 14), patioStoneMaterial, [0, -0.06, 0]);
addPart(starbucksOutdoorArea, new THREE.BoxGeometry(18, 0.06, 3.1), patioRoadMaterial, [0, -0.025, 5.45]);
for (let x = -7.2; x <= 7.2; x += 2.4) {
  addPart(starbucksOutdoorArea, new THREE.BoxGeometry(1.15, 0.018, 0.12), roadMarkMaterial, [x, 0.016, 5.45]);
}
addPart(starbucksOutdoorArea, new THREE.BoxGeometry(13.6, 3.5, 0.18), coffeeWallMaterial, [0, 1.75, -5.45]);
addPart(starbucksOutdoorArea, new THREE.BoxGeometry(13.8, 0.22, 0.32), coffeeDarkWoodMaterial, [0, 3.56, -5.28]);
addPart(starbucksOutdoorArea, new THREE.BoxGeometry(2.2, 2.2, 0.08), patioGlassMaterial, [-4.6, 1.66, -5.22]);
addPart(starbucksOutdoorArea, new THREE.BoxGeometry(2.2, 2.2, 0.08), patioGlassMaterial, [4.6, 1.66, -5.22]);
addPart(starbucksOutdoorArea, new THREE.BoxGeometry(1.35, 2.45, 0.12), coffeeGreenMaterial, [0, 1.28, -5.16]);
addPart(starbucksOutdoorArea, new THREE.BoxGeometry(0.86, 1.78, 0.08), patioGlassMaterial, [0, 1.34, -5.06]);
const patioLogo = createTextPlane('STARBUCKS', 3.0, 0.45, 52);
patioLogo.position.set(0, 3.08, -5.02);
starbucksOutdoorArea.add(patioLogo);
addPart(starbucksOutdoorArea, new THREE.CylinderGeometry(0.34, 0.34, 0.07, 42), coffeeGreenMaterial, [0, 2.62, -4.96], [1, 1, 1], [Math.PI / 2, 0, 0]);
addPart(starbucksOutdoorArea, new THREE.TorusGeometry(0.23, 0.018, 8, 36), coffeeCreamMaterial, [0, 2.62, -4.91]);
for (const [x, z] of [[-3.4, -0.4], [3.15, -0.2], [-1.2, 2.0], [2.15, 2.4]]) {
  createOutdoorTableSet(starbucksOutdoorArea, x, z, 0.08, true);
  if (x === -1.2 && z === 2.0) continue;
  addPart(starbucksOutdoorArea, new THREE.CylinderGeometry(0.045, 0.06, 2.25, 14), coffeeDarkWoodMaterial, [x, 1.66, z]);
  addPart(starbucksOutdoorArea, new THREE.ConeGeometry(1.18, 0.5, 34), patioUmbrellaMaterial, [x, 2.78, z], [1.28, 0.72, 1.28], [Math.PI, 0, 0]);
}
for (const [x, z, sx] of [[-6.4, -1.2, 1.1], [6.3, -1.35, 1.0], [-6.1, 3.2, 0.9], [5.7, 3.1, 0.92]]) {
  addPart(starbucksOutdoorArea, new THREE.BoxGeometry(1.25 * sx, 0.58, 0.72), outdoorHedgeMaterial, [x, 0.29, z]);
  addPart(starbucksOutdoorArea, new THREE.CylinderGeometry(0.1, 0.16, 1.15, 12), outdoorBenchLegMaterial, [x, 0.8, z]);
  addPart(starbucksOutdoorArea, new THREE.SphereGeometry(0.58 * sx, 16, 12), outdoorDarkLeafMaterial, [x, 1.42, z]);
}

addPart(starbucksArea, new THREE.BoxGeometry(14, 0.12, 10), coffeeFloorMaterial, [0, -0.04, 0]);
addPart(starbucksArea, new THREE.BoxGeometry(14, 4.2, 0.16), coffeeWallMaterial, [0, 2.05, -4.9]);
addPart(starbucksArea, new THREE.BoxGeometry(0.16, 4.2, 10), coffeeWallMaterial, [-7, 2.05, 0]);
addPart(starbucksArea, new THREE.BoxGeometry(0.16, 4.2, 10), coffeeWallMaterial, [7, 2.05, 0]);
addPart(starbucksArea, new THREE.BoxGeometry(5.8, 0.18, 1.1), coffeeWoodMaterial, [0, 1.0, -2.65]);
addPart(starbucksArea, new THREE.BoxGeometry(5.8, 1.0, 0.95), coffeeDarkWoodMaterial, [0, 0.48, -2.66]);
addPart(starbucksArea, new THREE.BoxGeometry(5.6, 0.08, 0.18), coffeeCreamMaterial, [0, 1.15, -2.08]);
const pastryGlassMaterial = new THREE.MeshStandardMaterial({
  color: 0xd9f8ff,
  transparent: true,
  opacity: 0.32,
  roughness: 0.05,
  metalness: 0.08,
});
addPart(starbucksArea, new THREE.BoxGeometry(1.56, 0.08, 0.72), coffeeDarkWoodMaterial, [-2.1, 1.03, -2.52]);
addPart(starbucksArea, new THREE.BoxGeometry(1.56, 0.08, 0.72), coffeeCreamMaterial, [-2.1, 1.56, -2.52]);
addPart(starbucksArea, new THREE.BoxGeometry(1.56, 0.46, 0.035), pastryGlassMaterial, [-2.1, 1.31, -2.16]);
addPart(starbucksArea, new THREE.BoxGeometry(0.035, 0.46, 0.72), pastryGlassMaterial, [-2.88, 1.31, -2.52]);
addPart(starbucksArea, new THREE.BoxGeometry(0.035, 0.46, 0.72), pastryGlassMaterial, [-1.32, 1.31, -2.52]);
addPart(starbucksArea, new THREE.BoxGeometry(1.42, 0.035, 0.56), coffeeCreamMaterial, [-2.1, 1.28, -2.48]);
for (const x of [-2.43, -2.1, -1.77]) {
  addPart(starbucksArea, new THREE.CylinderGeometry(0.12, 0.15, 0.08, 20), new THREE.MeshStandardMaterial({ color: 0xd99b55, roughness: 0.82 }), [x, 1.16, -2.28]);
}
addPart(starbucksArea, new THREE.BoxGeometry(2.9, 1.05, 0.08), new THREE.MeshStandardMaterial({ color: 0x1e2a24, roughness: 0.54 }), [-2.35, 2.75, -4.78]);
addPart(starbucksArea, new THREE.BoxGeometry(2.9, 1.05, 0.08), new THREE.MeshStandardMaterial({ color: 0x1e2a24, roughness: 0.54 }), [2.35, 2.75, -4.78]);
for (const [x, y, w] of [[-2.35, 2.92, 1.9], [-2.35, 2.72, 2.2], [-2.35, 2.52, 1.55], [2.35, 2.92, 1.75], [2.35, 2.72, 2.25], [2.35, 2.52, 1.6]]) {
  addPart(starbucksArea, new THREE.BoxGeometry(w, 0.035, 0.025), coffeeCreamMaterial, [x, y, -4.71]);
}
const coffeeLogo = createTextPlane('STARBUCKS', 2.35, 0.38, 52);
coffeeLogo.position.set(0, 3.45, -4.67);
starbucksArea.add(coffeeLogo);
addPart(starbucksArea, new THREE.CylinderGeometry(0.48, 0.48, 0.08, 48), coffeeGreenMaterial, [0, 3.02, -4.72], [1, 1, 1], [Math.PI / 2, 0, 0]);
addPart(starbucksArea, new THREE.TorusGeometry(0.33, 0.025, 8, 36), coffeeCreamMaterial, [0, 3.02, -4.66], [1, 1, 1], [0, 0, 0]);
for (const x of [-4.6, -2.4, 2.4, 4.6]) {
  addPart(starbucksArea, new THREE.CylinderGeometry(0.025, 0.025, 0.52, 12), coffeeDarkWoodMaterial, [x, 3.78, -2.32]);
  addPart(starbucksArea, new THREE.ConeGeometry(0.38, 0.34, 32, 1, true), coffeeGreenMaterial, [x, 3.45, -2.32], [1, 1, 1], [Math.PI, 0, 0]);
  addPart(starbucksArea, new THREE.CylinderGeometry(0.24, 0.24, 0.035, 32), new THREE.MeshStandardMaterial({ color: 0xffefc0, emissive: 0xffd47a, emissiveIntensity: 1.2, roughness: 0.34 }), [x, 3.27, -2.32]);
  const light = new THREE.PointLight(0xffdf9e, 0.72, 3.2, 1.4);
  light.position.set(x, 3.12, -2.32);
  light.castShadow = false;
  starbucksArea.add(light);
}
for (const y of [1.75, 2.12]) {
  addPart(starbucksArea, new THREE.BoxGeometry(1.9, 0.08, 0.32), coffeeWoodMaterial, [-5.7, y, -4.62]);
  for (const x of [-6.25, -5.85, -5.45, -5.05]) {
    addPart(starbucksArea, new THREE.CylinderGeometry(0.09, 0.09, 0.28, 16), coffeeCreamMaterial, [x, y + 0.18, -4.52]);
    addPart(starbucksArea, new THREE.CylinderGeometry(0.09, 0.09, 0.035, 16), coffeeGreenMaterial, [x, y + 0.34, -4.52]);
  }
}
for (const [x, z] of [[-5.28, 0.82], [-4.92, 1.06], [4.92, 0.82], [5.28, 1.06]]) {
  addPart(starbucksArea, new THREE.CylinderGeometry(0.18, 0.14, 0.42, 20), coffeeCreamMaterial, [x, 0.86, z]);
  addPart(starbucksArea, new THREE.CylinderGeometry(0.19, 0.19, 0.035, 20), coffeeGreenMaterial, [x, 1.09, z]);
}
for (const x of [-5.1, 5.1]) {
  addPart(starbucksArea, new THREE.CylinderGeometry(0.58, 0.58, 0.07, 42), coffeeWoodMaterial, [x, 0.62, 0.95]);
  addPart(starbucksArea, new THREE.CylinderGeometry(0.055, 0.07, 0.68, 12), coffeeDarkWoodMaterial, [x, 0.28, 0.95]);
}

function createBarista() {
  const barista = createRandomGuy();
  barista.userData.torso.children[0].material = guyShirtMaterial;
  addPart(barista.userData.torso, new THREE.BoxGeometry(0.42, 0.58, 0.04), baristaApronMaterial, [0, 0.98, 0.255]);
  addPart(barista.userData.torso, new THREE.BoxGeometry(0.12, 0.05, 0.045), coffeeCreamMaterial, [0.12, 1.15, 0.285]);
  addPart(barista.userData.torso, new THREE.BoxGeometry(0.028, 0.32, 0.035), baristaApronMaterial, [-0.13, 1.28, 0.28], [1, 1, 1], [0, 0, -0.32]);
  addPart(barista.userData.torso, new THREE.BoxGeometry(0.028, 0.32, 0.035), baristaApronMaterial, [0.13, 1.28, 0.28], [1, 1, 1], [0, 0, 0.32]);
  addPart(barista.userData.head, new THREE.BoxGeometry(0.5, 0.1, 0.34), coffeeGreenMaterial, [0, 0.66, 0.02]);
  addPart(barista.userData.head, new THREE.BoxGeometry(0.34, 0.045, 0.2), coffeeGreenMaterial, [0, 0.64, 0.24]);
  addPart(barista.userData.head, new THREE.SphereGeometry(0.045, 12, 8), coffeeCreamMaterial, [0, 0.33, 0.34], [1, 0.38, 0.18]);
  return barista;
}

const starbucksGuy = createRandomGuy();
starbucksGuy.visible = false;
starbucksArea.add(starbucksGuy);
const barista = createBarista();
barista.visible = false;
starbucksArea.add(barista);
const starbucksBaristaBubble = createMeetupBubblePlane('barista', starbucksArea);
const starbucksGuyBubble = createMeetupBubblePlane('guy', starbucksArea);
const starbucksGirlBubble = createMeetupBubblePlane('girl', starbucksArea);

function createHandDrink() {
  const drink = new THREE.Group();
  addPart(drink, new THREE.CylinderGeometry(0.11, 0.085, 0.34, 20), coffeeCreamMaterial, [0, 0, 0], [1, 1, 1], [0.16, 0, 0.08]);
  addPart(drink, new THREE.CylinderGeometry(0.115, 0.115, 0.025, 20), coffeeGreenMaterial, [0, 0.19, 0.015], [1, 1, 1], [0.16, 0, 0.08]);
  drink.visible = false;
  return drink;
}

const starbucksGirlDrink = createHandDrink();
starbucksGirlDrink.position.set(0.42, 1.02, 0.28);
avatar.add(starbucksGirlDrink);
const starbucksGuyDrink = createHandDrink();
starbucksGuyDrink.position.set(-0.42, 1.03, 0.28);
starbucksGuy.add(starbucksGuyDrink);
const starbucksOutdoorGuy = createRandomGuy();
starbucksOutdoorGuy.visible = false;
starbucksOutdoorArea.add(starbucksOutdoorGuy);
const starbucksOutdoorGuyDrink = createHandDrink();
starbucksOutdoorGuyDrink.position.set(-0.42, 1.03, 0.28);
starbucksOutdoorGuyDrink.visible = true;
starbucksOutdoorGuy.add(starbucksOutdoorGuyDrink);
const starbucksOutdoorGuyBubble = createMeetupBubblePlane('guy', starbucksOutdoorArea);
const starbucksOutdoorGirlBubble = createMeetupBubblePlane('girl', starbucksOutdoorArea);
const starbucksProposalHearts = [];
for (let i = 0; i < 18; i += 1) {
  const heart = new THREE.Mesh(createHeartGeometry(), heartPinkMaterial.clone());
  heart.scale.setScalar(0.13 + (i % 4) * 0.025);
  heart.visible = false;
  starbucksOutdoorArea.add(heart);
  starbucksProposalHearts.push(heart);
}

const starbucksHeartClouds = new THREE.Group();
starbucksHeartClouds.visible = false;
for (let cloudIndex = 0; cloudIndex < 3; cloudIndex += 1) {
  const heartCloud = new THREE.Group();
  const cloudMat = new THREE.MeshStandardMaterial({
    color: 0xffd3e2,
    roughness: 0.96,
    transparent: true,
    opacity: 0.78,
    depthWrite: false,
  });
  for (let i = 0; i < 16; i += 1) {
    const t = (i / 16) * Math.PI * 2;
    const x = 0.16 * 16 * Math.sin(t) ** 3;
    const y = 0.14 * (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
    const puff = new THREE.Mesh(new THREE.SphereGeometry(0.22, 14, 10), cloudMat);
    puff.position.set(x, y, Math.sin(t * 2) * 0.08);
    puff.scale.set(1.25, 0.72, 0.9);
    heartCloud.add(puff);
  }
  heartCloud.position.set(-5 + cloudIndex * 5.1, 5.2 + cloudIndex * 0.35, -4.9 - cloudIndex * 1.2);
  heartCloud.scale.setScalar(0.04);
  heartCloud.userData.targetScale = 0.58 + cloudIndex * 0.08;
  starbucksHeartClouds.add(heartCloud);
}
scene.add(starbucksHeartClouds);

function hideStarbucksOutdoorBubbles() {
  starbucksOutdoorGuyBubble.visible = false;
  starbucksOutdoorGirlBubble.visible = false;
}

function hideStarbucksOutdoorSceneUi() {
  hideStarbucksOutdoorBubbles();
  starbucksProposalHearts.forEach((heart) => {
    heart.visible = false;
  });
  starbucksHeartClouds.visible = false;
  starbucksBirds.forEach((bird) => {
    bird.visible = false;
  });
}

const starbucksExitHeart = new THREE.Group();
const starbucksExitHeartDropPosition = new THREE.Vector3(0, 6.2, 2.55);
const starbucksExitHeartLandedPosition = new THREE.Vector3(0, 0.08, 2.55);
const starbucksExitDoorPosition = new THREE.Vector3(0, doorDropStartY, 3.95);
const starbucksExitHeartMesh = new THREE.Mesh(createHeartGeometry(), heartPinkMaterial.clone());
const starbucksExitHeartBase = new THREE.Mesh(new THREE.CylinderGeometry(0.46, 0.54, 0.07, 34), puzzleHeartBaseMaterial.clone());
starbucksExitHeartMesh.position.y = 0.58;
starbucksExitHeartMesh.rotation.x = -0.08;
starbucksExitHeartMesh.scale.setScalar(0.58);
starbucksExitHeart.add(starbucksExitHeartBase, starbucksExitHeartMesh);
starbucksExitHeart.visible = false;
starbucksArea.add(starbucksExitHeart);

const starbucksExitDoor = createFallingDoor();
starbucksExitDoor.position.copy(starbucksExitDoorPosition);
starbucksExitDoor.rotation.y = Math.PI;
starbucksExitDoor.visible = false;
starbucksArea.add(starbucksExitDoor);

const freeRoamPortalDoors = [];

function createFreeRoamPortalDoor(parent, area, destination, position, rotationY = 0) {
  const door = createFallingDoor();
  door.position.set(position[0], position[1], position[2]);
  door.rotation.y = rotationY;
  door.visible = false;
  door.userData.portalArea = area;
  door.userData.portalDestination = destination;
  parent.add(door);
  freeRoamPortalDoors.push(door);
  return door;
}

createFreeRoamPortalDoor(root, 'tutorial-island', 'bedroom', [2.8, 0, -3.2], 0);
createFreeRoamPortalDoor(room, 'bedroom', 'next-part', [0, 0, 4.25], Math.PI);
createFreeRoamPortalDoor(outdoorArea, 'next-part', 'starbucks', [0, 0, 4.85], Math.PI);
createFreeRoamPortalDoor(starbucksArea, 'starbucks', 'bedroom', [5.85, 0, 2.55], -Math.PI / 2);

const meetupLoveHearts = [];
for (let i = 0; i < 8; i += 1) {
  const heart = new THREE.Mesh(createHeartGeometry(), heartPinkMaterial.clone());
  heart.scale.setScalar(0.18 + (i % 3) * 0.035);
  heart.visible = false;
  outdoorArea.add(heart);
  meetupLoveHearts.push(heart);
}

const guyMeetupBubble = createMeetupBubblePlane('guy');
const girlMeetupBubble = createMeetupBubblePlane('girl');

const meetupTableProps = new THREE.Group();
const walletProp = addPart(meetupTableProps, new THREE.BoxGeometry(0.36, 0.06, 0.24), new THREE.MeshStandardMaterial({ color: 0x3b2418, roughness: 0.58 }), [-0.28, 0.73, 0.04], [1, 1, 1], [0, 0.08, 0]);
addPart(walletProp, new THREE.BoxGeometry(0.16, 0.012, 0.08), new THREE.MeshStandardMaterial({ color: 0xd8b16a, roughness: 0.42 }), [0.02, 0.034, 0.02]);
addPart(meetupTableProps, new THREE.BoxGeometry(0.42, 0.46, 0.14), new THREE.MeshStandardMaterial({ color: 0xe64b34, roughness: 0.74 }), [0.26, 0.91, -0.02], [1, 1, 1], [0.08, 0, -0.08]);
addPart(meetupTableProps, new THREE.TorusGeometry(0.16, 0.015, 8, 24), new THREE.MeshStandardMaterial({ color: 0xffdf9e, roughness: 0.56 }), [0.26, 1.15, -0.02], [0.8, 0.32, 0.32], [Math.PI / 2, 0, 0]);
addPart(meetupTableProps, new THREE.CylinderGeometry(0.08, 0.08, 0.22, 20), new THREE.MeshStandardMaterial({ color: 0xf7f0e8, roughness: 0.62 }), [0.02, 0.78, 0.28]);
meetupTableProps.visible = false;
outdoorArea.add(meetupTableProps);

const outdoorExitDoor = new THREE.Group();
addPart(outdoorExitDoor, new THREE.BoxGeometry(1.42, 2.18, 0.18), doorMaterial, [0, 1.2, 0]);
addPart(outdoorExitDoor, new THREE.BoxGeometry(1.72, 0.16, 0.24), doorTrimMaterial, [0, 2.38, 0.01]);
addPart(outdoorExitDoor, new THREE.BoxGeometry(0.16, 2.38, 0.24), doorTrimMaterial, [-0.84, 1.22, 0.01]);
addPart(outdoorExitDoor, new THREE.BoxGeometry(0.16, 2.38, 0.24), doorTrimMaterial, [0.84, 1.22, 0.01]);
outdoorExitDoor.position.set(0, doorDropStartY, 4.85);
outdoorExitDoor.rotation.y = Math.PI;
outdoorExitDoor.visible = false;
outdoorArea.add(outdoorExitDoor);

if (blankRoomMode) {
  const keepInBlankRoom = new Set([bigPhone, bumbleLogo, puzzleHeart, bedroomDoor]);
  room.children.slice(defaultRoomDecorStartIndex).forEach((child) => {
    if (!keepInBlankRoom.has(child)) child.visible = false;
  });
}

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
const cloudMaterial = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  roughness: 0.92,
  transparent: true,
  opacity: 0.92,
});
const cloudShadowMaterial = new THREE.MeshStandardMaterial({
  color: 0xdbeeff,
  roughness: 0.95,
  transparent: true,
  opacity: 0.52,
});
const overheadCloudMaterial = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  roughness: 0.94,
  transparent: true,
  opacity: 0.38,
  depthWrite: false,
});
const overheadCloudShadowMaterial = new THREE.MeshStandardMaterial({
  color: 0xd7f2ff,
  roughness: 0.96,
  transparent: true,
  opacity: 0.2,
  depthWrite: false,
});
const birdMaterial = new THREE.MeshBasicMaterial({
  color: 0x355d72,
  transparent: true,
  opacity: 0.72,
  side: THREE.DoubleSide,
  depthWrite: false,
});

function createCloud(index, overhead = false) {
  const cloud = new THREE.Group();
  const puffCount = overhead ? 4 + Math.floor(Math.random() * 4) : 5 + Math.floor(Math.random() * 5);
  for (let j = 0; j < puffCount; j += 1) {
    const puff = new THREE.Mesh(
      new THREE.SphereGeometry(0.28 + Math.random() * (overhead ? 0.28 : 0.42), 16, 12),
      overhead
        ? (j % 4 === 0 ? overheadCloudShadowMaterial : overheadCloudMaterial)
        : (j % 4 === 0 ? cloudShadowMaterial : cloudMaterial),
    );
    puff.position.set(
      (j - puffCount / 2) * (0.28 + Math.random() * 0.12),
      Math.sin(j * 0.8) * 0.08 + Math.random() * 0.22,
      Math.random() * 0.36,
    );
    puff.scale.set(1.35 + Math.random() * 0.55, 0.62 + Math.random() * 0.34, 0.72 + Math.random() * 0.32);
    cloud.add(puff);
  }

  const layer = index % 3;
  if (overhead) {
    cloud.position.set(
      -18 + Math.random() * 36,
      4.75 + Math.random() * 1.3,
      -5 + Math.random() * 14,
    );
  } else {
    cloud.position.set(
      -22 + Math.random() * 44,
      5.6 + layer * 1.25 + Math.random() * 1.4,
      -12 - layer * 4 - Math.random() * 10,
    );
  }
  cloud.scale.setScalar(overhead ? 0.72 + Math.random() * 1.05 : 0.85 + Math.random() * 1.45);
  cloud.userData.speed = (overhead ? 0.34 : 0.2) + layer * 0.08 + Math.random() * 0.22;
  cloud.userData.wrapMin = -24 - Math.random() * 8;
  cloud.userData.wrapMax = 24 + Math.random() * 8;
  cloud.userData.floatOffset = Math.random() * Math.PI * 2;
  cloud.userData.overhead = overhead;
  scene.add(cloud);
  clouds.push(cloud);
}

for (let i = 0; i < 20; i += 1) {
  createCloud(i);
}
for (let i = 0; i < 16; i += 1) {
  createCloud(i, true);
}

function createBird(index) {
  const bird = new THREE.Group();
  const body = new THREE.Mesh(new THREE.SphereGeometry(0.055, 8, 6), birdMaterial);
  body.scale.set(1.25, 0.62, 0.62);
  const wingGeometry = new THREE.BufferGeometry();
  wingGeometry.setAttribute('position', new THREE.Float32BufferAttribute([
    0, 0, 0,
    -0.34, 0.06, 0,
    -0.06, -0.045, 0,
  ], 3));
  wingGeometry.computeVertexNormals();
  const leftWing = new THREE.Mesh(wingGeometry, birdMaterial);
  const rightWing = new THREE.Mesh(wingGeometry.clone(), birdMaterial);
  rightWing.scale.x = -1;
  bird.add(body, leftWing, rightWing);
  bird.position.set(-20 + Math.random() * 40, 5.3 + Math.random() * 2.1, -8 - Math.random() * 14);
  bird.scale.setScalar(0.85 + Math.random() * 0.55);
  bird.rotation.y = Math.PI / 2;
  bird.userData.speed = 0.7 + Math.random() * 0.55;
  bird.userData.wrapMin = -24 - Math.random() * 8;
  bird.userData.wrapMax = 24 + Math.random() * 8;
  bird.userData.floatOffset = Math.random() * Math.PI * 2;
  bird.userData.leftWing = leftWing;
  bird.userData.rightWing = rightWing;
  scene.add(bird);
  return bird;
}

const birds = Array.from({ length: 9 }, (_, index) => createBird(index));

function createStarbucksBird(index) {
  const bird = createBird(index + 40);
  bird.position.set(-9 - index * 1.8, 4.0 + (index % 3) * 0.32, 0.8 + (index % 2) * 1.1);
  bird.scale.setScalar(1.05 + (index % 3) * 0.12);
  bird.userData.speed = 1.05 + index * 0.08;
  bird.userData.wrapMin = -10.5;
  bird.userData.wrapMax = 10.5;
  bird.userData.starbucks = true;
  bird.visible = false;
  return bird;
}

const starbucksBirds = Array.from({ length: 6 }, (_, index) => createStarbucksBird(index));

const keys = new Set();
const move = new THREE.Vector2();
const movementKeys = new Set(['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright']);
const pointer = {
  active: false,
  id: null,
  origin: new THREE.Vector2(),
  current: new THREE.Vector2(),
};
const pinchPointers = new Map();
let lastPinchDistance = 0;
let touchLookId = null;
let touchLookLastX = 0;
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
let tutorialActive = false;
let tutorialIndex = 0;
let currentArea = 'tutorial-island';
let doorUnlocked = false;
let doorFalling = false;
let doorReady = false;
let bedroomDoorUnlocked = false;
let bedroomDoorFalling = false;
let bedroomDoorReady = false;
let doorPromptVisible = false;
let phonePromptVisible = false;
let roomLoading = false;
let bumbleLogoPulseUntil = 0;
let bumbleOpen = false;
let bumbleCardIndex = 0;
let bumbleQuietRightAttempts = 0;
let bumbleFinalLeftAttempts = 0;
let bumbleMessageTimer = null;
let chatOpen = false;
let chatSolved = false;
const chatTimers = [];
let chatTyping = null;
let chatChoiceStep = 'first';
let puzzleOpen = false;
let puzzleSolved = false;
let puzzleMode = 'picture';
let puzzleHeartDropping = false;
let puzzleHeartLanded = false;
let puzzleHeartReadyToOpen = true;
let selectedPuzzleTile = null;
let puzzleTiles = [];
let puzzleImageReady = false;
let puzzleImageObjectUrl = null;
let puzzleImageSrc = '/puzzle/puzzle.png';
let puzzleRound = 0;
let puzzleCards = [];
let puzzleAcceptingInput = false;
let puzzleRoundCorrectSlot = 0;
let puzzleShuffleClass = '';
let puzzleLastHardShuffleClass = '';
const puzzleTimers = [];
const puzzleShufflePaths = [
  { className: 'shuffle-middle-left', finalSlots: [1, 0, 2] },
  { className: 'shuffle-middle-right', finalSlots: [0, 2, 1] },
];
const puzzleHardShufflePaths = [
  { className: 'shuffle-middle-left-right', finalSlots: [2, 0, 1] },
  { className: 'shuffle-hard-middle-right-left', finalSlots: [1, 2, 0] },
  { className: 'shuffle-hard-middle-right', finalSlots: [0, 2, 1] },
];
const puzzleAllShufflePaths = [...puzzleShufflePaths, ...puzzleHardShufflePaths];
let mediaOpen = false;
let mediaIndex = 0;
let phoneLaunchOpen = false;
let phoneLaunchZoomTimer = null;
let meetupStartedAt = 0;
let meetupGuySeated = false;
let meetupConversationActive = false;
let meetupConversationIndex = 0;
let meetupWaitingForChoice = false;
let meetupDoorFalling = false;
let meetupDoorReady = false;
let meetupWalkingToDoor = false;
let meetupWalkStartedAt = 0;
let meetupLastTimer = null;
let meetupLoveActive = false;
let starbucksStartedAt = 0;
let starbucksConversationIndex = 0;
let starbucksLastTimer = null;
let starbucksConversationActive = false;
let starbucksWalkingToCounter = false;
let starbucksWalkStartedAt = 0;
let starbucksPostPuzzlePhase = '';
let starbucksPostPuzzleStartedAt = 0;
let starbucksAtTable = false;
let starbucksCanMove = false;
let starbucksExitHeartDropping = false;
let starbucksExitHeartLanded = false;
let starbucksExitHeartReady = true;
let starbucksExitDoorUnlocked = false;
let starbucksExitDoorFalling = false;
let starbucksExitDoorReady = false;
let starbucksOutdoorConversationActive = false;
let starbucksOutdoorConversationIndex = 0;
let starbucksOutdoorWaitingForChoice = false;
let starbucksOutdoorTimer = null;
let starbucksProposalActive = false;
const proposalEndingTimers = [];
let starbucksWalletGameReady = false;
let finalWalletSequenceActive = false;
let finalWalletWalking = false;
let finalWalletWalkStartedAt = 0;
let finalWalletDialogueIndex = 0;
let finalEndingActive = false;
let freeRoamActive = false;
let mazeOpen = false;
let mazeReady = true;
const mazeContext = mazeCanvas.getContext('2d');
const mazePlayerImage = new Image();
const mazePlayer = {
  x: 110,
  y: 120,
  visualRadius: 24,
  collisionRadius: 10,
  step: 16,
};
const mazeWallThickness = 10;
const mazeBounds = { left: 48, top: 48, right: 1452, bottom: 1452 };
const mazeWalls = [
  [48, 48, 1452, 48], [1452, 48, 1452, 1452], [1452, 1452, 48, 1452], [48, 1452, 48, 48],
  [262, 48, 262, 170], [48, 170, 125, 170], [184, 170, 262, 170], [320, 106, 678, 106], [320, 106, 320, 170],
  [320, 170, 382, 170], [382, 170, 382, 418], [438, 170, 735, 170], [735, 48, 735, 170], [792, 106, 912, 106],
  [912, 106, 912, 170], [912, 170, 1088, 170], [970, 48, 970, 108], [1028, 106, 1148, 106], [1148, 106, 1148, 354],
  [1108, 354, 1206, 354],
  [110, 230, 322, 230], [110, 230, 110, 292], [110, 292, 260, 292], [260, 292, 260, 414], [48, 354, 204, 354],
  [110, 416, 322, 416], [110, 416, 110, 622], [322, 230, 322, 354], [322, 416, 322, 620], [170, 480, 262, 480],
  [170, 480, 170, 772], [262, 480, 262, 710], [210, 538, 210, 710], [210, 710, 260, 710], [322, 620, 382, 620],
  [382, 474, 382, 620], [438, 230, 438, 354], [500, 230, 795, 230], [500, 230, 500, 354], [500, 354, 620, 354],
  [620, 354, 620, 474], [560, 292, 735, 292], [795, 230, 795, 354], [680, 354, 795, 354], [680, 354, 680, 474],
  [618, 474, 680, 474], [618, 474, 618, 538], [438, 416, 500, 416], [500, 416, 500, 474], [558, 416, 620, 416],
  [558, 416, 558, 474], [735, 170, 852, 170], [852, 170, 852, 354], [852, 230, 1028, 230], [1028, 230, 1028, 354],
  [910, 292, 970, 292], [910, 292, 910, 416], [970, 354, 1028, 354], [1088, 170, 1088, 416], [970, 416, 1148, 416],
  [1148, 416, 1148, 650], [1028, 474, 1088, 474],
  [48, 678, 110, 678], [110, 678, 110, 758], [48, 836, 204, 836], [110, 898, 262, 898], [110, 898, 110, 1148],
  [110, 1148, 262, 1148], [170, 958, 322, 958], [170, 958, 170, 1085], [170, 1085, 322, 1085], [262, 772, 262, 898],
  [322, 678, 500, 678], [322, 678, 322, 836], [382, 742, 382, 836], [262, 836, 322, 836], [322, 898, 500, 898],
  [500, 836, 500, 898], [382, 1020, 382, 1148], [230, 1020, 382, 1020], [322, 958, 322, 1206], [438, 678, 438, 836],
  [500, 538, 735, 538], [500, 538, 500, 772], [735, 538, 735, 678], [558, 598, 680, 598], [558, 598, 558, 712],
  [680, 598, 680, 712], [500, 772, 620, 772], [620, 772, 620, 836], [558, 836, 678, 836],
  [438, 898, 558, 898], [438, 898, 438, 1148], [438, 1148, 620, 1148], [500, 1020, 735, 1020],
  [620, 1148, 795, 1148], [795, 836, 795, 1148], [680, 898, 852, 898],
  [680, 898, 680, 958], [618, 958, 795, 958], [735, 898, 735, 958], [795, 898, 852, 898], [852, 898, 852, 960],
  [852, 960, 912, 960], [912, 960, 912, 1020], [852, 1020, 1148, 1020], [912, 1085, 970, 1085], [912, 1085, 912, 1148],
  [970, 1085, 970, 1206], [1028, 1085, 1148, 1085], [1028, 1085, 1028, 1206],
  [735, 416, 912, 416], [735, 416, 735, 474], [912, 416, 912, 474], [852, 474, 970, 474], [852, 474, 852, 550],
  [970, 474, 970, 538], [735, 620, 912, 620], [795, 474, 795, 620], [912, 538, 1028, 538], [1028, 474, 1028, 538],
  [970, 598, 1088, 598], [970, 598, 970, 898], [1088, 598, 1088, 898], [1010, 660, 1010, 792],
  [1088, 898, 1206, 898], [1028, 898, 1028, 960], [1028, 960, 1206, 960], [1148, 678, 1206, 678],
  [1148, 742, 1148, 836], [1148, 742, 1206, 742],
  [204, 354, 204, 416], [262, 292, 322, 292], [438, 354, 500, 354], [735, 678, 852, 678],
  [852, 678, 852, 772], [912, 742, 970, 742], [912, 742, 912, 836], [970, 1020, 970, 1085],
  [1088, 1020, 1088, 1085],
  [125, 170, 125, 230], [184, 230, 184, 292], [262, 620, 322, 620], [322, 538, 382, 538],
  [438, 474, 500, 474], [438, 538, 438, 620], [500, 678, 558, 678], [620, 836, 620, 898],
  [735, 772, 852, 772], [852, 772, 852, 836], [912, 620, 912, 678], [970, 836, 1028, 836],
  [1028, 598, 1028, 660], [1088, 538, 1148, 538], [795, 1085, 852, 1085],
  [852, 1148, 912, 1148], [620, 958, 620, 1020], [262, 958, 262, 1020],
  [560, 670, 620, 670], [618, 640, 618, 712], [560, 1048, 680, 1048], [615, 1084, 735, 1084],
  [1044, 684, 1044, 748], [1008, 748, 1070, 748],
  [1206, 170, 1390, 170], [1268, 230, 1268, 520], [1328, 290, 1452, 290], [1206, 416, 1388, 416],
  [1388, 416, 1388, 650], [1268, 598, 1328, 598], [1328, 598, 1328, 742], [1206, 742, 1390, 742],
  [1268, 836, 1452, 836], [1328, 898, 1328, 1048], [1206, 1048, 1328, 1048], [1268, 1120, 1452, 1120],
  [1390, 1120, 1390, 1332], [1268, 1278, 1328, 1278],
  [110, 1268, 322, 1268], [110, 1268, 110, 1388], [230, 1330, 438, 1330], [438, 1210, 438, 1390],
  [322, 1390, 620, 1390], [560, 1210, 560, 1330], [620, 1268, 852, 1268], [852, 1210, 852, 1390],
  [735, 1330, 970, 1330], [970, 1210, 970, 1452], [1032, 1278, 1160, 1278], [1032, 1278, 1032, 1390],
  [1092, 1390, 1210, 1390], [1210, 1330, 1210, 1390], [1330, 1210, 1330, 1278], [1330, 1278, 1390, 1278],
];
const bumbleSwipe = {
  active: false,
  id: null,
  startX: 0,
  currentX: 0,
};
const bumbleFinalLeftMessages = [
  "u cannot swipe left",
  "u sure u wanna swipe left?",
  "this guy been lonely for his whole life",
  "no option to swipe left! swipe RIGHT!",
  "SWIPE RIGHT RN!",
];
const chatChoiceSets = {
  first: [
    { text: "No were not", correct: true },
    { text: "f*ck this guy hot.", correct: false },
    { text: "ewh Weird guy.", correct: false },
  ],
  second: [
    { text: "ih ni orang lucu", correct: false },
    {
      text: "karena belum ketemu orang yang tepat ga sih",
      hint: "this guy kinda cute and handsome",
      correct: true,
    },
    { text: "ih gajelas banget gamau mulai dari awal lagi", correct: false },
  ],
  third: [
    { text: "ya iyalah, aku chindo akut, harus sesama chindo", correct: false },
    { text: "hmm this guy kinda cute", correct: false },
    { text: "well for me i dont think bout this anymore", correct: true },
  ],
  fourth: [
    { text: "wtf? i'm nott!", correct: true },
    { text: "yes i can be wild for you 👄", correct: false },
    { text: "ewhhhh this guy disgustingg", correct: false },
  ],
  final: [
    {
      text: "because i like you and i think you are gonna stick with me more than years and we can go all the way facing every problem?",
      correct: false,
    },
    { text: "hmm maybe because i just wanna use you?", correct: false },
    {
      text: "kaya, the way u text me it's affect my feelings",
      hint: "iihh maluu maluuu",
      correct: true,
    },
  ],
};
const doorScreenPosition = new THREE.Vector3();
const phoneScreenPosition = new THREE.Vector3();
const puzzlePhotoSources = Array.from({ length: 9 }, (_, index) => `/puzzlestarbucks/${index + 1}.jpeg`);

const mediaItems = [
  { type: 'image', title: 'Phone Preview', src: '/bumble-slide/phone.png' },
  { type: 'image', title: '365 Days', src: '/bumble-slide/365days.jpg' },
  { type: 'image', title: 'Bumble Card', src: '/bumble-slide/bumbleK.png' },
  { type: 'image', title: 'Kim Young-kwang', src: '/bumble-slide/kim-young-kwang.jpg' },
];

const roomEditorStorageKey = 'memoryGardenRoomLayoutGirlyBuiltRoomV1';
const defaultRoomScaleBoost = 1.42;
const newEditorModelScaleBoost = 1.32;
const featuredEditorAssets = [
  { id: 'photoCanvas', label: 'Photo', kind: 'photo', placement: 'wall' },
  { id: 'bedDouble', label: 'Bed', src: '/room-assets/bedDouble.png', modelSrc: '/room-models/bedDouble.glb', scale: 1.25 },
  { id: 'bookcaseOpen', label: 'Shelf', src: '/room-assets/bookcaseOpen.png', modelSrc: '/room-models/bookcaseOpen.glb', scale: 1.15 },
  { id: 'desk', label: 'Desk', src: '/room-assets/desk.png', modelSrc: '/room-models/desk.glb', scale: 1.15 },
  { id: 'chairDesk', label: 'Chair', src: '/room-assets/chairDesk.png', modelSrc: '/room-models/chairDesk.glb', scale: 1.05 },
  { id: 'pottedPlant', label: 'Plant', src: '/room-assets/pottedPlant.png', modelSrc: '/room-models/pottedPlant.glb', scale: 0.9 },
  { id: 'rugRound', label: 'Rug', src: '/room-assets/rugRound.png', modelSrc: '/room-models/rugRound.glb', scale: 1.55, placement: 'floor' },
  { id: 'lampRoundFloor', label: 'Lamp', src: '/room-assets/lampRoundFloor.png', modelSrc: '/room-models/lampRoundFloor.glb', scale: 1.15 },
  { id: 'tableRound', label: 'Table', src: '/room-assets/tableRound.png', modelSrc: '/room-models/tableRound.glb', scale: 1.0 },
  { id: 'bear', label: 'Bear', src: '/room-assets/bear.png', modelSrc: '/room-models/bear.glb', scale: 0.82 },
  { id: 'computerScreen', label: 'Screen', src: '/room-assets/computerScreen.png', modelSrc: '/room-models/computerScreen.glb', scale: 0.9 },
];
const defaultRoomLayout = [
  { id: 'rugRound', x: -0.4, z: 1.55, s: 2.35 },
  { id: 'bedDouble', x: -6.25, z: -4.75, ry: Math.PI / 2, s: 1.3 },
  { id: 'cabinetBedDrawerTable', x: -7.55, z: -2.7, ry: Math.PI / 2, s: 1.05 },
  { id: 'lampRoundFloor', x: -7.8, z: -5.9, s: 1.2 },
  { id: 'pillowBlueLong', x: -6.85, z: -4.25, ry: Math.PI / 2, s: 1.15, vo: 0.64 },
  { id: 'pillow', x: -6.85, z: -5.25, ry: Math.PI / 2, s: 1.1, vo: 0.64 },
  { id: 'benchCushionLow', x: -4.55, z: -1.95, ry: Math.PI / 2, s: 1.15 },

  { id: 'desk', x: 4.8, z: -3.45, ry: Math.PI, s: 1.3 },
  { id: 'chairDesk', x: 4.05, z: -2.05, ry: Math.PI, s: 1.05 },
  { id: 'laptop', x: 4.7, z: -3.45, ry: Math.PI, s: 0.95, vo: 0.78 },
  { id: 'computerKeyboard', x: 4.15, z: -3.28, ry: Math.PI, s: 0.9, vo: 0.78 },
  { id: 'computerMouse', x: 5.35, z: -3.18, ry: Math.PI, s: 0.85, vo: 0.78 },
  { id: 'lampSquareTable', x: 5.75, z: -3.75, ry: Math.PI, s: 0.9, vo: 0.8 },

  { id: 'bookcaseOpen', x: 7.65, z: -5.75, ry: Math.PI, s: 1.35 },
  { id: 'books', x: 7.35, z: -5.72, ry: Math.PI, s: 1.0, vo: 1.18 },
  { id: 'books', x: 7.75, z: -5.72, ry: Math.PI, s: 0.9, vo: 1.62 },
  { id: 'plantSmall2', x: 8.05, z: -5.7, s: 0.9, vo: 0.78 },
  { id: 'cabinetTelevisionDoors', x: 6.65, z: 1.0, ry: -Math.PI / 2, s: 1.15 },
  { id: 'televisionModern', x: 6.62, z: 1.0, ry: -Math.PI / 2, s: 0.95, vo: 0.78 },

  { id: 'tableRound', x: 1.9, z: 3.85, s: 1.2 },
  { id: 'bear', x: 1.9, z: 3.86, s: 0.9, vo: 0.68 },
  { id: 'radio', x: 1.25, z: 3.55, ry: -0.35, s: 0.85, vo: 0.68 },
  { id: 'plantSmall1', x: 2.45, z: 3.55, s: 0.8, vo: 0.68 },
  { id: 'sideTableDrawers', x: -1.95, z: 4.75, ry: Math.PI, s: 1.05 },
  { id: 'lampRoundTable', x: -1.95, z: 4.75, s: 0.8, vo: 0.75 },

  { id: 'pottedPlant', x: -7.85, z: 5.65, s: 1.05 },
  { id: 'pottedPlant', x: 7.9, z: 5.55, s: 1.0 },
  { id: 'coatRackStanding', x: -8.05, z: 0.75, ry: Math.PI / 2, s: 1.0 },
  { id: 'cardboardBoxOpen', x: -5.0, z: 5.3, ry: 0.35, s: 1.0 },
  { id: 'cardboardBoxClosed', x: -5.75, z: 5.55, ry: -0.25, s: 0.9 },
  { id: 'trashcan', x: 7.85, z: -1.5, s: 0.85 },

  { id: 'photoCanvas', x: -2.25, y: 2.45, z: -roomHalfDepth + 0.12, s: 1.25 },
  { id: 'wallWindowSlide', x: -5.8, y: 2.55, z: -roomHalfDepth + 0.12, s: 1.2 },
  { id: 'wallWindow', x: 0.85, y: 2.58, z: -roomHalfDepth + 0.12, s: 1.05 },
  { id: 'photoCanvas', x: 2.85, y: 2.18, z: -roomHalfDepth + 0.12, s: 0.95 },
];
let editorAssets = [...featuredEditorAssets];
let roomEditorActive = false;
let selectedEditorAsset = editorAssets[0];
let selectedEditorObject = null;
const placedEditorObjects = [];
const editorDrag = {
  active: false,
  pointerId: null,
  object: null,
  placement: 'floor',
  verticalOffset: 0,
};

const tutorialSteps = [
  "Hi hi, I'm mot mot. I'll help you walk around Memory Garden.",
  "On phone or tablet, drag the glowing circle on the left to move. On PC, use WASD or the arrow keys.",
  "Drag on the right side of the screen to move the camera. On PC, drag with the mouse.",
  "Pinch with two fingers to zoom in or out. On PC, use the mouse wheel.",
  "The spinning hearts are memory keys. Walk close to collect all 5 hearts on this island.",
  "Later, hearts can open pictures, little puzzles, messages, and other surprises. For now, collect them and explore.",
];

function stopMovementInput() {
  keys.clear();
  move.set(0, 0);
  resetTouchStick();
  resetCanvasPointerState();
}

function resetTouchStick() {
  pointer.active = false;
  pointer.id = null;
  pointer.origin.set(0, 0);
  pointer.current.set(0, 0);
  knob.style.transform = 'translate(-50%, -50%)';
}

function resetCanvasPointerState() {
  pinchPointers.clear();
  lastPinchDistance = 0;
  touchLookId = null;
  touchLookLastX = 0;
  draggingLook = false;
  cuddleButton.classList.remove('is-visible');
  doorButton.classList.remove('is-visible');
  phoneButton.classList.remove('is-visible');
}

function updateBumbleCards() {
  bumbleCards.forEach((card, index) => {
    card.classList.toggle('is-active', index === bumbleCardIndex);
    card.classList.toggle('is-left', index < bumbleCardIndex);
    card.classList.toggle('is-right', index > bumbleCardIndex);
    card.classList.remove('is-denied');
  });

  const activeCard = bumbleCards[bumbleCardIndex];
  const canLike = activeCard?.dataset.canLike === 'true';
  const canSkip = activeCard?.dataset.canSkip === 'true';
  bumbleLeft.classList.toggle('is-disabled', !canSkip);
  bumbleRight.classList.toggle('is-disabled', !canLike);
  bumbleInstruction.textContent = activeCard?.dataset.rightAction === 'ready'
    ? "Swipe right if you are ready."
    : "";
}

function showBumbleReady() {
  bumblePhone.classList.add('is-ready');
  bumbleReady.classList.add('is-visible');
  bumbleReady.setAttribute('aria-hidden', 'false');
  bumbleInstruction.textContent = "";
}

function hideBumbleMessagePop() {
  clearTimeout(bumbleMessageTimer);
  bumbleMessageTimer = null;
  bumbleMessagePop.classList.remove('is-visible');
  bumbleMessagePop.setAttribute('aria-hidden', 'true');
}

function showBumbleMessagePop(message = "u should try better this guy is ugly") {
  clearTimeout(bumbleMessageTimer);
  bumbleMessagePop.textContent = message;
  bumbleMessagePop.classList.add('is-visible');
  bumbleMessagePop.setAttribute('aria-hidden', 'false');
  bumbleMessageTimer = window.setTimeout(hideBumbleMessagePop, 4000);
}

function showPostReadyBumbleCards() {
  bumbleCardIndex = 2;
  bumbleQuietRightAttempts = 0;
  bumbleFinalLeftAttempts = 0;
  bumblePhone.classList.remove('is-ready');
  bumbleReady.classList.remove('is-visible');
  bumbleReady.setAttribute('aria-hidden', 'true');
  hideBumbleMessagePop();
  updateBumbleCards();
}

function openBumbleApp() {
  bumbleOpen = true;
  bumbleCardIndex = 0;
  bumbleQuietRightAttempts = 0;
  bumbleFinalLeftAttempts = 0;
  bumblePhone.classList.remove('is-ready');
  bumbleReady.classList.remove('is-visible');
  bumbleReady.setAttribute('aria-hidden', 'true');
  hideBumbleMessagePop();
  updateBumbleCards();
  stopMovementInput();
  bumbleApp.classList.add('is-visible');
  bumbleApp.setAttribute('aria-hidden', 'false');
  document.body.classList.add('bumble-open');
}

function closeBumbleApp() {
  bumbleOpen = false;
  bumbleQuietRightAttempts = 0;
  bumbleFinalLeftAttempts = 0;
  bumblePhone.classList.remove('is-ready');
  bumbleReady.classList.remove('is-visible');
  bumbleReady.setAttribute('aria-hidden', 'true');
  hideBumbleMessagePop();
  bumbleApp.classList.remove('is-visible');
  bumbleApp.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('bumble-open');
  stopMovementInput();
}

function clearChatTimers() {
  while (chatTimers.length) {
    clearTimeout(chatTimers.pop());
  }
  chatTyping = null;
}

function addChatTimer(callback, delay) {
  const timer = window.setTimeout(() => {
    const index = chatTimers.indexOf(timer);
    if (index >= 0) chatTimers.splice(index, 1);
    callback();
  }, delay);
  chatTimers.push(timer);
  return timer;
}

function scrollChatToBottom() {
  chatThread.scrollTop = chatThread.scrollHeight;
}

function createChatBubble(side, text = "") {
  const row = document.createElement('div');
  row.className = `chat-row chat-row-${side}`;

  const avatar = document.createElement('div');
  avatar.className = `chat-avatar chat-avatar-${side}`;
  avatar.setAttribute('aria-hidden', 'true');
  avatar.textContent = side === 'girl' ? 'M' : '?';

  const bubble = document.createElement('div');
  bubble.className = `chat-bubble chat-bubble-${side}`;
  bubble.textContent = text;

  if (side === 'girl') {
    row.append(bubble, avatar);
  } else {
    row.append(avatar, bubble);
  }

  chatThread.append(row);
  scrollChatToBottom();
  return bubble;
}

function typeChatBubble(bubble, text, onDone) {
  const letters = [...text];
  const state = {
    bubble,
    letters,
    index: 0,
    fast: false,
  };
  chatTyping = state;
  bubble.classList.add('is-typing');
  bubble.textContent = "";

  function typeNextLetter() {
    if (chatTyping !== state) return;
    bubble.textContent += letters[state.index] || "";
    state.index += 1;
    scrollChatToBottom();

    if (state.index >= letters.length) {
      bubble.classList.remove('is-typing');
      chatTyping = null;
      if (onDone) onDone();
      return;
    }

    addChatTimer(typeNextLetter, state.fast ? 26 : 145);
  }

  addChatTimer(typeNextLetter, 220);
}

function speedUpChatTyping() {
  if (chatTyping) chatTyping.fast = true;
}

function hideChatFinalScreen() {
  chatBody.querySelector('.chat-final-screen')?.remove();
}

function showChatChoices() {
  chatChoices.replaceChildren();
  chatChoices.classList.add('is-visible');
  const options = chatChoiceSets[chatChoiceStep] || chatChoiceSets.first;
  options.forEach((option, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'chat-choice';
    const label = document.createElement('span');
    label.textContent = `${index + 1}. ${option.text}`;
    button.append(label);
    if (option.hint) {
      const hint = document.createElement('small');
      hint.textContent = option.hint;
      button.append(hint);
    }
    button.addEventListener('click', () => chooseChatAnswer(option, button));
    chatChoices.append(button);
  });
}

function burstChatHearts() {
  chatHearts.replaceChildren();
  for (let i = 0; i < 34; i += 1) {
    const heart = document.createElement('span');
    heart.textContent = '♥';
    heart.style.left = `${8 + Math.random() * 84}%`;
    heart.style.animationDelay = `${Math.random() * 0.8}s`;
    heart.style.animationDuration = `${2.4 + Math.random() * 1.5}s`;
    heart.style.setProperty('--heart-drift', `${-36 + Math.random() * 72}px`);
    heart.style.setProperty('--heart-scale', `${0.72 + Math.random() * 0.82}`);
    chatHearts.append(heart);
  }
}

function shakeWrongChatAnswer(button) {
  chatPanel.classList.remove('is-shaking');
  chatChoices.classList.remove('is-shaking');
  button.classList.remove('is-wrong');
  void chatPanel.offsetWidth;
  chatPanel.classList.add('is-shaking');
  chatChoices.classList.add('is-shaking');
  button.classList.add('is-wrong');
  chatFeedback.textContent = "it's wrong it not turn like this.";
  if ('vibrate' in navigator) navigator.vibrate([45, 35, 45]);
}

function chooseChatAnswer(option, button) {
  if (chatSolved) return;
  if (!option.correct) {
    shakeWrongChatAnswer(button);
    return;
  }

  chatFeedback.textContent = "";
  chatChoices.classList.remove('is-visible', 'is-shaking');
  chatChoices.replaceChildren();
  const answerBubble = createChatBubble('girl');
  answerBubble.classList.add('is-confirmed');
  const completedStep = chatChoiceStep;
  typeChatBubble(answerBubble, option.sendText || option.text, () => {
    burstChatHearts();
    const nextStep = {
      first: startReferenceChatScript,
      second: startThirdQuestionScript,
      third: startFourthQuestionScript,
      fourth: startFinalQuestionScript,
      final: startMoveSomewhereScript,
    }[completedStep];

    if (nextStep) {
      addChatTimer(nextStep, 950);
    } else {
      chatSolved = true;
    }
  });
}

function typeChatSequence(messages, onDone) {
  const [message, ...rest] = messages;
  if (!message) {
    if (onDone) onDone();
    return;
  }

  const bubble = createChatBubble(message.side);
  typeChatBubble(bubble, message.text, () => {
    addChatTimer(() => typeChatSequence(rest, onDone), message.pause ?? 420);
  });
}

function startReferenceChatScript() {
  chatChoiceStep = 'second';
  typeChatSequence(
    [
      { side: 'girl', text: "why" },
      { side: 'guy', text: "nothing" },
      { side: 'guy', text: "but nice to match u" },
      { side: 'girl', text: "Yea its fine" },
      { side: 'girl', text: "Nice to match u also" },
      { side: 'guy', text: "cape ga sih? harus nyapa org baru lagi" },
      { side: 'guy', text: "say hi lgi" },
      { side: 'guy', text: "nanyain suka kopi apa atau makan apa lagi" },
    ],
    () => addChatTimer(showChatChoices, 320),
  );
}

function startThirdQuestionScript() {
  chatChoiceStep = 'third';
  typeChatSequence(
    [
      { side: 'guy', text: "kdg udah ketemu yang tepat, tapi kepisah sama agama" },
    ],
    () => addChatTimer(showChatChoices, 320),
  );
}

function startFourthQuestionScript() {
  chatChoiceStep = 'fourth';
  typeChatSequence(
    [
      {
        side: 'girl',
        text: "Even kaya yag penting cm yaudahlah, risk it, karna uda ktemu sama yang seagama pun bisa bubar2 juga, So let it be aja gausa jadi pikiran",
      },
      { side: 'guy', text: "ur cute, also funny 🤣" },
      { side: 'girl', text: "aaaa :\")" },
      {
        side: 'guy',
        text: "i thought u were the hypebeast sexy girl kiddo, who like doing some high stuff",
      },
    ],
    () => addChatTimer(showChatChoices, 320),
  );
}

function startFinalQuestionScript() {
  chatChoiceStep = 'final';
  typeChatSequence(
    [
      { side: 'guy', text: "hahaha chill you can be honest with ur self." },
      { side: 'guy', text: "why in the start you tap me on?" },
    ],
    () => addChatTimer(showChatChoices, 320),
  );
}

function moveNoButton(button, screen) {
  const maxX = Math.max(40, screen.clientWidth - button.offsetWidth - 20);
  const maxY = Math.max(40, screen.clientHeight - button.offsetHeight - 20);
  button.style.left = `${20 + Math.random() * (maxX - 20)}px`;
  button.style.top = `${110 + Math.random() * Math.max(20, maxY - 120)}px`;
}

function showMoveSomewhereChoice() {
  hideChatFinalScreen();
  const screen = document.createElement('div');
  screen.className = 'chat-final-screen';

  const title = document.createElement('div');
  title.className = 'chat-final-title';
  title.textContent = "yes?";

  const yesButton = document.createElement('button');
  yesButton.type = 'button';
  yesButton.className = 'chat-final-yes';
  yesButton.textContent = "YES";
  yesButton.addEventListener('click', () => {
    title.textContent = "yesss :\")";
    burstChatHearts();
    yesButton.disabled = true;
    noButton.disabled = true;
    addChatTimer(startRoomReturnFromChat, 720);
  });

  const noButton = document.createElement('button');
  noButton.type = 'button';
  noButton.className = 'chat-final-no';
  noButton.textContent = "NO";
  noButton.addEventListener('pointerenter', () => moveNoButton(noButton, screen));
  noButton.addEventListener('pointerdown', (event) => {
    event.preventDefault();
    moveNoButton(noButton, screen);
  });
  noButton.addEventListener('click', (event) => {
    event.preventDefault();
    moveNoButton(noButton, screen);
  });

  screen.append(title, yesButton, noButton);
  chatBody.append(screen);
  addChatTimer(() => moveNoButton(noButton, screen), 80);
}

function startRoomReturnFromChat() {
  chatScene.classList.add('is-returning');
  window.setTimeout(() => {
    closeChatScene();
    chatScene.classList.remove('is-returning');
    puzzleSolved = false;
    puzzleHeart.visible = false;
    openPuzzleScene('picture');
  }, 1400);
}

function beginPuzzleHeartDrop() {
  if (puzzleSolved) return;
  puzzleHeart.visible = true;
  puzzleHeartDropping = true;
  puzzleHeartLanded = false;
  puzzleHeartReadyToOpen = true;
  puzzleHeart.position.set(0, 6.4, 0.25);
  puzzleHeart.scale.setScalar(0.88);
  puzzleHeartMesh.material.emissiveIntensity = 0.75;
  player.position.set(-0.2, 0, 1.65);
  yaw = Math.PI;
  stopMovementInput();
}

function shufflePicturePuzzleTiles() {
  puzzleTiles = Array.from({ length: 9 }, (_, index) => index);
  for (let index = puzzleTiles.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [puzzleTiles[index], puzzleTiles[swapIndex]] = [puzzleTiles[swapIndex], puzzleTiles[index]];
  }
  if (puzzleTiles.every((tile, index) => tile === index)) {
    [puzzleTiles[0], puzzleTiles[1]] = [puzzleTiles[1], puzzleTiles[0]];
  }
}

function renderPicturePuzzle() {
  puzzleGrid.replaceChildren();
  if (!puzzleImageReady) return;
  puzzleTiles.forEach((tileIndex, displayIndex) => {
    const tile = document.createElement('button');
    tile.type = 'button';
    tile.className = 'puzzle-tile';
    tile.style.setProperty('--puzzle-image', `url("${puzzleImageSrc}")`);
    tile.style.setProperty('--puzzle-position', `${(tileIndex % 3) * 50}% ${Math.floor(tileIndex / 3) * 50}%`);
    tile.setAttribute('aria-label', `Puzzle tile ${displayIndex + 1}`);
    if (selectedPuzzleTile === displayIndex) tile.classList.add('is-selected');
    tile.addEventListener('click', () => choosePicturePuzzleTile(displayIndex));
    puzzleGrid.append(tile);
  });
}

function checkPicturePuzzleImage() {
  const image = new Image();
  image.onload = () => {
    puzzleImageReady = true;
    puzzlePicker.classList.remove('is-visible');
    puzzleStatus.textContent = 'tap two pieces to swap them';
    renderPicturePuzzle();
  };
  image.onerror = () => {
    puzzleImageReady = false;
    puzzleGrid.replaceChildren();
    puzzlePicker.classList.add('is-visible');
    puzzleStatus.textContent = 'choose the photo first';
  };
  image.src = puzzleImageSrc;
}

function setPicturePuzzleImage(file) {
  if (!file) return;
  if (puzzleImageObjectUrl) URL.revokeObjectURL(puzzleImageObjectUrl);
  puzzleImageObjectUrl = URL.createObjectURL(file);
  puzzleImageSrc = puzzleImageObjectUrl;
  puzzleSolved = false;
  selectedPuzzleTile = null;
  shufflePicturePuzzleTiles();
  checkPicturePuzzleImage();
}

function choosePicturePuzzleTile(index) {
  if (puzzleSolved || puzzleMode !== 'picture') return;
  if (selectedPuzzleTile === null) {
    selectedPuzzleTile = index;
    puzzleStatus.textContent = 'pick another piece';
    renderPicturePuzzle();
    return;
  }
  if (selectedPuzzleTile !== index) {
    [puzzleTiles[selectedPuzzleTile], puzzleTiles[index]] = [puzzleTiles[index], puzzleTiles[selectedPuzzleTile]];
  }
  selectedPuzzleTile = null;
  const solved = puzzleTiles.every((tile, tileIndex) => tile === tileIndex);
  puzzleStatus.textContent = solved ? 'perfect :)' : 'keep going';
  if (solved) {
    puzzleSolved = true;
    puzzleHeart.visible = false;
    window.setTimeout(completeFirstMission, 900);
  }
  renderPicturePuzzle();
}

function clearPuzzleTimers() {
  while (puzzleTimers.length) clearTimeout(puzzleTimers.pop());
}

function addPuzzleTimer(callback, delay) {
  const timer = window.setTimeout(() => {
    const index = puzzleTimers.indexOf(timer);
    if (index >= 0) puzzleTimers.splice(index, 1);
    callback();
  }, delay);
  puzzleTimers.push(timer);
  return timer;
}

function pickPuzzleShufflePath() {
  if (puzzleRound < 2) {
    return puzzleShufflePaths[puzzleRound % puzzleShufflePaths.length];
  }

  const choices = puzzleHardShufflePaths.filter((path) => path.className !== puzzleLastHardShuffleClass);
  const path = choices[Math.floor(Math.random() * choices.length)] || puzzleHardShufflePaths[0];
  puzzleLastHardShuffleClass = path.className;
  return path;
}

function startPuzzleRound() {
  clearPuzzleTimers();
  puzzleAcceptingInput = false;
  const settleAfterShuffle = puzzleRound === 2 ? 11000 : 9550;
  puzzleShuffleClass = '';
  puzzleGrid.classList.remove('is-ready', 'is-shaking', 'is-shuffling', ...puzzleAllShufflePaths.map((path) => path.className));
  puzzleGrid.replaceChildren();

  const groupStart = puzzleRound * 3;
  const roundPhotos = puzzlePhotoSources.slice(groupStart, groupStart + 3);
  const correctPhoto = roundPhotos[0];
  puzzleRoundCorrectSlot = 1;
  puzzleCards = roundPhotos.map((photo, index) => ({
    photo,
    correct: photo === correctPhoto,
    startSlot: index === 0 ? puzzleRoundCorrectSlot : null,
    finalSlot: null,
  }));

  const freeSlots = [0, 1, 2].filter((slot) => slot !== puzzleRoundCorrectSlot);
  puzzleCards.forEach((card) => {
    if (card.startSlot === null) card.startSlot = freeSlots.shift();
  });
  puzzleCards.sort((a, b) => a.startSlot - b.startSlot);

  puzzleStatus.textContent = `Round ${puzzleRound + 1}/3: remember the photo`;
  renderPuzzleCards(false);
  addPuzzleTimer(() => {
    puzzleStatus.textContent = "remember the middle one";
    puzzleGrid.classList.add('is-shaking');
  }, 4000);
  addPuzzleTimer(() => {
    puzzleStatus.textContent = "folding cards...";
    puzzleGrid.classList.remove('is-ready', 'is-shaking', ...puzzleAllShufflePaths.map((path) => path.className));
    renderPuzzleCards(true);
  }, 5900);
  addPuzzleTimer(() => {
    const path = pickPuzzleShufflePath();
    puzzleShuffleClass = path.className;
    puzzleCards.forEach((card, startSlot) => {
      card.finalSlot = path.finalSlots[startSlot];
    });
    puzzleGrid.classList.add('is-shuffling', puzzleShuffleClass);
    puzzleStatus.textContent = "watch the cards...";
  }, 6600);
  addPuzzleTimer(() => {
    puzzleCards.sort((a, b) => a.finalSlot - b.finalSlot);
    puzzleShuffleClass = '';
    puzzleStatus.textContent = "where is it?";
    puzzleGrid.classList.remove('is-shuffling', ...puzzleAllShufflePaths.map((path) => path.className));
    puzzleGrid.classList.add('is-ready');
    puzzleAcceptingInput = true;
    renderPuzzleCards(true);
  }, settleAfterShuffle);
}

function renderPuzzleCards(hidden) {
  puzzleGrid.replaceChildren();
  puzzleCards.forEach((card, index) => {
    const tile = document.createElement('button');
    tile.type = 'button';
    tile.className = 'puzzle-tile memory-card';
    tile.setAttribute('aria-label', `Memory card ${index + 1}`);
    if (hidden) tile.classList.add('is-folded');
    if (card.correct) tile.classList.add('is-correct-card');
    const marker = card.correct ? '✅' : '❎';
    tile.innerHTML = `
      <span class="memory-card-inner">
        <span class="memory-card-front" style="background-image: url('${card.photo}')">
          <span class="memory-card-marker">${marker}</span>
        </span>
        <span class="memory-card-back">?</span>
      </span>
    `;
    tile.addEventListener('click', () => choosePuzzleCard(index));
    puzzleGrid.append(tile);
  });
}

function choosePuzzleCard(index) {
  if (!puzzleAcceptingInput || puzzleSolved) return;
  puzzleAcceptingInput = false;
  const card = puzzleCards[index];
  const tiles = [...puzzleGrid.children];
  tiles[index]?.classList.remove('is-folded');
  if (!card.correct) {
    tiles[index]?.classList.add('is-wrong');
    puzzleStatus.textContent = "wrong card, watch again";
    addPuzzleTimer(startPuzzleRound, 950);
    return;
  }

  tiles[index]?.classList.add('is-picked');
  puzzleStatus.textContent = "correct!";
  if (puzzleRound < 2) {
    puzzleRound += 1;
    addPuzzleTimer(startPuzzleRound, 1100);
    return;
  }

  puzzleSolved = true;
  puzzleStatus.textContent = "perfect memory :)";
  puzzleHeart.visible = false;
  addPuzzleTimer(completeFirstMission, 900);
}

function completeFirstMission() {
  closePuzzleScene();
  if (currentArea === 'starbucks') {
    startStarbucksAfterPuzzle();
    return;
  }
  collected = 0;
  memoryCount.textContent = '0';
  memoryTotal.textContent = '3';
  missionStatus.textContent = 'Mission 1 clear';
  player.position.set(-0.2, 0, 1.65);
  player.rotation.y = 0;
  yaw = 0;
  unlockBedroomDoor();
}

function openPuzzleScene(mode = currentArea === 'starbucks' ? 'memory' : 'picture') {
  if (puzzleOpen || puzzleSolved) return;
  puzzleOpen = true;
  puzzleMode = mode;
  puzzleScene.classList.toggle('is-picture-puzzle', mode === 'picture');
  puzzleScene.querySelector('.puzzle-topbar span').textContent = mode === 'picture' ? 'Picture puzzle' : 'Remember the card';
  stopMovementInput();
  puzzleScene.classList.add('is-visible');
  puzzleScene.setAttribute('aria-hidden', 'false');
  document.body.classList.add('puzzle-open');
  if (mode === 'picture') {
    selectedPuzzleTile = null;
    shufflePicturePuzzleTiles();
    puzzleStatus.textContent = 'loading photo...';
    checkPicturePuzzleImage();
    return;
  }
  puzzleRound = 0;
  puzzleLastHardShuffleClass = '';
  puzzlePicker.classList.remove('is-visible');
  puzzleStatus.textContent = "get ready";
  startPuzzleRound();
}

function openPuzzleSceneFromStarbucks(delay = 0) {
  if (puzzleOpen) return;
  starbucksLastTimer = window.setTimeout(() => {
    starbucksConversationActive = false;
    hideStarbucksBubbles();
    puzzleSolved = false;
    openPuzzleScene('memory');
  }, delay);
}

function closePuzzleScene() {
  puzzleOpen = false;
  clearPuzzleTimers();
  puzzleAcceptingInput = false;
  selectedPuzzleTile = null;
  puzzleHeartReadyToOpen = false;
  puzzleScene.classList.remove('is-visible');
  puzzleScene.classList.remove('is-picture-puzzle');
  puzzleScene.setAttribute('aria-hidden', 'true');
  puzzleGrid.classList.remove('is-picture-puzzle');
  document.body.classList.remove('puzzle-open');
  stopMovementInput();
}

function startMoveSomewhereScript() {
  chatSolved = true;
  typeChatSequence(
    [
      {
        side: 'guy',
        text: "should we move to somewhere else? start something or texting somewhere else or maybe call?",
      },
    ],
    () => addChatTimer(showMoveSomewhereChoice, 520),
  );
}

function startChatScript() {
  clearChatTimers();
  chatSolved = false;
  chatChoiceStep = chatFocusMode ? 'third' : 'first';
  chatThread.replaceChildren();
  chatChoices.replaceChildren();
  chatFeedback.textContent = "";
  chatHearts.replaceChildren();
  hideChatFinalScreen();
  chatChoices.classList.remove('is-visible', 'is-shaking');
  chatPanel.classList.remove('is-shaking');

  if (chatFocusMode) {
    startMoveSomewhereScript();
    return;
  }

  const firstBubble = createChatBubble('girl');
  typeChatBubble(firstBubble, "Hiii", () => {
    addChatTimer(() => {
      const guyHiBubble = createChatBubble('guy');
      typeChatBubble(guyHiBubble, "Hiii", () => {
        addChatTimer(() => {
          const replyBubble = createChatBubble('guy');
          typeChatBubble(replyBubble, "have we met before?", () => {
            addChatTimer(showChatChoices, 320);
          });
        }, 420);
      });
    }, 420);
  });
}

function openChatScene() {
  closeBumbleApp();
  chatOpen = true;
  stopMovementInput();
  startChatScript();
  chatScene.classList.add('is-visible');
  chatScene.setAttribute('aria-hidden', 'false');
  document.body.classList.add('chat-open');
}

function closeChatScene() {
  chatOpen = false;
  clearChatTimers();
  hideChatFinalScreen();
  chatScene.classList.remove('is-visible');
  chatScene.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('chat-open');
  stopMovementInput();
}

function denyBumbleSwipe(direction) {
  const activeCard = bumbleCards[bumbleCardIndex];
  if (!activeCard) return;
  activeCard.classList.remove('is-denied');
  bumblePhone.classList.remove('is-shaking');
  void activeCard.offsetWidth;
  activeCard.classList.add('is-denied');
  void bumblePhone.offsetWidth;
  bumblePhone.classList.add('is-shaking');
  if ('vibrate' in navigator) navigator.vibrate([35, 28, 35]);
  if (direction === 'left' && activeCard.dataset.leftSequence === 'bumbleB') {
    const index = Math.min(bumbleFinalLeftAttempts, bumbleFinalLeftMessages.length - 1);
    bumbleFinalLeftAttempts += 1;
    bumbleInstruction.textContent = "";
    showBumbleMessagePop(bumbleFinalLeftMessages[index]);
    return;
  }
  if (direction === 'right' && activeCard.dataset.quietRight === 'true') {
    bumbleQuietRightAttempts += 1;
    bumbleInstruction.textContent = "";
    if (bumbleQuietRightAttempts >= 3) {
      showBumbleMessagePop();
    }
    return;
  }
  bumbleInstruction.textContent = `You cannot swipe ${direction}.`;
}

function swipeBumbleLeft() {
  if (!bumbleOpen) return;
  const activeCard = bumbleCards[bumbleCardIndex];
  if (activeCard?.dataset.canSkip !== 'true') {
    denyBumbleSwipe('left');
    return;
  }
  if (bumbleCardIndex < bumbleCards.length - 1) {
    bumbleCardIndex += 1;
    bumbleQuietRightAttempts = 0;
    bumbleFinalLeftAttempts = 0;
    hideBumbleMessagePop();
    updateBumbleCards();
    return;
  }
  activeCard.classList.add('is-left');
  activeCard.classList.remove('is-active');
  bumbleInstruction.textContent = "";
  bumbleLeft.classList.add('is-disabled');
}

function swipeBumbleRight() {
  if (!bumbleOpen) return;
  const activeCard = bumbleCards[bumbleCardIndex];
  if (activeCard?.dataset.canLike !== 'true') {
    denyBumbleSwipe('right');
    return;
  }
  activeCard.classList.add('is-right');
  activeCard.classList.remove('is-active');
  bumbleInstruction.textContent = "";
  bumbleFinalLeftAttempts = 0;
  hideBumbleMessagePop();
  bumbleLogoPulseUntil = clock.elapsedTime + 2.2;
  if (activeCard.dataset.rightAction === 'finish') {
    bumbleRight.classList.add('is-disabled');
    window.setTimeout(() => {
      if (bumbleOpen) openChatScene();
    }, 320);
    return;
  }
  window.setTimeout(() => {
    if (bumbleOpen) showBumbleReady();
  }, 260);
}

function renderMediaViewer() {
  const item = mediaItems[mediaIndex];
  mediaStage.replaceChildren();
  if (!item) return;

  let element;
  if (item.type === 'video') {
    element = document.createElement('video');
    element.src = item.src;
    element.controls = true;
    element.playsInline = true;
    element.autoplay = true;
  } else {
    element = document.createElement('img');
    element.src = item.src;
    element.alt = item.title;
    element.decoding = 'async';
  }

  mediaTitle.textContent = item.title;
  mediaCounter.textContent = `${mediaIndex + 1} / ${mediaItems.length}`;
  mediaStage.append(element);
}

function openMediaViewer(index = 0) {
  mediaIndex = THREE.MathUtils.clamp(index, 0, mediaItems.length - 1);
  mediaOpen = true;
  renderMediaViewer();
  stopMovementInput();
  closeBumbleApp(false);
  mediaViewer.classList.add('is-visible');
  mediaViewer.setAttribute('aria-hidden', 'false');
  document.body.classList.add('media-open');
}

function closeMediaViewer() {
  mediaOpen = false;
  mediaViewer.classList.remove('is-visible');
  mediaViewer.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('media-open');
  mediaStage.replaceChildren();
  stopMovementInput();
}

function openPhoneLaunch() {
  phoneLaunchOpen = true;
  stopMovementInput();
  phoneLaunch.classList.remove('is-zooming');
  phoneLaunch.classList.add('is-visible');
  phoneLaunch.setAttribute('aria-hidden', 'false');
  document.body.classList.add('phone-launch-open');
  clearTimeout(phoneLaunchZoomTimer);
  phoneLaunchZoomTimer = setTimeout(() => {
    if (phoneLaunchOpen) phoneLaunch.classList.add('is-zooming');
  }, 620);
}

function closePhoneLaunch() {
  phoneLaunchOpen = false;
  clearTimeout(phoneLaunchZoomTimer);
  phoneLaunchZoomTimer = null;
  phoneLaunch.classList.remove('is-visible', 'is-zooming');
  phoneLaunch.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('phone-launch-open');
  stopMovementInput();
}

function showNextMedia(step) {
  if (!mediaOpen) return;
  mediaIndex = (mediaIndex + step + mediaItems.length) % mediaItems.length;
  renderMediaViewer();
}

function createPhotoCanvasTexture() {
  const canvasTexture = document.createElement('canvas');
  canvasTexture.width = 512;
  canvasTexture.height = 360;
  const context = canvasTexture.getContext('2d');
  context.fillStyle = '#fff8ed';
  context.fillRect(0, 0, canvasTexture.width, canvasTexture.height);
  context.fillStyle = '#ffd044';
  context.fillRect(24, 24, canvasTexture.width - 48, canvasTexture.height - 48);
  context.fillStyle = '#ff9fb2';
  context.beginPath();
  context.arc(176, 150, 64, 0, Math.PI * 2);
  context.arc(310, 150, 64, 0, Math.PI * 2);
  context.fill();
  context.fillStyle = '#fff8ed';
  context.font = '900 46px Arial, sans-serif';
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillText('PHOTO', canvasTexture.width / 2, 270);
  const texture = new THREE.CanvasTexture(canvasTexture);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function mergeEditorAssetCatalog(catalog) {
  if (!Array.isArray(catalog)) return;
  const featuredById = new Map(featuredEditorAssets.map((asset) => [asset.id, asset]));
  const catalogAssets = catalog
    .filter((asset) => asset?.id)
    .map((asset) => ({
      placement: 'floor',
      scale: 1,
      ...asset,
    }));
  editorAssets = [
    featuredEditorAssets[0],
    ...catalogAssets.map((asset) => ({ ...asset, ...(featuredById.get(asset.id) || {}) })),
  ];
  selectedEditorAsset = editorAssets.find((asset) => asset.id === selectedEditorAsset?.id) || editorAssets[0];
}

async function loadEditorAssetCatalog() {
  try {
    const response = await fetch('/room-models/catalog.json');
    if (!response.ok) throw new Error(`Catalog ${response.status}`);
    const catalog = await response.json();
    mergeEditorAssetCatalog(catalog);
  } catch {
    editorAssets = [...featuredEditorAssets];
  }
  renderAssetPalette();
  loadRoomLayout();
}

function getDefaultRoomLayout() {
  return [];
}

function applyTextureToEditorObject(object, textureSrc) {
  if (!object || !textureSrc) return;
  textureLoader.load(textureSrc, (texture) => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.flipY = false;
    texture.anisotropy = 8;
    object.traverse((child) => {
      if (!child.isMesh || !child.material) return;
      const materials = Array.isArray(child.material) ? child.material : [child.material];
      const updatedMaterials = materials.map((material) => {
        const nextMaterial = material.clone();
        nextMaterial.map = texture;
        nextMaterial.color?.set(0xffffff);
        nextMaterial.needsUpdate = true;
        return nextMaterial;
      });
      child.material = Array.isArray(child.material) ? updatedMaterials : updatedMaterials[0];
    });
    object.userData.editorTextureSrc = textureSrc;
  });
}

function getModelFormat(src = '') {
  const cleanSrc = src.split('?')[0].split('#')[0];
  return cleanSrc.slice(cleanSrc.lastIndexOf('.') + 1).toLowerCase();
}

function loadEditorModel(asset, onLoad) {
  const format = (asset.format || getModelFormat(asset.modelSrc)).toLowerCase();
  if (format === 'glb' || format === 'gltf') {
    gltfLoader.load(asset.modelSrc, (gltf) => onLoad(gltf.scene));
    return;
  }
  if (format === 'fbx') {
    fbxLoader.load(asset.modelSrc, onLoad);
    return;
  }
  if (format === 'obj') {
    objLoader.load(asset.modelSrc, onLoad);
    return;
  }
  if (format === 'stl') {
    stlLoader.load(asset.modelSrc, (geometry) => {
      const material = new THREE.MeshStandardMaterial({ color: 0xf4c28e, roughness: 0.72, metalness: 0.04 });
      onLoad(new THREE.Mesh(geometry, material));
    });
    return;
  }
  if (format === 'dae') {
    colladaLoader.load(asset.modelSrc, (collada) => onLoad(collada.scene));
  }
}

function getEditorGroundY(object) {
  const placement = object.userData.editorPlacement;
  if (placement === 'wall') return object.position.y;
  if (placement === 'floor') return 0.11;
  return 0.75;
}

function groundEditorObject(object) {
  if (!object || object.userData.editorPlacement === 'wall') return;
  const box = new THREE.Box3().setFromObject(object);
  if (!Number.isFinite(box.min.y)) return;
  const targetY = getEditorGroundY(object) + (object.userData.verticalOffset || 0);
  object.position.y += targetY - box.min.y;
}

function moveSelectedEditorObject(deltaY) {
  if (!selectedEditorObject) return;
  selectedEditorObject.userData.verticalOffset = (selectedEditorObject.userData.verticalOffset || 0) + deltaY;
  selectedEditorObject.position.y += deltaY;
}

function setEditorObjectFromPointer(object, event) {
  const target = object.userData.editorPlacement === 'wall' ? editorBackWallTarget : editorFloorTarget;
  setPointerRay(event);
  const hit = raycaster.intersectObject(target, false)[0];
  if (!hit) return false;
  object.position.x = hit.point.x;
  object.position.z = object.userData.editorPlacement === 'wall' ? -roomHalfDepth + 0.12 : hit.point.z;
  if (object.userData.editorPlacement === 'wall') {
    object.position.y = hit.point.y;
  } else {
    object.position.y = getEditorGroundY(object) + (object.userData.verticalOffset || 0);
    groundEditorObject(object);
  }
  return true;
}

function createEditorObject(asset, saved = {}) {
  const object = new THREE.Group();
  object.userData.editorAssetId = asset.id;
  object.userData.editorPlacement = asset.placement || 'floor';
  object.userData.isEditorRoot = true;
  let material;
  let mesh;
  let width = asset.kind === 'photo' ? 1.35 : 1;
  let height = asset.kind === 'photo' ? 0.95 : 1;

  if (asset.modelSrc) {
    const placeholder = new THREE.Mesh(
      new THREE.BoxGeometry(0.7, 0.7, 0.7),
      new THREE.MeshStandardMaterial({ color: 0xffd044, transparent: true, opacity: 0.28 }),
    );
    placeholder.userData.editorRoot = object;
    object.add(placeholder);
    object.userData.editorMesh = placeholder;
    loadEditorModel(asset, (loadedModel) => {
      object.remove(placeholder);
      const model = loadedModel;
      model.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          child.userData.editorRoot = object;
        }
      });
      const box = new THREE.Box3().setFromObject(model);
      const center = box.getCenter(new THREE.Vector3());
      model.position.sub(center);
      const groundedBox = new THREE.Box3().setFromObject(model);
      model.position.y -= groundedBox.min.y;
      object.add(model);
      object.userData.editorMesh = model;
      if (saved.textureSrc) applyTextureToEditorObject(object, saved.textureSrc);
      groundEditorObject(object);
    });
  } else if (asset.kind === 'photo') {
    material = new THREE.MeshBasicMaterial({
      map: saved.textureSrc ? textureLoader.load(saved.textureSrc) : createPhotoCanvasTexture(),
      transparent: true,
      side: THREE.DoubleSide,
    });
    material.map.colorSpace = THREE.SRGBColorSpace;
  } else {
    const texture = textureLoader.load(asset.src, (loaded) => {
      const aspect = loaded.image.width / loaded.image.height;
      if (mesh) mesh.scale.set(aspect * (asset.scale || 1), asset.scale || 1, 1);
    });
    texture.colorSpace = THREE.SRGBColorSpace;
    material = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      side: THREE.DoubleSide,
      toneMapped: false,
    });
  }

  if (material) {
    mesh = new THREE.Mesh(new THREE.PlaneGeometry(width, height), material);
    mesh.userData.editorRoot = object;
    object.add(mesh);
    object.userData.editorMesh = mesh;
  }

  if (asset.placement === 'floor') {
    if (mesh) mesh.rotation.x = -Math.PI / 2;
    object.position.set(saved.x ?? 0, 0.11, saved.z ?? 0);
  } else if (asset.placement === 'wall') {
    object.position.set(saved.x ?? 0, saved.y ?? 2, saved.z ?? -roomHalfDepth + 0.12);
  } else {
    object.position.set(saved.x ?? 0, saved.y ?? 0.75, saved.z ?? 0);
  }

  object.rotation.y = saved.ry ?? 0;
  object.userData.verticalOffset = saved.vo ?? 0;
  object.userData.editorTextureSrc = saved.textureSrc || '';
  const baseScale = saved.s ?? ((asset.scale ?? 1) * (asset.modelSrc ? newEditorModelScaleBoost : 1));
  object.scale.setScalar(baseScale);
  room.add(object);
  placedEditorObjects.push(object);
  if (!asset.modelSrc && saved.textureSrc && asset.kind !== 'photo') applyTextureToEditorObject(object, saved.textureSrc);
  return object;
}

function selectEditorObject(object) {
  selectedEditorObject = object;
  placedEditorObjects.forEach((placed) => {
    placed.traverse((child) => {
      if (!child.isMesh || !child.material) return;
      const materials = Array.isArray(child.material) ? child.material : [child.material];
      materials.forEach((item) => {
        item.transparent = placed === object || item.transparent;
        item.opacity = placed === object ? 0.72 : 1;
        item.needsUpdate = true;
      });
    });
  });
}

function saveRoomLayout() {
  const layout = placedEditorObjects.map((object) => ({
    id: object.userData.editorAssetId,
    x: Number(object.position.x.toFixed(3)),
    y: Number(object.position.y.toFixed(3)),
    z: Number(object.position.z.toFixed(3)),
    ry: Number(object.rotation.y.toFixed(3)),
    s: Number(object.scale.x.toFixed(3)),
    vo: Number((object.userData.verticalOffset || 0).toFixed(3)),
    textureSrc: object.userData.editorTextureSrc || '',
  }));
  localStorage.setItem(roomEditorStorageKey, JSON.stringify(layout));
}

function loadRoomLayout() {
  const raw = localStorage.getItem(roomEditorStorageKey);
  try {
    const layout = raw ? JSON.parse(raw) : getDefaultRoomLayout();
    layout.forEach((item) => {
      const asset = editorAssets.find((candidate) => candidate.id === item.id);
      if (asset) createEditorObject(asset, item);
    });
  } catch {
    localStorage.removeItem(roomEditorStorageKey);
    getDefaultRoomLayout().forEach((item) => {
      const asset = editorAssets.find((candidate) => candidate.id === item.id);
      if (asset) createEditorObject(asset, item);
    });
  }
}

function renderAssetPalette() {
  assetPalette.replaceChildren();
  const picker = document.createElement('div');
  picker.className = 'asset-picker';

  const preview = document.createElement('div');
  preview.className = 'asset-preview';

  const previewImage = document.createElement('div');
  previewImage.className = 'asset-preview-image';
  if (selectedEditorAsset.src) {
    const img = document.createElement('img');
    img.src = selectedEditorAsset.src;
    img.alt = selectedEditorAsset.label;
    img.addEventListener('error', () => {
      img.remove();
      previewImage.textContent = selectedEditorAsset.label.slice(0, 2).toUpperCase();
    });
    previewImage.append(img);
  } else {
    previewImage.textContent = selectedEditorAsset.label.slice(0, 2).toUpperCase();
  }

  const previewText = document.createElement('div');
  previewText.className = 'asset-preview-text';
  const previewLabel = document.createElement('strong');
  previewLabel.textContent = selectedEditorAsset.label;
  const previewMeta = document.createElement('span');
  previewMeta.textContent = selectedEditorAsset.kind === 'photo'
    ? 'Photo canvas'
    : `${selectedEditorAsset.format?.toUpperCase() || 'MODEL'} / ${selectedEditorAsset.placement || 'floor'}`;
  previewText.append(previewLabel, previewMeta);
  preview.append(previewImage, previewText);

  const select = document.createElement('select');
  select.className = 'asset-select';
  select.setAttribute('aria-label', 'Choose room asset');
  editorAssets.forEach((asset) => {
    const option = document.createElement('option');
    option.value = asset.id;
    option.textContent = asset.label;
    option.selected = asset.id === selectedEditorAsset.id;
    select.append(option);
  });
  select.addEventListener('change', () => {
    selectedEditorAsset = editorAssets.find((asset) => asset.id === select.value) || selectedEditorAsset;
    selectedEditorObject = null;
    renderAssetPalette();
  });

  picker.append(preview, select);
  assetPalette.append(picker);
}

function placeEditorAsset(event) {
  if (!roomEditorActive || currentArea !== 'bedroom') return false;
  setPointerRay(event);
  const picked = raycaster.intersectObjects(placedEditorObjects, true)[0];
  if (picked?.object?.userData.editorRoot) {
    const object = picked.object.userData.editorRoot;
    selectEditorObject(object);
    return object;
  }
  const target = selectedEditorAsset.placement === 'wall' ? editorBackWallTarget : editorFloorTarget;
  const hit = raycaster.intersectObject(target, false)[0];
  if (!hit) return null;

  const object = createEditorObject(selectedEditorAsset);
  object.position.copy(hit.point);
  if (selectedEditorAsset.placement === 'wall') {
    object.position.z = -roomHalfDepth + 0.12;
    object.rotation.y = 0;
  } else if (selectedEditorAsset.placement === 'floor') {
    object.position.y = 0.11;
  } else {
    object.position.y = 0.75;
    object.rotation.y = yaw + Math.PI;
  }
  object.userData.verticalOffset = 0;
  groundEditorObject(object);
  selectEditorObject(object);
  return object;
}

function startEditorDrag(object, event) {
  if (!object) return;
  editorDrag.active = true;
  editorDrag.pointerId = event.pointerId;
  editorDrag.object = object;
  editorDrag.placement = object.userData.editorPlacement || 'floor';
  editorDrag.verticalOffset = object.userData.verticalOffset || 0;
  canvas.setPointerCapture(event.pointerId);
}

function moveEditorDrag(event) {
  if (!editorDrag.active || editorDrag.pointerId !== event.pointerId || !editorDrag.object) return false;
  setEditorObjectFromPointer(editorDrag.object, event);
  return true;
}

function endEditorDrag(event) {
  if (!editorDrag.active || editorDrag.pointerId !== event.pointerId) return false;
  editorDrag.active = false;
  editorDrag.pointerId = null;
  editorDrag.object = null;
  draggingLook = false;
  return true;
}

function setRoomEditorActive(active) {
  roomEditorActive = active;
  if (active && currentArea === 'bedroom') stopMovementInput();
  document.body.classList.toggle('room-editor-mode', active && currentArea === 'bedroom');
  editorToggle.classList.toggle('is-active', roomEditorActive);
}

function getActiveBumbleCard() {
  return bumbleCards[bumbleCardIndex];
}

function resetBumbleCardDrag() {
  const activeCard = getActiveBumbleCard();
  if (activeCard) activeCard.style.transform = '';
  bumbleSwipe.active = false;
  bumbleSwipe.id = null;
  bumbleSwipe.startX = 0;
  bumbleSwipe.currentX = 0;
}

function startBumbleSwipe(event) {
  if (!bumbleOpen) return;
  bumbleSwipe.active = true;
  bumbleSwipe.id = event.pointerId;
  bumbleSwipe.startX = event.clientX;
  bumbleSwipe.currentX = event.clientX;
  bumbleCardStack.setPointerCapture(event.pointerId);
}

function moveBumbleSwipe(event) {
  if (!bumbleSwipe.active || event.pointerId !== bumbleSwipe.id) return;
  bumbleSwipe.currentX = event.clientX;
  const delta = THREE.MathUtils.clamp(bumbleSwipe.currentX - bumbleSwipe.startX, -120, 120);
  const activeCard = getActiveBumbleCard();
  if (activeCard) {
    activeCard.style.transform = `translateX(${delta}px) rotate(${delta * 0.035}deg)`;
  }
}

function finishBumbleSwipe(event) {
  if (!bumbleSwipe.active || event.pointerId !== bumbleSwipe.id) return;
  const delta = bumbleSwipe.currentX - bumbleSwipe.startX;
  resetBumbleCardDrag();
  if (delta < -62) {
    swipeBumbleLeft();
  } else if (delta > 62) {
    swipeBumbleRight();
  }
}

function getPinchDistance() {
  const points = [...pinchPointers.values()];
  if (points.length < 2) return 0;
  return points[0].distanceTo(points[1]);
}

function showTutorialStep() {
  tutorialText.textContent = tutorialSteps[tutorialIndex];
  tutorialNext.textContent = tutorialIndex === tutorialSteps.length - 1 ? "Explore" : "Next";
}

function startTutorial() {
  tutorialActive = true;
  tutorialIndex = 0;
  stopMovementInput();
  document.body.classList.add('tutorial-active');
  showTutorialStep();
  tutorial.classList.add('is-visible');
}

function finishTutorial() {
  tutorialActive = false;
  tutorial.classList.remove('is-visible');
  document.body.classList.remove('tutorial-active');
  stopMovementInput();
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

window.addEventListener('keydown', (event) => {
  const key = event.key.toLowerCase();
  if (mazeOpen) {
    if (key === 'w' || key === 'arrowup') moveMazePlayer(0, -1);
    if (key === 's' || key === 'arrowdown') moveMazePlayer(0, 1);
    if (key === 'a' || key === 'arrowleft') moveMazePlayer(-1, 0);
    if (key === 'd' || key === 'arrowright') moveMazePlayer(1, 0);
    if (movementKeys.has(key)) event.preventDefault();
    return;
  }
  if (phoneLaunchOpen) {
    if (event.key === 'Escape') closePhoneLaunch();
    return;
  }
  if (chatOpen) {
    if (event.key === 'Escape') closeChatScene();
    return;
  }
  if (mediaOpen) {
    if (event.key === 'Escape') closeMediaViewer();
    if (event.key === 'ArrowLeft') showNextMedia(-1);
    if (event.key === 'ArrowRight') showNextMedia(1);
    return;
  }
  if (bumbleOpen) {
    if (event.key === 'Escape') closeBumbleApp();
    if (event.key === 'ArrowLeft') swipeBumbleLeft();
    if (event.key === 'ArrowRight') swipeBumbleRight();
    return;
  }
  if (roomEditorActive && currentArea === 'bedroom' && event.key === 'Escape') {
    setRoomEditorActive(false);
    return;
  }
  if (movementKeys.has(key)) {
    event.preventDefault();
    keys.add(key);
  }
});
window.addEventListener('keyup', (event) => {
  keys.delete(event.key.toLowerCase());
});
window.addEventListener('blur', stopMovementInput);
document.addEventListener('visibilitychange', () => {
  if (document.hidden) stopMovementInput();
});

mainMenu.addEventListener('pointerdown', (event) => {
  if (event.pointerType === 'touch') {
    requestFullscreen();
  }
});

startButton.addEventListener('click', () => {
  requestFullscreen();
  resetGameProgress();
  mainMenu.classList.add('is-hidden');
  startTransition.classList.add('is-active');
  stopMovementInput();
  setTimeout(() => {
    gameStarted = true;
    document.body.classList.add('game-started');
    startTransition.classList.remove('is-active');
    if (finalChoiceFocusMode) {
      tutorialActive = false;
      tutorial.classList.remove('is-visible');
      document.body.classList.remove('tutorial-active');
      showFinalGameOver();
      return;
    }
    if (mazeFocusMode) {
      tutorialActive = false;
      tutorial.classList.remove('is-visible');
      document.body.classList.remove('tutorial-active');
      openMazeGame();
      return;
    }
    if (postStarbucksMemoryFocusMode) {
      tutorialActive = false;
      tutorial.classList.remove('is-visible');
      document.body.classList.remove('tutorial-active');
      enterStarbucksHeartFallenFocus();
      return;
    }
    if (roomFocusMode) {
      tutorialActive = false;
      tutorial.classList.remove('is-visible');
      document.body.classList.remove('tutorial-active');
      enterBedroom();
      if (starbucksFocusMode) {
        enterStarbucks();
        return;
      }
      if (outdoorFocusMode) {
        enterNextPart();
        return;
      }
      if (puzzleFocusMode) {
        openPuzzleScene();
        return;
      }
      if (chatFocusMode) openChatScene();
      return;
    }
    startTutorial();
  }, 850);
});

menuButton.addEventListener('click', () => {
  gameStarted = false;
  tutorialActive = false;
  tutorial.classList.remove('is-visible');
  document.body.classList.remove('tutorial-active');
  stopMovementInput();
  document.body.classList.remove('game-started');
  mainMenu.classList.remove('is-hidden');
});

tutorialNext.addEventListener('click', () => {
  if (tutorialIndex >= tutorialSteps.length - 1) {
    finishTutorial();
    return;
  }
  tutorialIndex += 1;
  showTutorialStep();
});

tutorialSkip.addEventListener('click', finishTutorial);

canvas.addEventListener('pointerdown', (event) => {
  if (!gameStarted || tutorialActive || bumbleOpen || mediaOpen || phoneLaunchOpen || chatOpen || puzzleOpen) return;
  if (roomEditorActive && currentArea === 'bedroom') {
    if (event.pointerType !== 'touch' && event.button === 2) {
      draggingLook = true;
      lastX = event.clientX;
      canvas.setPointerCapture(event.pointerId);
      return;
    }
    if (event.pointerType === 'touch' || event.button === 0) {
      const object = placeEditorAsset(event);
      if (object) startEditorDrag(object, event);
      return;
    }
  }
  if (event.pointerType === 'touch') {
    if (isPointerOnBigPhone(event)) {
      activateBigPhone();
      return;
    }
    if (isPointerOnBumbleLogo(event)) {
      activateBumbleLogo();
      return;
    }
    pinchPointers.set(event.pointerId, new THREE.Vector2(event.clientX, event.clientY));
    if (pinchPointers.size === 2) {
      lastPinchDistance = getPinchDistance();
      touchLookId = null;
    } else if (pinchPointers.size === 1 && event.clientX > (window.visualViewport?.width || window.innerWidth) * 0.45) {
      touchLookId = event.pointerId;
      touchLookLastX = event.clientX;
    }
    canvas.setPointerCapture(event.pointerId);
    return;
  }
  if (event.button === 0 && isPointerOnBumbleLogo(event)) {
    activateBumbleLogo();
    return;
  }
  if (event.button === 0 && isPointerOnBigPhone(event)) {
    activateBigPhone();
    return;
  }
  if (event.button === 0 && isPointerOnDog(event)) {
    startDogCuddle();
    return;
  }
  draggingLook = true;
  lastX = event.clientX;
  canvas.setPointerCapture(event.pointerId);
});

cuddleButton.addEventListener('click', startDogCuddle);
doorButton.addEventListener('click', startRoomLoading);
phoneButton.addEventListener('click', activateBigPhone);
bumbleClose.addEventListener('click', closeBumbleApp);
bumbleLeft.addEventListener('click', swipeBumbleLeft);
bumbleRight.addEventListener('click', swipeBumbleRight);
bumbleApp.addEventListener('pointerdown', (event) => {
  if (event.target === bumbleApp) closeBumbleApp();
});
bumbleCardStack.addEventListener('pointerdown', startBumbleSwipe);
bumbleCardStack.addEventListener('pointermove', moveBumbleSwipe);
bumbleCardStack.addEventListener('pointerup', finishBumbleSwipe);
bumbleCardStack.addEventListener('pointercancel', resetBumbleCardDrag);
chatClose.addEventListener('click', closeChatScene);
chatPanel.addEventListener('pointerdown', speedUpChatTyping);
chatScene.addEventListener('pointerdown', (event) => {
  if (event.target === chatScene) closeChatScene();
});
puzzleClose.addEventListener('click', closePuzzleScene);
puzzleScene.addEventListener('pointerdown', (event) => {
  if (event.target === puzzleScene) event.preventDefault();
});
puzzlePickButton.addEventListener('click', () => puzzleFileInput.click());
puzzleFileInput.addEventListener('change', () => {
  setPicturePuzzleImage(puzzleFileInput.files?.[0]);
  puzzleFileInput.value = '';
});
mediaClose.addEventListener('click', closeMediaViewer);
mediaPrev.addEventListener('click', () => showNextMedia(-1));
mediaNext.addEventListener('click', () => showNextMedia(1));
mediaViewer.addEventListener('pointerdown', (event) => {
  if (event.target === mediaViewer) closeMediaViewer();
});
phoneLaunchClose.addEventListener('click', closePhoneLaunch);
phoneLaunch.addEventListener('pointerdown', (event) => {
  if (event.target === phoneLaunch) closePhoneLaunch();
});
phoneLaunchBumble.addEventListener('click', () => {
  if (!phoneLaunchOpen) return;
  phoneLaunch.classList.add('is-zooming');
  window.setTimeout(() => {
    if (!phoneLaunchOpen) return;
    closePhoneLaunch();
    openBumbleApp();
  }, 520);
});
bumbleReadyYes.addEventListener('click', () => {
  showPostReadyBumbleCards();
});
editorToggle.addEventListener('click', () => setRoomEditorActive(!roomEditorActive));
editorSave.addEventListener('click', saveRoomLayout);
editorFinish.addEventListener('click', () => {
  saveRoomLayout();
  setRoomEditorActive(false);
});
editorAdd.addEventListener('click', () => {
  roomEditor.classList.toggle('is-adding');
});
editorAddModel.addEventListener('click', () => {
  editorModelInput.click();
});
editorAddTexture.addEventListener('click', () => {
  if (!selectedEditorObject) {
    window.alert('Select an object in the room first, then choose Texture.');
    return;
  }
  editorTextureInput.click();
});
editorModelInput.addEventListener('change', () => {
  const files = [...(editorModelInput.files || [])];
  editorModelInput.value = '';
  if (!files.length) return;

  const supportedFormats = new Set(['glb', 'gltf', 'fbx', 'obj', 'stl', 'dae']);
  const uploadedAssets = files
    .filter((file) => supportedFormats.has(getModelFormat(file.name)))
    .map((file, index) => {
      const format = getModelFormat(file.name);
      const label = file.name.replace(/\.(glb|gltf|fbx|obj|stl|dae)$/i, '') || 'Custom Model';
      return {
        id: `customModel-${Date.now()}-${index}`,
        label,
        modelSrc: URL.createObjectURL(file),
        format,
        scale: 1,
        placement: 'floor',
        isCustom: true,
      };
    });

  if (!uploadedAssets.length) {
    window.alert('Choose model files: GLB, GLTF, FBX, OBJ, STL, or DAE.');
    return;
  }

  editorAssets.splice(1, 0, ...uploadedAssets);
  selectedEditorAsset = uploadedAssets[0];
  selectedEditorObject = null;
  roomEditor.classList.remove('is-adding');
  renderAssetPalette();
});
editorTextureInput.addEventListener('change', () => {
  const file = editorTextureInput.files?.[0];
  editorTextureInput.value = '';
  if (!file || !selectedEditorObject) return;
  const reader = new FileReader();
  reader.addEventListener('load', () => {
    applyTextureToEditorObject(selectedEditorObject, reader.result);
    selectEditorObject(selectedEditorObject);
  });
  reader.readAsDataURL(file);
  roomEditor.classList.remove('is-adding');
});
editorRotate.addEventListener('click', () => {
  if (!selectedEditorObject) return;
  selectedEditorObject.rotation.y += Math.PI / 4;
});
editorSmaller.addEventListener('click', () => {
  if (!selectedEditorObject) return;
  selectedEditorObject.scale.multiplyScalar(0.9);
  groundEditorObject(selectedEditorObject);
});
editorBigger.addEventListener('click', () => {
  if (!selectedEditorObject) return;
  selectedEditorObject.scale.multiplyScalar(1.1);
  groundEditorObject(selectedEditorObject);
});
editorUp.addEventListener('click', () => {
  moveSelectedEditorObject(0.12);
});
editorDown.addEventListener('click', () => {
  moveSelectedEditorObject(-0.12);
});
editorDelete.addEventListener('click', () => {
  if (!selectedEditorObject) return;
  room.remove(selectedEditorObject);
  const index = placedEditorObjects.indexOf(selectedEditorObject);
  if (index >= 0) placedEditorObjects.splice(index, 1);
  selectedEditorObject = null;
});

canvas.addEventListener('pointermove', (event) => {
  if (bumbleOpen || mediaOpen || phoneLaunchOpen || chatOpen || puzzleOpen) return;
  if (moveEditorDrag(event)) return;
  if (event.pointerType === 'touch') {
    if (!pinchPointers.has(event.pointerId)) return;
    pinchPointers.get(event.pointerId).set(event.clientX, event.clientY);
    if (pinchPointers.size >= 2) {
      const pinchDistance = getPinchDistance();
      if (lastPinchDistance > 0) {
        cameraDistance = THREE.MathUtils.clamp(cameraDistance - (pinchDistance - lastPinchDistance) * 0.018, 3.4, 10);
      }
      lastPinchDistance = pinchDistance;
    } else if (touchLookId === event.pointerId) {
      yaw -= (event.clientX - touchLookLastX) * 0.006;
      touchLookLastX = event.clientX;
    }
    return;
  }

  if (!draggingLook) return;
  yaw -= (event.clientX - lastX) * 0.006;
  lastX = event.clientX;
});

function endCanvasPointer(event) {
  if (endEditorDrag(event)) return;
  if (event.pointerType === 'touch') {
    pinchPointers.delete(event.pointerId);
    lastPinchDistance = pinchPointers.size >= 2 ? getPinchDistance() : 0;
    if (touchLookId === event.pointerId) {
      touchLookId = null;
    }
    return;
  }
  draggingLook = false;
}

canvas.addEventListener('pointerup', endCanvasPointer);
canvas.addEventListener('pointercancel', endCanvasPointer);
canvas.addEventListener('lostpointercapture', endCanvasPointer);
canvas.addEventListener('contextmenu', (event) => event.preventDefault());

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
  if (!gameStarted || tutorialActive || bumbleOpen || mediaOpen || phoneLaunchOpen || chatOpen || puzzleOpen) return;
  event.preventDefault();
  pointer.active = true;
  pointer.id = event.pointerId;
  pointer.origin.set(event.clientX, event.clientY);
  pointer.current.copy(pointer.origin);
  stick.setPointerCapture(event.pointerId);
});

stick.addEventListener('pointermove', (event) => {
  if (!pointer.active || pointer.id !== event.pointerId) return;
  event.preventDefault();
  pointer.current.set(event.clientX, event.clientY);
});

stick.addEventListener('pointerup', (event) => {
  if (pointer.id !== event.pointerId) return;
  event.preventDefault();
  resetTouchStick();
});
stick.addEventListener('pointercancel', (event) => {
  if (pointer.id !== event.pointerId) return;
  event.preventDefault();
  resetTouchStick();
});
stick.addEventListener('lostpointercapture', (event) => {
  if (pointer.id !== event.pointerId) return;
  resetTouchStick();
});

function updateInput() {
  move.set(0, 0);
  const starbucksLocked = currentArea === 'starbucks' && !starbucksCanMove;
  const storyAreaLocked = !freeRoamActive && (currentArea === 'next-part' || currentArea === 'starbucks-outdoor');
  if (!gameStarted || tutorialActive || bumbleOpen || mediaOpen || phoneLaunchOpen || chatOpen || puzzleOpen || mazeOpen || storyAreaLocked || starbucksLocked) {
    pointer.active = false;
    pointer.id = null;
    knob.style.transform = 'translate(-50%, -50%)';
    return;
  }
  if (keys.has('w') || keys.has('arrowup')) move.y += 1;
  if (keys.has('s') || keys.has('arrowdown')) move.y -= 1;
  if (keys.has('a') || keys.has('arrowleft')) move.x -= 1;
  if (keys.has('d') || keys.has('arrowright')) move.x += 1;

  if (pointer.active) {
    const delta = pointer.current.clone().sub(pointer.origin);
    const length = Math.min(delta.length(), 46);
    if (length < 4) {
      knob.style.transform = 'translate(-50%, -50%)';
      move.set(0, 0);
    } else {
      const angle = Math.atan2(delta.y, delta.x);
      const x = Math.cos(angle) * length;
      const y = Math.sin(angle) * length;
      knob.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
      move.set(x / 46, -y / 46);
    }
  }

  if (move.lengthSq() > 1) move.normalize();
}

function constrainPlayerToArea() {
  if (currentArea === 'starbucks-outdoor') {
    player.position.x = THREE.MathUtils.clamp(player.position.x, -8.1, 8.1);
    player.position.z = THREE.MathUtils.clamp(player.position.z, -4.48, 6.55);
    return;
  }

  if (currentArea === 'bedroom' || currentArea === 'next-part' || currentArea === 'starbucks') {
    player.position.x = THREE.MathUtils.clamp(player.position.x, -roomHalfWidth + 0.75, roomHalfWidth - 0.75);
    player.position.z = THREE.MathUtils.clamp(player.position.z, -roomHalfDepth + 0.75, roomHalfDepth - 0.75);
    return;
  }

  const maxRadius = 6.7;
  const flat = new THREE.Vector2(player.position.x, player.position.z);
  if (flat.length() > maxRadius) {
    flat.setLength(maxRadius);
    player.position.x = flat.x;
    player.position.z = flat.y;
  }
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

  constrainPlayerToArea();
}

function updateCamera() {
  const height = THREE.MathUtils.mapLinear(cameraDistance, 3.4, 10, 2.5, 5.8);
  const cameraOffset = new THREE.Vector3(Math.sin(yaw) * cameraDistance, height, Math.cos(yaw) * cameraDistance);
  const targetPosition = player.position.clone().add(cameraOffset);
  camera.position.lerp(targetPosition, 0.08);
  camera.lookAt(player.position.x, player.position.y + 0.75, player.position.z);
}

function updateRoomWalls() {
  if (currentArea !== 'bedroom' && currentArea !== 'next-part' && currentArea !== 'starbucks') {
    roomBackWallMaterial.opacity = 1;
    roomLeftWallMaterial.opacity = 1;
    roomRightWallMaterial.opacity = 1;
    roomCeilingMaterial.opacity = 0.94;
    return;
  }

  const backTarget = camera.position.z < -roomHalfDepth + 0.35 && player.position.z > -roomHalfDepth ? 0.18 : 1;
  const leftTarget = camera.position.x < -roomHalfWidth + 0.35 && player.position.x > -roomHalfWidth ? 0.18 : 1;
  const rightTarget = camera.position.x > roomHalfWidth - 0.35 && player.position.x < roomHalfWidth ? 0.18 : 1;
  const ceilingTarget = camera.position.y > roomWallHeight - 0.2 ? 0.2 : 0.94;

  roomBackWallMaterial.opacity = THREE.MathUtils.lerp(roomBackWallMaterial.opacity, backTarget, 0.16);
  roomLeftWallMaterial.opacity = THREE.MathUtils.lerp(roomLeftWallMaterial.opacity, leftTarget, 0.16);
  roomRightWallMaterial.opacity = THREE.MathUtils.lerp(roomRightWallMaterial.opacity, rightTarget, 0.16);
  roomCeilingMaterial.opacity = THREE.MathUtils.lerp(roomCeilingMaterial.opacity, ceilingTarget, 0.16);
  roomBackWallMaterial.depthWrite = roomBackWallMaterial.opacity > 0.65;
  roomLeftWallMaterial.depthWrite = roomLeftWallMaterial.opacity > 0.65;
  roomRightWallMaterial.depthWrite = roomRightWallMaterial.opacity > 0.65;
  roomCeilingMaterial.depthWrite = roomCeilingMaterial.opacity > 0.65;
}

function updateBumbleLogo(time, delta) {
  if (currentArea !== 'bedroom') return;
  const isPulsing = time < bumbleLogoPulseUntil;
  bumbleLogo.rotation.y += delta * (isPulsing ? 5.2 : 1.25);
  bumbleLogo.position.y = bumbleLogoBasePosition.y + Math.sin(time * 2.6) * 0.055;
  const pulseScale = isPulsing ? 1.12 + Math.sin(time * 18) * 0.06 : 1;
  bumbleLogo.scale.lerp(new THREE.Vector3(pulseScale, pulseScale, pulseScale), 0.18);
  bumbleLogoGlowMaterial.emissiveIntensity = THREE.MathUtils.lerp(
    bumbleLogoGlowMaterial.emissiveIntensity,
    isPulsing ? 1.9 : 0.65,
    0.12,
  );
  bigPhoneLight.intensity = THREE.MathUtils.lerp(
    bigPhoneLight.intensity,
    isPulsing ? 4.8 : 2.6 + Math.sin(time * 3.4) * 0.35,
    0.08,
  );

  if (!isPulsing && phoneScreenMaterial.emissive.getHex() !== 0x222222) {
    phoneScreenMaterial.emissive.set(0x222222);
  }
  bigPhoneScreenMaterial.emissiveIntensity = THREE.MathUtils.lerp(
    bigPhoneScreenMaterial.emissiveIntensity,
    isPulsing ? 1.25 : 0.72,
    0.08,
  );
  bigPhoneGlowMaterial.emissiveIntensity = THREE.MathUtils.lerp(
    bigPhoneGlowMaterial.emissiveIntensity,
    isPulsing ? 1.55 : 1.05,
    0.08,
  );
}

function applyPlayerMeetupPose(time) {
  player.position.set(-0.82, 0, -0.08);
  player.rotation.y = Math.PI / 2;
  avatar.position.y = avatarGroundOffset + Math.sin(time * 1.8) * 0.006;
  rig.torso.rotation.x = 0;
  rig.torso.rotation.z = 0.02;
  rig.leftLeg.rotation.x = 0;
  rig.rightLeg.rotation.x = 0;
  rig.leftLeg.rotation.z = 0;
  rig.rightLeg.rotation.z = 0;
  rig.leftArm.rotation.z = -0.52;
  rig.rightArm.rotation.z = -0.18;
  rig.leftArm.rotation.x = 0.06;
  rig.rightArm.rotation.x = 0.18;
  rig.head.rotation.x = -0.02 + Math.sin(time * 1.4) * 0.006;
  rig.head.rotation.z = 0.02;
}

function applyGuyWalkingPose(time) {
  const stride = Math.sin(time * 8.2);
  randomGuy.userData.leftLeg.rotation.x = stride * 0.42;
  randomGuy.userData.rightLeg.rotation.x = -stride * 0.42;
  randomGuy.userData.torso.rotation.z = Math.sin(time * 4.1) * 0.025;
  randomGuy.userData.head.rotation.z = Math.sin(time * 2.2) * 0.01;
}

function applyGuyStandingPose(time) {
  randomGuy.position.set(0.82, 0, -0.08);
  randomGuy.rotation.y = -Math.PI / 2;
  randomGuy.userData.leftLeg.rotation.x = 0;
  randomGuy.userData.rightLeg.rotation.x = 0;
  randomGuy.userData.leftLeg.rotation.z = 0;
  randomGuy.userData.rightLeg.rotation.z = 0;
  randomGuy.userData.torso.rotation.x = 0;
  randomGuy.userData.torso.rotation.z = -0.015;
  randomGuy.userData.head.rotation.x = -0.01 + Math.sin(time * 1.3) * 0.006;
  randomGuy.userData.leftArm.rotation.z = 0.18;
  randomGuy.userData.rightArm.rotation.z = 0.58;
  randomGuy.userData.leftArm.rotation.x = 0.18;
  randomGuy.userData.rightArm.rotation.x = 0.06;
}

const meetupConversation = [
  { side: 'guy', text: 'hi am i taking a long time' },
  {
    side: 'girl',
    choices: [
      { text: "bet ur ass, yea u take a long time, i'm coming home", correct: false },
      { text: "no u were not! i know it's far", correct: true },
      { text: 'i wanna kiss this guy', correct: false },
    ],
  },
  { side: 'guy', text: 'ok then', action: 'placeProps' },
  { side: 'guy', text: 'you look cute in real life' },
  { side: 'girl', text: 'oh yea thanks!' },
  { side: 'guy', text: 'i like your hair, ur lips, it looks good' },
  { side: 'guy', text: 'tell me bout yourself, and yea when should i bring you home?' },
  {
    side: 'girl',
    choices: [
      { text: 'you can bring me to your home if u want.', correct: false },
      { text: '24 hours i can go home anytime!', correct: false },
      { text: "I actually cannot go and don't usually come home after 7 at the night", correct: true },
    ],
  },
  { side: 'guy', text: '...', action: 'loveGasp', pause: 760 },
  {
    side: 'guy',
    text: "wow i also not a night guy who usually came out a lot. i'm really glad to hear that. i'm happy bout that!",
  },
  { side: 'girl', text: "yea rather than that i'd like to spending time in the day, i'm a DAY GURL BRehhh" },
  {
    side: 'guy',
    text: 'bet u r, wanna get a coffe? like you r the queen of this place. should you take me somewhere else?',
  },
  { side: 'girl', text: "yeaa it's good", action: 'finishConversation' },
];

function clearMeetupTimer() {
  if (meetupLastTimer) clearTimeout(meetupLastTimer);
  meetupLastTimer = null;
}

function hideMeetupChoices() {
  meetupChoices.classList.remove('is-visible');
  meetupChoices.replaceChildren();
  meetupWaitingForChoice = false;
}

function showMeetupChoices(step) {
  meetupChoices.replaceChildren();
  meetupWaitingForChoice = true;
  step.choices.forEach((choice, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'meetup-choice';
    button.textContent = `${index + 1}. ${choice.text}`;
    button.addEventListener('click', () => {
      if (!choice.correct) {
        button.classList.add('is-wrong');
        return;
      }
      hideMeetupChoices();
      typeMeetupBubble(girlMeetupBubble, choice.text);
      meetupConversationIndex += 1;
      meetupLastTimer = window.setTimeout(runMeetupConversationStep, 900);
    });
    meetupChoices.append(button);
  });
  meetupChoices.classList.add('is-visible');
}

function performMeetupAction(action) {
  if (action === 'placeProps') {
    meetupTableProps.visible = true;
    meetupTableProps.scale.setScalar(0.05);
  }
  if (action === 'loveGasp') {
    meetupLoveActive = true;
  }
  if (action === 'finishConversation') {
    meetupLastTimer = window.setTimeout(startMeetupExit, 1000);
  }
}

function runMeetupConversationStep() {
  clearMeetupTimer();
  if (!meetupConversationActive || meetupWaitingForChoice) return;
  const step = meetupConversation[meetupConversationIndex];
  if (!step) return;
  if (step.choices) {
    showMeetupChoices(step);
    return;
  }

  const bubble = step.side === 'girl' ? girlMeetupBubble : guyMeetupBubble;
  const otherBubble = step.side === 'girl' ? guyMeetupBubble : girlMeetupBubble;
  otherBubble.visible = false;
  typeMeetupBubble(bubble, step.text);
  performMeetupAction(step.action);
  meetupConversationIndex += 1;
  if (step.action !== 'finishConversation') {
    meetupLastTimer = window.setTimeout(runMeetupConversationStep, step.pause ?? Math.max(1200, step.text.length * 48));
  }
}

function startMeetupConversation() {
  meetupConversationActive = true;
  meetupConversationIndex = 0;
  meetupLoveActive = false;
  guyMeetupBubble.visible = false;
  girlMeetupBubble.visible = false;
  hideMeetupChoices();
  runMeetupConversationStep();
}

function startMeetupExit() {
  meetupConversationActive = false;
  hideMeetupChoices();
  guyMeetupBubble.visible = false;
  girlMeetupBubble.visible = false;
  meetupDoorFalling = true;
  meetupDoorReady = false;
  outdoorExitDoor.visible = true;
  outdoorExitDoor.position.y = doorDropStartY;
  meetupLastTimer = window.setTimeout(() => {
    meetupWalkingToDoor = true;
    meetupWalkStartedAt = clock.elapsedTime;
  }, 1300);
}

const starbucksConversation = [
  { speaker: 'barista', text: 'hi what would you like to order?' },
  { speaker: 'guy', text: 'i just want a caramel frappucino what do you want', action: 'memoryGameLater' },
];

function clearStarbucksTimer() {
  if (starbucksLastTimer) clearTimeout(starbucksLastTimer);
  starbucksLastTimer = null;
}

function getStarbucksBubble(speaker) {
  if (speaker === 'barista') return starbucksBaristaBubble;
  if (speaker === 'girl') return starbucksGirlBubble;
  return starbucksGuyBubble;
}

function hideStarbucksBubbles(except = null) {
  [starbucksBaristaBubble, starbucksGuyBubble, starbucksGirlBubble].forEach((bubble) => {
    if (bubble !== except) bubble.visible = false;
  });
}

function runSceneCircleWipe(onCovered, onDone) {
  const closeDuration = 1400;
  const coveredDuration = 520;
  const openDuration = 1100;
  sceneWipe.classList.remove('is-opening', 'is-covered', 'is-closing');
  sceneWipe.classList.add('is-closing');
  window.setTimeout(() => {
    sceneWipe.classList.remove('is-closing');
    sceneWipe.classList.add('is-covered');
    onCovered?.();
    window.setTimeout(() => {
      sceneWipe.classList.remove('is-covered');
      sceneWipe.classList.add('is-opening');
      window.setTimeout(() => {
        sceneWipe.classList.remove('is-opening');
        onDone?.();
      }, openDuration);
    }, coveredDuration);
  }, closeDuration);
}

function startStarbucksAfterPuzzle() {
  clearStarbucksTimer();
  starbucksConversationActive = false;
  hideStarbucksBubbles();
  const bubble = starbucksGirlBubble;
  typeMeetupBubble(bubble, "i'm gonna pick the same as you, just more less sugar.");
  starbucksLastTimer = window.setTimeout(() => {
    hideStarbucksBubbles();
    runSceneCircleWipe(() => {
      player.position.set(-1.45, 0, 1.62);
      starbucksGuy.position.set(-0.68, 0, 1.62);
      player.rotation.y = Math.PI;
      starbucksGuy.rotation.y = Math.PI;
      starbucksGirlDrink.visible = false;
      starbucksGuyDrink.visible = false;
      starbucksAtTable = false;
      starbucksPostPuzzlePhase = 'approach-counter';
      starbucksPostPuzzleStartedAt = clock.elapsedTime;
    });
  }, 4300);
}

function beginStarbucksExitHeartDrop() {
  if (starbucksExitHeart.visible || starbucksExitDoorUnlocked) return;
  starbucksCanMove = true;
  starbucksExitHeart.visible = true;
  starbucksExitHeartDropping = true;
  starbucksExitHeartLanded = false;
  starbucksExitHeartReady = true;
  starbucksExitHeart.position.copy(starbucksExitHeartDropPosition);
  starbucksExitHeart.scale.setScalar(0.9);
  if ('emissiveIntensity' in starbucksExitHeartMesh.material) starbucksExitHeartMesh.material.emissiveIntensity = 0.78;
  missionStatus.textContent = 'Follow the heart';
}

function enterStarbucksHeartFallenFocus() {
  currentArea = 'starbucks';
  roomLoading = false;
  root.visible = false;
  room.visible = false;
  outdoorArea.visible = false;
  starbucksOutdoorArea.visible = false;
  starbucksOutdoorGuy.visible = false;
  stopStarbucksOutdoorConversation();
  dog.visible = false;
  dogBubble.style.display = 'none';
  cuddleButton.classList.remove('is-visible');
  doorButton.classList.remove('is-visible');
  phoneButton.classList.remove('is-visible');
  loveGameButton.classList.remove('is-visible');
  hideMeetupChoices();
  clearMeetupTimer();
  guyMeetupBubble.visible = false;
  girlMeetupBubble.visible = false;
  clearStarbucksTimer();
  hideStarbucksBubbles();
  starbucksArea.visible = true;
  starbucksGuy.visible = true;
  barista.visible = true;
  barista.position.set(0, 0, -3.35);
  barista.rotation.y = 0;
  starbucksGirlDrink.visible = showGirlCoffeeCup;
  starbucksGuyDrink.visible = true;
  player.position.set(-1.15, 0, 1.25);
  player.rotation.y = Math.PI;
  starbucksGuy.position.set(-5.1, 0, 0.3);
  starbucksGuy.rotation.y = 0;
  starbucksAtTable = true;
  starbucksCanMove = true;
  starbucksConversationActive = false;
  starbucksWalkingToCounter = false;
  starbucksPostPuzzlePhase = 'table';
  starbucksExitDoorUnlocked = false;
  starbucksExitDoorFalling = false;
  starbucksExitDoorReady = false;
  starbucksExitDoor.visible = false;
  starbucksExitHeart.visible = true;
  starbucksExitHeartDropping = false;
  starbucksExitHeartLanded = true;
  starbucksExitHeartReady = true;
  starbucksExitHeart.position.copy(starbucksExitHeartLandedPosition);
  starbucksExitHeart.scale.setScalar(1);
  if ('emissiveIntensity' in starbucksExitHeartMesh.material) starbucksExitHeartMesh.material.emissiveIntensity = 0.78;
  missionStatus.textContent = 'Follow the heart';
  memoryCount.textContent = '0';
  memoryTotal.textContent = '3';
  cameraDistance = 5.8;
  yaw = Math.PI;
  stopMovementInput();
}

function runStarbucksConversationStep() {
  clearStarbucksTimer();
  if (!starbucksConversationActive) return;
  const step = starbucksConversation[starbucksConversationIndex];
  if (!step) return;
  const bubble = getStarbucksBubble(step.speaker);
  hideStarbucksBubbles(bubble);
  typeMeetupBubble(bubble, step.text);
  starbucksConversationIndex += 1;
  if (step.action === 'memoryGameLater') {
    openPuzzleSceneFromStarbucks(Math.max(1800, step.text.length * 58));
    return;
  }
  starbucksLastTimer = window.setTimeout(runStarbucksConversationStep, Math.max(1400, step.text.length * 52));
}

function startStarbucksConversation() {
  starbucksConversationActive = true;
  starbucksConversationIndex = 0;
  hideStarbucksBubbles();
  runStarbucksConversationStep();
}

function enterStarbucks() {
  currentArea = 'starbucks';
  root.visible = false;
  room.visible = false;
  outdoorArea.visible = false;
  starbucksOutdoorArea.visible = false;
  starbucksOutdoorGuy.visible = false;
  stopStarbucksOutdoorConversation();
  starbucksArea.visible = true;
  starbucksGuy.visible = true;
  barista.visible = true;
  starbucksGirlDrink.visible = false;
  starbucksGuyDrink.visible = false;
  starbucksGuy.position.set(-0.7, 0, 3.85);
  starbucksGuy.rotation.y = Math.PI;
  barista.position.set(0, 0, -3.35);
  barista.rotation.y = 0;
  player.position.set(-1.45, 0, 3.85);
  player.rotation.y = Math.PI;
  yaw = 0;
  cameraDistance = 5.8;
  meetupWalkingToDoor = false;
  meetupDoorReady = false;
  meetupDoorFalling = false;
  meetupLoveActive = false;
  meetupLoveHearts.forEach((heart) => {
    heart.visible = false;
  });
  clearMeetupTimer();
  hideMeetupChoices();
  guyMeetupBubble.visible = false;
  girlMeetupBubble.visible = false;
  starbucksStartedAt = clock.elapsedTime;
  starbucksWalkingToCounter = true;
  starbucksWalkStartedAt = clock.elapsedTime;
  starbucksPostPuzzlePhase = '';
  starbucksPostPuzzleStartedAt = 0;
  starbucksAtTable = false;
  starbucksCanMove = false;
  starbucksExitHeart.visible = false;
  starbucksExitHeartDropping = false;
  starbucksExitHeartLanded = false;
  starbucksExitDoorUnlocked = false;
  starbucksExitDoorFalling = false;
  starbucksExitDoorReady = false;
  starbucksExitDoor.visible = false;
  starbucksExitDoor.position.copy(starbucksExitDoorPosition);
  stopMovementInput();
}

function updateStarbucksScene(time) {
  if (currentArea !== 'starbucks') return;
  const girlStart = new THREE.Vector3(-1.45, 0, 3.85);
  const guyStart = new THREE.Vector3(-0.7, 0, 3.85);
  const girlCounter = new THREE.Vector3(-1.65, 0, 0.9);
  const guyCounter = new THREE.Vector3(-0.9, 0, 0.9);
  const girlPickupStart = new THREE.Vector3(-1.45, 0, 1.62);
  const guyPickupStart = new THREE.Vector3(-0.68, 0, 1.62);
  const girlPickup = new THREE.Vector3(-1.48, 0, 0.68);
  const guyPickup = new THREE.Vector3(-0.74, 0, 0.68);
  const girlTable = new THREE.Vector3(-5.1, 0, 1.55);
  const guyTable = new THREE.Vector3(-5.1, 0, 0.3);
  let walkProgress = 1;
  let stride = 0;
  let scriptedWalking = false;
  if (starbucksWalkingToCounter) {
    scriptedWalking = true;
    walkProgress = THREE.MathUtils.clamp((time - starbucksWalkStartedAt) / 2.6, 0, 1);
    const eased = THREE.MathUtils.smoothstep(walkProgress, 0, 1);
    player.position.lerpVectors(girlStart, girlCounter, eased);
    starbucksGuy.position.lerpVectors(guyStart, guyCounter, eased);
    stride = Math.sin(time * 8.4);
    rig.leftLeg.rotation.x = stride * 0.24;
    rig.rightLeg.rotation.x = -stride * 0.24;
    starbucksGuy.userData.leftLeg.rotation.x = -stride * 0.24;
    starbucksGuy.userData.rightLeg.rotation.x = stride * 0.24;
    if (walkProgress >= 1) {
      starbucksWalkingToCounter = false;
      startStarbucksConversation();
    }
  } else if (starbucksPostPuzzlePhase === 'approach-counter') {
    scriptedWalking = true;
    walkProgress = THREE.MathUtils.clamp((time - starbucksPostPuzzleStartedAt) / 1.65, 0, 1);
    const eased = THREE.MathUtils.smoothstep(walkProgress, 0, 1);
    player.position.lerpVectors(girlPickupStart, girlPickup, eased);
    starbucksGuy.position.lerpVectors(guyPickupStart, guyPickup, eased);
    stride = Math.sin(time * 9.2);
    rig.leftLeg.rotation.x = stride * 0.24;
    rig.rightLeg.rotation.x = -stride * 0.24;
    starbucksGuy.userData.leftLeg.rotation.x = -stride * 0.24;
    starbucksGuy.userData.rightLeg.rotation.x = stride * 0.24;
    if (walkProgress >= 1) {
      starbucksPostPuzzlePhase = 'to-table';
      starbucksPostPuzzleStartedAt = time;
      starbucksGirlDrink.visible = showGirlCoffeeCup;
      starbucksGuyDrink.visible = true;
    }
  } else if (starbucksPostPuzzlePhase === 'to-table') {
    scriptedWalking = true;
    walkProgress = THREE.MathUtils.clamp((time - starbucksPostPuzzleStartedAt) / 3.1, 0, 1);
    const eased = THREE.MathUtils.smoothstep(walkProgress, 0, 1);
    player.position.lerpVectors(girlPickup, girlTable, eased);
    starbucksGuy.position.lerpVectors(guyPickup, guyTable, eased);
    stride = Math.sin(time * 8.8);
    rig.leftLeg.rotation.x = stride * 0.25;
    rig.rightLeg.rotation.x = -stride * 0.25;
    starbucksGuy.userData.leftLeg.rotation.x = -stride * 0.25;
    starbucksGuy.userData.rightLeg.rotation.x = stride * 0.25;
    if (walkProgress >= 1) {
      starbucksPostPuzzlePhase = 'table';
      starbucksAtTable = true;
      beginStarbucksExitHeartDrop();
    }
  } else {
    if (!starbucksCanMove) {
      player.position.copy(starbucksAtTable ? girlTable : girlCounter);
      rig.leftLeg.rotation.x = 0;
      rig.rightLeg.rotation.x = 0;
    }
    starbucksGuy.position.copy(starbucksAtTable ? guyTable : guyCounter);
    starbucksGuy.userData.leftLeg.rotation.x = 0;
    starbucksGuy.userData.rightLeg.rotation.x = 0;
  }
  const walkingToTable = starbucksPostPuzzlePhase === 'to-table';
  const playerCanWalkFreely = starbucksCanMove && !scriptedWalking;
  if (!playerCanWalkFreely) {
    player.rotation.y = starbucksAtTable ? Math.PI : walkingToTable ? -Math.PI / 2 : Math.PI;
    avatar.position.y = avatarGroundOffset + (scriptedWalking ? Math.abs(stride) * 0.018 : Math.sin(time * 1.5) * 0.005);
    rig.torso.rotation.x = 0;
    rig.torso.rotation.z = 0.01 + (scriptedWalking ? Math.sin(time * 8.8) * 0.006 : 0);
  }
  if (!playerCanWalkFreely || starbucksGirlDrink.visible) {
    const freeWalkStride = playerCanWalkFreely ? Math.sin(time * 8.6) * walkStrength : 0;
    const heldCupStride = scriptedWalking ? stride : freeWalkStride;
    const heldCupIdle = Math.sin(time * 1.9) * (1 - Math.min(walkStrength, 1));
    rig.leftArm.rotation.z = starbucksGirlDrink.visible ? -0.66 + heldCupStride * 0.035 : -0.9;
    rig.rightArm.rotation.z = starbucksGirlDrink.visible ? 0.1 + heldCupStride * 0.045 + heldCupIdle * 0.012 : 0.48;
    rig.leftArm.rotation.x = 0.18 + heldCupStride * 0.055;
    rig.rightArm.rotation.x = starbucksGirlDrink.visible ? 0.34 + Math.abs(heldCupStride) * 0.03 + heldCupIdle * 0.01 : 0.06;
    rig.rightArm.rotation.y = starbucksGirlDrink.visible ? -0.08 + heldCupStride * 0.025 : 0;
    rig.head.rotation.x = -0.015 + Math.sin(time * 1.2) * 0.004;
    if (starbucksGirlDrink.visible) {
      const freeWalkBob = playerCanWalkFreely ? Math.abs(freeWalkStride) * 0.014 : 0;
      const scriptedBob = scriptedWalking ? Math.abs(stride) * 0.012 : 0;
      starbucksGirlDrink.position.set(0.42 + heldCupStride * 0.012, 1.02 + scriptedBob + freeWalkBob + heldCupIdle * 0.004, 0.28);
      starbucksGirlDrink.rotation.set(0.16 + heldCupStride * 0.018, 0, 0.08 - heldCupStride * 0.014);
    }
  }

  starbucksGuy.rotation.y = starbucksAtTable ? 0 : walkingToTable ? -Math.PI / 2 : Math.PI;
  starbucksGuy.userData.torso.rotation.x = 0;
  starbucksGuy.userData.head.rotation.x = -0.01 + Math.sin(time * 1.1) * 0.004;
  starbucksGuy.userData.leftArm.rotation.z = starbucksGuyDrink.visible ? -0.1 : -0.58;
  starbucksGuy.userData.rightArm.rotation.z = starbucksGuyDrink.visible ? 0.72 : 0.9;
  starbucksGuy.userData.leftArm.rotation.x = starbucksGuyDrink.visible ? 0.32 : 0.06;
  starbucksGuy.userData.rightArm.rotation.x = 0.18;

  barista.position.set(0, 0, -3.35);
  barista.rotation.y = 0;
  barista.userData.leftLeg.rotation.x = 0;
  barista.userData.rightLeg.rotation.x = 0;
  barista.userData.leftArm.rotation.z = -0.58 + Math.sin(time * 1.6) * 0.025;
  barista.userData.rightArm.rotation.z = 0.58 + Math.sin(time * 1.6 + Math.PI) * 0.025;

  starbucksBaristaBubble.position.copy(barista.position).add(new THREE.Vector3(0, 2.72, 0.1));
  starbucksGuyBubble.position.copy(starbucksGuy.position).add(new THREE.Vector3(0, 2.65, 0.15));
  starbucksGirlBubble.position.copy(player.position).add(new THREE.Vector3(0, 2.65, 0.15));
  starbucksBaristaBubble.lookAt(camera.position);
  starbucksGuyBubble.lookAt(camera.position);
  starbucksGirlBubble.lookAt(camera.position);
}

function updateStarbucksOutdoorScene(time) {
  if (currentArea !== 'starbucks-outdoor') return;
  const breathe = Math.sin(time * 1.55);
  const cupIdle = Math.sin(time * 2.05);
  walkStrength = THREE.MathUtils.lerp(walkStrength, 0, 0.18);

  if (freeRoamActive) {
    starbucksOutdoorGuy.visible = false;
    starbucksGirlDrink.visible = false;
    starbucksOutdoorGuyDrink.visible = false;
    hideStarbucksOutdoorBubbles();
    return;
  }

  if (starbucksWalletGameReady) {
    player.position.set(-0.72, 0, 2.74);
    player.rotation.y = Math.PI * 0.86;
    avatar.position.y = avatarGroundOffset + breathe * 0.006;
    avatar.rotation.z = -0.03 + breathe * 0.006;
    rig.torso.rotation.x = -0.02;
    rig.torso.rotation.z = -0.04;
    rig.leftLeg.rotation.x = 0;
    rig.rightLeg.rotation.x = 0;
    rig.leftLeg.rotation.z = -0.02;
    rig.rightLeg.rotation.z = 0.02;
    rig.leftArm.rotation.z = -0.18 + cupIdle * 0.018;
    rig.rightArm.rotation.z = 0.62 + cupIdle * 0.026;
    rig.leftArm.rotation.x = -0.08;
    rig.rightArm.rotation.x = 0.28 + cupIdle * 0.018;
    rig.rightArm.rotation.y = 0.04;
    rig.head.rotation.x = -0.08 + breathe * 0.008;
    starbucksGirlDrink.visible = false;
  } else {
    player.position.set(-1.2, 0, 3.05);
    player.rotation.y = Math.PI;
    avatar.position.y = avatarGroundOffset - 0.18 + breathe * 0.004;
    avatar.rotation.z = breathe * 0.003;
    rig.torso.rotation.x = -0.08 + breathe * 0.006;
    rig.torso.rotation.z = 0;
    rig.leftLeg.rotation.x = -1.1;
    rig.rightLeg.rotation.x = -1.1;
    rig.leftLeg.rotation.z = -0.08;
    rig.rightLeg.rotation.z = 0.08;
    rig.leftArm.rotation.z = -0.48 + cupIdle * 0.012;
    rig.rightArm.rotation.z = 0.18 + cupIdle * 0.018;
    rig.leftArm.rotation.x = 0.18 + cupIdle * 0.018;
    rig.rightArm.rotation.x = 0.52 + cupIdle * 0.018;
    rig.rightArm.rotation.y = -0.1 + cupIdle * 0.012;
    rig.head.rotation.x = -0.03 + breathe * 0.006;
    starbucksGirlDrink.visible = true;
    starbucksGirlDrink.position.set(0.41 + cupIdle * 0.006, 1.01 + cupIdle * 0.005, 0.29);
    starbucksGirlDrink.rotation.set(0.18 + cupIdle * 0.012, 0, 0.08 - cupIdle * 0.01);
  }

  starbucksOutdoorGuy.position.set(-1.2, 0, 0.95);
  starbucksOutdoorGuy.rotation.y = 0;
  starbucksOutdoorGuy.userData.torso.rotation.x = -0.06 + breathe * 0.005;
  starbucksOutdoorGuy.userData.head.rotation.x = -0.03 + Math.sin(time * 1.3) * 0.006;
  starbucksOutdoorGuy.userData.leftLeg.rotation.x = -1.05;
  starbucksOutdoorGuy.userData.rightLeg.rotation.x = -1.05;
  starbucksOutdoorGuy.userData.leftLeg.rotation.z = -0.06;
  starbucksOutdoorGuy.userData.rightLeg.rotation.z = 0.06;
  starbucksOutdoorGuy.userData.leftArm.rotation.z = -0.1 + cupIdle * 0.014;
  starbucksOutdoorGuy.userData.leftArm.rotation.x = 0.34 + cupIdle * 0.012;
  starbucksOutdoorGuy.userData.rightArm.rotation.z = 0.72 + cupIdle * 0.014;
  starbucksOutdoorGuy.userData.rightArm.rotation.x = 0.22 + cupIdle * 0.012;
  starbucksOutdoorGuyDrink.visible = true;
  starbucksOutdoorGuyDrink.position.set(-0.42 + cupIdle * 0.005, 1.03 + cupIdle * 0.005, 0.28);
  starbucksOutdoorGuyDrink.rotation.set(0.16 + cupIdle * 0.01, 0, 0.08);

  starbucksOutdoorGirlBubble.position.copy(player.position).add(new THREE.Vector3(0, 2.35, 0.2));
  starbucksOutdoorGuyBubble.position.copy(starbucksOutdoorGuy.position).add(new THREE.Vector3(0, 2.35, 0.2));
  starbucksOutdoorGirlBubble.lookAt(camera.position);
  starbucksOutdoorGuyBubble.lookAt(camera.position);

  starbucksBirds.forEach((bird, index) => {
    bird.visible = true;
    bird.position.x += 0.018 + bird.userData.speed * 0.004;
    bird.position.y = 4.05 + Math.sin(time * 1.45 + index) * 0.22 + (index % 3) * 0.18;
    bird.position.z = 0.15 + Math.sin(time * 0.36 + index * 0.8) * 1.15;
    const wingFlap = Math.sin(time * 10 + index) * 0.72;
    bird.userData.leftWing.rotation.z = wingFlap;
    bird.userData.rightWing.rotation.z = -wingFlap;
    if (bird.position.x > bird.userData.wrapMax) {
      bird.position.x = bird.userData.wrapMin - index * 0.45;
    }
  });

  if (starbucksProposalActive) {
    scene.background.lerp(new THREE.Color(0xffb6d4), 0.025);
    scene.fog.color.lerp(new THREE.Color(0xffb6d4), 0.025);
    starbucksProposalHearts.forEach((heart, index) => {
      const phase = time * 1.25 + index * 0.55;
      const side = index % 2 ? -1 : 1;
      heart.position.set(
        -1.2 + side * (0.45 + Math.sin(phase) * 0.26),
        1.55 + ((phase * 0.26) % 1) * 1.35,
        1.95 + Math.cos(phase * 0.8) * 0.52,
      );
      heart.rotation.y += 0.035;
      heart.rotation.z = Math.sin(phase) * 0.3;
      heart.material.transparent = true;
      heart.material.opacity = 0.7 + Math.sin(phase) * 0.18;
    });
    starbucksHeartClouds.children.forEach((cloud, index) => {
      const target = cloud.userData.targetScale || 0.6;
      cloud.scale.lerp(new THREE.Vector3(target, target, target), 0.018 + index * 0.004);
      cloud.position.x += Math.sin(time * 0.25 + index) * 0.002;
      cloud.lookAt(camera.position);
    });
  }
}

const starbucksOutdoorConversation = [
  { side: 'guy', text: "so how's life.. ?" },
  {
    side: 'girl',
    choices: [
      { text: "it's suck", correct: false },
      { text: "yeaa just trying to live everyday happy and keep going", correct: true },
      { text: "why u wanna know? ewh", correct: false },
    ],
  },
  { side: 'guy', text: 'then let me make your life colorfull everyday again..' },
  { side: 'girl', text: 'sorry?' },
  { side: 'guy', text: 'hahahaha nothing you r just cute' },
  {
    side: 'girl',
    choices: [
      { text: 'nah you to r cute', correct: true },
      { text: 'apasih, gajelas.', correct: false },
      { text: "yea i know i'm cute n slay", correct: false },
    ],
  },
  { side: 'guy', text: 'so what do you think bout me?' },
  { side: 'girl', text: 'hmmm' },
  {
    side: 'girl',
    choices: [
      { text: 'you look like a cute kiddo who lost somewhere else', correct: true },
      { text: "you just look like a predator guy. i don't like it. can we go home?", correct: false },
      { text: 'u r hot, can i kiss you?', correct: false },
    ],
  },
  { side: 'guy', text: 'really huh? kiddo guy?' },
  { side: 'guy', text: "u know there's something that i wanna tell you that i didn't wanna say in the text. and maybe you already know bout it." },
  { side: 'girl', text: 'what is it?' },
  { side: 'guy', text: "I'm in love with you Marvellyn, will you be mine ?", action: 'proposal' },
  {
    side: 'girl',
    proposalChoices: [
      { text: 'Yes. i want to be yours!', correct: true },
      { text: 'no', correct: false, runaway: true },
    ],
  },
];

function clearStarbucksOutdoorTimer() {
  if (starbucksOutdoorTimer) clearTimeout(starbucksOutdoorTimer);
  starbucksOutdoorTimer = null;
}

function addStarbucksOutdoorTimer(callback, delay) {
  clearStarbucksOutdoorTimer();
  starbucksOutdoorTimer = window.setTimeout(() => {
    starbucksOutdoorTimer = null;
    callback();
  }, delay);
}

function getOutdoorDialogueDelay(text, extra = 0) {
  return Math.max(3200, text.length * 92) + extra;
}

function clearProposalEndingTimers() {
  while (proposalEndingTimers.length) clearTimeout(proposalEndingTimers.pop());
}

function resetFinalEndingState() {
  finalWalletSequenceActive = false;
  finalWalletWalking = false;
  finalWalletDialogueIndex = 0;
  finalEndingActive = false;
  finalNo.style.transform = '';
  finalNo.style.left = '';
  finalNo.style.top = '';
  finalNo.style.right = '';
  starbucksHeartClouds.visible = false;
  proposalEnding.classList.remove('is-final', 'is-love-wipe');
}

function addProposalEndingTimer(callback, delay) {
  const timer = window.setTimeout(() => {
    const index = proposalEndingTimers.indexOf(timer);
    if (index >= 0) proposalEndingTimers.splice(index, 1);
    callback();
  }, delay);
  proposalEndingTimers.push(timer);
}

function populateProposalFireworks() {
  proposalFireworks.replaceChildren();
  for (let i = 0; i < 42; i += 1) {
    const burst = document.createElement('span');
    burst.style.left = `${6 + Math.random() * 88}%`;
    burst.style.top = `${5 + Math.random() * 54}%`;
    burst.style.animationDelay = `${Math.random() * 1.6}s`;
    burst.style.animationDuration = `${1.4 + Math.random() * 1.1}s`;
    burst.style.setProperty('--firework-scale', `${0.68 + Math.random() * 0.82}`);
    proposalFireworks.append(burst);
  }
}

function typeProposalEndingLines(lines, lineIndex = 0, charIndex = 0) {
  if (lineIndex >= lines.length) {
    addProposalEndingTimer(() => {
      proposalEnding.classList.remove('is-visible', 'is-white', 'is-game-over');
      proposalEnding.setAttribute('aria-hidden', 'true');
      proposalEndingLine.textContent = '';
      proposalFireworks.replaceChildren();
      prepareWalletGame();
    }, 2200);
    return;
  }

  const prefix = lineIndex === 0 ? '?: ' : '? ';
  const currentLine = `${prefix}${lines[lineIndex]}`;
  proposalEndingLine.textContent = currentLine.slice(0, charIndex);
  if (charIndex <= currentLine.length) {
    addProposalEndingTimer(() => typeProposalEndingLines(lines, lineIndex, charIndex + 1), 125);
    return;
  }
  addProposalEndingTimer(() => typeProposalEndingLines(lines, lineIndex + 1, 0), 1400);
}

function prepareWalletGame() {
  starbucksWalletGameReady = true;
  currentArea = 'starbucks-outdoor';
  starbucksOutdoorArea.visible = true;
  starbucksOutdoorGuy.visible = true;
  scene.background.set(0x8ed8ff);
  scene.fog.color.set(0x8ed8ff);
  setStarbucksProposalActive(false);
  hideStarbucksOutdoorBubbles();
  hideStarbucksOutdoorChoices();
  loveGameButton.classList.remove('is-visible');
  missionStatus.textContent = 'Find the wallet';
  cameraDistance = 5.8;
  yaw = Math.PI;
  stopMovementInput();
  addProposalEndingTimer(showWalletGamePrompt, 850);
}

function showWalletGamePrompt() {
  if (!starbucksWalletGameReady || currentArea !== 'starbucks-outdoor') return;
  starbucksOutdoorGuyBubble.visible = false;
  typeMeetupBubble(starbucksOutdoorGirlBubble, 'what the hell Bryan!, where do you put it?!?!?!?!');
  addProposalEndingTimer(() => {
    if (!starbucksWalletGameReady) return;
    loveGameButton.classList.add('is-visible');
  }, 5200);
}

function startProposalEndingSequence() {
  clearProposalEndingTimers();
  resetFinalEndingState();
  hideStarbucksOutdoorChoices();
  starbucksOutdoorConversationActive = false;
  starbucksOutdoorWaitingForChoice = false;
  starbucksWalletGameReady = false;
  populateProposalFireworks();
  proposalEnding.classList.add('is-visible', 'is-fireworks');
  proposalEnding.classList.remove('is-white', 'is-game-over');
  proposalEnding.setAttribute('aria-hidden', 'false');
  proposalEndingLine.textContent = '';
  addProposalEndingTimer(() => {
    proposalEnding.classList.add('is-white');
  }, 3600);
  addProposalEndingTimer(() => {
    proposalEnding.classList.remove('is-fireworks');
    proposalEnding.classList.add('is-game-over');
  }, 5000);
  addProposalEndingTimer(() => {
    typeProposalEndingLines(['WAIT AMO......', 'DO YOU SEE MY WALLET? ....................']);
  }, 15000);
}

function setStarbucksProposalActive(active) {
  starbucksProposalActive = active;
  starbucksHeartClouds.visible = active;
  starbucksProposalHearts.forEach((heart) => {
    heart.visible = active;
  });
  if (!active) {
    scene.background.set(0x8ed8ff);
    scene.fog.color.set(0x8ed8ff);
    starbucksHeartClouds.children.forEach((cloud) => cloud.scale.setScalar(0.04));
  }
}

function hideStarbucksOutdoorChoices() {
  meetupChoices.classList.remove('is-visible', 'is-proposal');
  meetupChoices.replaceChildren();
  starbucksOutdoorWaitingForChoice = false;
}

function moveRunawayChoice(button) {
  const x = -220 + Math.random() * 440;
  const y = -120 - Math.random() * 120;
  button.style.transform = `translate(${x}px, ${y}px) rotate(${(-8 + Math.random() * 16).toFixed(1)}deg)`;
}

function showStarbucksOutdoorChoices(step) {
  meetupChoices.replaceChildren();
  meetupChoices.classList.toggle('is-proposal', Boolean(step.proposalChoices));
  starbucksOutdoorWaitingForChoice = true;
  const feedback = document.createElement('div');
  feedback.className = 'meetup-choice-feedback';
  feedback.textContent = '';
  meetupChoices.append(feedback);
  const choices = step.choices || step.proposalChoices || [];
  choices.forEach((choice, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'meetup-choice';
    button.textContent = step.proposalChoices ? choice.text : `${index + 1}. ${choice.text}`;
    if (choice.runaway) {
      button.addEventListener('pointerenter', () => moveRunawayChoice(button));
      button.addEventListener('pointerdown', (event) => {
        event.preventDefault();
        moveRunawayChoice(button);
      });
    }
    button.addEventListener('click', (event) => {
      if (choice.runaway) {
        event.preventDefault();
        moveRunawayChoice(button);
        return;
      }
      if (!choice.correct) {
        meetupChoices.classList.remove('is-shaking');
        button.classList.add('is-wrong');
        feedback.textContent = "it doesnt go like this i think.";
        void meetupChoices.offsetWidth;
        meetupChoices.classList.add('is-shaking');
        if ('vibrate' in navigator) navigator.vibrate([35, 30, 35]);
        return;
      }
      hideStarbucksOutdoorChoices();
      const bubble = starbucksOutdoorGirlBubble;
      starbucksOutdoorGuyBubble.visible = false;
      typeMeetupBubble(bubble, choice.text);
      if (step.proposalChoices) {
        addStarbucksOutdoorTimer(startProposalEndingSequence, getOutdoorDialogueDelay(choice.text, 1200));
        return;
      }
      starbucksOutdoorConversationIndex += 1;
      addStarbucksOutdoorTimer(runStarbucksOutdoorConversationStep, getOutdoorDialogueDelay(choice.text, step.proposalChoices ? 900 : 450));
    });
    meetupChoices.append(button);
  });
  meetupChoices.classList.add('is-visible');
}

function runStarbucksOutdoorConversationStep() {
  clearStarbucksOutdoorTimer();
  if (!starbucksOutdoorConversationActive || starbucksOutdoorWaitingForChoice || currentArea !== 'starbucks-outdoor') return;
  const step = starbucksOutdoorConversation[starbucksOutdoorConversationIndex];
  if (!step) return;
  if (step.choices || step.proposalChoices) {
    showStarbucksOutdoorChoices(step);
    return;
  }

  const bubble = step.side === 'girl' ? starbucksOutdoorGirlBubble : starbucksOutdoorGuyBubble;
  const otherBubble = step.side === 'girl' ? starbucksOutdoorGuyBubble : starbucksOutdoorGirlBubble;
  otherBubble.visible = false;
  if (step.action === 'proposal') setStarbucksProposalActive(true);
  typeMeetupBubble(bubble, step.text);
  starbucksOutdoorConversationIndex += 1;
  addStarbucksOutdoorTimer(runStarbucksOutdoorConversationStep, getOutdoorDialogueDelay(step.text, step.action === 'proposal' ? 1400 : 0));
}

function startStarbucksOutdoorConversation() {
  clearStarbucksOutdoorTimer();
  hideStarbucksOutdoorChoices();
  hideStarbucksOutdoorBubbles();
  setStarbucksProposalActive(false);
  starbucksOutdoorConversationActive = true;
  starbucksOutdoorConversationIndex = 0;
  addStarbucksOutdoorTimer(runStarbucksOutdoorConversationStep, 1400);
}

function stopStarbucksOutdoorConversation() {
  starbucksOutdoorConversationActive = false;
  starbucksOutdoorConversationIndex = 0;
  clearStarbucksOutdoorTimer();
  clearProposalEndingTimers();
  starbucksWalletGameReady = false;
  loveGameButton.classList.remove('is-visible');
  closeMazeGame();
  hideStarbucksOutdoorChoices();
  setStarbucksProposalActive(false);
  hideStarbucksOutdoorSceneUi();
  proposalEnding.classList.remove('is-visible', 'is-fireworks', 'is-white', 'is-game-over');
  resetFinalEndingState();
  proposalEnding.setAttribute('aria-hidden', 'true');
  proposalEndingLine.textContent = '';
  proposalFireworks.replaceChildren();
}

function startWalletMazeTransition() {
  hideStarbucksOutdoorChoices();
  proposalEnding.classList.add('is-visible', 'is-white');
  proposalEnding.classList.remove('is-fireworks', 'is-game-over');
  proposalEnding.setAttribute('aria-hidden', 'false');
  proposalEndingLine.textContent = '';
  proposalFireworks.replaceChildren();
  missionStatus.textContent = 'Love Game 3/3';
  addProposalEndingTimer(openMazeGame, 900);
}

const finalWalletDialogue = [
  { side: 'girl', text: 'why r u so stubborn?!!?!!!' },
  { side: 'guy', text: 'hahahahaha atleast we find it!' },
  { side: 'girl', text: 'huhhh' },
  { side: 'guy', text: 'I love you, thanks for accepting me!', action: 'finalLoveSky' },
  { side: 'girl', text: 'I love you to..', action: 'finalGameOver' },
];

function returnToGadingWalkAfterMaze() {
  closeMazeGame();
  runSceneCircleWipe(() => {
    stopStarbucksOutdoorConversation();
    currentArea = 'next-part';
    starbucksWalletGameReady = false;
    finalWalletSequenceActive = true;
    finalWalletWalking = true;
    finalWalletWalkStartedAt = clock.elapsedTime;
    finalWalletDialogueIndex = 0;
    outdoorArea.visible = true;
    starbucksOutdoorArea.visible = false;
    starbucksOutdoorGuy.visible = false;
    randomGuy.visible = true;
    meetupTableProps.visible = false;
    meetupLoveActive = false;
    meetupLoveHearts.forEach((heart) => {
      heart.visible = false;
    });
    outdoorExitDoor.visible = false;
    hideMeetupChoices();
    guyMeetupBubble.visible = false;
    girlMeetupBubble.visible = false;
    player.position.set(-0.35, 0, 4.15);
    randomGuy.position.set(0.35, 0, 4.15);
    player.rotation.y = Math.PI;
    randomGuy.rotation.y = Math.PI;
    yaw = 0;
    cameraDistance = 5.2;
    missionStatus.textContent = 'Wallet found';
    scene.background.set(0x8ed8ff);
    scene.fog.color.set(0x8ed8ff);
    dog.visible = false;
    dogBubble.style.display = 'none';
    cuddleButton.classList.remove('is-visible');
    stopMovementInput();
  });
}

function runFinalWalletDialogue() {
  clearMeetupTimer();
  if (!finalWalletSequenceActive) return;
  const step = finalWalletDialogue[finalWalletDialogueIndex];
  if (!step) return;
  const bubble = step.side === 'girl' ? girlMeetupBubble : guyMeetupBubble;
  const otherBubble = step.side === 'girl' ? guyMeetupBubble : girlMeetupBubble;
  otherBubble.visible = false;
  typeMeetupBubble(bubble, step.text);
  if (step.action === 'finalLoveSky') {
    scene.background.set(0xffa6cc);
    scene.fog.color.set(0xffa6cc);
    starbucksHeartClouds.visible = true;
    starbucksHeartClouds.children.forEach((cloud, index) => {
      cloud.position.set(-4.6 + index * 4.5, 5.1 + index * 0.25, -3.8 - index * 0.75);
      cloud.scale.setScalar(0.08);
    });
    populateProposalFireworks();
    proposalEnding.classList.add('is-visible', 'is-fireworks');
    proposalEnding.classList.remove('is-white', 'is-game-over', 'is-final', 'is-love-wipe');
    proposalEnding.setAttribute('aria-hidden', 'false');
    proposalEndingLine.textContent = '';
    finalEndingActions.style.display = '';
  }
  finalWalletDialogueIndex += 1;
  const delay = Math.max(1900, step.text.length * 58) + (step.action === 'finalLoveSky' ? 1000 : 0);
  if (step.action === 'finalGameOver') {
    meetupLastTimer = window.setTimeout(showFinalGameOver, delay);
    return;
  }
  meetupLastTimer = window.setTimeout(runFinalWalletDialogue, delay);
}

function showFinalGameOver() {
  finalEndingActive = true;
  clearProposalEndingTimers();
  proposalEnding.classList.add('is-visible', 'is-love-wipe');
  proposalEnding.classList.remove('is-fireworks', 'is-white', 'is-game-over', 'is-final');
  proposalEnding.setAttribute('aria-hidden', 'false');
  proposalEndingLine.textContent = '';
  finalNo.style.transform = '';
  finalNo.style.left = '';
  finalNo.style.top = '';
  finalNo.style.right = '';
  proposalFireworks.replaceChildren();
  addProposalEndingTimer(() => {
    proposalEnding.classList.add('is-game-over', 'is-final');
    proposalEndingLine.textContent = 'Will you repeat this in another life?';
  }, 1750);
}

function moveFinalNoButton() {
  if (!finalEndingActive) return;
  const box = finalEndingActions.getBoundingClientRect();
  const buttonWidth = finalNo.offsetWidth || 130;
  const buttonHeight = finalNo.offsetHeight || 54;
  const maxLeft = Math.max(0, box.width - buttonWidth);
  const maxTop = Math.max(0, box.height + 120 - buttonHeight);
  const currentLeft = Number.parseFloat(finalNo.style.left || `${maxLeft}`) || maxLeft;
  const currentTop = Number.parseFloat(finalNo.style.top || '0') || 0;
  let nextLeft = Math.random() * maxLeft;
  let nextTop = Math.random() * maxTop;

  for (let i = 0; i < 8 && Math.hypot(nextLeft - currentLeft, nextTop - currentTop) < 120; i += 1) {
    nextLeft = Math.random() * maxLeft;
    nextTop = Math.random() * maxTop;
  }

  finalNo.style.right = 'auto';
  finalNo.style.left = `${nextLeft}px`;
  finalNo.style.top = `${nextTop}px`;
  finalNo.style.transform = `rotate(${(-16 + Math.random() * 32).toFixed(1)}deg)`;
}

function updateFinalWalletScene(time) {
  if (!finalWalletSequenceActive) return false;
  const girlTarget = new THREE.Vector3(-0.82, 0, -0.08);
  const guyTarget = new THREE.Vector3(0.82, 0, -0.08);
  if (finalWalletWalking) {
    yaw = 0;
    const progress = THREE.MathUtils.clamp((time - finalWalletWalkStartedAt) / 2.7, 0, 1);
    const eased = THREE.MathUtils.smoothstep(progress, 0, 1);
    player.position.lerpVectors(new THREE.Vector3(-0.35, 0, 4.15), girlTarget, eased);
    randomGuy.position.lerpVectors(new THREE.Vector3(0.35, 0, 4.15), guyTarget, eased);
    player.rotation.y = Math.PI;
    randomGuy.rotation.y = Math.PI;
    const stride = Math.sin(time * 8.4);
    rig.leftLeg.rotation.x = stride * 0.24;
    rig.rightLeg.rotation.x = -stride * 0.24;
    randomGuy.userData.leftLeg.rotation.x = -stride * 0.24;
    randomGuy.userData.rightLeg.rotation.x = stride * 0.24;
    if (progress >= 1) {
      finalWalletWalking = false;
      meetupLastTimer = window.setTimeout(runFinalWalletDialogue, 700);
    }
  } else {
    applyPlayerMeetupPose(time);
    applyGuyStandingPose(time);
  }

  guyMeetupBubble.position.copy(randomGuy.position).add(new THREE.Vector3(0, 2.55, 0));
  girlMeetupBubble.position.copy(player.position).add(new THREE.Vector3(0, 2.65, 0));
  guyMeetupBubble.lookAt(camera.position);
  girlMeetupBubble.lookAt(camera.position);
  if (starbucksHeartClouds.visible) {
    starbucksHeartClouds.children.forEach((cloud, index) => {
      const target = cloud.userData.targetScale || 0.6;
      cloud.scale.lerp(new THREE.Vector3(target, target, target), 0.02 + index * 0.004);
      cloud.position.x += Math.sin(time * 0.26 + index) * 0.002;
      cloud.lookAt(camera.position);
    });
  }
  return true;
}

function updateFreeRoamPortalDoors() {
  freeRoamPortalDoors.forEach((door) => {
    door.visible = freeRoamActive && door.userData.portalArea === currentArea;
    if (door.visible) door.position.y = doorGroundY;
  });
}

function getNearbyFreeRoamPortalDoor() {
  if (!freeRoamActive) return null;
  updateFreeRoamPortalDoors();
  return freeRoamPortalDoors.find((door) => (
    door.visible &&
    door.userData.portalArea === currentArea &&
    door.position.distanceTo(player.position) < 2.1
  )) || null;
}

function enterFreeRoamArea(area) {
  freeRoamActive = true;
  document.body.classList.add('final-free-roam');
  finalWalletSequenceActive = false;
  finalWalletWalking = false;
  finalEndingActive = false;
  starbucksWalletGameReady = false;
  starbucksOutdoorConversationActive = false;
  starbucksOutdoorWaitingForChoice = false;
  meetupConversationActive = false;
  meetupWaitingForChoice = false;
  meetupWalkingToDoor = false;
  meetupLoveActive = false;
  meetupLoveHearts.forEach((heart) => {
    heart.visible = false;
  });
  starbucksConversationActive = false;
  starbucksWalkingToCounter = false;
  starbucksAtTable = false;
  starbucksCanMove = true;
  clearMeetupTimer();
  clearStarbucksTimer();
  clearStarbucksOutdoorTimer();
  hideMeetupChoices();
  hideStarbucksBubbles();
  hideStarbucksOutdoorBubbles();
  hideStarbucksOutdoorChoices();
  proposalEnding.classList.remove('is-visible', 'is-fireworks', 'is-white', 'is-game-over', 'is-final', 'is-love-wipe');
  proposalEnding.setAttribute('aria-hidden', 'true');
  proposalEndingLine.textContent = '';
  proposalFireworks.replaceChildren();
  loveGameButton.classList.remove('is-visible');
  phoneButton.classList.remove('is-visible');
  cuddleButton.classList.remove('is-visible');

  currentArea = area;
  root.visible = area === 'tutorial-island';
  room.visible = area === 'bedroom';
  bigPhone.visible = area !== 'bedroom';
  bumbleLogo.visible = area !== 'bedroom';
  outdoorArea.visible = area === 'next-part';
  starbucksArea.visible = area === 'starbucks';
  starbucksOutdoorArea.visible = area === 'starbucks-outdoor';

  randomGuy.visible = false;
  starbucksGuy.visible = false;
  starbucksOutdoorGuy.visible = false;
  barista.visible = false;
  starbucksGirlDrink.visible = false;
  starbucksGuyDrink.visible = false;
  starbucksOutdoorGuyDrink.visible = false;
  girlMeetupBubble.visible = false;
  guyMeetupBubble.visible = false;
  meetupTableProps.visible = false;
  scene.background.set(0x8ed8ff);
  scene.fog.color.set(0x8ed8ff);

  if (area === 'tutorial-island') {
    player.position.set(0, 0, 1.2);
    player.rotation.y = 0;
    yaw = 0;
    cameraDistance = 6.2;
    missionStatus.textContent = 'Free roam';
  } else if (area === 'bedroom') {
    player.position.set(-0.2, 0, 1.65);
    player.rotation.y = Math.PI * 0.92;
    yaw = Math.PI;
    cameraDistance = 5.4;
    missionStatus.textContent = 'Bedroom';
  } else if (area === 'next-part') {
    player.position.set(-0.82, 0, -0.08);
    player.rotation.y = Math.PI / 2;
    yaw = Math.PI * 0.92;
    cameraDistance = 4.8;
    missionStatus.textContent = 'Gading Walk';
  } else if (area === 'starbucks') {
    player.position.set(-1.2, 0, 1.2);
    player.rotation.y = Math.PI;
    yaw = Math.PI;
    cameraDistance = 5.8;
    missionStatus.textContent = 'Starbucks';
  } else if (area === 'starbucks-outdoor') {
    player.position.set(-1.2, 0, 2.35);
    player.rotation.y = Math.PI;
    yaw = Math.PI;
    cameraDistance = 5.8;
    missionStatus.textContent = 'Starbucks outside';
  }

  dog.position.set(player.position.x + 1, 0.03, player.position.z + 0.8);
  dogTarget.copy(player.position);
  dogTarget.y = 0.03;
  dog.visible = true;
  dogBubble.style.display = '';
  dogBubble.textContent = dogFreeRoamMessages[Math.floor(Math.random() * dogFreeRoamMessages.length)];
  dogNextMessageAt = clock.elapsedTime + 3;
  pickDogTarget();
  updateFreeRoamPortalDoors();
  stopMovementInput();
}

function startFinalFreeRoam() {
  if (!finalEndingActive) return;
  proposalEnding.classList.remove('is-visible', 'is-fireworks', 'is-white', 'is-game-over', 'is-final', 'is-love-wipe');
  proposalEnding.setAttribute('aria-hidden', 'true');
  proposalEndingLine.textContent = '';
  proposalFireworks.replaceChildren();
  enterFreeRoamArea('bedroom');
}

function drawMazeGame() {
  if (!mazeContext) return;
  mazeContext.clearRect(0, 0, mazeCanvas.width, mazeCanvas.height);
  mazeContext.fillStyle = '#fff';
  mazeContext.fillRect(0, 0, mazeCanvas.width, mazeCanvas.height);
  mazeContext.save();
  mazeContext.shadowColor = 'rgb(0 0 0 / 22%)';
  mazeContext.shadowBlur = 8;
  mazeContext.shadowOffsetX = 2;
  mazeContext.shadowOffsetY = 2;
  mazeContext.strokeStyle = '#050505';
  mazeContext.lineWidth = mazeWallThickness;
  mazeContext.lineCap = 'round';
  mazeContext.lineJoin = 'round';
  mazeWalls.forEach(([x1, y1, x2, y2]) => {
    mazeContext.beginPath();
    mazeContext.moveTo(x1, y1);
    mazeContext.lineTo(x2, y2);
    mazeContext.stroke();
  });
  mazeContext.restore();

  mazeContext.fillStyle = '#111';
  mazeContext.font = '900 24px Arial, sans-serif';
  mazeContext.textAlign = 'center';
  mazeContext.fillText('START', 154, 98);
  mazeContext.beginPath();
  mazeContext.moveTo(156, 132);
  mazeContext.lineTo(140, 108);
  mazeContext.lineTo(172, 108);
  mazeContext.closePath();
  mazeContext.fill();
  mazeContext.save();
  mazeContext.translate(1360, 1416);
  mazeContext.beginPath();
  for (let i = 0; i < 10; i += 1) {
    const angle = -Math.PI / 2 + (i * Math.PI) / 5;
    const radius = i % 2 === 0 ? 28 : 11;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    if (i === 0) mazeContext.moveTo(x, y);
    else mazeContext.lineTo(x, y);
  }
  mazeContext.closePath();
  mazeContext.fill();
  mazeContext.restore();

  const size = mazePlayer.visualRadius * 2;
  mazeContext.save();
  mazeContext.beginPath();
  mazeContext.arc(mazePlayer.x, mazePlayer.y, mazePlayer.visualRadius, 0, Math.PI * 2);
  mazeContext.clip();
  if (mazePlayerImage.complete) {
    mazeContext.drawImage(mazePlayerImage, mazePlayer.x - mazePlayer.visualRadius, mazePlayer.y - mazePlayer.visualRadius, size, size);
  } else {
    mazeContext.fillStyle = '#ffb7c8';
    mazeContext.fill();
  }
  mazeContext.restore();
  mazeContext.lineWidth = 5;
  mazeContext.strokeStyle = '#ff7eb3';
  mazeContext.beginPath();
  mazeContext.arc(mazePlayer.x, mazePlayer.y, mazePlayer.visualRadius + 2, 0, Math.PI * 2);
  mazeContext.stroke();
}

function distanceToMazeWall(x, y, wall) {
  const [x1, y1, x2, y2] = wall;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const lengthSq = dx * dx + dy * dy || 1;
  const t = THREE.MathUtils.clamp(((x - x1) * dx + (y - y1) * dy) / lengthSq, 0, 1);
  const closestX = x1 + t * dx;
  const closestY = y1 + t * dy;
  return Math.hypot(x - closestX, y - closestY);
}

function isMazeWallPoint(x, y) {
  const minDistance = mazePlayer.collisionRadius + mazeWallThickness * 0.5;
  return mazeWalls.some((wall) => distanceToMazeWall(x, y, wall) < minDistance);
}

function canMoveMazePlayerTo(x, y) {
  const radius = mazePlayer.collisionRadius;
  if (
    x - radius < 28 ||
    y - radius < 28 ||
    x + radius > mazeCanvas.width - 28 ||
    y + radius > mazeCanvas.height - 28
  ) {
    return false;
  }
  const samples = [
    [0, 0],
    [radius, 0],
    [-radius, 0],
    [0, radius],
    [0, -radius],
    [radius * 0.72, radius * 0.72],
    [-radius * 0.72, radius * 0.72],
    [radius * 0.72, -radius * 0.72],
    [-radius * 0.72, -radius * 0.72],
  ];
  return samples.every(([dx, dy]) => !isMazeWallPoint(x + dx, y + dy));
}

function checkMazeGoal() {
  if (Math.hypot(mazePlayer.x - 1360, mazePlayer.y - 1416) < 54) {
    missionStatus.textContent = 'Wallet path found';
    mazeReady = false;
    window.setTimeout(returnToGadingWalkAfterMaze, 650);
  }
}

function moveMazePlayer(dx, dy) {
  if (!mazeOpen || !mazeReady) return;
  const distance = mazePlayer.step;
  for (let i = 0; i < distance; i += 1) {
    const nextX = mazePlayer.x + dx;
    const nextY = mazePlayer.y + dy;
    if (!canMoveMazePlayerTo(nextX, nextY)) {
      const slideOptions = dx
        ? [[0, -1], [0, 1]]
        : [[-1, 0], [1, 0]];
      const slid = slideOptions.some(([sx, sy]) => {
        const slideX = mazePlayer.x + sx;
        const slideY = mazePlayer.y + sy;
        if (!canMoveMazePlayerTo(slideX, slideY)) return false;
        mazePlayer.x = slideX;
        mazePlayer.y = slideY;
        return true;
      });
      if (!slid) break;
      continue;
    }
    mazePlayer.x = nextX;
    mazePlayer.y = nextY;
  }
  checkMazeGoal();
  drawMazeGame();
}

function openMazeGame() {
  proposalEnding.classList.remove('is-visible', 'is-white', 'is-game-over', 'is-fireworks');
  proposalEnding.setAttribute('aria-hidden', 'true');
  mazeOpen = true;
  mazeReady = true;
  mazePlayer.x = 110;
  mazePlayer.y = 120;
  mazeGame.classList.add('is-visible');
  mazeGame.setAttribute('aria-hidden', 'false');
  document.body.classList.add('maze-open');
  missionStatus.textContent = 'Find the pocket';
  drawMazeGame();
}

function closeMazeGame() {
  stopMazeButtonMove();
  mazeOpen = false;
  mazeGame.classList.remove('is-visible');
  mazeGame.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('maze-open');
}

mazePlayerImage.addEventListener('load', drawMazeGame);
mazePlayerImage.src = '/maze/round_clean_crop.png';

let mazeMoveDelayTimer = 0;
let mazeMoveRepeatTimer = 0;

function stopMazeButtonMove() {
  window.clearTimeout(mazeMoveDelayTimer);
  window.clearInterval(mazeMoveRepeatTimer);
  mazeMoveDelayTimer = 0;
  mazeMoveRepeatTimer = 0;
}

function bindMazeMoveButton(button, dx, dy) {
  button.addEventListener('pointerdown', (event) => {
    if (event.button !== 0 || !mazeOpen || !mazeReady) return;
    event.preventDefault();
    stopMazeButtonMove();
    button.setPointerCapture(event.pointerId);
    moveMazePlayer(dx, dy);
    mazeMoveDelayTimer = window.setTimeout(() => {
      mazeMoveRepeatTimer = window.setInterval(() => {
        moveMazePlayer(dx, dy);
      }, 70);
    }, 180);
  });

  button.addEventListener('pointerup', stopMazeButtonMove);
  button.addEventListener('pointercancel', stopMazeButtonMove);
  button.addEventListener('lostpointercapture', stopMazeButtonMove);
  button.addEventListener('click', (event) => {
    event.preventDefault();
    if (event.detail === 0) moveMazePlayer(dx, dy);
  });
}

bindMazeMoveButton(mazeUp, 0, -1);
bindMazeMoveButton(mazeDown, 0, 1);
bindMazeMoveButton(mazeLeft, -1, 0);
bindMazeMoveButton(mazeRight, 1, 0);
window.addEventListener('blur', stopMazeButtonMove);

finalNo.addEventListener('pointerdown', (event) => {
  event.preventDefault();
  moveFinalNoButton();
});
finalNo.addEventListener('click', (event) => {
  event.preventDefault();
  moveFinalNoButton();
});
finalYes.addEventListener('click', () => {
  startFinalFreeRoam();
});

loveGameButton.addEventListener('click', () => {
  if (!starbucksWalletGameReady) return;
  loveGameButton.classList.remove('is-visible');
  missionStatus.textContent = 'Love Game 3/3';
  starbucksOutdoorGirlBubble.visible = false;
  typeMeetupBubble(starbucksOutdoorGuyBubble, 'we need to find the way back to my pocket in Gading Walk...');
  addProposalEndingTimer(startWalletMazeTransition, 5200);
});

function updateMeetupScene(time, delta) {
  if (currentArea !== 'next-part') return;
  if (updateFinalWalletScene(time)) return;
  if (freeRoamActive) {
    randomGuy.visible = false;
    meetupTableProps.visible = false;
    guyMeetupBubble.visible = false;
    girlMeetupBubble.visible = false;
    hideMeetupChoices();
    return;
  }
  if (!meetupWalkingToDoor) applyPlayerMeetupPose(time);
  dog.visible = false;
  doorButton.classList.remove('is-visible');
  phoneButton.classList.remove('is-visible');
  if (meetupTableProps.visible && meetupTableProps.scale.x < 0.99) {
    meetupTableProps.scale.lerp(new THREE.Vector3(1, 1, 1), 0.18);
  }

  const elapsed = time - meetupStartedAt;
  const targetX = 1.32;
  if (!meetupGuySeated && !meetupWalkingToDoor) {
    const nextX = Math.min(targetX, randomGuy.position.x + delta * 1.35);
    randomGuy.position.x = nextX;
    randomGuy.position.y = 0;
    randomGuy.position.z = 3.8 - THREE.MathUtils.smoothstep(nextX, -5.4, targetX) * 3.9;
    randomGuy.rotation.y = Math.PI / 2;
    applyGuyWalkingPose(time);
    if (nextX >= targetX - 0.01 || elapsed > 5.2) {
      meetupGuySeated = true;
      randomGuy.position.set(targetX, 0, -0.08);
      startMeetupConversation();
    }
  } else if (!meetupWalkingToDoor) {
    applyGuyStandingPose(time);
  }

  if (meetupDoorFalling) {
    outdoorExitDoor.position.y = Math.max(0.02, outdoorExitDoor.position.y - delta * 5.8);
    if (outdoorExitDoor.position.y <= 0.021) {
      meetupDoorFalling = false;
      meetupDoorReady = true;
    }
  }

  if (meetupWalkingToDoor) {
    const progress = THREE.MathUtils.clamp((time - meetupWalkStartedAt) / 3.2, 0, 1);
    const eased = THREE.MathUtils.smoothstep(progress, 0, 1);
    const girlStart = new THREE.Vector3(-1.32, 0, -0.08);
    const guyStart = new THREE.Vector3(1.32, 0, -0.08);
    const girlEnd = new THREE.Vector3(-0.34, 0, 4.05);
    const guyEnd = new THREE.Vector3(0.34, 0, 4.05);
    player.position.lerpVectors(girlStart, girlEnd, eased);
    randomGuy.position.lerpVectors(guyStart, guyEnd, eased);
    player.rotation.y = 0;
    randomGuy.rotation.y = 0;
    const walkStride = Math.sin(time * 8);
    rig.leftLeg.rotation.x = walkStride * 0.24;
    rig.rightLeg.rotation.x = -walkStride * 0.24;
    randomGuy.userData.leftLeg.rotation.x = -walkStride * 0.24;
    randomGuy.userData.rightLeg.rotation.x = walkStride * 0.24;
    if (progress >= 1) {
      enterStarbucks();
      return;
    }
  }

  guyMeetupBubble.position.copy(randomGuy.position).add(new THREE.Vector3(0, 2.55, 0));
  girlMeetupBubble.position.copy(player.position).add(new THREE.Vector3(0, 2.65, 0));
  guyMeetupBubble.lookAt(camera.position);
  girlMeetupBubble.lookAt(camera.position);

  meetupLoveHearts.forEach((heart, index) => {
    heart.visible = meetupLoveActive;
    if (!meetupLoveActive) return;
    const phase = time * 1.35 + index * 0.82;
    const centerX = index % 2 ? randomGuy.position.x : player.position.x;
    heart.position.set(
      centerX + Math.sin(phase) * 0.32,
      2.25 + ((phase * 0.32) % 1) * 0.85,
      -0.08 + Math.cos(phase * 0.8) * 0.18,
    );
    heart.rotation.y += delta * 1.8;
    heart.rotation.z = Math.sin(phase) * 0.28;
    heart.material.opacity = 0.72 + Math.sin(phase) * 0.2;
    heart.material.transparent = true;
  });
}

function unlockDoor() {
  if (doorUnlocked) return;
  doorUnlocked = true;
  doorFalling = true;
  nextDoor.visible = true;
  nextDoor.position.y = doorDropStartY;
  dogBubble.textContent = "the next door is falling!";
}

function unlockBedroomDoor() {
  if (bedroomDoorUnlocked) return;
  bedroomDoorUnlocked = true;
  bedroomDoorFalling = true;
  bedroomDoorReady = false;
  bedroomDoor.visible = true;
  bedroomDoor.position.y = doorDropStartY;
  doorButton.classList.remove('is-visible');
}

function resetGameProgress() {
  currentArea = 'tutorial-island';
  freeRoamActive = false;
  puzzleSolved = false;
  puzzleMode = 'picture';
  puzzleHeart.visible = false;
  document.body.classList.remove('final-free-roam');
  bigPhone.visible = true;
  bumbleLogo.visible = true;
  meetupStartedAt = 0;
  meetupGuySeated = false;
  meetupConversationActive = false;
  meetupConversationIndex = 0;
  meetupWaitingForChoice = false;
  meetupDoorFalling = false;
  meetupDoorReady = false;
  meetupWalkingToDoor = false;
  meetupLoveActive = false;
  starbucksConversationActive = false;
  starbucksConversationIndex = 0;
  starbucksWalkingToCounter = false;
  starbucksPostPuzzlePhase = '';
  starbucksPostPuzzleStartedAt = 0;
  starbucksAtTable = false;
  starbucksCanMove = false;
  starbucksExitHeart.visible = false;
  starbucksExitHeartDropping = false;
  starbucksExitHeartLanded = false;
  starbucksExitDoorUnlocked = false;
  starbucksExitDoorFalling = false;
  starbucksExitDoorReady = false;
  clearStarbucksTimer();
  clearMeetupTimer();
  hideMeetupChoices();
  doorUnlocked = false;
  doorFalling = false;
  doorReady = false;
  bedroomDoorUnlocked = false;
  bedroomDoorFalling = false;
  bedroomDoorReady = false;
  doorPromptVisible = false;
  phonePromptVisible = false;
  roomLoading = false;
  closeBumbleApp();
  closeMediaViewer();
  closePhoneLaunch();
  collected = 0;
  memoryCount.textContent = '0';
  memoryTotal.textContent = '5';
  missionStatus.textContent = '';
  root.visible = true;
  room.visible = false;
  outdoorArea.visible = false;
  starbucksOutdoorArea.visible = false;
  starbucksOutdoorGuy.visible = false;
  starbucksArea.visible = false;
  starbucksGuy.visible = false;
  barista.visible = false;
  hideStarbucksBubbles();
  stopStarbucksOutdoorConversation();
  starbucksGirlDrink.visible = false;
  starbucksGuyDrink.visible = false;
  starbucksPostPuzzlePhase = '';
  starbucksAtTable = false;
  sceneWipe.classList.remove('is-closing', 'is-covered', 'is-opening');
  randomGuy.visible = false;
  guyMeetupBubble.visible = false;
  girlMeetupBubble.visible = false;
  meetupTableProps.visible = false;
  outdoorExitDoor.visible = false;
  outdoorExitDoor.position.set(0, doorDropStartY, 4.85);
  meetupLoveHearts.forEach((heart) => {
    heart.visible = false;
  });
  document.body.classList.remove('room-editor-mode');
  bumbleLogoPulseUntil = 0;
  bumbleLogo.scale.setScalar(1);
  bumbleLogo.position.copy(bumbleLogoBasePosition);
  bumbleLogoGlowMaterial.emissiveIntensity = 0.65;
  bigPhoneLight.intensity = 2.6;
  bigPhoneScreenMaterial.color.set(0xffffff);
  bigPhoneScreenMaterial.emissive.set(0xffffff);
  bigPhoneScreenMaterial.emissiveIntensity = 0.72;
  bigPhoneScreenMaterial.needsUpdate = true;
  bigPhoneGlowMaterial.color.set(0xffffff);
  bigPhoneGlowMaterial.emissive.set(0xfff4d8);
  bigPhoneGlowMaterial.emissiveIntensity = 1.05;
  dog.visible = false;
  dogBubble.style.display = 'none';
  loadingScreen.classList.remove('is-visible');
  doorButton.classList.remove('is-visible');
  phoneButton.classList.remove('is-visible');
  phoneScreenMaterial.map = null;
  phoneScreenMaterial.color.set(0x8fd8ff);
  phoneScreenMaterial.emissive.set(0x4db8ff);
  phoneScreenMaterial.needsUpdate = true;
  playerPhone.visible = false;
  bedPhoneScreen.scale.set(1, 1, 1);
  bigPhoneScreen.scale.set(1, 1, 1);
  nextDoor.visible = false;
  nextDoor.position.set(0, doorDropStartY, -5.35);
  bedroomDoor.visible = false;
  bedroomDoor.position.set(-0.2, doorDropStartY, 4.15);
  updateFreeRoamPortalDoors();
  markers.forEach((marker) => {
    marker.userData.collected = false;
    marker.userData.heart.material = glowMaterial;
    marker.userData.heart.material.color.set(0xffb7c8);
    marker.userData.heart.material.emissive.set(0xff6f9d);
  });
  scene.background.set(0x8ed8ff);
  scene.fog.color.set(0x8ed8ff);
  player.position.set(0, 0, 0);
  player.rotation.y = 0;
  dog.position.set(1.8, 0.03, 2.2);
  pickDogTarget();
  cameraDistance = 6.2;
  yaw = 0;
}

function enterBedroom() {
  currentArea = 'bedroom';
  doorButton.classList.remove('is-visible');
  root.visible = false;
  outdoorArea.visible = false;
  dog.visible = false;
  dogBubble.style.display = 'none';
  cuddleButton.classList.remove('is-visible');
  room.visible = true;
  setRoomEditorActive(roomEditorActive);
  scene.background.set(0x8ed8ff);
  scene.fog.color.set(0x8ed8ff);
  player.position.set(-0.2, 0, 1.65);
  player.rotation.y = Math.PI * 0.92;
  yaw = Math.PI;
  playerPhone.visible = false;
  cameraDistance = 5.4;
  bumbleLogoPulseUntil = 0;
  bumbleLogo.scale.setScalar(1);
  bumbleLogo.position.copy(bumbleLogoBasePosition);
  bumbleLogoGlowMaterial.emissiveIntensity = 0.65;
  bigPhoneLight.intensity = 2.6;
  bigPhoneScreenMaterial.color.set(0xffffff);
  bigPhoneScreenMaterial.emissive.set(0xffffff);
  bigPhoneScreenMaterial.emissiveIntensity = 0.72;
  bigPhoneScreenMaterial.needsUpdate = true;
  bigPhoneGlowMaterial.color.set(0xffffff);
  bigPhoneGlowMaterial.emissive.set(0xfff4d8);
  bigPhoneGlowMaterial.emissiveIntensity = 1.05;
  stopMovementInput();
  setTimeout(() => {
    phoneScreenMaterial.map = phoneLogoTexture;
    phoneScreenMaterial.color.set(0xffffff);
    phoneScreenMaterial.emissive.set(0x222222);
    phoneScreenMaterial.needsUpdate = true;
    bedPhoneScreen.scale.set(1.05, 1.12, 1.05);
    bigPhoneScreen.scale.set(1.06, 1.06, 1.06);
  }, 650);
}

function startRoomLoading() {
  const portalDoor = getNearbyFreeRoamPortalDoor();
  if (portalDoor && !roomLoading) {
    roomLoading = true;
    stopMovementInput();
    runSceneCircleWipe(() => {
      enterFreeRoamArea(portalDoor.userData.portalDestination);
      roomLoading = false;
    });
    return;
  }

  const usingBedroomDoor = currentArea === 'bedroom' && bedroomDoorReady;
  const usingTutorialDoor = currentArea === 'tutorial-island' && doorReady;
  const usingStarbucksDoor = currentArea === 'starbucks' && starbucksExitDoorReady;
  if ((!usingBedroomDoor && !usingTutorialDoor && !usingStarbucksDoor) || roomLoading) return;
  roomLoading = true;
  stopMovementInput();
  if (usingStarbucksDoor) {
    runSceneCircleWipe(() => {
      enterStarbucksOutdoor();
      roomLoading = false;
    });
    return;
  }
  loadingScreen.classList.add('is-visible');
  setTimeout(() => {
    loadingScreen.classList.remove('is-visible');
    roomLoading = false;
    if (usingBedroomDoor) {
      enterNextPart();
    } else {
      enterBedroom();
    }
  }, 900);
}

function enterStarbucksOutdoor() {
  currentArea = 'starbucks-outdoor';
  roomLoading = false;
  starbucksCanMove = true;
  root.visible = false;
  room.visible = false;
  outdoorArea.visible = false;
  dog.visible = false;
  dogBubble.style.display = 'none';
  cuddleButton.classList.remove('is-visible');
  doorButton.classList.remove('is-visible');
  phoneButton.classList.remove('is-visible');
  loveGameButton.classList.remove('is-visible');
  starbucksArea.visible = false;
  starbucksGuy.visible = false;
  barista.visible = false;
  hideStarbucksBubbles();
  starbucksExitDoorReady = false;
  starbucksExitDoor.visible = false;
  starbucksOutdoorArea.visible = true;
  starbucksOutdoorGuy.visible = true;
  starbucksGirlDrink.visible = true;
  starbucksGuyDrink.visible = false;
  player.position.set(-1.2, 0, 3.05);
  player.rotation.y = Math.PI;
  starbucksOutdoorGuy.position.set(-1.2, 0, 0.95);
  starbucksOutdoorGuy.rotation.y = 0;
  starbucksOutdoorGuy.userData.leftLeg.rotation.x = 0;
  starbucksOutdoorGuy.userData.rightLeg.rotation.x = 0;
  starbucksOutdoorGuy.userData.leftArm.rotation.z = -0.1;
  starbucksOutdoorGuy.userData.leftArm.rotation.x = 0.32;
  starbucksOutdoorGuy.userData.rightArm.rotation.z = 0.72;
  starbucksOutdoorGuy.userData.rightArm.rotation.x = 0.18;
  missionStatus.textContent = 'Starbucks outside';
  cameraDistance = 5.8;
  yaw = Math.PI;
  stopMovementInput();
  startStarbucksOutdoorConversation();
}

function enterNextPart() {
  currentArea = 'next-part';
  roomLoading = false;
  bedroomDoorReady = false;
  bedroomDoor.visible = false;
  root.visible = false;
  room.visible = false;
  starbucksArea.visible = false;
  starbucksOutdoorArea.visible = false;
  starbucksOutdoorGuy.visible = false;
  stopStarbucksOutdoorConversation();
  starbucksGuy.visible = false;
  barista.visible = false;
  hideStarbucksBubbles();
  starbucksGirlDrink.visible = false;
  starbucksGuyDrink.visible = false;
  starbucksConversationActive = false;
  starbucksConversationIndex = 0;
  starbucksWalkingToCounter = false;
  starbucksPostPuzzlePhase = '';
  starbucksAtTable = false;
  clearStarbucksTimer();
  outdoorArea.visible = true;
  randomGuy.visible = true;
  randomGuy.position.set(-5.4, 0, 3.8);
  randomGuy.rotation.y = Math.PI / 2;
  meetupStartedAt = clock.elapsedTime;
  meetupGuySeated = false;
  meetupConversationActive = false;
  meetupConversationIndex = 0;
  meetupWaitingForChoice = false;
  meetupDoorFalling = false;
  meetupDoorReady = false;
  meetupWalkingToDoor = false;
  meetupLoveActive = false;
  clearMeetupTimer();
  hideMeetupChoices();
  guyMeetupBubble.visible = false;
  girlMeetupBubble.visible = false;
  meetupTableProps.visible = false;
  meetupTableProps.scale.setScalar(1);
  outdoorExitDoor.visible = false;
  outdoorExitDoor.position.set(0, doorDropStartY, 4.85);
  doorButton.classList.remove('is-visible');
  phoneButton.classList.remove('is-visible');
  missionStatus.textContent = 'Next mission';
  memoryCount.textContent = '0';
  memoryTotal.textContent = '3';
  player.position.set(-0.82, 0, -0.08);
  player.rotation.y = Math.PI / 2;
  yaw = Math.PI * 0.92;
  cameraDistance = 4.6;
  scene.background.set(0x8ed8ff);
  scene.fog.color.set(0x8ed8ff);
  stopMovementInput();
}

function updateDoor(delta, time) {
  if (doorUnlocked) {
    doorHeart.rotation.y += 0.05;
    doorHeart.position.y = 1.35 + Math.sin(time * 2.8) * 0.06;

    if (doorFalling) {
      nextDoor.position.y = Math.max(doorGroundY, nextDoor.position.y - delta * 7.5);
      if (nextDoor.position.y <= doorGroundY + 0.001) {
        doorFalling = false;
        doorReady = true;
        dogBubble.textContent = "go through the door!";
      }
    }
  }

  if (bedroomDoorUnlocked) {
    if (bedroomDoorFalling) {
      bedroomDoor.position.y = Math.max(doorGroundY, bedroomDoor.position.y - delta * 6.2);
      if (bedroomDoor.position.y <= doorGroundY + 0.001) {
        bedroomDoorFalling = false;
        bedroomDoorReady = true;
      }
    }
  }

  if (starbucksExitDoorUnlocked) {
    if (starbucksExitDoorFalling) {
      starbucksExitDoor.position.y = Math.max(doorGroundY, starbucksExitDoor.position.y - delta * 6.2);
      if (starbucksExitDoor.position.y <= doorGroundY + 0.001) {
        starbucksExitDoorFalling = false;
        starbucksExitDoorReady = true;
      }
    }
  }

  const nearTutorialDoor = !freeRoamActive && doorReady && currentArea === 'tutorial-island' && nextDoor.position.distanceTo(player.position) < 1.75;
  const nearBedroomDoor = !freeRoamActive && bedroomDoorReady && currentArea === 'bedroom' && bedroomDoor.position.distanceTo(player.position) < 2.05;
  const nearStarbucksDoor = !freeRoamActive && starbucksExitDoorReady && currentArea === 'starbucks' && starbucksExitDoor.position.distanceTo(player.position) < 2.05;
  const nearbyPortalDoor = getNearbyFreeRoamPortalDoor();
  const activeDoor = nearbyPortalDoor || (nearStarbucksDoor ? starbucksExitDoor : nearBedroomDoor ? bedroomDoor : nextDoor);
  const nearDoor = nearTutorialDoor || nearBedroomDoor || nearStarbucksDoor || Boolean(nearbyPortalDoor);
  doorPromptVisible = nearDoor && !roomLoading;
  doorButton.classList.toggle('is-visible', doorPromptVisible);

  if (doorPromptVisible) {
    doorScreenPosition.set(activeDoor.position.x, activeDoor.position.y + 2.55, activeDoor.position.z);
    doorScreenPosition.project(camera);
    const width = window.visualViewport?.width || window.innerWidth;
    const height = window.visualViewport?.height || window.innerHeight;
    doorButton.style.left = `${(doorScreenPosition.x * 0.5 + 0.5) * width}px`;
    doorButton.style.top = `${(-doorScreenPosition.y * 0.5 + 0.5) * height}px`;
  }
}

function updatePuzzleHeart(time, delta) {
  if (currentArea !== 'bedroom' || !puzzleHeart.visible || puzzleSolved) return;

  puzzleHeart.rotation.y += delta * (puzzleHeartDropping ? 2.8 : 1.45);
  puzzleHeartMesh.position.y = 0.68 + Math.sin(time * 3.1) * 0.055;
  puzzleHeartMesh.material.emissiveIntensity = THREE.MathUtils.lerp(
    puzzleHeartMesh.material.emissiveIntensity,
    puzzleHeartDropping ? 0.95 : 0.42 + Math.sin(time * 3.6) * 0.16,
    0.12,
  );

  if (puzzleHeartDropping) {
    puzzleHeart.position.y = Math.max(0.08, puzzleHeart.position.y - delta * 3.1);
    if (puzzleHeart.position.y <= 0.081) {
      puzzleHeartDropping = false;
      puzzleHeartLanded = true;
      puzzleHeart.position.y = 0.08;
      puzzleHeart.scale.setScalar(1);
    }
    return;
  }

  puzzleHeart.position.y = 0.08 + Math.sin(time * 2.2) * 0.035;
  const heartFlat = new THREE.Vector2(puzzleHeart.position.x, puzzleHeart.position.z);
  const playerFlat = new THREE.Vector2(player.position.x, player.position.z);
  const distanceToHeart = heartFlat.distanceTo(playerFlat);
  if (distanceToHeart > 1.9) puzzleHeartReadyToOpen = true;
  if (puzzleHeartLanded && puzzleHeartReadyToOpen && distanceToHeart < 1.35) {
    openPuzzleScene();
  }
}

function updateStarbucksExitHeart(time, delta) {
  if (currentArea !== 'starbucks' || !starbucksExitHeart.visible || starbucksExitDoorUnlocked) return;

  starbucksExitHeart.rotation.y += delta * (starbucksExitHeartDropping ? 2.8 : 1.45);
  starbucksExitHeartMesh.position.y = 0.58 + Math.sin(time * 3.1) * 0.055;
  if (starbucksExitHeartDropping) {
    starbucksExitHeart.position.y = Math.max(0.08, starbucksExitHeart.position.y - delta * 3.1);
    if (starbucksExitHeart.position.y <= 0.081) {
      starbucksExitHeartDropping = false;
      starbucksExitHeartLanded = true;
      starbucksExitHeart.position.y = 0.08;
      starbucksExitHeart.scale.setScalar(1);
    }
    return;
  }

  starbucksExitHeart.position.y = 0.08 + Math.sin(time * 2.2) * 0.035;
  const heartFlat = new THREE.Vector2(starbucksExitHeart.position.x, starbucksExitHeart.position.z);
  const playerFlat = new THREE.Vector2(player.position.x, player.position.z);
  const distanceToHeart = heartFlat.distanceTo(playerFlat);
  if (distanceToHeart > 1.9) starbucksExitHeartReady = true;
  if (starbucksExitHeartLanded && starbucksExitHeartReady && distanceToHeart < 1.35) {
    starbucksExitHeartReady = false;
    starbucksExitHeart.visible = false;
    starbucksExitDoorUnlocked = true;
    starbucksExitDoorFalling = true;
    starbucksExitDoorReady = false;
    starbucksExitDoor.visible = true;
    starbucksExitDoor.position.copy(starbucksExitDoorPosition);
    missionStatus.textContent = 'Door unlocked';
  }
}

function updatePhonePrompt() {
  const nearPhone = currentArea === 'bedroom' && !bumbleOpen && !mediaOpen && !phoneLaunchOpen && isPlayerNearBigPhone();
  phonePromptVisible = nearPhone;
  phoneButton.classList.toggle('is-visible', phonePromptVisible);

  if (phonePromptVisible) {
    phoneScreenPosition.set(bigPhone.position.x, bigPhone.position.y + 1.45, bigPhone.position.z + 0.28);
    phoneScreenPosition.project(camera);
    const width = window.visualViewport?.width || window.innerWidth;
    const height = window.visualViewport?.height || window.innerHeight;
    phoneButton.style.left = `${(phoneScreenPosition.x * 0.5 + 0.5) * width}px`;
    phoneButton.style.top = `${(-phoneScreenPosition.y * 0.5 + 0.5) * height}px`;
  }
}

function updateMarkers(time) {
  if (tutorialActive || currentArea !== 'tutorial-island') return;
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
      if (collected >= markers.length) {
        unlockDoor();
      }
    }
  });
}

function updateDog(time, delta) {
  if (!tutorialActive && !freeRoamActive) {
    dog.visible = false;
    dogBubble.style.display = 'none';
    cuddleButton.classList.remove('is-visible');
    return;
  }

  const freeRoamDogAllowed = freeRoamActive && (
    currentArea === 'tutorial-island' ||
    currentArea === 'bedroom' ||
    currentArea === 'next-part' ||
    currentArea === 'starbucks' ||
    currentArea === 'starbucks-outdoor'
  );
  const dogAllowed =
    currentArea === 'tutorial-island' ||
    currentArea === 'bedroom' ||
    currentArea === 'starbucks-outdoor' ||
    freeRoamDogAllowed;
  if (!dogAllowed) {
    dog.visible = false;
    dogBubble.style.display = 'none';
    return;
  }
  dog.visible = true;
  dogBubble.style.display = '';
  const distanceToPlayer = dog.position.distanceTo(player.position);
  dogPlayful = gameStarted && !tutorialActive && distanceToPlayer < 1.7;
  const isCuddling = time < cuddleUntil;

  if (dogPlayful !== lastDogPlayful) {
    if (freeRoamActive) {
      dogBubble.textContent = dogPlayful
        ? "i need pet pet"
        : dogFreeRoamMessages[Math.floor(Math.random() * dogFreeRoamMessages.length)];
    } else {
      dogBubble.textContent = dogPlayful ? "cuddle mot mot?" : "woof! follow the hearts";
    }
    dogNextMessageAt = time + 3;
    cuddleButton.classList.toggle('is-visible', dogPlayful);
    lastDogPlayful = dogPlayful;
  }

  cuddleButton.classList.toggle('is-visible', dogPlayful);

  if (freeRoamActive) {
    dogTarget.copy(player.position);
    dogTarget.y = 0.03;
  }

  const toTarget = dogTarget.clone().sub(dog.position);
  toTarget.y = 0;

  if (!freeRoamActive && !isCuddling && toTarget.length() < 0.22) {
    pickDogTarget();
  }

  const speed = freeRoamActive ? 2.35 : dogPlayful ? 1.05 : 0.75;
  const direction = dogTarget.clone().sub(dog.position);
  direction.y = 0;
  const followDistance = freeRoamActive ? 1.15 : 0.1;
  const isWalking = !isCuddling && direction.lengthSq() > followDistance * followDistance;

  if (isWalking) {
    direction.normalize();
    dog.position.addScaledVector(direction, speed * delta);
    dog.rotation.y = lerpAngle(dog.rotation.y, Math.atan2(direction.x, direction.z) - Math.PI / 2, 0.08);
  } else if (isCuddling) {
    const toPlayer = player.position.clone().sub(dog.position);
    toPlayer.y = 0;
    if (toPlayer.lengthSq() > 0.001) {
      toPlayer.normalize();
      dog.rotation.y = lerpAngle(dog.rotation.y, Math.atan2(toPlayer.x, toPlayer.z) - Math.PI / 2, 0.14);
    }
  }

  const bounceSpeed = isCuddling ? 12 : freeRoamActive && isWalking ? 8 : dogPlayful ? 7 : 4.2;
  dog.position.y = 0.03 + Math.abs(Math.sin(time * bounceSpeed)) * (isCuddling ? 0.075 : freeRoamActive && isWalking ? 0.09 : dogPlayful ? 0.035 : 0.012);
  dog.scale.setScalar(isCuddling ? 1 + Math.sin(time * 18) * 0.04 : 1);
  dogBody.rotation.x = Math.sin(time * (isCuddling ? 9 : 3.8)) * (isCuddling ? 0.1 : 0.04);
  dogHead.rotation.z = Math.sin(time * (isCuddling ? 8 : 2.2)) * (isCuddling ? 0.13 : dogPlayful ? 0.08 : 0.04);
  dogTail.rotation.z = -0.72 + Math.sin(time * (isCuddling ? 18 : dogPlayful ? 13 : 8)) * (isCuddling ? 0.62 : dogPlayful ? 0.48 : 0.34);
  dogLegs.forEach((leg, index) => {
    leg.rotation.x = Math.sin(time * (isCuddling ? 13 : 7.2) + index * Math.PI) * (isCuddling ? 0.32 : isWalking ? 0.24 : 0.04);
  });

  if (!isCuddling && time > dogNextMessageAt) {
    const messages = freeRoamActive ? dogFreeRoamMessages : dogBubbleMessages;
    dogBubble.textContent = messages[Math.floor(Math.random() * messages.length)];
    dogNextMessageAt = time + 4 + Math.random() * 4;
  }

  dogScreenPosition.set(dog.position.x, dog.position.y + 0.9, dog.position.z);
  dogScreenPosition.project(camera);
  const width = window.visualViewport?.width || window.innerWidth;
  const height = window.visualViewport?.height || window.innerHeight;
  dogBubble.style.left = `${(dogScreenPosition.x * 0.5 + 0.5) * width}px`;
  dogBubble.style.top = `${(-dogScreenPosition.y * 0.5 + 0.5) * height}px`;
}

function resize() {
  updateAppViewport();
  const width = window.visualViewport?.width || window.innerWidth;
  const height = window.visualViewport?.height || window.innerHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
}

window.addEventListener('resize', resize);
window.addEventListener('orientationchange', () => setTimeout(resize, 250));
document.addEventListener('fullscreenchange', resize);
window.visualViewport?.addEventListener('resize', resize);

const clock = new THREE.Clock();

loadEditorAssetCatalog();

function tick() {
  const delta = Math.min(clock.getDelta(), 0.033);
  const time = clock.elapsedTime;

  updateInput();
  updatePlayer(delta);
  updateMeetupScene(time, delta);
  updateStarbucksScene(time);
  updateStarbucksOutdoorScene(time);
  updateTypedBubbles(time);
  updateCamera();
  updateRoomWalls();
  updateBumbleLogo(time, delta);
  updatePuzzleHeart(time, delta);
  updateStarbucksExitHeart(time, delta);
  updateMarkers(time);
  updateDoor(delta, time);
  updatePhonePrompt();
  updateDog(time, delta);
  updateFace(time);

  root.rotation.y = Math.sin(time * 0.15) * 0.025;
  clouds.forEach((cloud) => {
    cloud.position.x += delta * cloud.userData.speed;
    cloud.position.y += Math.sin(time * 0.35 + cloud.userData.floatOffset) * delta * 0.035;
    if (cloud.position.x > cloud.userData.wrapMax) {
      cloud.position.x = cloud.userData.wrapMin;
      cloud.position.z = cloud.userData.overhead ? -5 + Math.random() * 14 : -12 - Math.random() * 18;
      cloud.position.y = cloud.userData.overhead ? 4.75 + Math.random() * 1.3 : 5.6 + Math.random() * 3.8;
    }
  });
  birds.forEach((bird) => {
    bird.position.x += delta * bird.userData.speed;
    bird.position.y += Math.sin(time * 1.4 + bird.userData.floatOffset) * delta * 0.12;
    const wingFlap = Math.sin(time * 8.5 + bird.userData.floatOffset) * 0.55;
    bird.userData.leftWing.rotation.z = wingFlap;
    bird.userData.rightWing.rotation.z = -wingFlap;
    if (bird.position.x > bird.userData.wrapMax) {
      bird.position.x = bird.userData.wrapMin;
      bird.position.y = 5.25 + Math.random() * 2.2;
      bird.position.z = -8 - Math.random() * 14;
      bird.scale.setScalar(0.85 + Math.random() * 0.55);
    }
  });

  renderer.render(scene, camera);
  requestAnimationFrame(tick);
}

tick();
