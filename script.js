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

// Difficulty settings
let dropSpeed = 600;
let badDropChance = 0.25;
let defaultTime = 30;

// Sound
const popSound = new Audio("pop.mp3");

// Milestones
const milestones = [15, 27, 39, 51, 63, 75];

// Buttons
document.getElementById("start-btn").addEventListener("click", startGame);
document.getElementById("restart-btn").addEventListener("click", startGame);
document.getElementById("in-game-restart-btn").addEventListener("click", startGame);

function showOnlyScreen(screenToShow) {
  [startScreen, gameScreen, endScreen].forEach(screen => {
    screen.classList.add("hidden");
  });
  screenToShow.classList.remove("hidden");
}

function setDifficulty(level) {
  document.querySelectorAll(".difficulty-buttons button")
    .forEach(btn => btn.classList.remove("selected-difficulty"));

  if (level === "easy") {
    dropSpeed = 900;
    badDropChance = 0.15;
    defaultTime = 35;
    document.getElementById("easy-btn").classList.add("selected-difficulty");
    document.getElementById("difficulty-selected").textContent = "Difficulty: Easy";
  }

  if (level === "normal") {
    dropSpeed = 600;
    badDropChance = 0.25;
    defaultTime = 30;
    document.getElementById("normal-btn").classList.add("selected-difficulty");
    document.getElementById("difficulty-selected").textContent = "Difficulty: Normal";
  }

  if (level === "hard") {
    dropSpeed = 350;
    badDropChance = 0.4;
    defaultTime = 25;
    document.getElementById("hard-btn").classList.add("selected-difficulty");
    document.getElementById("difficulty-selected").textContent = "Difficulty: Hard";
  }
}

// Start game
function startGame() {
  showOnlyScreen(gameScreen);

  if (dropMaker) clearInterval(dropMaker);
  if (countdownInterval) clearInterval(countdownInterval);
  document.querySelectorAll(".water-drop").forEach(drop => drop.remove());

  timerValue = defaultTime;
  score = 0;

  countdownElement.textContent = `${timerValue}s left`;
  scoreElement.textContent = `Score: ${score}`;

  // Reset milestone icons
  const milestoneIcons = document.querySelectorAll("#milestones span");
  milestoneIcons.forEach(icon => icon.classList.remove("show"));

  gameRunning = true;
  dropMaker = setInterval(createDrop, dropSpeed);
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

  // End screen milestones
  const endMilestones = document.getElementById("end-milestones");
  endMilestones.innerHTML = "";
  for (let i = 0; i < milestones.length; i++) {
    const span = document.createElement("span");
    span.textContent = "💧";
    if (score >= milestones[i]) span.classList.add("hit");
    endMilestones.appendChild(span);
  }

  const transitionDelay = score > 30 ? 1800 : 1000;

  if (score > 30) {
    launchConfetti();
  }

  setTimeout(() => {
    showOnlyScreen(endScreen);
  }, transitionDelay);
}

// Create drops
function createDrop() {
  const drop = document.createElement("div");
  drop.className = "water-drop";

  const isBad = Math.random() < badDropChance;
  if (isBad) drop.classList.add("bad-drop");

  const initialSize = 60;
  const sizeMultiplier = Math.random() * 0.8 + 0.5;
  const size = initialSize * sizeMultiplier;
  drop.style.width = drop.style.height = `${size}px`;

  const gameWidth = document.getElementById("game-container").offsetWidth;
  drop.style.left = Math.random() * Math.max(gameWidth - size, 0) + "px";
  drop.style.animationDuration = "4s";

  document.getElementById("game-container").appendChild(drop);

  // Click
  drop.addEventListener("click", () => {
    if (!gameRunning) return;

    popSound.currentTime = 0;
    popSound.play();

    if (isBad) {
      score -= 2;
      showFeedback("-2", drop, "black");
    } else {
      score += 3;
      showFeedback("+3", drop, "blue");
    }

    scoreElement.textContent = `Score: ${score}`;

    // Milestones appear one by one
    const milestoneIcons = document.querySelectorAll("#milestones span");
    for (let i = 0; i < milestones.length; i++) {
      if (score >= milestones[i]) {
        milestoneIcons[i].classList.add("show");
      }
    }

    drop.remove();
  });

  drop.addEventListener("animationend", () => drop.remove());
}

// Feedback text
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

function launchConfetti() {
  const gameContainer = document.getElementById("game-container");
  const colors = ["#FFC907", "#2E9DF7", "#8BD1CB", "#003366", "#BF6C46"];

  for (let i = 0; i < 120; i++) {
    const bit = document.createElement("div");
    const size = Math.random() * 7 + 5;

    bit.style.position = "absolute";
    bit.style.width = `${size}px`;
    bit.style.height = `${size * 0.6}px`;
    bit.style.left = `${Math.random() * 100}%`;
    bit.style.top = "-20px";
    bit.style.background = colors[Math.floor(Math.random() * colors.length)];
    bit.style.opacity = "0.95";
    bit.style.borderRadius = "2px";
    bit.style.zIndex = "9";
    bit.style.pointerEvents = "none";

    const fallTime = Math.random() * 700 + 900;
    const sway = Math.random() * 100 - 50;
    bit.animate(
      [
        { transform: "translate(0, 0) rotate(0deg)", opacity: 1 },
        {
          transform: `translate(${sway}px, 650px) rotate(${Math.random() * 720 - 360}deg)`,
          opacity: 0.6
        }
      ],
      {
        duration: fallTime,
        easing: "ease-in",
        fill: "forwards"
      }
    );

    gameContainer.appendChild(bit);
    setTimeout(() => bit.remove(), fallTime + 80);
  }
}