// Elements
const startScreen = document.getElementById("start-screen");
const gameScreen = document.getElementById("game-screen");
const endScreen = document.getElementById("end-screen");
const countdownElement = document.getElementById("time");
const scoreElement = document.getElementById("score");
const finalScoreElement = document.getElementById("final-score");

// Game state
let gameRunning = false;
let dropMaker;
let countdownInterval;
let timerValue = 30;
let score = 0;

// Start / Restart buttons
document.getElementById("start-btn").addEventListener("click", startGame);
document.getElementById("restart-btn").addEventListener("click", startGame);

// Start game function
function startGame() {
  // Switch screens
  startScreen.classList.add("hidden");
  endScreen.classList.add("hidden");
  gameScreen.classList.remove("hidden");

  // Reset state
  if (dropMaker) clearInterval(dropMaker);
  if (countdownInterval) clearInterval(countdownInterval);
  document.querySelectorAll(".water-drop").forEach(drop => drop.remove());

  timerValue = 30;
  score = 0;
  countdownElement.textContent = `${timerValue}s left`;
  scoreElement.textContent = `Score: ${score}`;

  gameRunning = true;
  dropMaker = setInterval(createDrop, 600);
  startCountdown();
}

// Countdown
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

// End game
function endGame() {
  gameRunning = false;
  clearInterval(dropMaker);
  clearInterval(countdownInterval);
  finalScoreElement.textContent = score;
  document.querySelectorAll(".water-drop").forEach(drop => drop.remove());

  if (score > 20) {
    for (let i = 0; i < 50; i++) {
      const confetti = document.createElement("div");
      confetti.style.position = "absolute";
      confetti.style.width = "10px";
      confetti.style.height = "10px";
      confetti.style.backgroundColor = `hsl(${Math.random()*360}, 100%, 50%)`;
      confetti.style.left = Math.random() * 800 + "px";
      confetti.style.top = "0px";
      confetti.style.opacity = "0.8";
      confetti.style.animation = "dropFall 2s linear forwards";
      document.getElementById("game-container").appendChild(confetti);
      setTimeout(() => confetti.remove(), 2000);
    }
  }

  gameScreen.classList.add("hidden");
  endScreen.classList.remove("hidden");
}

// Create drops
function createDrop() {
  const drop = document.createElement("div");
  drop.className = "water-drop";

  const isBad = Math.random() < 0.25;
  if (isBad) drop.classList.add("bad-drop");

  const initialSize = 60;
  const sizeMultiplier = Math.random() * 0.8 + 0.5;
  const size = initialSize * sizeMultiplier;
  drop.style.width = drop.style.height = `${size}px`;

  const gameWidth = document.getElementById("game-container").offsetWidth;
  drop.style.left = Math.random() * (gameWidth - 60) + "px";
  drop.style.animationDuration = "4s";

  document.getElementById("game-container").appendChild(drop);

  drop.addEventListener("click", () => {
    if (!gameRunning) return;
    if (isBad) {
      score -= 2;
      showFeedback("-2", drop, "red");
    } else {
      score += 3;
      showFeedback("+3", drop, "blue");
    }
    scoreElement.textContent = `Score: ${score}`;
    drop.remove();
  });

  drop.addEventListener("animationend", () => drop.remove());
}

// Show feedback
function showFeedback(text, drop, color) {
  const feedback = document.createElement("div");
  feedback.textContent = text;
  feedback.style.position = "absolute";
  feedback.style.left = drop.style.left;
  feedback.style.top = drop.style.top;
  feedback.style.color = color;
  feedback.style.fontWeight = "bold";
  feedback.style.fontSize = "20px";

  document.getElementById("game-container").appendChild(feedback);
  setTimeout(() => feedback.remove(), 800);
}