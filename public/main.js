// Responsive, mobile-friendly Snake Game

const canvas = document.getElementById('snake');
const ctx = canvas.getContext('2d');
let box = 20, cols = 40, rows = 20;
let snake, direction, food, score, speed, gameInterval, isPaused;

// Responsive canvas
function resizeCanvas() {
    const width = Math.max(240, Math.min(window.innerWidth * 0.95, 900));
    const height = Math.floor(width / 2);
    canvas.width = width;
    canvas.height = height;

    if (width < 500) {
        cols = 20;
    } else if (width < 800) {
        cols = 30;
    } else {
        cols = 40;
    }
    box = Math.floor(width / cols);
    rows = Math.floor(height / box);

    draw();
}
window.addEventListener('resize', resizeCanvas);
window.addEventListener('DOMContentLoaded', resizeCanvas);

// Game logic
function spawnFood() {
    let newFood;
    while (true) {
        newFood = {
            x: Math.floor(Math.random() * cols) * box,
            y: Math.floor(Math.random() * rows) * box
        };
        if (!snake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
            return newFood;
        }
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw snake with gradient
    for (let i = 0; i < snake.length; i++) {
        let grad = ctx.createLinearGradient(
            snake[i].x, snake[i].y, snake[i].x + box, snake[i].y + box
        );
        grad.addColorStop(0, i === 0 ? "#4CAF50" : "#8BC34A");
        grad.addColorStop(1, "#388E3C");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(
            snake[i].x + box / 2,
            snake[i].y + box / 2,
            box / 2 - 2,
            0,
            2 * Math.PI
        );
        ctx.fill();
        ctx.closePath();
    }

    // Draw round food
    ctx.fillStyle = "#f44336";
    ctx.beginPath();
    ctx.arc(
        food.x + box / 2,
        food.y + box / 2,
        box / 2 - 2,
        0,
        2 * Math.PI
    );
    ctx.fill();
    ctx.closePath();
}

function update() {
    if (isPaused) return;

    let head = { ...snake[0] };

    if (direction === "LEFT") head.x -= box;
    if (direction === "UP") head.y -= box;
    if (direction === "RIGHT") head.x += box;
    if (direction === "DOWN") head.y += box;

    // Wall wrap
    if (head.x < 0) head.x = (cols - 1) * box;
    if (head.x >= cols * box) head.x = 0;
    if (head.y < 0) head.y = (rows - 1) * box;
    if (head.y >= rows * box) head.y = 0;

    // Self collision
    if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        gameOver();
        return;
    }

    snake.unshift(head);

    // Food collision
    if (head.x === food.x && head.y === food.y) {
        score++;
        document.getElementById('score').textContent = "Score: " + score;
        food = spawnFood();
        speed = Math.max(50, speed - 5);
        clearInterval(gameInterval);
        gameInterval = setInterval(gameLoop, speed);
    } else {
        snake.pop();
    }
}

function gameLoop() {
    update();
    draw();
}

function gameOver() {
    clearInterval(gameInterval);
    gameInterval = null;
    document.getElementById('gameOver').style.display = 'block';
}

function getInitialSpeed() {
    const diff = document.getElementById('difficulty').value;
    if (diff === "easy") return 200;
    if (diff === "medium") return 120;
    if (diff === "hard") return 60;
    return 120;
}

function resetGame() {
    // Start snake in the center
    const startX = Math.floor(cols / 2) * box;
    const startY = Math.floor(rows / 2) * box;
    snake = [{ x: startX, y: startY }];
    direction = "RIGHT";
    food = spawnFood();
    score = 0;
    speed = getInitialSpeed();
    document.getElementById('score').textContent = "Score: 0";
    document.getElementById('gameOver').style.display = 'none';
    clearInterval(gameInterval);
    gameInterval = null;
    isPaused = false;
    draw();
}

// Keyboard controls
document.addEventListener('keydown', e => {
    if (e.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
    if (e.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
    if (e.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
    if (e.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
});

// Touch controls
document.getElementById('upBtn').addEventListener('touchstart', e => {
    e.preventDefault();
    if (direction !== "DOWN") direction = "UP";
});
document.getElementById('downBtn').addEventListener('touchstart', e => {
    e.preventDefault();
    if (direction !== "UP") direction = "DOWN";
});
document.getElementById('leftBtn').addEventListener('touchstart', e => {
    e.preventDefault();
    if (direction !== "RIGHT") direction = "LEFT";
});
document.getElementById('rightBtn').addEventListener('touchstart', e => {
    e.preventDefault();
    if (direction !== "LEFT") direction = "RIGHT";
});

// Button controls
document.getElementById('startBtn').onclick = () => {
    if (!gameInterval) {
        if (!direction) direction = "RIGHT";
        isPaused = false;
        gameInterval = setInterval(gameLoop, speed);
    }
};
document.getElementById('pauseBtn').onclick = () => {
    isPaused = !isPaused;
};
document.getElementById('resetBtn').onclick = () => {
    resetGame();
};
document.getElementById('difficulty').onchange = () => {
    resetGame();
};

resetGame();