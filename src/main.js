// This file contains the JavaScript logic for the Snake game.

const canvas = document.getElementById('snake');
const ctx = canvas.getContext('2d');
const box = 20;
let snake = [{ x: 9 * box, y: 10 * box }];
let direction = null;
let food = spawnFood();
let score = 0;
let speed = 150;
let gameInterval = null;
let isPaused = false;

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

function spawnFood() {
    let newFood;
    while (true) {
        newFood = {
            x: Math.floor(Math.random() * (canvas.width / box)) * box,
            y: Math.floor(Math.random() * (canvas.height / box)) * box
        };
        // Make sure food doesn't spawn on the snake
        if (!snake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
            return newFood;
        }
    }
}

function update() {
    if (isPaused) return;

    let head = { ...snake[0] };

    if (direction === "LEFT") head.x -= box;
    if (direction === "UP") head.y -= box;
    if (direction === "RIGHT") head.x += box;
    if (direction === "DOWN") head.y += box;

    // Wall wrap
    if (head.x < 0) head.x = canvas.width - box;
    if (head.x >= canvas.width) head.x = 0;
    if (head.y < 0) head.y = canvas.height - box;
    if (head.y >= canvas.height) head.y = 0;

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
    snake = [{ x: 9 * box, y: 10 * box }];
    direction = "RIGHT";
    food = spawnFood();
    score = 0;
    speed = getInitialSpeed();
    document.getElementById('score').textContent = "Score: 0";
    document.getElementById('gameOver').style.display = 'none';
    clearInterval(gameInterval);
    gameInterval = null; // <-- Add this line
    isPaused = false;    // <-- Add this line to ensure game is not paused
    draw();
}

document.addEventListener('keydown', e => {
    if (e.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
    if (e.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
    if (e.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
    if (e.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
});

document.getElementById('startBtn').onclick = () => {
    if (!gameInterval) {
        if (!direction) direction = "RIGHT"; // Ensure direction is set
        isPaused = false;
        gameInterval = setInterval(gameLoop, speed);
    }
};
document.getElementById('pauseBtn').onclick = () => {
    isPaused = !isPaused;
};
document.getElementById('resetBtn').onclick = () => {
    resetGame();
    gameInterval = setInterval(gameLoop, speed);
};

document.getElementById('difficulty').onchange = () => {
    resetGame();
};

resetGame();