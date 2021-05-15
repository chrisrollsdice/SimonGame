/**
 * Simon, a memory game.
 * All code in this file is by ChrisRollsDice.
 * simpleTones.js by escottalexander (https://github.com/escottalexander/simpleTones.js)
 */

// Game Classes
class Button {
  constructor(documentButton, onClick, tone) {
    this.documentButton = documentButton;
    this.onClick = onClick;
    this.documentButton.addEventListener("click", () => {
      this.onClick();
    });
    this.documentButton.addEventListener("click", () => this.activate());
    this.tone = tone;
  }
  activate = function () {
    this.documentButton.classList.add("active");
    playSound("sine", this.tone, clickTime / 1000);
    setTimeout(() => {
      this.documentButton.classList.remove("active");
    }, clickTime);
  };
  disable = function () {
    this.documentButton.disabled = true;
  };
  enable = function () {
    this.documentButton.disabled = false;
  };
}

// Game Variables
const clickTime = 350;
const colors = ["red", "yellow", "green", "blue"];

const redButton = new Button(
  document.querySelector(".redButton"),
  () => pressButton("red"),
  400
);
const yellowButton = new Button(
  document.querySelector(".yellowButton"),
  () => pressButton("yellow"),
  500
);
const greenButton = new Button(
  document.querySelector(".greenButton"),
  () => pressButton("green"),
  600
);
const blueButton = new Button(
  document.querySelector(".blueButton"),
  () => pressButton("blue"),
  300
);

const scoreDisplay = document.querySelector(".scoreDisplay");
const message = document.querySelector(".message");
const restart = document.querySelector(".restartGame");
const highScoreDisplay = document.querySelector(".highScoreDisplay");

let correctInputs = [""];
let userInputs = [];
let score = 0;
let inGame = false;

// Game Flow
function pressButton(color) {
  if (inGame) {
    userInputs.push(color);

    if (
      userInputs[userInputs.length - 1] == correctInputs[userInputs.length] &&
      userInputs.length >= correctInputs.length - 1
    ) {
      nextRound();
    } else if (
      userInputs[userInputs.length - 1] != correctInputs[userInputs.length]
    ) {
      endGame();
    }
  }
}
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
function setControlable(controlEnabled) {
  if (controlEnabled === true) {
    redButton.enable();
    yellowButton.enable();
    greenButton.enable();
    blueButton.enable();
  } else {
    redButton.disable();
    yellowButton.disable();
    greenButton.disable();
    blueButton.disable();
  }
}
async function nextRound() {
  userInputs = [];
  score++;
  updateHighScore();
  scoreDisplay.textContent = score;
  correctInputs.push(colors[Math.floor(Math.random() * 4)]);
  message.textContent = "Watch and listen!";
  await showPattern(correctInputs);
  message.textContent = "Your turn!";
}
async function showPattern(pattern) {
  setControlable(false);
  let x = await sleep(300);
  for (light in pattern) {
    if (light > 0) {
      flashLight(pattern[light]);
    }
    let x = await sleep(500);
  }
  setControlable(true);
}
function flashLight(color) {
  let button;
  switch (color) {
    case "red":
      button = redButton;
      break;
    case "yellow":
      button = yellowButton;
      break;
    case "green":
      button = greenButton;
      break;
    case "blue":
      button = blueButton;
      break;
    default:
      button = redButton;
      break;
  }
  button.activate();
}
function updateHighScore() {
  if (score > Number(localStorage.getItem("highscore"))) {
    localStorage.setItem("highscore", String(score));
  }
  highScoreDisplay.textContent = localStorage.getItem("highscore");
}
function endGame() {
  playSound("buzzer");
  message.textContent = "You pressed the wrong button!";
  restart.disabled = false;
  restart.textContent = "Restart Game";
  updateHighScore();
  inGame = false;
}
function newGame() {
  correctInputs = [""];
  inGame = true;
  score = 0;
  message.textContent = "Keep going for a high score!";
  highScoreDisplay.textContent =
    "High Score: " + localStorage.getItem("highscore");
  nextRound();
}
function main() {
  if (localStorage.getItem("highscore") === null) {
    localStorage.setItem("highscore", "1");
  }
  highScoreDisplay.textContent = localStorage.getItem("highscore");
  restart.addEventListener("click", () => {
    restart.disabled = true;
    newGame();
  });
  document.querySelector(".back").addEventListener("click", () => {
    window.location.replace("../index.html");
  });
}

main();
