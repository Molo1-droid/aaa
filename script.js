const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const scoreEl = document.getElementById("score");
const bestScoreEl = document.getElementById("best-score");
const statusEl = document.getElementById("status");

const gridSize = 24;
const tileCount = canvas.width / gridSize;
const bestScoreKey = "snake-best-score";

const directions = {
  ArrowUp: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 },
  w: { x: 0, y: -1 },
  s: { x: 0, y: 1 },
  a: { x: -1, y: 0 },
  d: { x: 1, y: 0 },
};

let snake;
let direction;
let nextDirection;
let food;
let score;
let bestScore;
let isRunning;
let isPaused;
let speed;
let lastRenderTime = 0;

function initGame() {
  snake = [
    { x: 10, y: 10 },
    { x: 9, y: 10 },
    { x: 8, y: 10 },
  ];
  direction = { x: 1, y: 0 };
  nextDirection = direction;
  score = 0;
  speed = 6;
  isRunning = false;
  isPaused = false;
  bestScore = Number.parseInt(localStorage.getItem(bestScoreKey) || "0", 10);
  bestScoreEl.textContent = bestScore.toString();
  scoreEl.textContent = score.toString();
  statusEl.textContent = "Press an arrow key to start.";
  placeFood();
  draw();
}

function placeFood() {
  let newFood;
  do {
    newFood = {
      x: Math.floor(Math.random() * tileCount),
      y: Math.floor(Math.random() * tileCount),
    };
  } while (snake.some((segment) => segment.x === newFood.x && segment.y === newFood.y));

  food = newFood;
}

function gameLoop(timestamp) {
  if (!isRunning) {
    return;
  }

  window.requestAnimationFrame(gameLoop);
  const secondsSinceLastRender = (timestamp - lastRenderTime) / 1000;
  if (secondsSinceLastRender < 1 / speed) {
    return;
  }
  lastRenderTime = timestamp;

  if (!isPaused) {
    update();
  }
  draw();
}

function update() {
  direction = nextDirection;
  const head = {
    x: snake[0].x + direction.x,
    y: snake[0].y + direction.y,
  };

  if (isCollision(head)) {
    handleGameOver();
    return;
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score += 10;
    speed = Math.min(14, 6 + Math.floor(score / 50));
    scoreEl.textContent = score.toString();
    if (score > bestScore) {
      bestScore = score;
      bestScoreEl.textContent = bestScore.toString();
      localStorage.setItem(bestScoreKey, bestScore.toString());
    }
    placeFood();
  } else {
    snake.pop();
  }
}

function isCollision(position) {
  const hitWall =
    position.x < 0 ||
    position.x >= tileCount ||
    position.y < 0 ||
    position.y >= tileCount;
  const hitSelf = snake.some(
    (segment, index) => index !== 0 && segment.x === position.x && segment.y === position.y
  );
  return hitWall || hitSelf;
}

function handleGameOver() {
  isRunning = false;
  statusEl.textContent = "Game over! Press R to restart.";
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#0f172a";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  drawGrid();
  drawFood();
  drawSnake();
}

function drawGrid() {
  ctx.strokeStyle = "rgba(148, 163, 184, 0.12)";
  ctx.lineWidth = 1;
  for (let i = 0; i <= tileCount; i += 1) {
    ctx.beginPath();
    ctx.moveTo(i * gridSize, 0);
    ctx.lineTo(i * gridSize, canvas.height);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, i * gridSize);
    ctx.lineTo(canvas.width, i * gridSize);
    ctx.stroke();
  }
}

function drawSnake() {
  snake.forEach((segment, index) => {
    ctx.fillStyle = index === 0 ? "#38bdf8" : "#0ea5e9";
    ctx.beginPath();
    ctx.roundRect(
      segment.x * gridSize + 1,
      segment.y * gridSize + 1,
      gridSize - 2,
      gridSize - 2,
      6
    );
    ctx.fill();
  });
}

function drawFood() {
  ctx.fillStyle = "#f97316";
  ctx.beginPath();
  ctx.roundRect(
    food.x * gridSize + 2,
    food.y * gridSize + 2,
    gridSize - 4,
    gridSize - 4,
    8
  );
  ctx.fill();
}

function startGame() {
  if (!isRunning) {
    isRunning = true;
    statusEl.textContent = "Game on!";
    window.requestAnimationFrame(gameLoop);
  }
}

function togglePause() {
  if (!isRunning) {
    return;
  }
  isPaused = !isPaused;
  statusEl.textContent = isPaused ? "Paused." : "Game on!";
}

function resetGame() {
  initGame();
}

function handleDirectionChange(key) {
  const newDirection = directions[key] || directions[key.toLowerCase()];
  if (!newDirection) {
    return;
  }

  const isOppositeDirection =
    direction.x + newDirection.x === 0 && direction.y + newDirection.y === 0;

  if (isOppositeDirection) {
    return;
  }

  nextDirection = newDirection;
  startGame();
}

document.addEventListener("keydown", (event) => {
  if (event.code === "Space") {
    event.preventDefault();
    togglePause();
    return;
  }

  if (event.key.toLowerCase() === "r") {
    resetGame();
    return;
  }

  handleDirectionChange(event.key);
});

initGame();
