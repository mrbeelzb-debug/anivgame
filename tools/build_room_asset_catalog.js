import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const assetRoot = path.join(root, 'asset', 'room asset');
const modelRoot = path.join(assetRoot, 'Models');
const sideRoot = path.join(assetRoot, 'Side');
const publicModelRoot = path.join(root, 'public', 'room-models');
const publicThumbRoot = path.join(root, 'public', 'room-assets');
const catalogPath = path.join(publicModelRoot, 'catalog.json');

const formatFolders = [
  { folder: 'GLTF format', extensions: ['.glb', '.gltf'], priority: 0 },
  { folder: 'FBX format', extensions: ['.fbx'], priority: 1 },
  { folder: 'OBJ format', extensions: ['.obj'], priority: 2 },
  { folder: 'STL format', extensions: ['.stl'], priority: 3 },
  { folder: 'DAE format', extensions: ['.dae'], priority: 4 },
];

const floorNames = new Set(['rugDoormat', 'rugRectangle', 'rugRound', 'rugRounded', 'rugSquare']);
const wallNames = new Set([
  'bathroomMirror',
  'ceilingFan',
  'doorway',
  'doorwayFront',
  'doorwayOpen',
  'wall',
  'wallCorner',
  'wallCornerRond',
  'wallDoorway',
  'wallDoorwayWide',
  'wallHalf',
  'wallWindow',
  'wallWindowSlide',
]);

const labelWords = {
  bathroom: 'Bathroom',
  bed: 'Bed',
  bookcase: 'Bookcase',
  cabinet: 'Cabinet',
  cardboard: 'Cardboard',
  chair: 'Chair',
  coat: 'Coat',
  computer: 'Computer',
  desk: 'Desk',
  floor: 'Floor',
  kitchen: 'Kitchen',
  lamp: 'Lamp',
  lounge: 'Lounge',
  potted: 'Potted',
  side: 'Side',
  television: 'Television',
  washer: 'Washer',
};

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function copyFileIfChanged(source, destination) {
  ensureDir(path.dirname(destination));
  if (fs.existsSync(destination)) {
    const sourceStat = fs.statSync(source);
    const destinationStat = fs.statSync(destination);
    if (sourceStat.size === destinationStat.size && sourceStat.mtimeMs <= destinationStat.mtimeMs) return;
  }
  fs.copyFileSync(source, destination);
}

function toTitle(id) {
  const spaced = id
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[-_]+/g, ' ')
    .trim();
  return spaced
    .split(/\s+/)
    .map((word) => labelWords[word.toLowerCase()] || word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function getPlacement(id) {
  if (floorNames.has(id)) return 'floor';
  if (wallNames.has(id)) return 'wall';
  return 'floor';
}

function getScale(id) {
  if (id.startsWith('wall') || id.startsWith('floor')) return 1;
  if (id.startsWith('rug')) return 1.55;
  if (id.includes('lamp')) return 1.15;
  if (id.includes('plant')) return 0.9;
  if (id.includes('bear')) return 0.82;
  return 1;
}

function copyThumbnails() {
  if (!fs.existsSync(sideRoot)) return new Set();
  const thumbnails = new Set();
  ensureDir(publicThumbRoot);
  for (const entry of fs.readdirSync(sideRoot, { withFileTypes: true })) {
    if (!entry.isFile() || path.extname(entry.name).toLowerCase() !== '.png') continue;
    const id = path.basename(entry.name, '.png');
    copyFileIfChanged(path.join(sideRoot, entry.name), path.join(publicThumbRoot, entry.name));
    thumbnails.add(id);
  }
  return thumbnails;
}

function buildCatalog() {
  if (!fs.existsSync(modelRoot)) {
    console.log('Room asset catalog: source folder not found, keeping existing public catalog');
    return;
  }

  ensureDir(publicModelRoot);
  const thumbnails = copyThumbnails();
  const byId = new Map();

  for (const format of formatFolders) {
    const sourceDir = path.join(modelRoot, format.folder);
    if (!fs.existsSync(sourceDir)) continue;

    for (const entry of fs.readdirSync(sourceDir, { withFileTypes: true })) {
      if (!entry.isFile()) continue;
      const extension = path.extname(entry.name).toLowerCase();
      if (!format.extensions.includes(extension)) continue;

      const id = path.basename(entry.name, extension);
      const existing = byId.get(id);
      if (existing && existing.priority <= format.priority) continue;

      const publicFormatDir = path.join(publicModelRoot, format.folder.replace(/\s+/g, '-').toLowerCase());
      copyFileIfChanged(path.join(sourceDir, entry.name), path.join(publicFormatDir, entry.name));

      byId.set(id, {
        id,
        label: toTitle(id),
        src: thumbnails.has(id) ? `/room-assets/${id}.png` : '',
        modelSrc: `/room-models/${path.basename(publicFormatDir)}/${entry.name}`,
        format: extension.slice(1),
        placement: getPlacement(id),
        scale: getScale(id),
        priority: format.priority,
      });
    }
  }

  const catalog = [...byId.values()]
    .map(({ priority, ...asset }) => asset)
    .sort((a, b) => a.label.localeCompare(b.label));

  fs.writeFileSync(catalogPath, `${JSON.stringify(catalog, null, 2)}\n`);
  console.log(`Room asset catalog: ${catalog.length} models`);
}

buildCatalog();
