// Game constants & variables
let inputDir = { x: 0, y: 0 };
const foodSound = new Audio('music/foodsound.mp3');
const gameOverSound = new Audio('music/gameover.mp3');
const gameStartSound = new Audio('music/gamestart.mp3');
let speed = 10; // Adjust the speed
let score = 0;
let lastPaintTime = 0;
let snakeArr = [{ x: 14, y: 15 }];
let food = { x: 6, y: 7 };
let highScore = localStorage.getItem("highScore") ? JSON.parse(localStorage.getItem("highScore")) : 0;
document.getElementById("HighScoreBox").innerHTML = "HighScore: " + highScore;

// Game functions
function main(ctime) {
    window.requestAnimationFrame(main);
    if ((ctime - lastPaintTime) / 1000 < 1 / speed) {
        return;
    }
    lastPaintTime = ctime;
    gameEngine();
}

function isCollide(snake) {
    // If you bump into yourself
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
            return true;
        }
    }
    // If you bump into the wall
    if (snake[0].x >= 18 || snake[0].x < 0 || snake[0].y >= 18 || snake[0].y < 0) {
        return true;
    }
    return false;
}

function gameEngine() {
    // Part 1: Updating the snake array & food
    if (isCollide(snakeArr)) {
        gameOverSound.play();
        alert("Game over. Press any key to play again!");
        snakeArr = [{ x: 14, y: 15 }];
        inputDir = { x: 0, y: 0 };
        score = 0;
        document.getElementById("ScoreBox").innerHTML = "Score: " + score;
    }

    // If you have eaten the food, increment the score and regenerate the food
    if (snakeArr[0].y === food.y && snakeArr[0].x === food.x) {
        foodSound.play();
        score += 1;
        if (score > highScore) {
            highScore = score;
            localStorage.setItem("highScore", JSON.stringify(highScore));
            document.getElementById("HighScoreBox").innerHTML = "HighScore: " + highScore;
        }
        document.getElementById("ScoreBox").innerHTML = "Score: " + score;
        snakeArr.unshift({ x: snakeArr[0].x + inputDir.x, y: snakeArr[0].y + inputDir.y });
        let a = 2;
        let b = 16;
        food = { x: Math.round(a + (b - a) * Math.random()), y: Math.round(a + (b - a) * Math.random()) };
    }

    // Moving the snake
    for (let i = snakeArr.length - 2; i >= 0; i--) {
        snakeArr[i + 1] = { ...snakeArr[i] };
    }
    snakeArr[0].x += inputDir.x;
    snakeArr[0].y += inputDir.y;

    // Part 2: Display the snake and food
    const board = document.getElementById('board');
    board.innerHTML = "";
    snakeArr.forEach((e, index) => {
        let snakeElement = document.createElement('div');
        snakeElement.style.gridRowStart = e.y;
        snakeElement.style.gridColumnStart = e.x;
        if (index === 0) {
            snakeElement.classList.add('head');
        } else {
            snakeElement.classList.add('snake');
        }
        board.appendChild(snakeElement);
    });

    // Display the food
    let foodElement = document.createElement('div');
    foodElement.style.gridRowStart = food.y;
    foodElement.style.gridColumnStart = food.x;
    foodElement.classList.add('food');
    board.appendChild(foodElement);
}

// Main logic
window.requestAnimationFrame(main);
window.addEventListener('keydown', e => {
    gameStartSound.play();
    inputDir = { x: 0, y: 1 }; // Start the game
    switch (e.key) {
        case "ArrowUp":
            inputDir.x = 0;
            inputDir.y = -1;
            break;

        case "ArrowDown":
            inputDir.x = 0;
            inputDir.y = 1;
            break;

        case "ArrowLeft":
            inputDir.x = -1;
            inputDir.y = 0;
            break;

        case "ArrowRight":
            inputDir.x = 1;
            inputDir.y = 0;
            break;

        default:
            break;
    }
});

// Initial display of the snake and food
gameEngine();
