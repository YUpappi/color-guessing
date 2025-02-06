const colors = document.getElementById("options");
const colorDisplay = document.getElementById("colorDisplay");
const rulesScreen = document.getElementById("rulesScreen");
const gameOverScreen = document.getElementById("gameOverScreen");
const gameScreen = document.getElementById("gameScreen");
const scores = document.getElementById("score");
const highScores = document.getElementById("highscore");
const timerComp = document.getElementById("timer");
const message = document.getElementById("message");

let score = 0,
  loss = 0,
  highscore = localStorage.getItem("highscore") || 0,
  timeLeft = 30,
  timer;

function clamp(value) {
  return Math.max(0, Math.min(255, value));
}

function similarColors(similarcolor) {
  let [r, g, b] = similarcolor.match(/\d+/g).map(Number);
  return `rgb(${clamp(r + rand(50) - 25)}, ${clamp(g + rand(50) - 25)}, ${clamp(
    b + rand(50) - 25
  )})`;
}
function randomColor() {
  return `rgb(${rand(255)}, ${rand(255)}, ${rand(255)})`;
}

function rand(max) {
  return Math.floor(Math.random() * (max + 1));
}

function startGame() {
  rulesScreen.classList.add("hidden");
  gameOverScreen.classList.add("hidden");
  gameScreen.classList.remove("hidden");
  document.querySelector(".reset-btn").style.display = "none";
  scores.textContent = score;
  highScores.textContent = highscore;
  score = 0;
  loss = 0;
  timeLeft = 120;
  clearInterval(timer);
  timer = setInterval(updateTimer, 1000);
  generateColors();
}

function updateTimer() {
  if (timeLeft <= 0) return endGame();
  timerComp.textContent = --timeLeft;
}

function generateColors() {
  let correctColor = randomColor();
  let colorOptions = [
    correctColor,
    ...Array.from({ length: 5 }, () => similarColors(correctColor)),
  ].sort(() => Math.random() - 0.5);
  colorDisplay.style.backgroundColor = correctColor;
  colors.innerHTML = "";
  colorOptions.forEach((color) => {
    let btn = document.createElement("button");
    btn.className = "option";
    btn.style.backgroundColor = color;
    btn.onclick = () => checkAnswer(color, correctColor);
    colors.appendChild(btn);
  });
}

function checkAnswer(selected, correct) {
  if (selected === correct) {
    score++;

    document.getElementById("score").textContent = score;
    if (score > 0) {
      document.querySelector(".reset-btn").style.display = "block";
    }
    message.textContent = "Correct, good sight";
    if (score > highscore) {
      highscore = score;
      localStorage.setItem("highscore", highscore);
      document.getElementById("highscore").textContent = highscore;
    }
  }
  if (selected !== correct) {
    message.textContent = "Wrong, try again";
    loss++;
    document.getElementById("losses").textContent = loss;
    if (loss > 0) {
      document.querySelector(".reset-btn").style.display = "block";
    }
    if (loss === 7) {
      endGame();
    }
  }
  generateColors();
}

function resetGame() {
  score = 0;
  loss = 0;
  document.getElementById("losses").textContent = loss;
  document.getElementById("score").textContent = score;
  message.textContent = "";
  clearInterval(timer);
  startGame();
}

function endGame() {
  clearInterval(timer);
  document.getElementById("gameScreen").classList.add("hidden");
  document.getElementById("gameOverScreen").classList.remove("hidden");
  document.getElementById("finalScore").textContent = score;
  document.getElementById("finalHighscore").textContent = highscore;
}
