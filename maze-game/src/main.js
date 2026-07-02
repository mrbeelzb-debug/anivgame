const TILE_SIZE = 40;
const PLAYER_SPEED = 7.5;
const PLAYER_RADIUS = TILE_SIZE * 0.2;
const WALL_COLOR = '#000000';
const BACKGROUND_COLOR = '#ffffff';
const START_COLOR = '#111111';
const GOAL_COLOR = '#ffcc00';

const canvas = document.querySelector('#game-canvas');
const stageWrap = document.querySelector('.stage-wrap');
const ctx = canvas.getContext('2d');
const winPanel = document.querySelector('#win-panel');
const restartButton = document.querySelector('#restart-button');
const controlButtons = document.querySelectorAll('[data-direction]');

const map = window.MAZE_MAP;
const rows = map.length;
const cols = map[0].length;
const directions = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

let scale = 1;
let lastTime = 0;
let started = false;
let won = false;
let startTile = null;
let goalTile = null;
let player = null;
let movingDirection = null;

const playerImage = new Image();
playerImage.src = 'assets/round_clean_crop.png';

function findSpecialTiles() {
  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      if (map[row][col] === 'S') startTile = { col, row };
      if (map[row][col] === 'G') goalTile = { col, row };
    }
  }
}

function tileCenter(tile) {
  return {
    x: tile.col * TILE_SIZE + TILE_SIZE / 2,
    y: tile.row * TILE_SIZE + TILE_SIZE / 2,
  };
}

function getTileAt(col, row) {
  if (row < 0 || row >= rows || col < 0 || col >= cols) return 1;
  return map[row][col];
}

function isWall(col, row) {
  return getTileAt(col, row) === 1;
}

function isAligned(value) {
  const centerOffset = (value - TILE_SIZE / 2) / TILE_SIZE;
  return Math.abs(centerOffset - Math.round(centerOffset)) < 0.001;
}

function currentTile() {
  return {
    col: Math.round((player.x - TILE_SIZE / 2) / TILE_SIZE),
    row: Math.round((player.y - TILE_SIZE / 2) / TILE_SIZE),
  };
}

function canMoveFromCurrentTile(direction) {
  const tile = currentTile();
  return !isWall(tile.col + direction.x, tile.row + direction.y);
}

function resetGame() {
  const start = tileCenter(startTile);
  player = {
    x: start.x,
    y: start.y,
    radius: PLAYER_RADIUS,
  };
  movingDirection = null;
  started = false;
  won = false;
  winPanel.classList.remove('is-visible');
  winPanel.setAttribute('aria-hidden', 'true');
}

function setDirection(name) {
  if (won) return;
  const direction = directions[name];
  if (!direction || movingDirection) return;
  if (!canMoveFromCurrentTile(direction)) return;
  movingDirection = direction;
  started = true;
}

function resizeCanvas() {
  const dpr = window.devicePixelRatio || 1;
  canvas.width = Math.round(cols * TILE_SIZE * dpr);
  canvas.height = Math.round(rows * TILE_SIZE * dpr);
  canvas.style.aspectRatio = `${cols} / ${rows}`;
  stageWrap.style.aspectRatio = `${cols} / ${rows}`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  scale = dpr;
}

function drawMaze() {
  ctx.fillStyle = BACKGROUND_COLOR;
  ctx.fillRect(0, 0, cols * TILE_SIZE, rows * TILE_SIZE);

  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      if (map[row][col] === 1) {
        ctx.fillStyle = WALL_COLOR;
        ctx.fillRect(col * TILE_SIZE, row * TILE_SIZE, TILE_SIZE, TILE_SIZE);
      }
    }
  }
}

