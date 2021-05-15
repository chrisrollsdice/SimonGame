/**
 * Simon, a memory game.
 * This version allows for custom numbers of buttons!
 * All code in this file is by ChrisRollsDice.
 * simpleTones.js by escottalexander (https://github.com/escottalexander/simpleTones.js)
 * tinycolor.js by Brian Grinstead
 */

// Game Object Types
class Button {
  constructor(documentButton, tone, onColor, offColor) {
    this.documentButton = documentButton;
    this.documentButton.addEventListener("click", () => {
      this.userPress();
    });
    this.documentButton.addEventListener("click", () => this.activate());
    this.tone = tone;
    this.onColor = onColor;
    this.offColor = offColor;
    this.documentButton.style.backgroundColor = this.offColor;
  }
  activate = function () {
    this.documentButton.style.backgroundColor = this.onColor;
    playSound("sine", this.tone, clickTime / 1000);
    setTimeout(() => {
      this.documentButton.style.backgroundColor = this.offColor;
    }, clickTime);
  };
  disable = function () {
    this.documentButton.disabled = true;
  };
  enable = function () {
    this.documentButton.disabled = false;
  };
  userPress = function () {
    if (inGame) {
      userInputs.push(this);
  
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
}

// Game Variables
const clickTime = 350;
const classicRedirect = "../classic/game.html";
const minTone = 200;
const maxTone = 700;
const colors = [
  "AliceBlue", "AntiqueWhite", "Aqua", "Aquamarine",
  "Azure", "Beige", "Bisque", "BlanchedAlmond", "Blue",
  "BlueViolet", "BurlyWood", "CadetBlue", "Chartreuse",
  "Chocolate", "Coral", "CornflowerBlue", "Cornsilk",
  "Crimson",
  "DodgerBlue", "FireBrick", "ForestGreen", "Fuchsia",
  "Gainsboro", "GhostWhite", "Gold", "GoldenRod", "Gray",
  "Green", "GreenYellow", "HoneyDew", "HotPink", "IndianRed",
  "Indigo", "Ivory", "Khaki", "Lavender", "LavenderBlush",
  "LawnGreen", "LemonChiffon", "Lime", "LimeGreen", "Linen",
  "Magenta", "Maroon", "MediumAquaMarine", "MediumBlue",
  "MediumOrchid", "MediumPurple", "MediumSeaGreen",
  "MediumSlateBlue", "MediumSpringGreen", "MediumTurquoise",
  "MediumVioletRed", "MidnightBlue", "MintCream", "MistyRose",
  "Moccasin", "NavajoWhite", "Navy", "OldLace", "Olive",
  "OliveDrab", "Orange", "OrangeRed", "Orchid", "PaleGoldenRod",
  "PaleGreen", "PaleTurquoise", "PaleVioletRed", "PapayaWhip",
  "PeachPuff", "Peru", "Pink", "Plum", "PowderBlue", "Purple",
  "RebeccaPurple", "Red", "RosyBrown", "RoyalBlue", "SaddleBrown",
  "Salmon", "SandyBrown", "SeaGreen", "SeaShell", "Sienna",
  "Silver", "SkyBlue", "SlateBlue", "SlateGray", "SlateGrey",
  "Snow", "SpringGreen", "SteelBlue", "Tan", "Teal", "Thistle",
  "Tomato", "Turquoise", "Violet", "Wheat", "WhiteSmoke", "Yellow", "YellowGreen",
];

const scoreDisplay = document.querySelector(".scoreDisplay");
const message = document.querySelector(".message");
const restart = document.querySelector(".restartGame");
const highScoreDisplay = document.querySelector(".highScoreDisplay");
const table = document.querySelector(".simon");

let correctInputs = [""];
let userInputs = [];
let buttons = [];
let score = 0;
let inGame = false;
let width, height;

// Game Flow
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
function setControlable(controlEnabled) {
  if (controlEnabled === true) {
    for (bttn in buttons) {
      buttons[bttn].enable();
    }
  } else {
    for (bttn in buttons) {
      buttons[bttn].disable();
    }
  }
}
async function nextRound() {
  userInputs = [];
  score++;
  scoreDisplay.textContent = score;
  correctInputs.push(buttons[Math.floor(Math.random() * buttons.length)]);
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
  color.activate();
}
function generateButtons() {
  let index = 0;
  for (let y = 0; y < height; y++) {
    let row = document.createElement("tr");
    for (let x = 0; x < width; x++) {
      let item = document.createElement("td");
      let button = document.createElement("button");
      button.classList = ['game'];
      button.style.width = (80 / width) + "vw";
      button.style.height = (80 / height) + "vh";

      let colorI = Math.floor(Math.random() * colors.length + 1);
      let color = colors[colorI];
      colors.splice(colorI, 1);
      color = tinycolor(color);

      let bttn = new Button (
        button,
        ((index / (width * height)) * (maxTone - minTone)) + minTone,
        onColor = color.toString(),
        offColor = color.darken().toString()
      );
      buttons.push(bttn);

      item.appendChild(button);
      row.appendChild(item);

      index++;
    }
    table.appendChild(row);
  }
}
function endGame() {
  playSound("buzzer");
  message.textContent = "You pressed the wrong button!";
  restart.disabled = false;
  restart.textContent = "Restart Game";
  inGame = false;
}
function newGame() {
  correctInputs = [""];
  inGame = true;
  score = 0;
  message.textContent = "Have fun with these challenges!";
  nextRound();
}
function main() {
  let urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has('width') && urlParams.has('width')) {
      width = urlParams.get('width');
      height = urlParams.get('height');
      if (width < 2 || height < 2) {
        window.location.replace(classicRedirect);
      }
      if (width > 10) {width = 10};
      if (height > 10) {height = 10};
      generateButtons();
  } else {
    window.location.replace(classicRedirect);
  }
  restart.addEventListener("click", () => {
    restart.disabled = true;
    newGame();
  });
  document.querySelector(".back").addEventListener("click", () => {
    window.location.replace("../index.html");
  });
}

main();