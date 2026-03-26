// =====================
// ELEMENTS
// =====================
const startScreen = document.getElementById("start-screen");
const gameScreen = document.getElementById("game-screen");
const endScreen = document.getElementById("end-screen");

const countdownElement = document.getElementById("time");
const scoreElement = document.getElementById("score");
const finalScoreElement = document.getElementById("final-score");

// =====================
// GAME STATE
// =====================
let gameRunning = false;
let dropMaker;
let countdownInterval;
let timerValue = 30;
let score = 0;

// =====================
// DIFFICULTY
// =====================
let dropSpeed = 600;
let badDropChance = 0.25;
let defaultTime = 30;

// =====================
// SOUNDS (FIXED)
// =====================
const goodSound = new Audio("goodDrop.mp3");
const badSound = new Audio("badDrop.mp3");
const milestoneSound = new Audio("mileStone.mp3");

// unlock audio on first click (IMPORTANT FIX)
document.body.addEventListener("click", () => {
  goodSound.play().catch(() => {});
  badSound.play().catch(() => {});
  milestoneSound.play().catch(() => {});
}, { once: true });

// =====================
// DATA
// =====================
const milestones = [15, 27, 39, 51, 63, 75];

const facts = [
  "771 million people lack access to clean water.",
  "Every $40 donated can bring clean water to one person.",
  "100% of donations fund clean water projects.",
  "Women and children spend 200 million hours daily collecting water.",
  "Clean water improves education and health.",
  "Over 100,000 water projects have been funded.",
  "Clean water prevents deadly diseases.",
  "Some walk miles daily just for water."
];

// =====================
// BUTTONS
// =====================
document.getElementById("start-btn").addEventListener("click", startGame);
document.getElementById("restart-btn").addEventListener("click", startGame);
document.getElementById("in-game-restart-btn").addEventListener("click", startGame);

// =====================
// SCREEN SWITCH
// =====================
function showOnlyScreen(screen) {
  [startScreen, gameScreen, endScreen].forEach(s => s.classList.add("hidden"));
  screen.classList.remove("hidden");
}

// =====================
// DIFFICULTY
// =====================
function setDifficulty(level) {
  document.querySelectorAll(".difficulty-buttons button")
    .forEach(btn => btn.classList.remove("selected-difficulty"));

  let text = "";

  if (level === "easy") {
    dropSpeed = 900;
    badDropChance = 0.15;
    defaultTime = 35;
    text = "Difficulty: Easy";
  }

  if (level === "normal") {
    dropSpeed = 600;
    badDropChance = 0.25;
    defaultTime = 30;
    text = "Difficulty: Normal";
  }

  if (level === "hard") {
    dropSpeed = 350;
    badDropChance = 0.4;
    defaultTime = 25;
    text = "Difficulty: Hard";
  }

  document.getElementById(level + "-btn")?.classList.add("selected-difficulty");
  document.getElementById(level + "-btn-end")?.classList.add("selected-difficulty");

  document.getElementById("difficulty-selected").textContent = text;
  document.getElementById("difficulty-selected-end").textContent = text;
}

// =====================
// GAME START
// =====================
function startGame() {
  showOnlyScreen(gameScreen);

  clearInterval(dropMaker);
  clearInterval(countdownInterval);

  document.querySelectorAll(".water-drop").forEach(d => d.remove());

  timerValue = defaultTime;
  score = 0;

  countdownElement.textContent = `${timerValue}s left`;
  scoreElement.textContent = `Score: ${score}`;

  document.querySelectorAll("#milestones span")
    .forEach(icon => icon.classList.remove("show"));

  gameRunning = true;
  dropMaker = setInterval(createDrop, dropSpeed);
  startCountdown();
}

// =====================
// COUNTDOWN
// =====================
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

// =====================
// END GAME (FIXED)
// =====================
function endGame() {
  gameRunning = false;
  clearInterval(dropMaker);
  clearInterval(countdownInterval);

  finalScoreElement.textContent = score;

  document.querySelectorAll(".water-drop").forEach(d => d.remove());

  // FIX: only show earned milestones
  const endMilestones = document.getElementById("end-milestones");
  endMilestones.innerHTML = "";

  milestones.forEach(m => {
    if (score >= m) {
      const span = document.createElement("span");
      span.textContent = "💧";
      span.classList.add("hit");
      endMilestones.appendChild(span);
    }
  });

  // Random fact
  const factText = document.getElementById("fact-text");
  factText.textContent = facts[Math.floor(Math.random() * facts.length)];

  showOnlyScreen(endScreen);
}

// =====================
// CREATE DROPS
// =====================
function createDrop() {
  const drop = document.createElement("div");
  drop.className = "water-drop";

  const isBad = Math.random() < badDropChance;
  if (isBad) drop.classList.add("bad-drop");

  const size = 40 + Math.random() * 30;
  drop.style.width = drop.style.height = size + "px";

  const gameWidth = document.getElementById("game-container").offsetWidth;
  drop.style.left = Math.random() * (gameWidth - size) + "px";

  drop.style.animationDuration = "4s";

  document.getElementById("game-container").appendChild(drop);

  drop.addEventListener("click", () => {
    if (!gameRunning) return;

    if (isBad) {
      badSound.currentTime = 0;
      badSound.play();
      score -= 2;
      showFeedback("-2", drop, "black");
    } else {
      goodSound.currentTime = 0;
      goodSound.play();
      score += 3;
      showFeedback("+3", drop, "blue");
    }

    scoreElement.textContent = `Score: ${score}`;

    const milestoneIcons = document.querySelectorAll("#milestones span");

    milestones.forEach((m, i) => {
      if (score >= m && !milestoneIcons[i].classList.contains("show")) {
        milestoneIcons[i].classList.add("show");
        milestoneSound.currentTime = 0;
        milestoneSound.play();
      }
    });

    drop.remove();
  });

  drop.addEventListener("animationend", () => drop.remove());
}

// =====================
// FEEDBACK
// =====================
function showFeedback(text, drop, color) {
  const el = document.createElement("div");
  el.textContent = text;

  el.style.position = "absolute";
  el.style.left = drop.style.left;
  el.style.top = drop.style.top;
  el.style.color = color;
  el.style.fontWeight = "bold";

  document.getElementById("game-container").appendChild(el);
  setTimeout(() => el.remove(), 800);
}

// =====================
setDifficulty("normal");