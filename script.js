// Variables to control game state
let gameRunning = false; // Keeps track of whether game is active or not
let dropMaker; // Will store our timer that creates drops regularly
let countdownInterval;
let timerValue = 130;
let score = 0;

// Wait for button click to start the game
document.getElementById("start-btn").addEventListener("click", startGame);
document.getElementById("restart-btn").addEventListener("click", startGame);
const countdownElement = document.getElementById("time");
const scoreElement = document.getElementById("score");
const finalScoreElement = document.getElementById("final-score");


function startGame(){

if (dropMaker) {
  clearInterval(dropMaker);
}
if (countdownInterval) {
  clearInterval(countdownInterval);
}

timerValue = 130;
score = 0;
countdownElement.textContent = `${timerValue}s left`;
scoreElement.textContent = `Score: ${score}`;

document.getElementById("start-screen").classList.add("hidden");
document.getElementById("end-screen").classList.add("hidden");
document.getElementById("game-screen").classList.remove("hidden");

gameRunning = true;
dropMaker = setInterval(createDrop,1000);
startCountdown();

}

function startCountdown() {
  countdownInterval = setInterval(() => {
    timerValue--;
    countdownElement.textContent = `${timerValue}s left`;
    if (timerValue <= 0) {
      clearInterval(countdownInterval);
      endGame();
    }
  }, 1000);
}

function endGame() {
  gameRunning = false;
  clearInterval(dropMaker);
  clearInterval(countdownInterval);
  finalScoreElement.textContent = score;

  document.querySelectorAll(".water-drop").forEach((drop) => drop.remove());

  document.getElementById("game-screen").classList.add("hidden");
  document.getElementById("end-screen").classList.remove("hidden");
}



function createDrop() {
  // Create a new div element that will be our water drop
  const drop = document.createElement("div");
  drop.className = "water-drop";

  // Make drops different sizes for visual variety
  const initialSize = 60;
  const sizeMultiplier = Math.random() * 0.8 + 0.5;
  const size = initialSize * sizeMultiplier;
  drop.style.width = drop.style.height = `${size}px`;

  // Position the drop randomly across the game width
  // Subtract 60 pixels to keep drops fully inside the container
  const gameWidth = document.getElementById("game-container").offsetWidth;
  const xPosition = Math.random() * (gameWidth - 60);
  drop.style.left = xPosition + "px";

  // Make drops fall for 4 seconds
  drop.style.animationDuration = "4s";

  // Add the new drop to the game screen
  document.getElementById("game-container").appendChild(drop);

  drop.addEventListener("click", () => {
    if (!gameRunning) {
      return;
    }
    score += 1;
    scoreElement.textContent = `Score: ${score}`;
    drop.remove();
  });

  // Remove drops that reach the bottom (weren't clicked)
  drop.addEventListener("animationend", () => {
    drop.remove(); // Clean up drops that weren't caught
  });
}