function drawStartMarker() {
  if (started) return;
  const center = tileCenter(startTile);
  ctx.fillStyle = START_COLOR;
  ctx.font = `900 ${TILE_SIZE * 0.28}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('START', center.x, center.y);
}

function drawGoalMarker() {
  const center = tileCenter(goalTile);
  const outer = TILE_SIZE * 0.36;
  const inner = TILE_SIZE * 0.16;
  ctx.save();
  ctx.translate(center.x, center.y);
  ctx.beginPath();
  for (let i = 0; i < 10; i += 1) {
    const angle = -Math.PI / 2 + (i * Math.PI) / 5;
    const radius = i % 2 === 0 ? outer : inner;
    ctx.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
  }
  ctx.closePath();
  ctx.fillStyle = GOAL_COLOR;
  ctx.strokeStyle = WALL_COLOR;
  ctx.lineWidth = 2;
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

function drawPlayer() {
  ctx.save();
  ctx.beginPath();
  ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
  ctx.clip();

  if (playerImage.complete && playerImage.naturalWidth > 0) {
    const size = player.radius * 2;
    const imageRatio = playerImage.naturalWidth / playerImage.naturalHeight;
    const drawWidth = imageRatio > 1 ? size * imageRatio : size;
    const drawHeight = imageRatio > 1 ? size : size / imageRatio;
    ctx.drawImage(playerImage, player.x - drawWidth / 2, player.y - drawHeight / 2, drawWidth, drawHeight);
  } else {
    ctx.fillStyle = '#ffb7c8';
    ctx.fillRect(player.x - player.radius, player.y - player.radius, player.radius * 2, player.radius * 2);
  }

  ctx.restore();
  ctx.strokeStyle = WALL_COLOR;
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
  ctx.stroke();
}

function updatePlayer(delta) {
  if (!movingDirection || won) return;

  const tile = currentTile();
  const targetCol = tile.col + movingDirection.x;
  const targetRow = tile.row + movingDirection.y;

  if (isWall(targetCol, targetRow)) {
    movingDirection = null;
    const snapped = tileCenter(tile);
    player.x = snapped.x;
    player.y = snapped.y;
    return;
  }

  const speed = PLAYER_SPEED * TILE_SIZE;
  player.x += movingDirection.x * speed * delta;
  player.y += movingDirection.y * speed * delta;

  if (movingDirection.x !== 0) {
    player.y = tile.row * TILE_SIZE + TILE_SIZE / 2;
  }
  if (movingDirection.y !== 0) {
    player.x = tile.col * TILE_SIZE + TILE_SIZE / 2;
  }

  const nextWallCol = targetCol + movingDirection.x;
  const nextWallRow = targetRow + movingDirection.y;
  const targetCenter = tileCenter({ col: targetCol, row: targetRow });
  const passedTarget =
    (movingDirection.x > 0 && player.x >= targetCenter.x) ||
    (movingDirection.x < 0 && player.x <= targetCenter.x) ||
    (movingDirection.y > 0 && player.y >= targetCenter.y) ||
    (movingDirection.y < 0 && player.y <= targetCenter.y);

  if (passedTarget && isWall(nextWallCol, nextWallRow)) {
    player.x = targetCenter.x;
    player.y = targetCenter.y;
    movingDirection = null;
  }
}

function checkWin() {
  if (won || movingDirection) return;
  const tile = currentTile();
  if (tile.col === goalTile.col && tile.row === goalTile.row) {
    won = true;
    winPanel.classList.add('is-visible');
    winPanel.setAttribute('aria-hidden', 'false');
  }
}

function draw() {
  drawMaze();
  drawGoalMarker();
  drawStartMarker();
  drawPlayer();
}

function loop(time) {
  const delta = Math.min((time - lastTime) / 1000 || 0, 0.04);
  lastTime = time;
  updatePlayer(delta);
  checkWin();
  draw();
  requestAnimationFrame(loop);
}

function directionFromKey(key) {
  const normalized = key.toLowerCase();
  if (normalized === 'arrowup' || normalized === 'w') return 'up';
  if (normalized === 'arrowdown' || normalized === 's') return 'down';
  if (normalized === 'arrowleft' || normalized === 'a') return 'left';
  if (normalized === 'arrowright' || normalized === 'd') return 'right';
  return null;
}

let swipeStart = null;

window.addEventListener('keydown', (event) => {
  const direction = directionFromKey(event.key);
  if (!direction) return;
  event.preventDefault();
  setDirection(direction);
});

canvas.addEventListener('pointerdown', (event) => {
  swipeStart = { x: event.clientX, y: event.clientY };
  canvas.setPointerCapture(event.pointerId);
});

canvas.addEventListener('pointerup', (event) => {
  if (!swipeStart) return;
  const dx = event.clientX - swipeStart.x;
  const dy = event.clientY - swipeStart.y;
  swipeStart = null;
  if (Math.hypot(dx, dy) < 26) return;
  if (Math.abs(dx) > Math.abs(dy)) {
    setDirection(dx > 0 ? 'right' : 'left');
  } else {
    setDirection(dy > 0 ? 'down' : 'up');
  }
});

controlButtons.forEach((button) => {
  button.addEventListener('click', () => setDirection(button.dataset.direction));
});

restartButton.addEventListener('click', resetGame);
window.addEventListener('resize', resizeCanvas);

findSpecialTiles();
resizeCanvas();
resetGame();
requestAnimationFrame(loop);
