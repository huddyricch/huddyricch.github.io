// Input tracking
const keysPressed = {};

const hitSound = new Audio('bonk.mp3');


// Paddle positions
let paddleY = 100;
let paddle2Y = 100;

// DOM Elements
const paddle = document.getElementById('paddle');
const paddle2 = document.getElementById('paddle2');
const ball = document.getElementById('ball');
const playerScoreEl = document.getElementById('playerScore');
const aiScoreEl = document.getElementById('aiScore');

// Scores
let playerScore = 0;
let aiScore = 0;

// Ball properties
let ballX = 300;
let ballY = 200;
let ballSpeedX = 4.25;
let ballSpeedY = 4.25;

// Handle ball movement
function moveBall() {
  ballX += ballSpeedX;
  ballY += ballSpeedY;

  // Bounce off top and bottom
  if (ballY <= 0 || ballY + ball.offsetHeight >= window.innerHeight) {
    ballSpeedY *= -1;
	hitSound.currentTime = 0;
	hitSound.play();
  }

  // Left wall = AI scores
  if (ballX <= 0) {
    aiScore++;
    resetBall();
    updateScore();
	hitSound.currentTime = 0;
	hitSound.play();
    return;
  }

  // Right wall = Player scores
  if (ballX + ball.offsetWidth >= window.innerWidth) {
    playerScore++;
    resetBall();
    updateScore();
	hitSound.currentTime = 0;
	hitSound.play();
    return;
  }

  // Get bounds for collision detection
  const ballLeft = ballX;
  const ballRight = ballX + ball.offsetWidth;
  const ballTop = ballY;
  const ballBottom = ballY + ball.offsetHeight;

  const paddleLeft = paddle.offsetLeft;
  const paddleRight = paddleLeft + paddle.offsetWidth;
  const paddleTop = paddleY;
  const paddleBottom = paddleTop + paddle.offsetHeight;

  const paddle2Left = paddle2.offsetLeft;
  const paddle2Right = paddle2Left + paddle2.offsetWidth;
  const paddle2Top = paddle2Y;
  const paddle2Bottom = paddle2Top + paddle2.offsetHeight;

  // Collision with player paddle
  const hitPaddle =
    ballLeft < paddleRight &&
    ballRight > paddleLeft &&
    ballBottom > paddleTop &&
    ballTop < paddleBottom;

  // Collision with AI paddle
  const hitPaddle2 =
    ballRight > paddle2Left &&
    ballLeft < paddle2Right &&
    ballBottom > paddle2Top &&
    ballTop < paddle2Bottom;

  if (hitPaddle && ballSpeedX < 0) {
    ballSpeedX *= -1;
    ballSpeedY += (Math.random() - 0.5) * 2.2;
	hitSound.currentTime = 0;
	hitSound.play();
  }

  if (hitPaddle2 && ballSpeedX > 0) {
    ballSpeedX *= -1;
    ballSpeedY += (Math.random() - 0.5) * 2.2;
	hitSound.currentTime = 0;
	hitSound.play();
  }
   if(hitPaddle || hitPaddle2){
	   ballSpeedX *1.1
	   ballSpeedY * 1.1
   }
  // Apply position
  ball.style.left = ballX + 'px';
  ball.style.top = ballY + 'px';
}

// Reset ball to center
function resetBall() {

  ballX = window.innerWidth / 2 - ball.offsetWidth / 2;
  ballY = window.innerHeight / 2 - ball.offsetHeight / 2;
  let ballSpeed = Math.random();
  if(ballSpeed >=0.25 && ballSpeed <0.50){
	  ballSpeedX = -4.2;
	  ballSpeedX = -4.2;
  }else if(ballSpeed >=0.5 && ballSpeed <0.75){
  ballSpeedX = 4.2;
  ballSpeedY = 4.2;
  }else if(ballSpeed >=0.75){
	  ballSpeedX = -4.2;
	  ballSpeedY = 4.2;
  }else{
	  ballSpeedX = 4.2;
	  ballSpeedY = -4.2;
  }
}

// Basic AI movement
function aiMove() {
  const centerPaddle2 = paddle2Y + paddle2.offsetHeight / 2;

  if (ballY > centerPaddle2 + 10 && ballSpeedX > 0) {
    paddle2Y += 3;
  } else if (ballY < centerPaddle2 - 10 && ballSpeedX > 0) {
    paddle2Y -= 3;
  }

  // Stay within bounds
  const maxY = window.innerHeight - paddle2.offsetHeight;
  paddle2Y = Math.max(0, Math.min(paddle2Y, maxY));
  paddle2.style.top = paddle2Y + 'px';
}

// Update scoreboard
function updateScore() {
  playerScoreEl.textContent = playerScore;
  aiScoreEl.textContent = aiScore;
}

// Keyboard input
document.addEventListener('keydown', (event) => {
  keysPressed[event.key.toLowerCase()] = true;
});

document.addEventListener('keyup', (event) => {
  keysPressed[event.key.toLowerCase()] = false;
});


resetBall();
function gameLoop() {
  // Player movement
  if (keysPressed['w']) {
    paddleY -= 3;
  } else if (keysPressed['s']) {
    paddleY += 3;
  }

  // Clamp player paddle to screen
  const maxY = window.innerHeight - paddle.offsetHeight;
  paddleY = Math.max(0, Math.min(paddleY, maxY));
  paddle.style.top = paddleY + 'px';

  moveBall();
  aiMove();
  winGame();
  requestAnimationFrame(gameLoop);
}
function startGame() {
  document.getElementById('startScreen').style.display = 'none';
  gameLoop();
}

function resetGame() {
	playerScore = 0;
	aiScore = 0;
	updateScore();
	
	paddleY = 100;
	paddle2Y = 100;
	paddle.style.top = paddleY + 'px';
	paddle2.style.top = paddle2Y + 'px';
	
	resetBall();
}

function winGame() {
	if (playerScore > 10){
		alert("You Won!");
		resetGame();
	}else if(aiScore > 10){
		alert("You lost!");
		resetGame();
	}
}

document.getElementById('startButton').addEventListener('click', startGame);;
document.getElementById('resetButton').addEventListener('click', resetGame);
