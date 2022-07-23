// Started on July 25th, extensive research in general.

// Stopped Working on 08/20/2021
// Switched to node to host

import { Vector2 } from "./core/math/vector2.js";
import { linearBezier, Path } from "./core/math/path.js";
import { Text } from "./core/text.js";
import { withinBounds } from "./core/gameplay/collision.js";
import { Entity } from "./core/entities/entity.js";

// Canvas Properties
const foreground = document.querySelector('#foreground');
const ctx = foreground.getContext('2d');
foreground.width = parseInt(window.getComputedStyle(foreground).getPropertyValue('width'), 10);
foreground.height = parseInt(window.getComputedStyle(foreground).getPropertyValue('height'), 10);

const prerender = document.querySelector('#prerender');
const ptx = prerender.getContext('2d');
prerender.width = parseInt(window.getComputedStyle(prerender).getPropertyValue('width'), 10);
prerender.height = parseInt(window.getComputedStyle(prerender).getPropertyValue('height'), 10);

const background = document.querySelector('#background');
const dtx = background.getContext('2d');
background.width = window.innerWidth;
background.height = window.innerHeight;

ctx.fillStyle = "white";
ctx.strokeStyle = "white";
ptx.fillStyle = "white";
ptx.strokeStyle = "white";
dtx.fillStyle = "white";
dtx.strokeStyle = "white";

// ----------------------------- Pre-initializations ----------------------------- //
const paths = [];

// Screen Properties
class Surface {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }
}
const screen = new Surface(0, 0, foreground.width, foreground.height);

class Grid {
  constructor(rows = 0, columns = 0) {
    this.rows = rows;
    this.columns = columns;
    this.divX = (screen.width / rows);
    this.divY = (screen.height / columns);
    this.boxes = [];

    let temp = [];
    for (let i = 0; i < rows; i++) {
      temp = [];
      for (let j = 0; j < columns; j++) {
        temp.push(new Vector2(0 + j * this.divX, 0 + i * this.divY));
      }
      this.boxes.push(temp);
    }
  }

  draw(canvas) {
    for (const r of this.boxes) {
      for (const c of r) {
        canvas.strokeRect(c.x, c.y, (screen.width / this.boxes.length), (screen.height / r.length));
      }
    }
  }
}
const grid = new Grid(16, 16);

// Default Paths, more can be added but will only add more complexity.
const EDITORPATH = new Path();

const ENTRANCEPATH_1 = new Path();
ENTRANCEPATH_1.addPoint(new Vector2(grid.boxes[0][7].x, grid.boxes[0][7].y));
ENTRANCEPATH_1.addPoint(new Vector2(grid.boxes[2][2].x, grid.boxes[2][2].y));
ENTRANCEPATH_1.addPoint(new Vector2(grid.boxes[7][2].x, grid.boxes[7][2].y));
ENTRANCEPATH_1.addPoint(new Vector2(grid.boxes[10][3].x, grid.boxes[10][3].y));
ENTRANCEPATH_1.addPoint(new Vector2(grid.boxes[10][5].x, grid.boxes[10][5].y));
ENTRANCEPATH_1.addPoint(new Vector2(grid.boxes[8][6].x, grid.boxes[8][6].y));

const ENTRANCEPATH_2 = new Path();
ENTRANCEPATH_2.addPoint(new Vector2(grid.boxes[0][9].x, grid.boxes[0][9].y));
ENTRANCEPATH_2.addPoint(new Vector2(grid.boxes[2][14].x, grid.boxes[2][14].y));
ENTRANCEPATH_2.addPoint(new Vector2(grid.boxes[7][14].x, grid.boxes[7][14].y));
ENTRANCEPATH_2.addPoint(new Vector2(grid.boxes[10][13].x, grid.boxes[10][13].y));
ENTRANCEPATH_2.addPoint(new Vector2(grid.boxes[10][11].x, grid.boxes[10][11].y));
ENTRANCEPATH_2.addPoint(new Vector2(grid.boxes[8][10].x, grid.boxes[8][10].y));

const ENTRANCEPATH_3 = new Path();
ENTRANCEPATH_3.addPoint(new Vector2(grid.boxes[11][0].x, grid.boxes[11][0].y));
ENTRANCEPATH_3.addPoint(new Vector2(grid.boxes[8][3].x, grid.boxes[8][3].y));
ENTRANCEPATH_3.addPoint(new Vector2(grid.boxes[8][4].x, grid.boxes[8][4].y));
ENTRANCEPATH_3.addPoint(new Vector2(grid.boxes[9][5].x, grid.boxes[9][5].y));
ENTRANCEPATH_3.addPoint(new Vector2(grid.boxes[10][5].x, grid.boxes[10][5].y));
ENTRANCEPATH_3.addPoint(new Vector2(grid.boxes[11][4].x, grid.boxes[11][4].y));
ENTRANCEPATH_3.addPoint(new Vector2(grid.boxes[11][3].x, grid.boxes[11][3].y));
ENTRANCEPATH_3.addPoint(new Vector2(grid.boxes[10][2].x, grid.boxes[10][2].y));
ENTRANCEPATH_3.addPoint(new Vector2(grid.boxes[9][2].x, grid.boxes[9][2].y));
ENTRANCEPATH_3.addPoint(new Vector2(grid.boxes[7][4].x, grid.boxes[7][4].y));

const ENTRANCEPATH_4 = new Path();
ENTRANCEPATH_4.addPoint(new Vector2(grid.boxes[11][15].x + grid.divX, grid.boxes[11][15].y));
ENTRANCEPATH_4.addPoint(new Vector2(grid.boxes[8][13].x, grid.boxes[8][13].y));
ENTRANCEPATH_4.addPoint(new Vector2(grid.boxes[8][12].x, grid.boxes[8][12].y));
ENTRANCEPATH_4.addPoint(new Vector2(grid.boxes[9][11].x, grid.boxes[9][11].y));
ENTRANCEPATH_4.addPoint(new Vector2(grid.boxes[10][11].x, grid.boxes[10][11].y));
ENTRANCEPATH_4.addPoint(new Vector2(grid.boxes[11][12].x, grid.boxes[11][12].y));
ENTRANCEPATH_4.addPoint(new Vector2(grid.boxes[11][13].x, grid.boxes[11][13].y));
ENTRANCEPATH_4.addPoint(new Vector2(grid.boxes[10][14].x, grid.boxes[10][14].y));
ENTRANCEPATH_4.addPoint(new Vector2(grid.boxes[9][14].x, grid.boxes[9][14].y));
ENTRANCEPATH_4.addPoint(new Vector2(grid.boxes[7][12].x, grid.boxes[7][12].y));

const GOEIPATH_1 = new Path()
GOEIPATH_1.addPoint(new Vector2(grid.boxes[3][4].x, grid.boxes[3][4].y));
GOEIPATH_1.addPoint(new Vector2(grid.boxes[3][4].x - grid.divX / 2, grid.boxes[3][4].y - grid.divY / 2));
GOEIPATH_1.addPoint(new Vector2(grid.boxes[3][3].x, grid.boxes[3][3].y));
GOEIPATH_1.addPoint(new Vector2(grid.boxes[7][2].x, grid.boxes[7][2].y));
GOEIPATH_1.addPoint(new Vector2(grid.boxes[8][5].x, grid.boxes[8][5].y));
GOEIPATH_1.addPoint(new Vector2(grid.boxes[10][7].x, grid.boxes[10][7].y));
GOEIPATH_1.addPoint(new Vector2(grid.boxes[14][1].x - grid.divX, grid.boxes[14][1].y + grid.divY * 2));

const GOEIPATH_2 = new Path();
GOEIPATH_2.addPoint(new Vector2(grid.boxes[3][11].x, grid.boxes[3][11].y));
GOEIPATH_2.addPoint(new Vector2(grid.boxes[3][12].x + grid.divX / 2, grid.boxes[3][12].y - grid.divY / 2));
GOEIPATH_2.addPoint(new Vector2(grid.boxes[3][13].x, grid.boxes[3][13].y));
GOEIPATH_2.addPoint(new Vector2(grid.boxes[7][14].x, grid.boxes[7][14].y));
GOEIPATH_2.addPoint(new Vector2(grid.boxes[8][11].x, grid.boxes[8][11].y));
GOEIPATH_2.addPoint(new Vector2(grid.boxes[10][9].x, grid.boxes[10][9].y));
GOEIPATH_2.addPoint(new Vector2(grid.boxes[14][15].x + grid.divX, grid.boxes[14][15].y + grid.divY * 2));

const ZAKOPATH_1 = new Path();
ZAKOPATH_1.addPoint(new Vector2(grid.boxes[5][3].x, grid.boxes[5][3].y));
ZAKOPATH_1.addPoint(new Vector2(grid.boxes[5][3].x - grid.divX / 2, grid.boxes[5][3].y - grid.divY / 2));
ZAKOPATH_1.addPoint(new Vector2(grid.boxes[5][2].x, grid.boxes[5][2].y));
ZAKOPATH_1.addPoint(new Vector2(grid.boxes[8][6].x, grid.boxes[8][6].y));
ZAKOPATH_1.addPoint(new Vector2(grid.boxes[11][7].x, grid.boxes[11][7].y));
ZAKOPATH_1.addPoint(new Vector2(grid.boxes[14][6].x, grid.boxes[14][6].y));
ZAKOPATH_1.addPoint(new Vector2(grid.boxes[14][3].x, grid.boxes[14][3].y));
ZAKOPATH_1.addPoint(new Vector2(grid.boxes[11][2].x, grid.boxes[11][2].y));
ZAKOPATH_1.addPoint(new Vector2(grid.boxes[8][3].x, grid.boxes[8][3].y));

const ZAKOPATH_2 = new Path();
ZAKOPATH_2.addPoint(new Vector2(grid.boxes[5][12].x, grid.boxes[5][12].y));
ZAKOPATH_2.addPoint(new Vector2(grid.boxes[5][13].x + grid.divX / 2, grid.boxes[5][13].y - grid.divY / 2));
ZAKOPATH_2.addPoint(new Vector2(grid.boxes[5][14].x, grid.boxes[5][14].y));
ZAKOPATH_2.addPoint(new Vector2(grid.boxes[8][10].x, grid.boxes[8][10].y));
ZAKOPATH_2.addPoint(new Vector2(grid.boxes[11][9].x, grid.boxes[11][9].y));
ZAKOPATH_2.addPoint(new Vector2(grid.boxes[14][10].x, grid.boxes[14][10].y));
ZAKOPATH_2.addPoint(new Vector2(grid.boxes[14][13].x, grid.boxes[14][13].y));
ZAKOPATH_2.addPoint(new Vector2(grid.boxes[11][14].x, grid.boxes[11][14].y));
ZAKOPATH_2.addPoint(new Vector2(grid.boxes[8][13].x, grid.boxes[8][13].y));

const BOSUGYARAGAPATH_1 = new Path();
BOSUGYARAGAPATH_1.addPoint(new Vector2(grid.boxes[2][6].x, grid.boxes[2][6].y));
BOSUGYARAGAPATH_1.addPoint(new Vector2(grid.boxes[2][6].x - grid.divX / 2, grid.boxes[2][6].y - grid.divY / 2));
BOSUGYARAGAPATH_1.addPoint(new Vector2(grid.boxes[2][5].x, grid.boxes[2][5].y));
BOSUGYARAGAPATH_1.addPoint(new Vector2(grid.boxes[5][2].x, grid.boxes[5][2].y));
BOSUGYARAGAPATH_1.addPoint(new Vector2(grid.boxes[8][3].x, grid.boxes[8][3].y));
BOSUGYARAGAPATH_1.addPoint(new Vector2(grid.boxes[7][5].x, grid.boxes[7][5].y));
BOSUGYARAGAPATH_1.addPoint(new Vector2(grid.boxes[10][7].x, grid.boxes[10][7].y));
BOSUGYARAGAPATH_1.addPoint(new Vector2(grid.boxes[15][5].x, grid.boxes[15][5].y + grid.divY));

const BOSUGYARAGAPATH_2 = new Path();
BOSUGYARAGAPATH_2.addPoint(new Vector2(grid.boxes[2][9].x, grid.boxes[2][9].y));
BOSUGYARAGAPATH_2.addPoint(new Vector2(grid.boxes[2][10].x + grid.divX / 2, grid.boxes[2][10].y - grid.divY / 2));
BOSUGYARAGAPATH_2.addPoint(new Vector2(grid.boxes[2][11].x, grid.boxes[2][11].y));
BOSUGYARAGAPATH_2.addPoint(new Vector2(grid.boxes[5][14].x, grid.boxes[5][14].y));
BOSUGYARAGAPATH_2.addPoint(new Vector2(grid.boxes[8][13].x, grid.boxes[8][13].y));
BOSUGYARAGAPATH_2.addPoint(new Vector2(grid.boxes[7][11].x, grid.boxes[7][11].y));
BOSUGYARAGAPATH_2.addPoint(new Vector2(grid.boxes[10][9].x, grid.boxes[10][9].y));
BOSUGYARAGAPATH_2.addPoint(new Vector2(grid.boxes[15][11].x, grid.boxes[15][11].y + grid.divY));

paths.push(ENTRANCEPATH_1); // 0
paths.push(ENTRANCEPATH_2); // 1
paths.push(ENTRANCEPATH_3); // 2
paths.push(ENTRANCEPATH_4); // 3

// Bosu Gyaraga Attack Paths
let pl1 = paths.length;
for (let i = 0; i < 2; i++) { // 4, 5
  paths.push(BOSUGYARAGAPATH_1.clone());
  paths[pl1 + i].modifyPoints(grid.divX * i, "x");
}
pl1 = paths.length;
for (let i = 0; i < 2; i++) { // 6, 7
  paths.push(BOSUGYARAGAPATH_2.clone());
  paths[pl1 + i].modifyPoints(-grid.divX * i, "x");
}

// Goei Attack Paths
pl1 = paths.length;
for (let i = 0; i < 4; i++) { // 8, 9, 10, 11
  paths.push(GOEIPATH_1.clone());
  paths[pl1 + i].modifyPoints(grid.divX * i, "x");
}
pl1 = paths.length;
for (let i = 0; i < 4; i++) { // 12, 13, 14, 15
  paths.push(GOEIPATH_2.clone());
  paths[pl1 + i].modifyPoints(-grid.divX * i, "x");
}
pl1 = paths.length;
for (let i = 0; i < 4; i++) { // 16, 17, 18, 19
  paths.push(GOEIPATH_1.clone());
  paths[pl1 + i].modifyPoints(grid.divX * i, "x");
  paths[pl1 + i].modifyPoints(grid.divY, "y");
}
pl1 = paths.length;
for (let i = 0; i < 4; i++) { // 20, 21, 22, 23
  paths.push(GOEIPATH_2.clone());
  paths[pl1 + i].modifyPoints(-grid.divX * i, "x");
  paths[pl1 + i].modifyPoints(grid.divY, "y");
}

// Zako Attack Paths
pl1 = paths.length;
for (let i = 0; i < 5; i++) { // 24, 25, 26, 27, 28
  paths.push(ZAKOPATH_1.clone());
  paths[pl1 + i].modifyPoints(grid.divX * i, "x");
}
pl1 = paths.length;
for (let i = 0; i < 5; i++) { // 29, 30, 31, 32, 33
  paths.push(ZAKOPATH_2.clone());
  paths[pl1 + i].modifyPoints(-grid.divX * i, "x");
}
pl1 = paths.length;
for (let i = 0; i < 5; i++) { // 34, 35, 36, 37, 38
  paths.push(ZAKOPATH_1.clone());
  paths[pl1 + i].modifyPoints(grid.divX * i, "x");
  paths[pl1 + i].modifyPoints(grid.divY, "y");
}
pl1 = paths.length;
for (let i = 0; i < 5; i++) { // 39, 40, 41, 42, 43
  paths.push(ZAKOPATH_2.clone());
  paths[pl1 + i].modifyPoints(-grid.divX * i, "x");
  paths[pl1 + i].modifyPoints(grid.divY, "y");
}

// Game IMG Files
const imgs = [];
imgs.push(new Image());
imgs.push(new Image());
imgs[0].src = "assets/images/logo.png";
imgs[1].src = "assets/images/spritesheet.png";

// Game BGM Files
//const bgms = [];
//bgms.push(new Audio("assets/sounds/bgm/w0.mp3"));
//bgms.push(new Audio("assets/sounds/bgm/w1.mp3"));
//bgms.push(new Audio("assets/sounds/bgm/w2.mp3"));
//bgms.push(new Audio("assets/sounds/bgm/w3.mp3"));

// Game SFX Files
const sfxs = [];
sfxs.push(new Audio("assets/sounds/sfx/bossgalaga_destroyed.wav"));    // 0
sfxs.push(new Audio("assets/sounds/sfx/bossgalaga_destroyed2.wav"));   // 1
sfxs.push(new Audio("assets/sounds/sfx/bossgalaga_hatch.wav"));        // 2
sfxs.push(new Audio("assets/sounds/sfx/bossgalaga_injured.wav"));      // 3
sfxs.push(new Audio("assets/sounds/sfx/bossgalaga_injured2.wav"));     // 4
sfxs.push(new Audio("assets/sounds/sfx/captured_ship_destroyed.wav")); // 5
sfxs.push(new Audio("assets/sounds/sfx/coin_credit.wav"));             // 6
sfxs.push(new Audio("assets/sounds/sfx/explosion.wav"));               // 7
sfxs.push(new Audio("assets/sounds/sfx/extra_ship.wav"));              // 8
sfxs.push(new Audio("assets/sounds/sfx/fighter_captured.wav"));        // 9
sfxs.push(new Audio("assets/sounds/sfx/fighter_destroyed.wav"));       // 10
sfxs.push(new Audio("assets/sounds/sfx/fighter_rescued.wav"));         // 11
sfxs.push(new Audio("assets/sounds/sfx/galaga_destroyed.wav"));        // 12
sfxs.push(new Audio("assets/sounds/sfx/galaga_destroyed2.wav"));       // 13
sfxs.push(new Audio("assets/sounds/sfx/galaga_dive.wav"));             // 14
sfxs.push(new Audio("assets/sounds/sfx/galaga_grumble.wav"));          // 15
sfxs.push(new Audio("assets/sounds/sfx/laser_default.wav"));           // 16
sfxs.push(new Audio("assets/sounds/sfx/laser_fastshot.wav"));          // 17
sfxs.push(new Audio("assets/sounds/sfx/laser_ricochetshot.wav"));      // 18
sfxs.push(new Audio("assets/sounds/sfx/laser_widebeam.wav"));          // 19
sfxs.push(new Audio("assets/sounds/sfx/powerup.wav"));                 // 20
sfxs.push(new Audio("assets/sounds/sfx/result_screen_beep.wav"));      // 21
sfxs.push(new Audio("assets/sounds/sfx/tractor_beam1.wav"));           // 22
sfxs.push(new Audio("assets/sounds/sfx/tractor_beam2.wav"));           // 23
sfxs.push(new Audio("assets/sounds/sfx/tractor_beam3.wav"));           // 24

// Game Settings [NUMBERS]
const fps = 60;
const fontSize = 18;

// Game Settings [STRINGS]
const font = fontSize + "px Galaxian";

// Game Runtime Variables
let programElapsedTime = 0;
let framerate = 1000 / fps;
const currentKeysPressed = {};
const currentButtonsPressed = {};
let highscore = 0;

// Setup Keyboard Input
function onKeydown(event) { currentKeysPressed[event.key] = true; }
function onKeyup(event) { currentKeysPressed[event.key] = false; }
window.addEventListener("keydown", onKeydown);
window.addEventListener("keyup", onKeyup);

// Setup Mouse Input
let mouseX = 0;
let mouseY = 0;

function onMousemove(event) {
  mouseX = event.clientX;
  mouseY = event.clientY;
}
function onMousedown(event) { currentButtonsPressed[event.button] = 1; }
function onMouseup(event) { currentButtonsPressed[event.button] = 0; }
window.addEventListener("mousemove", onMousemove);
window.addEventListener("mousedown", onMousedown);
window.addEventListener("mouseup", onMouseup);

// ----------------------------- Helper Classes ----------------------------- //

const texts = [];
texts.push(new Text(grid.boxes[0][grid.rows / 2].x, grid.boxes[grid.columns / 2 + 1][grid.rows / 2].y, "PLAY PLAYER 1", "white", false));
texts.push(new Text(grid.boxes[0][grid.rows / 2].x, grid.boxes[grid.columns / 2 + 2][grid.rows / 2].y, "PLAY PLAYER 2 (NOT WORKING)", "white", false));
texts.push(new Text(grid.boxes[0][grid.rows / 2].x, grid.boxes[grid.columns / 2 + 3][grid.rows / 2].y, "LEVEL EDITOR (NOT WORKING) ", "white", false));
texts.push(new Text(grid.boxes[0][grid.rows / 2].x, grid.boxes[grid.columns / 2][grid.rows / 2].y, "START", "red", false));
texts.push(new Text(grid.boxes[0][grid.rows / 2].x, grid.boxes[grid.columns / 2][grid.rows / 2].y, "PAUSED", "cyan", false));
texts.push(new Text(grid.boxes[0][grid.rows / 2].x, grid.boxes[grid.columns / 2][grid.rows / 2].y, "STAGE " + 0, "cyan", false));
texts.push(new Text(grid.boxes[0][grid.rows / 2].x, grid.boxes[grid.columns / 2][grid.rows / 2].y, "READY", "red", false));
texts.push(new Text(grid.boxes[0][grid.rows / 2].x, grid.boxes[0][1].y + fontSize * 2, "HIGHSCORE", "red", false));
texts.push(new Text(grid.boxes[0][1].x, grid.boxes[0][1].y + fontSize * 2, "1UP", "red", false));
texts.push(new Text(screen.width / 2, fontSize * 3 + 4, "" + 0, "white", false));
texts.push(new Text(grid.boxes[0][1].x, grid.boxes[0][1].y + fontSize * 3 + 4, "" + 0, "white", false));
texts.push(new Text(grid.boxes[2][0].x, grid.boxes[2][0].y, "Time Elapsed: " + 0, "white", false));
texts.push(new Text(grid.boxes[3][0].x, grid.boxes[3][0].y, "Current Game State: " + null, "white", false));

for (let i = 4; i < grid.columns; i++) {
  texts.push(new Text(grid.boxes[i][0].x, grid.boxes[i][0].y, "Entity State: " + null, "white", false));
}

texts[0].center();
texts[1].center();
texts[2].center();
texts[3].center();
texts[4].center();
texts[5].center();
texts[6].center();
texts[7].center();
texts[8].center();
texts[9].center();
texts[10].center();
//texts[11].center();
//texts[12].center();

const gridTexts = [];
for (let i = 0; i < grid.rows; i++) {
  for (let j = 0; j < grid.columns; j++) {
    gridTexts.push(new Text(grid.boxes[i][j].x + grid.divX / 2, grid.boxes[i][j].y + grid.divY / 2, "(" + i + ", " + j + ")", "red", true, fontSize / 2));
    gridTexts[i * grid.columns + j].center();
  }
}

// Class Galaxies used for particles.
class Star {
  constructor(speed = 5, colour = "white") {
    this.x = Math.floor(screen.x + (Math.random() * screen.width));
    this.y = Math.floor(screen.y + (Math.random() * screen.height));
    this.radius = Math.random() * 2 + 1;
    this.speed = speed;
    this.colour = colour;
  }

  drop() {
    if ((this.y + this.speed > screen.y + screen.height) ||
      (this.y + this.speed < 0)) {
      this.y = screen.y;
    }
    this.y += this.speed;
  }

  draw(canvas) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fillStyle = this.colour;
    ctx.fill();
  }
}

class ShootingStar {
  constructor(speed = 10, colour = "white") {
    this.x = Math.floor(screen.x + (Math.random() * screen.width));
    this.y = Math.floor(screen.y + (Math.random() * screen.height));
    this.length = Math.random() * 30 + 10;
    this.speed = speed;
    this.colour = colour;
  }

  drop() {
    if ((this.y + this.length + this.speed > screen.y + screen.height) ||
      (this.y + this.length + this.speed < 0)) {
      this.y = screen.y;
    }
    this.y += this.speed;
  }

  draw(canvas) {
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x, this.y + this.length);
    ctx.closePath();
    ctx.strokeStyle = this.colour;
    ctx.stroke();
  }
}
const stars = [];
const colours = ["white", "cyan", "magenta", "yellow", "red", "green", "blue", "orange"];

for (let i = 0; i < 60; i++) {
  stars.push(new Star(Math.random() * 10 + 1, colours[Math.round(Math.random() * colours.length - 1)]));
  if (i % 2 == 0) {
    stars.push(new ShootingStar(Math.random() * 10 + 10, colours[Math.round(Math.random() * colours.length - 1)]));
  }
}

// ----------------------------- Game Specific Classes ----------------------------- //

class Laser extends Entity {
  constructor(x = 0, y = 0, speed = 15) {
    super(x, y, speed);
    this.setWidth(grid.divX);
    this.setHeight(grid.divY);
  }

  move(direction) {
    if (direction === "up" && this.visible) { // Player Lasers.
      if (this.y - this.speed > 0) { this.y = this.y - this.speed; }
      else {
        this.setVisibility(false);
        this.y = -1000;
      }
    }
    else if (direction === "down" && this.visible) { // Enemy Lasers.
      if (this.x - Math.cos(this.angle) * this.speed > 0 &&
        this.x - Math.cos(this.angle) * this.speed < screen.width &&
        this.y - Math.sin(this.angle) * this.speed > 0 &&
        this.y - Math.sin(this.angle) * this.speed < screen.height) {
        this.x = this.x - Math.cos(this.angle) * this.speed;
        this.y = this.y - Math.sin(this.angle) * this.speed;
      } else {
        this.setVisibility(false);
        this.y = -1000;
        this.x = -1000;
      }
    }
  }
}

class Gyaraga extends Entity {
  #currentExplosionFrame = -1;
  #explosionAnimation = 0;
  #explosionLength = 300;
  #isFullyDead = false;
  #isHit = false;

  constructor(x = 0, y = 0, speed = 10) {
    super(x, y, speed);
    this.upgrade = "default";
    this.lives = 2;

    this.lasers = [];
    for (let i = 0; i < 2; i++) {
      this.lasers.push(new Laser(-100, -100));
      this.lasers[i].setVisibility(false);
    }

    this.setWidth(grid.divX);
    this.setHeight(grid.divY);
  }

  gotDamaged() { this.#isHit = true; }
  getIsDamaged() { return this.#isHit; }
  getIsDead() { return this.#isFullyDead; }

  move(direction) {
    if (this.#currentExplosionFrame < 0) {
      if (this.x - this.speed >= screen.x && direction === "left") {
        this.x -= this.speed;
      }
      if (this.x + this.width <= screen.x + screen.width && direction === "right") {
        this.x += this.speed;
      }
    }
  }

  fire() {
    if (this.getIsDamaged() === false) { 
      for (const l of this.lasers) {
        if (!l.isAlive()) {
          l.setVisibility(true);
          l.x = this.x;
          l.y = this.y;
          if (!sfxs[16].paused) {
            sfxs[16].pause();
            sfxs[16].currentTime = 0;
          }
          sfxs[16].volume = 0.2;
          sfxs[16].play();
          break;
        }
      }
    }
  }

  explode(time) {
    if (this.isAlive() === true && this.#isFullyDead) {
      this.setVisibility(false);
    } else {
      if (this.#isFullyDead != true) {
        if (time >= this.#explosionAnimation) {
          this.#explosionAnimation = time + this.#explosionLength;
          if (this.#currentExplosionFrame < 4) {
            this.#currentExplosionFrame += 1;
          } else {
            this.#currentExplosionFrame = -1;
            this.#isFullyDead = true;
          }
        }
      }
    }
  }

  reset() {
    this.x = grid.boxes[grid.rows - 2][grid.columns / 2 - 1].x + grid.divX / 2;
    this.y = grid.boxes[grid.rows - 2][grid.columns / 2 - 1].y;
    this.#isHit = false;
    this.#isFullyDead = false;
  }

  draw(canvas) {
    // Display Player
    if (!(this.getIsDamaged())) {
      canvas.drawImage(imgs[1], 72 * 6, 0 + 72 * 0, 64, 64, this.x, this.y, this.width, this.height);
    } else { // Explosion
      if (this.#currentExplosionFrame === 0) {
        ctx.drawImage(imgs[1], 72 * 7 + 8 + 64 + 8 + 136 * 0, 0, 128, 128, this.x - this.width / 2, this.y - this.height / 2, this.width * 2, this.height * 2);
      } else if (this.#currentExplosionFrame === 1) {
        ctx.drawImage(imgs[1], 72 * 7 + 8 + 64 + 8 + 136 * 1, 0, 128, 128, this.x - this.width / 2, this.y - this.height / 2, this.width * 2, this.height * 2);
      } else if (this.#currentExplosionFrame === 2) {
        ctx.drawImage(imgs[1], 72 * 7 + 8 + 64 + 8 + 136 * 2, 0, 128, 128, this.x - this.width / 2, this.y - this.height / 2, this.width * 2, this.height * 2);
      } else if (this.#currentExplosionFrame === 3) {
        ctx.drawImage(imgs[1], 72 * 7 + 8 + 64 + 8 + 136 * 3, 0, 128, 128, this.x - this.width / 2, this.y - this.height / 2, this.width * 2, this.height * 2);
      }
    }

    // Display Player Lives
    for (let i = 0; i < this.lives; i++) {
      canvas.drawImage(imgs[1], 72 * 7 + 8 + 64 + 8 + 136 * 3 + 128 + 32 + 72 * 0, 128 + 16 + 328 + 72 * 3, 64, 64, grid.boxes[grid.rows - 1][i].x, grid.boxes[grid.rows - 1][i].y, this.width, this.height);
    }

    // Display Player Lasers
    for (const l of this.lasers) {
      if (l.isAlive()) {
        canvas.drawImage(imgs[1], 72 * 7 + 8 + 64 + 8 + 136 * 3 + 128 + 32 + 72 * 1, 128 + 16 + 328 + 72 * 0, 64, 64, l.x + l.width / 4, l.y, l.width / 2, l.height);
      }
    }
  }
}
const player = new Gyaraga(grid.boxes[grid.rows - 2][grid.columns / 2 - 1].x + grid.divX / 2, grid.boxes[grid.rows - 2][grid.columns / 2 - 1].y);
player.setVisibility(true);

class Enemy extends Entity {
  #animationDuration = 0;
  #animationCounter = 0;
  #entranceAnimationStart = 0;
  #entranceAnimationEnd = 0;
  #attackAnimationStart = 0;
  #attackAnimationEnd = 0;
  #cattackAnimationStart = 0;
  #cattackAnimationEnd = 0;
  #areturnAnimationStart = 0;
  #areturnAnimationEnd = 0;

  #explosionAnimation = 0;
  #explosionLength = 50;
  #isFullyDead = false;
  #randomLaserTimings = [];
  #randomLasersShot = [];
  #lasersShot = 0;

  constructor(x = 0, y = 0, entrancePath = null, attackPath = null, cattackPath = null, type = 0) {
    super(x, y, 3);
    this.#animationDuration = (this.speed * 1000);

    this.lasers = [];
    for (let i = 0; i < 2; i++) {
      this.lasers.push(new Laser(-100, -100, 10));
      this.lasers[i].setVisibility(false);
      this.#randomLaserTimings.push(Math.floor(Math.random() * 500) + 1);
      this.#randomLasersShot.push(false);
    }

    this.setWidth(grid.divX);
    this.setHeight(grid.divY);

    this.state = "WAIT";
    this.type = type; // type: 0 = Goei, 1 = Zako, 2 = BosuGyaraga

    this.entrancePath = entrancePath;
    this.attackPath = attackPath;
    this.cattackPath = cattackPath;
    this.returnPath = null;
    this.currentExplosionFrame = 0; // Really should be private.

    this.text = new Text(x, y, this.state, "white", false, 12);
  }

  setEntrancePath(entrancePath) { this.entrancePath = entrancePath; }
  setAttackPath(attackPath) { this.attackPath = attackPath; }
  setCAttackPath(cattackPath) { this.cattackPath = cattackPath; }
  generateReturnPath() {
    if (this.returnPath != null) {
      this.returnPath = null;
    }
    this.returnPath = new Path();
    this.returnPath.addPoint(new Vector2(this.x, this.y));
    this.returnPath.addPoint(new Vector2(this.x0 + grid.divX / 2, this.y0 + grid.divY / 2));
  }

  fire() {
    for (const l of this.lasers) {
      if (!l.isAlive()) {
        l.setVisibility(true);
        l.x = this.x;
        l.y = this.y;

        const v1 = new Vector2(player.x, player.y); // Setup angle and calculations.
        const v2 = new Vector2(this.x, this.y);
        const angle = Math.atan2(v2.y - v1.y, v2.x - v1.x);

        l.angle = angle;
        break;
      }
    }
  }

  enter(time) {
    if (this.#animationCounter == 2 || this.#animationCounter > 2) {
      this.#entranceAnimationStart = 0;
      this.#entranceAnimationEnd = 0;
      this.#animationCounter = 0;
      this.state = "RETURN";
    } else {
      if (time >= this.#entranceAnimationEnd) {
        this.#entranceAnimationStart = time;
        this.#entranceAnimationEnd = time + this.#animationDuration - 2000;
        this.#animationCounter += 1;
      } else {
        const b = this.entrancePath.followPathU((time - this.#entranceAnimationStart) / (this.#animationDuration - 2000));
        this.angle = this.entrancePath.getTangentAngleU((time - this.#entranceAnimationStart) / (this.#animationDuration - 2000));
        this.x = b.x;
        this.y = b.y;
      }
    }
  }

  attack(time) {
    if (this.#animationCounter == 2 || this.#animationCounter > 2) {
      this.#attackAnimationStart = 0;
      this.#attackAnimationEnd = 0;
      this.#animationCounter = 0;
      this.#lasersShot = 0;

      for (let i = 0; i < this.#randomLasersShot.length; i++) {
        this.#randomLasersShot[i] = false;
      }

      if (this.type == 0 || this.type == 2) {
        this.y = -50;
      }
      this.state = "RETURN";
    } else {
      if (time >= this.#attackAnimationEnd) {
        this.#attackAnimationStart = time;
        this.#attackAnimationEnd = time + this.#animationDuration - 1000;
        this.#animationCounter += 1;

        if (this.#animationCounter == 1) { // We only want to play the sound when they begin to dive.
          if (!sfxs[14].paused) {
            sfxs[14].pause();
            sfxs[14].currentTime = 0;
          }
          sfxs[14].volume = 0.05;
          sfxs[14].play();
        }
      } else {
        for (let i = 0; i < this.#randomLaserTimings.length; i++) { // For random Lasers being shot.
          if (time >= this.#attackAnimationStart + this.#randomLaserTimings[i]) {
            if (this.#lasersShot <= this.lasers.length && !(this.#randomLasersShot[i])) {
              this.fire();
              this.#randomLasersShot[i] = true; // Used to shoot only once.
              this.#lasersShot += 1;
            }
          }
        }
        const b = this.attackPath.followPathU((time - this.#attackAnimationStart) / (this.#animationDuration - 1000));
        this.angle = this.attackPath.getTangentAngleU((time - this.#attackAnimationStart) / (this.#animationDuration - 1000));
        this.x = b.x;
        this.y = b.y;
      }
    }
  }

  cattack(time) {

  }

  areturn(time) {
    if (this.#animationCounter == 2 || this.#animationCounter > 2) {
      this.#areturnAnimationStart = 0;
      this.#areturnAnimationEnd = 0;
      this.#animationCounter = 0;
      this.x = this.x0;
      this.y = this.y0;
      this.angle = 0;
      this.state = "WAIT";
    } else {
      if (this.returnPath = null) { // First Time Check
        this.generateReturnPath();
      }
      if (time >= this.#areturnAnimationEnd) {
        this.#areturnAnimationStart = time;
        this.#areturnAnimationEnd = time + (this.#animationDuration / 4);
        this.#animationCounter += 1;
      } else {
        this.generateReturnPath(); // Costly but is easily done.
        const b = this.returnPath.followPathU((time - this.#areturnAnimationStart) / (this.#animationDuration / 4));
        this.angle = this.returnPath.getTangentAngleU((time - this.#areturnAnimationStart) / (this.#animationDuration / 4));
        this.x = b.x;
        this.y = b.y;
      }
    }
  }

  dead(time) {
    if (this.isAlive() === true && this.#isFullyDead) {
      this.setVisibility(false);
    } else {
      if (this.#isFullyDead != true) {
        this.explode(time);
      }
    }
  }

  explode(time) {
    if (time >= this.#explosionAnimation) {
      this.#explosionAnimation = time + this.#explosionLength;
      if (this.currentExplosionFrame < 5) {
        this.currentExplosionFrame += 1;
      } else {
        if (!(this.#isFullyDead)) {
          this.#isFullyDead = true;
        }
      }
    }
  }

  handleStates(time) {
    switch (this.state) {
      case "ENTER":
        this.enter(time);
        break;
      case "WAIT":
        break;
      case "ATTACK":
        this.attack(time);
        break;
      case "CATTACK":
        this.cattack(time);
        break;
      case "RETURN":
        this.areturn(time);
        break;
      case "DEAD":
        this.dead(time);
        break;
    }
  }
}

class Goei extends Enemy {
  constructor(x = 0, y = 0, entrancePath = null, attackPath = null, cattackPath = null) {
    super(x, y, entrancePath, attackPath, cattackPath, 0);
  }

  animate(canvas, frame = 0) {
    this.text.updatePosition([this.x, this.y]);
    this.text.setText(this.state);
    this.text.draw(canvas);

    if (this.state != "WAIT" && this.state != "DEAD") {
      if (this.angle !== 0) {
        canvas.save();
        canvas.translate(this.x, this.y);
        canvas.rotate(this.angle + Math.PI / 2);
        canvas.drawImage(imgs[1], 72 * 6, 0 + 72 * 4, 64, 64, -this.width / 2, -this.height / 2, this.width, this.height);
        canvas.restore();
        //if(this.state == "ATTACK") { this.attackPath.draw(canvas); }
        //else if(this.state == "CATTACK") { this.cattackPath.draw(canvas); }
        //else if(this.state == "ENTER") { this.entrancePath.draw(canvas); }
        //else if(this.state == "RETURN") {
        //    if(this.returnPath != null) { this.returnPath.draw(canvas); }
        //}
      }
    } else if (this.state != "DEAD") {
      if (frame == 0) {
        canvas.drawImage(imgs[1], 72 * 6, 0 + 72 * 4, 64, 64, this.x, this.y, this.width, this.height);
      } else if (frame == 1) {
        canvas.drawImage(imgs[1], 72 * 7, 0 + 72 * 4, 64, 64, this.x, this.y, this.width, this.height);
      }
    } else {
      if (this.state === "DEAD") { // Double Check, since I hate dealing with debugging.
        if (this.currentExplosionFrame === 0) {
          canvas.drawImage(imgs[1], 72 * 7 + 8 + 64 + 8 + 136 * 3 + 128 + 32 + 136 * 0, 0, 128, 128, this.x - this.width / 2, this.y - this.height / 2, this.width * 2, this.height * 2);
        } else if (this.currentExplosionFrame === 1) {
          canvas.drawImage(imgs[1], 72 * 7 + 8 + 64 + 8 + 136 * 3 + 128 + 32 + 136 * 1, 0, 128, 128, this.x - this.width / 2, this.y - this.height / 2, this.width * 2, this.height * 2);
        } else if (this.currentExplosionFrame === 2) {
          canvas.drawImage(imgs[1], 72 * 7 + 8 + 64 + 8 + 136 * 3 + 128 + 32 + 136 * 2, 0, 128, 128, this.x - this.width / 2, this.y - this.height / 2, this.width * 2, this.height * 2);
        } else if (this.currentExplosionFrame === 3) {
          canvas.drawImage(imgs[1], 72 * 7 + 8 + 64 + 8 + 136 * 3 + 128 + 32 + 136 * 3, 0, 128, 128, this.x - this.width / 2, this.y - this.height / 2, this.width * 2, this.height * 2);
        } else if (this.currentExplosionFrame === 4) {
          canvas.drawImage(imgs[1], 72 * 7 + 8 + 64 + 8 + 136 * 3 + 128 + 32 + 136 * 4, 0, 128, 128, this.x - this.width / 2, this.y - this.height / 2, this.width * 2, this.height * 2);
        }
      }
    }

    for (const l of this.lasers) {
      if (l.isAlive()) {
        canvas.drawImage(imgs[1], 72 * 7 + 8 + 64 + 8 + 136 * 3 + 128 + 32 + 72 * 1, 128 + 16 + 328 + 72 * 1, 64, 64, l.x, l.y, l.width, l.height);
      }
    }
  }
}

class Zako extends Enemy {
  constructor(x = 0, y = 0, entrancePath = null, attackPath = null, cattackPath = null) {
    super(x, y, entrancePath, attackPath, cattackPath, 1);
  }

  animate(canvas, frame = 0) {
    this.text.updatePosition([this.x, this.y]);
    this.text.setText(this.state);
    this.text.draw(canvas);

    if (this.state != "WAIT" && this.state != "DEAD") {
      if (this.angle !== 0) {
        canvas.save();
        canvas.translate(this.x, this.y);
        canvas.rotate(this.angle + Math.PI / 2);
        canvas.drawImage(imgs[1], 72 * 6, 0 + 72 * 5, 64, 64, -this.width / 2, -this.height / 2, this.width, this.height);
        canvas.restore();
        //if(this.state == "ATTACK") { this.attackPath.draw(canvas); }
        //else if(this.state == "CATTACK") { this.cattackPath.draw(canvas); }
        //else if(this.state == "ENTER") { this.entrancePath.draw(canvas); }
        //else if(this.state == "RETURN") {
        //    if(this.returnPath != null) { this.returnPath.draw(canvas); }
        //}
      }
    } else if (this.state != "DEAD") {
      if (frame == 0) {
        canvas.drawImage(imgs[1], 72 * 6, 0 + 72 * 5, 64, 64, this.x, this.y, this.width, this.height);
      } else if (frame == 1) {
        canvas.drawImage(imgs[1], 72 * 7, 0 + 72 * 5, 64, 64, this.x, this.y, this.width, this.height);
      }
    } else {
      if (this.state === "DEAD") { // Double Check, since I hate dealing with debugging.
        if (this.currentExplosionFrame === 0) {
          canvas.drawImage(imgs[1], 72 * 7 + 8 + 64 + 8 + 136 * 3 + 128 + 32 + 136 * 0, 0, 128, 128, this.x - this.width / 2, this.y - this.height / 2, this.width * 2, this.height * 2);
        } else if (this.currentExplosionFrame === 1) {
          canvas.drawImage(imgs[1], 72 * 7 + 8 + 64 + 8 + 136 * 3 + 128 + 32 + 136 * 1, 0, 128, 128, this.x - this.width / 2, this.y - this.height / 2, this.width * 2, this.height * 2);
        } else if (this.currentExplosionFrame === 2) {
          canvas.drawImage(imgs[1], 72 * 7 + 8 + 64 + 8 + 136 * 3 + 128 + 32 + 136 * 2, 0, 128, 128, this.x - this.width / 2, this.y - this.height / 2, this.width * 2, this.height * 2);
        } else if (this.currentExplosionFrame === 3) {
          canvas.drawImage(imgs[1], 72 * 7 + 8 + 64 + 8 + 136 * 3 + 128 + 32 + 136 * 3, 0, 128, 128, this.x - this.width / 2, this.y - this.height / 2, this.width * 2, this.height * 2);
        } else if (this.currentExplosionFrame === 4) {
          canvas.drawImage(imgs[1], 72 * 7 + 8 + 64 + 8 + 136 * 3 + 128 + 32 + 136 * 4, 0, 128, 128, this.x - this.width / 2, this.y - this.height / 2, this.width * 2, this.height * 2);
        }
      }
    }

    for (const l of this.lasers) {
      if (l.isAlive()) {
        canvas.drawImage(imgs[1], 72 * 7 + 8 + 64 + 8 + 136 * 3 + 128 + 32 + 72 * 1, 128 + 16 + 328 + 72 * 1, 64, 64, l.x, l.y, l.width, l.height);
      }
    }
  }
}

class BosuGyaraga extends Enemy {
  #hitOnce = false;

  constructor(x = 0, y = 0, entrancePath = null, attackPath = null, cattackPath = null) {
    super(x, y, entrancePath, attackPath, cattackPath, 2);
  }

  getHit() { return this.#hitOnce; }
  gotHit() { this.#hitOnce = true; }

  animate(canvas, frame = 0) {
    this.text.updatePosition([this.x, this.y]);
    this.text.setText(this.state);
    this.text.draw(canvas);

    if (this.state != "WAIT" && this.state != "DEAD") {
      if (this.angle !== 0) {
        canvas.save();
        canvas.translate(this.x, this.y);
        canvas.rotate(this.angle + Math.PI / 2);

        if (this.#hitOnce) { canvas.drawImage(imgs[1], 72 * 6, 0 + 72 * 3, 64, 64, -this.width / 2, -this.height / 2, this.width, this.height); }  // Purple
        else { canvas.drawImage(imgs[1], 72 * 6, 0 + 72 * 2, 64, 64, -this.width / 2, -this.height / 2, this.width, this.height); } // Blue Green

        canvas.restore();
        //if(this.state == "ATTACK") { this.attackPath.draw(canvas); }
        //else if(this.state == "CATTACK") { this.cattackPath.draw(canvas); }
        //else if(this.state == "ENTER") { this.entrancePath.draw(canvas); }
        //else if(this.state == "RETURN") {
        //    if(this.returnPath != null) { this.returnPath.draw(canvas); }
        //}
      }
    } else if (this.state != "DEAD") {
      if (this.#hitOnce) { // Purple
        if (frame == 0) {
          canvas.drawImage(imgs[1], 72 * 6, 0 + 72 * 3, 64, 64, this.x, this.y, this.width, this.height);
        } else if (frame == 1) {
          canvas.drawImage(imgs[1], 72 * 7, 0 + 72 * 3, 64, 64, this.x, this.y, this.width, this.height);
        }
      } else { // Blue
        if (frame == 0) {
          canvas.drawImage(imgs[1], 72 * 6, 0 + 72 * 2, 64, 64, this.x, this.y, this.width, this.height);
        } else if (frame == 1) {
          canvas.drawImage(imgs[1], 72 * 7, 0 + 72 * 2, 64, 64, this.x, this.y, this.width, this.height);
        }
      }
    } else {
      if (this.state === "DEAD") { // Double Check, since I hate dealing with debugging.
        if (this.currentExplosionFrame === 0) {
          canvas.drawImage(imgs[1], 72 * 7 + 8 + 64 + 8 + 136 * 3 + 128 + 32 + 136 * 0, 0, 128, 128, this.x - this.width / 2, this.y - this.height / 2, this.width * 2, this.height * 2);
        } else if (this.currentExplosionFrame === 1) {
          canvas.drawImage(imgs[1], 72 * 7 + 8 + 64 + 8 + 136 * 3 + 128 + 32 + 136 * 1, 0, 128, 128, this.x - this.width / 2, this.y - this.height / 2, this.width * 2, this.height * 2);
        } else if (this.currentExplosionFrame === 2) {
          canvas.drawImage(imgs[1], 72 * 7 + 8 + 64 + 8 + 136 * 3 + 128 + 32 + 136 * 2, 0, 128, 128, this.x - this.width / 2, this.y - this.height / 2, this.width * 2, this.height * 2);
        } else if (this.currentExplosionFrame === 3) {
          canvas.drawImage(imgs[1], 72 * 7 + 8 + 64 + 8 + 136 * 3 + 128 + 32 + 136 * 3, 0, 128, 128, this.x - this.width / 2, this.y - this.height / 2, this.width * 2, this.height * 2);
        } else if (this.currentExplosionFrame === 4) {
          canvas.drawImage(imgs[1], 72 * 7 + 8 + 64 + 8 + 136 * 3 + 128 + 32 + 136 * 4, 0, 128, 128, this.x - this.width / 2, this.y - this.height / 2, this.width * 2, this.height * 2);
        }
      }
    }

    for (const l of this.lasers) {
      if (l.isAlive()) {
        canvas.drawImage(imgs[1], 72 * 7 + 8 + 64 + 8 + 136 * 3 + 128 + 32 + 72 * 1, 128 + 16 + 328 + 72 * 1, 64, 64, l.x, l.y, l.width, l.height);
      }
    }
  }
}

class EntityGroup {
  #x = grid.boxes[2][3].x;
  #y = grid.boxes[2][3].y;
  #rows = 5;
  #columns = 10;
  #bosuGyaragas = 4;
  #goeis = 8;
  #zakos = 10;
  #total = this.#bosuGyaragas + this.#goeis * 2 + this.#zakos * 2;

  #currentSquad = 0;
  #squadAnimationStart = 0;
  #squadAnimationEnd = 0;
  #squadsFinished = 0;

  #nonNullFormation = [];
  #formationCurrentFrame = 0;
  #formationAnimation = 0;
  #formationSendingAnimation = 0;
  #sentOut = [];
  #numberOfSentOut = 0;
  #left = 0;

  #wait = false;

  #permittedTime = 200        // default = 1500
  #maxPermittedSentOut = 14;   // default = 2;

  #startFormation = false;
  #formationAnimationType = "transform";
  #transformDirection = "right";
  #transformAnimation = 0;
  #breathDirection = "backward"; // default = "backward"
  #breathAnimation = 0;

  constructor() {
    this.formation = [];
    this.formationOriginal = [];
    this.squads = [];

    // Original Grid
    let temp;
    for (let i = 0; i < this.#rows; i++) {
      temp = [];
      for (let j = 0; j < this.#columns; j++) {
        temp.push([grid.boxes[2 + i][3 + j].x, grid.boxes[2 + i][3 + j].y, null]);
      }
      this.formationOriginal.push(temp);
    }
  }

  init() {
    // Grid
    let temp;
    for (let i = 0; i < this.#rows; i++) {
      temp = [];
      for (let j = 0; j < this.#columns; j++) {
        temp.push([grid.boxes[2 + i][3 + j].x, grid.boxes[2 + i][3 + j].y, null]);
      }
      this.formation.push(temp);
    }

    // Enemies default, customization should be added later.
    for (let i = 0; i < this.#rows; i++) {
      for (let j = 0; j < this.#columns; j++) {
        if (i == 0 && (j > 2 && j < 7)) {
          //this.formation[i][j][2] = new BosuGyaraga(-50, -50);
          this.formation[i][j][2] = new BosuGyaraga(this.formation[i][j][0], this.formation[i][j][1]);
          if (j < 5) {
            this.formation[i][j][2].setAttackPath(paths[j + 1]);
          } else {
            this.formation[i][j][2].setAttackPath(paths[j + 1]);
          }
        } else if ((i == 1 || i == 2) && (j > 0 && j < 9)) {
          //this.formation[i][j][2] = new Goei(-50, -50);
          this.formation[i][j][2] = new Goei(this.formation[i][j][0], this.formation[i][j][1]);
          if (i == 1 && j < 5) {
            this.formation[i][j][2].setAttackPath(paths[j + 7]);
          } else if (i == 1 && j < 10) {
            this.formation[i][j][2].setAttackPath(paths[j + 7]);
          } else if (i == 2 && j < 5) {
            this.formation[i][j][2].setAttackPath(paths[j + 15]);
          } else if (i == 2 && j < 10) {
            this.formation[i][j][2].setAttackPath(paths[j + 15]);
          }
        } else if ((i == 3 || i == 4)) {
          //this.formation[i][j][2] = new Zako(-50, -50);
          this.formation[i][j][2] = new Zako(this.formation[i][j][0], this.formation[i][j][1]);
          if (i == 3 && j < 5) {
            this.formation[i][j][2].setAttackPath(paths[j + 24]);
          } else if (i == 3 && j < 11) {
            this.formation[i][j][2].setAttackPath(paths[j + 24]);
          } else if (i == 4 && j < 5) {
            this.formation[i][j][2].setAttackPath(paths[j + 34]);
          } else if (i == 4 && j < 11) {
            this.formation[i][j][2].setAttackPath(paths[j + 34]);
          }
        }
      }
    }

    for (const r of this.formation) { // Non null Cache for easier access later.
      for (const c of r) {
        if (c[2] != null) {
          this.#nonNullFormation.push(c[2]);
        }
      }
    }

    // Squads, used for beginning.
    const SQUAD1 = [this.formation[1][4][2], this.formation[1][5][2],   // Goei and Zako
    this.formation[2][4][2], this.formation[2][5][2],
    this.formation[3][4][2], this.formation[3][5][2],
    this.formation[4][4][2], this.formation[4][5][2]];

    const SQUAD2 = [this.formation[0][3][2], this.formation[1][3][2],   // Goei and Bosu Gyaraga
    this.formation[0][4][2], this.formation[1][6][2],
    this.formation[0][5][2], this.formation[2][3][2],
    this.formation[0][6][2], this.formation[2][6][2]];

    const SQUAD3 = [this.formation[1][1][2], this.formation[1][7][2],  // Goei
    this.formation[1][2][2], this.formation[1][8][2],
    this.formation[2][1][2], this.formation[2][7][2],
    this.formation[2][2][2], this.formation[2][8][2]];

    const SQUAD4 = [this.formation[3][3][2], this.formation[3][6][2],   // Zako
    this.formation[4][3][2], this.formation[4][6][2],
    this.formation[3][2][2], this.formation[3][7][2],
    this.formation[4][2][2], this.formation[4][7][2]];

    const SQUAD5 = [this.formation[3][1][2], this.formation[3][8][2],  // Zako
    this.formation[4][1][2], this.formation[4][8][2],
    this.formation[3][0][2], this.formation[3][9][2],
    this.formation[4][0][2], this.formation[4][9][2]];

    // Randomize the Squad order if we want to keep it simple.
    temp = [];

    let u;
    while (temp.length < 5) {
      u = Math.floor(Math.random() * 5) + 1;
      if (temp.indexOf(u) === -1) { temp.push(u); };
    }

    for (const e of temp) {
      if (e === 1) { this.squads.push(SQUAD1); }
      if (e === 2) { this.squads.push(SQUAD2); }
      if (e === 3) { this.squads.push(SQUAD3); }
      if (e === 4) { this.squads.push(SQUAD4); }
      if (e === 5) { this.squads.push(SQUAD5); }
    }

    //this.squads.push(SQUAD1);
    //this.squads.push(SQUAD2);
    //this.squads.push(SQUAD3);
    //this.squads.push(SQUAD4);
    //this.squads.push(SQUAD5);

    // Squad 1
    this.formation[1][4][2].setEntrancePath(paths[1]);
    this.formation[3][4][2].setEntrancePath(paths[0]);
    this.formation[1][5][2].setEntrancePath(paths[1]);
    this.formation[3][5][2].setEntrancePath(paths[0]);
    this.formation[2][4][2].setEntrancePath(paths[1]);
    this.formation[4][4][2].setEntrancePath(paths[0]);
    this.formation[2][5][2].setEntrancePath(paths[1]);
    this.formation[4][5][2].setEntrancePath(paths[0]);

    // Squad 2
    this.formation[0][3][2].setEntrancePath(paths[2]);
    this.formation[1][3][2].setEntrancePath(paths[2]);
    this.formation[0][4][2].setEntrancePath(paths[2]);
    this.formation[1][6][2].setEntrancePath(paths[2]);
    this.formation[0][5][2].setEntrancePath(paths[2]);
    this.formation[2][3][2].setEntrancePath(paths[2]);
    this.formation[0][6][2].setEntrancePath(paths[2]);
    this.formation[2][6][2].setEntrancePath(paths[2]);

    // Squad 3
    this.formation[1][1][2].setEntrancePath(paths[3]);
    this.formation[1][7][2].setEntrancePath(paths[3]);
    this.formation[1][2][2].setEntrancePath(paths[3]);
    this.formation[1][8][2].setEntrancePath(paths[3]);
    this.formation[2][1][2].setEntrancePath(paths[3]);
    this.formation[2][7][2].setEntrancePath(paths[3]);
    this.formation[2][2][2].setEntrancePath(paths[3]);
    this.formation[2][8][2].setEntrancePath(paths[3]);

    // Squad 4
    this.formation[3][3][2].setEntrancePath(paths[0]);
    this.formation[3][6][2].setEntrancePath(paths[0]);
    this.formation[4][3][2].setEntrancePath(paths[0]);
    this.formation[4][6][2].setEntrancePath(paths[0]);
    this.formation[3][2][2].setEntrancePath(paths[0]);
    this.formation[3][7][2].setEntrancePath(paths[0]);
    this.formation[4][2][2].setEntrancePath(paths[0]);
    this.formation[4][7][2].setEntrancePath(paths[0]);

    // Squad 5
    this.formation[3][1][2].setEntrancePath(paths[1]);
    this.formation[3][8][2].setEntrancePath(paths[1]);
    this.formation[4][1][2].setEntrancePath(paths[1]);
    this.formation[4][8][2].setEntrancePath(paths[1]);
    this.formation[3][0][2].setEntrancePath(paths[1]);
    this.formation[3][9][2].setEntrancePath(paths[1]);
    this.formation[4][0][2].setEntrancePath(paths[1]);
    this.formation[4][9][2].setEntrancePath(paths[1]);

    this.#left = this.getRemaining();
  }

  allRotate() { // Test Function
    for (const r of this.formation) {
      for (const c of r) {
        if (c[2] != null) {
          if (c[2].isAlive()) {
            c[2].angle += 0.1;
          }
        }
      }
    }
  }

  allAttack() { // Test Function
    for (const r of this.formation) {
      for (const c of r) {
        if (c[2] != null) {
          if (c[2].isAlive()) {
            c[2].state = "ATTACK";
          }
        }
      }
    }
  }

  send(time) {
    for (let i = 0; i < this.#sentOut.length; i++) {
      if (this.#sentOut[i].state != "ATTACK") {// && this.#sentOut[i].state != "DEAD") {
        this.#sentOut.splice(i, 1);
        this.#numberOfSentOut -= 1;
      }
    }

    if (!(this.#numberOfSentOut == this.#maxPermittedSentOut + 1 || this.#numberOfSentOut > this.#maxPermittedSentOut + 1) && this.#left > 0) {
      const len = this.#nonNullFormation.length;
      const pickRandom = this.#nonNullFormation[Math.floor(Math.random() * len)];
      pickRandom.state = "ATTACK";
      this.#sentOut.push(pickRandom);
      this.#numberOfSentOut += 1;
    }
  }

  update(time) {
    for (const r of this.formation) { // Normal State handling.
      for (const c of r) {
        if (c[2] != null) {
          if (c[2].isAlive()) {
            c[2].handleStates(time);
          }
        }
      }
    }

    for (const r of this.formation) { // EXPENSIVE OPERATION. Probably needs optimization.
      for (const c of r) {
        if (c[2] != null) {
          for (const l of c[2].lasers) {
            if (l.isAlive()) {
              l.move("down");
            }
          }
        }
      }
    }

    for (let i = 0; i < this.#nonNullFormation.length; i++) { // Update the non null entities.
      if (this.#nonNullFormation[i].state === "DEAD" && this.#nonNullFormation.length > 0) {
        this.#nonNullFormation.splice(i, 1);
      }
    }

    if (time >= this.#squadAnimationEnd && !(this.#squadsFinished)) { // Entrance
      this.#squadAnimationEnd = time + 200;
      if (this.#currentSquad >= this.squads.length) {
        this.#currentSquad = 0;
        this.#squadsFinished = true;
      }
      else if (this.squads[this.#currentSquad].length != 0 || this.squads[this.#currentSquad].length < 0) {
        this.squads[this.#currentSquad][0].state = "ENTER";
        this.squads[this.#currentSquad][0].setVisibility(true);
        this.squads[this.#currentSquad].splice(0, 1);
      }
      else {
        this.#squadAnimationEnd += 1500;
        this.#currentSquad += 1;
      }
    }
    if (this.#left > 0) {
      if (time >= this.#formationAnimation) { // Update Animation Frames on state "WAIT"
        this.#formationAnimation = time + 500;
        if (this.#formationCurrentFrame == 0) { this.#formationCurrentFrame = 1; }
        else if (this.#formationCurrentFrame == 1) { this.#formationCurrentFrame = 0; }
      }

      if (time >= this.#formationSendingAnimation && this.#squadsFinished && !(this.#wait)) { // Automatic Sending
        this.#formationSendingAnimation = time + this.#permittedTime;
        this.send(time);
      }

      if (this.#squadsFinished) { // We want it only to do transformations when they have all reached their placement.
        if (this.#formationAnimationType === "transform") { // Transformation Animation.
          if (time >= this.#transformAnimation) {
            this.#transformAnimation = time + 2000;
            this.transform();
          }
          if (this.#left <= this.#total / 2 && // Check to see if half of the enemies are gone for breath.
            this.formation[0][0][0] == this.formationOriginal[0][0][0] &&
            this.formation[0][0][1] == this.formationOriginal[0][0][1]) {
            this.#formationAnimationType = "breath";
          }
        } else if (this.#formationAnimationType === "breath") { // Breathing Animation.
          this.breath(time);
        }
      }
    }
  }

  transform() { // Just left and right, since its a pain in the ass to do the others.
    if (this.#transformDirection === "right") {
      if (this.formation[this.#rows - 1][this.#columns - 1][0] + grid.divX < screen.width) {
        for (const r of this.formation) {
          for (const c of r) {
            c[0] += grid.divX;
            if (c[2] != null) {
              if (c[2].isAlive()) {
                if (c[2].state === "WAIT") {
                  c[2].x = c[0];
                }
                c[2].x0 = c[0];
                c[2].attackPath.modifyPoints(grid.divX, "x");
              }
            }
          }
        }
      } else {
        this.#transformDirection = "left";
      }
    }
    else if (this.#transformDirection === "left") {
      if (this.formation[0][0][0] - grid.divX >= 0) {
        for (const r of this.formation) {
          for (const c of r) {
            c[0] -= grid.divX;
            if (c[2] != null) {
              if (c[2].isAlive()) {
                if (c[2].state === "WAIT") {
                  c[2].x = c[0];
                }
                c[2].x0 = c[0];
                c[2].attackPath.modifyPoints(-grid.divX, "x");
              }
            }
          }
        }
      } else {
        this.#transformDirection = "right";
      }
    }
  }

  breath(time) { // Only when its centered, grid.boxes[3][7] is the standard point.
    let distance = 0;
    let angle = 0;
    let xinc = 0;
    let yinc = 0;
    //let v1 = new Vector2(grid.boxes[3][grid.columns/2].x - grid.divX/2, grid.boxes[3][grid.columns/2].y - grid.divY/2);
    let v1 = new Vector2(grid.boxes[3][7].x + grid.divX / 2, grid.boxes[3][7].y);
    let v2 = null;

    if (this.#breathDirection === "forward") {
      if (time >= this.#breathAnimation) {
        this.#breathAnimation = time + 2000;
        this.#breathDirection = "backward";
      } else {
        for (let i = 0; i < this.#rows; i++) {
          for (let j = 0; j < this.#columns; j++) {
            v2 = new Vector2(this.formationOriginal[i][j][0], this.formationOriginal[i][j][1]);
            distance = v1.distanceTo(v2) / 300;
            angle = Math.atan2(v2.y - v1.y, v2.x - v1.x);
            xinc = this.formation[i][j][0] + Math.cos(angle) * distance;
            yinc = this.formation[i][j][1] + Math.sin(angle) * distance;
            this.formation[i][j][0] = xinc;
            this.formation[i][j][1] = yinc;
            if (this.formation[i][j][2] != null) {
              if (this.formation[i][j][2].isAlive()) { // Update necessary information as moved.
                if (this.formation[i][j][2].state === "WAIT") {
                  this.formation[i][j][2].x = this.formation[i][j][0];
                  this.formation[i][j][2].y = this.formation[i][j][1];
                }
                this.formation[i][j][2].x0 = this.formation[i][j][0];
                this.formation[i][j][2].y0 = this.formation[i][j][1];
                this.formation[i][j][2].attackPath.modifyPoints(Math.cos(angle) * distance, "x");
                this.formation[i][j][2].attackPath.modifyPoints(Math.sin(angle) * distance, "y");
              }
            }
            v2 = null;
          }
        }
      }
    } else if (this.#breathDirection === "backward") {
      if (time >= this.#breathAnimation) {
        this.#breathAnimation = time + 2000;
        this.#breathDirection = "forward";
      } else {
        for (let i = 0; i < this.#rows; i++) {
          for (let j = 0; j < this.#columns; j++) {
            v2 = new Vector2(this.formationOriginal[i][j][0], this.formationOriginal[i][j][1]);
            distance = v1.distanceTo(v2) / 300;
            angle = Math.atan2(v2.y - v1.y, v2.x - v1.x);
            xinc = this.formation[i][j][0] - Math.cos(angle) * distance;
            yinc = this.formation[i][j][1] - Math.sin(angle) * distance;

            this.formation[i][j][0] = xinc;
            this.formation[i][j][1] = yinc;
            if (this.formation[i][j][2] != null) {
              if (this.formation[i][j][2].isAlive()) { // Update necessary information as moved.
                if (this.formation[i][j][2].state === "WAIT") {
                  this.formation[i][j][2].x = this.formation[i][j][0];
                  this.formation[i][j][2].y = this.formation[i][j][1];
                }
                this.formation[i][j][2].x0 = this.formation[i][j][0];
                this.formation[i][j][2].y0 = this.formation[i][j][1];
                this.formation[i][j][2].attackPath.modifyPoints(-Math.cos(angle) * distance, "x");
                this.formation[i][j][2].attackPath.modifyPoints(-Math.sin(angle) * distance, "y");
              }
            }
            v2 = null;
          }
        }
      }
    }
  }

  wait() {
    if (this.#wait) {
      this.#wait = false;
    } else {
      this.#wait = true;
    }
  }

  checkPlayerCollision(player) { // Currently not the best but works somewhat.
    if (!(player.getIsDamaged())) {
      for (const r of this.formation) { // EXPENSIVE OPERATION. Probably needs optimization.
        for (const c of r) {
          if (c[2] != null) {
            for (const l of c[2].lasers) { // Check Lasers if they hit the player.
              if (withinBounds(l, player, 2)) {
                player.gotDamaged();
                player.lives -= 1;

                if (!sfxs[7].paused) { // Player Explosion sound.
                  sfxs[7].pause();
                  sfxs[7].currentTime = 0;
                }
                sfxs[7].volume = 0.1;
                sfxs[7].play();
                return;
              }
            }
            if (c[2].isAlive()) {
              if (withinBounds(c[2], player)) {
                player.gotDamaged();
                player.lives -= 1;

                if (!sfxs[7].paused) { // Player Explosion sound.
                  sfxs[7].pause();
                  sfxs[7].currentTime = 0;
                }
                sfxs[7].volume = 0.1;
                sfxs[7].play();
                this.#left -= 1;

                c[2].state = "DEAD";
                return
              }
            }
          }
        }
      }
    }
  }

  checkCollision(p) { // Much easier to map rather than garble the update main loop.
    for (const e of this.#nonNullFormation) {
      if (e.isAlive() && e.state !== "DEAD") { // Check for repetitive, some cases may apply.
        if (withinBounds(p, e, 2)) {
          p.setVisibility(false);
          p.x = -1000;
          p.y = -1000;
          if (e.type === 0 || e.type === 1) {
            e.state = "DEAD";
            this.#left -= 1;

            if (!sfxs[12].paused) { // Goei and Zako Death sound.
              sfxs[12].pause();
              sfxs[12].currentTime = 0;
            }
            sfxs[12].volume = 0.1;
            sfxs[12].play();

            if (e.type === 0) { highscore += 100; } // Update Highscore
            else if (e.type === 1) { highscore += 160; } // Update Highscore
          } else if (e.type === 2) { // Special case for the Bosu Gyaraga.
            if (e.getHit()) {
              e.state = "DEAD";
              this.#left -= 1;

              if (!sfxs[0].paused) { // Bosu Gyaraga Death sound.
                sfxs[0].pause();
                sfxs[0].currentTime = 0;
              }
              sfxs[0].volume = 0.1;
              sfxs[0].play();

              highscore += 400; // Update Highscore
            } else {
              e.gotHit();

              if (!sfxs[3].paused) { // Bosu Gyaraga Injured sound.
                sfxs[3].pause();
                sfxs[3].currentTime = 0;
              }
              sfxs[3].volume = 0.1;
              sfxs[3].play();
            }
          }
          console.log(this.#left);
          break;
        }
      }
    }
  }

  getRemaining() {
    let remainingCount = 0;
    for (const r of this.formation) {
      for (const c of r) {
        if (c[2] != null) {
          if (c[2].state != "DEAD") {
            remainingCount += 1;
          }
        }
      }
    }
    return remainingCount;
  }

  getRemainingCache() { return this.#left; }

  reset() { // Currently Unused.
    this.#x = grid.boxes[2][3].x;
    this.#y = grid.boxes[2][3].y;
    this.#rows = 5;
    this.#columns = 10;
    this.#bosuGyaragas = 4;
    this.#goeis = 8;
    this.#zakos = 10;
    this.#total = this.#bosuGyaragas + this.#goeis * 2 + this.#zakos * 2;
    this.#currentSquad = 0;
    this.#squadAnimationStart = 0;
    this.#squadAnimationEnd = 0;
    this.#squadsFinished = 0;
    this.#nonNullFormation = [];
    this.#formationCurrentFrame = 0;
    this.#formationAnimation = 0;
    this.#formationSendingAnimation = 0;
    this.#sentOut = [];
    this.#numberOfSentOut = 0;
    this.#left = 0;
    this.#permittedTime = 200        // default = 1500
    this.#maxPermittedSentOut = 14;   // default = 2;
    this.#startFormation = false;
    this.#formationAnimationType = "transform";
    this.#transformDirection = "right";
    this.#transformAnimation = 0;
    this.#breathDirection = "backward"; // default = "backward"
    this.#breathAnimation = 0;

    this.formation = null;
    //this.formationOriginal = null;
    this.squads = null;

    this.formation = [];
    //this.formationOriginal = [];
    this.squads = [];
    this.init();
  }

  draw(canvas, time) {
    for (const r of this.formation) {
      for (const c of r) {
        if (c[2] != null) {
          if (c[2].isAlive()) {
            c[2].animate(canvas, this.#formationCurrentFrame);
          } else {
            c[2].animate(canvas, -1); // We still need to render any left over lasers.
          }
        }
      }
    }

    //for(let i=0; i < this.#rows; i++) {
    //    for(let j=0; j < this.#columns; j++) { // Test function for transformation.
    //        canvas.fillStyle = "white";
    //        canvas.fillRect(this.formation[i][j][0], this.formation[i][j][1], grid.divX, grid.divY);
    //    }
    //}
    //canvas.fillStyle = "white";
    //canvas.fillRect(grid.boxes[3][7].x + grid.divX/2, grid.boxes[3][7].y, grid.divX, grid.divY);

    //for(const r of this.squads) {
    //    for(const c of r) {
    //        c.animate(canvas, 1);
    //    }
    //}
  }
}

class Stage {
  #currentEnemiesActive = 0;

  constructor(bg = null) {
    this.bg = bg;
    this.enemies = new EntityGroup();
  }

  finished() {
    if (this.enemies.getRemainingCache() <= 0) {
      return true;
    } else { return false; }
  }

  draw(canvas) {
    this.enemies.draw(canvas);
  }
}
const stages = [];
stages.push(new Stage());
stages[0].enemies.init();

class GameState {
  #currentScene = 0;
  #sceneAnimationStart = 0;
  #sceneAnimationEnd = 0;

  constructor() {
    this.state = "INTRO";
    this.currentStage = 0;

  }

  intro(time) {
    if (!texts[0].getVisibility()) { texts[0].setVisibility(true); }
    if (!texts[1].getVisibility()) { texts[1].setVisibility(true); }
    if (!texts[2].getVisibility()) { texts[2].setVisibility(true); }

    if (texts[7].getVisibility()) { texts[7].setVisibility(false); }
    if (texts[8].getVisibility()) { texts[8].setVisibility(false); }
    if (texts[9].getVisibility()) { texts[9].setVisibility(false); }
    if (texts[10].getVisibility()) { texts[10].setVisibility(false); }

    if (time >= this.#sceneAnimationEnd) {
      this.#sceneAnimationStart = time;
      this.#sceneAnimationEnd = time + 1000;

      if (this.#currentScene === 0) {
        texts[0].updatePosition([texts[0].x - screen.width, texts[0].y]);
        texts[1].updatePosition([texts[1].x + screen.width, texts[1].y]);
        texts[2].updatePosition([texts[2].x - screen.width, texts[2].y]);
      }

      this.#currentScene += 1;
    }

    switch (this.#currentScene) {
      case 1:
        texts[0].updatePosition(linearBezier(texts[0].x, texts[0].y, texts[0].getOriginalX(), texts[0].getOriginalY(), (time - this.#sceneAnimationStart) / 1000));
        break;
      case 2:
        texts[1].updatePosition(linearBezier(texts[1].x, texts[1].y, texts[1].getOriginalX(), texts[1].getOriginalY(), (time - this.#sceneAnimationStart) / 1000));
        break;
      case 3:
        texts[2].updatePosition(linearBezier(texts[2].x, texts[2].y, texts[2].getOriginalX(), texts[2].getOriginalY(), (time - this.#sceneAnimationStart) / 1000));
        break;
      case 4:
        this.#sceneAnimationStart = 0;
        this.#sceneAnimationEnd = 0;
        this.#currentScene = 0;
        this.state = "MENU";
        break;
    }
  }

  menu(time) {
    if (!texts[0].getVisibility()) { texts[0].setVisibility(true); }
    if (!texts[1].getVisibility()) { texts[1].setVisibility(true); }
    if (!texts[2].getVisibility()) { texts[2].setVisibility(true); }

    if (this.#sceneAnimationStart != 0 ||
      this.#sceneAnimationEnd != 0 ||
      this.#currentScene != 0) {

      this.#sceneAnimationStart = 0;
      this.#sceneAnimationEnd = 0;
      this.#currentScene = 0;
    }
  }

  editor(time) {
    if (texts[0].getVisibility()) { texts[0].setVisibility(false); }
    if (texts[1].getVisibility()) { texts[1].setVisibility(false); }
    if (texts[2].getVisibility()) { texts[2].setVisibility(false); }
    if (texts[3].getVisibility()) { texts[3].setVisibility(false); }
    if (texts[4].getVisibility()) { texts[4].setVisibility(false); }
    if (texts[5].getVisibility()) { texts[5].setVisibility(false); }
    if (texts[6].getVisibility()) { texts[6].setVisibility(false); }
    if (texts[7].getVisibility()) { texts[7].setVisibility(false); }
    if (texts[8].getVisibility()) { texts[8].setVisibility(false); }
    if (texts[9].getVisibility()) { texts[9].setVisibility(false); }
    if (texts[10].getVisibility()) { texts[10].setVisibility(false); }
    if (texts[11].getVisibility()) { texts[11].setVisibility(false); }
    if (texts[12].getVisibility()) { texts[12].setVisibility(false); }
  }

  load(time) {
    if (texts[0].getVisibility()) { texts[0].setVisibility(false); }
    if (texts[1].getVisibility()) { texts[1].setVisibility(false); }
    if (texts[2].getVisibility()) { texts[2].setVisibility(false); }

    if (time >= this.#sceneAnimationEnd) {
      this.#sceneAnimationStart = time;
      this.#sceneAnimationEnd = time + 1000;

      if (this.#currentScene === 0) {
        texts[3].updatePosition([texts[3].x, texts[3].y - screen.height]);
        texts[5].updatePosition([texts[5].x, texts[5].y - screen.height]);
        texts[6].updatePosition([texts[6].x, texts[6].y - screen.height]);
      }

      this.#currentScene += 1;
    }

    switch (this.#currentScene) {
      case 1:
        texts[3].updatePosition(linearBezier(texts[3].x, texts[3].y, texts[3].getOriginalX(), texts[3].getOriginalY(), (time - this.#sceneAnimationStart) / 1000));
        texts[3].setVisibility(true);
        break;
      case 2:
        this.currentStage = 1;
        texts[5].setText("STAGE " + this.currentStage);
        texts[3].setVisibility(false);
        break;
      case 3:
        texts[5].updatePosition(linearBezier(texts[5].x, texts[5].y, texts[5].getOriginalX(), texts[5].getOriginalY(), (time - this.#sceneAnimationStart) / 1000));
        texts[5].setVisibility(true);
        break;
      case 4:
        texts[5].setVisibility(false);
        texts[6].updatePosition(linearBezier(texts[6].x, texts[6].y, texts[6].getOriginalX(), texts[6].getOriginalY(), (time - this.#sceneAnimationStart) / 1000));
        texts[6].setVisibility(true);
        for (const s of stars) {
          s.drop();
        }
        break;
      case 5:
        texts[6].setVisibility(false);
        this.#sceneAnimationStart = 0;
        this.#sceneAnimationEnd = 0;
        this.#currentScene = 0;
        this.state = "PLAY";
        break;
    }
  }

  play(time) {
    if (!texts[7].getVisibility()) { texts[7].setVisibility(true); }
    if (!texts[8].getVisibility()) { texts[8].setVisibility(true); }
    if (!texts[9].getVisibility()) { texts[9].setVisibility(true); }
    if (!texts[10].getVisibility()) { texts[10].setVisibility(true); }

    if (time >= this.#sceneAnimationEnd) {
      this.#sceneAnimationStart = time;
      this.#sceneAnimationEnd = time + 600;
      this.#currentScene += 1;
    }

    switch (this.#currentScene) {
      case 1:
        texts[8].setVisibility(false);
        break;
      case 2:
        texts[8].setVisibility(true);
        this.#currentScene = 0;
        break;
    }

    for (const s of stars) {
      s.drop();
    }

    for (const p of player.lasers) {
      p.move("up");
      stages[this.currentStage - 1].enemies.checkCollision(p);
    }

    stages[this.currentStage - 1].enemies.update(time);

    stages[this.currentStage - 1].enemies.checkPlayerCollision(player);
    if (player.getIsDamaged()) { player.explode(time); }
    if (player.getIsDead()) {
      stages[this.currentStage - 1].enemies.wait();
      this.#currentScene = 0; // Double Check
      this.state = "REVIVE";
    }

    if (stages[this.currentStage - 1].finished()) {
      stages[this.currentStage - 1].enemies.reset();
      this.#currentScene = 0; // Double Check
      this.state = "NEXT";
    }
  }

  pause(time) {
    if (!texts[7].getVisibility()) { texts[7].setVisibility(true); }
    if (!texts[8].getVisibility()) { texts[8].setVisibility(true); }
    if (!texts[9].getVisibility()) { texts[9].setVisibility(true); }
    if (!texts[10].getVisibility()) { texts[10].setVisibility(true); }

    for (const p of player.lasers) {
      p.move("up");
    }
  }

  next(time) {
    if (!texts[7].getVisibility()) { texts[7].setVisibility(true); }
    if (!texts[8].getVisibility()) { texts[8].setVisibility(true); }
    if (!texts[9].getVisibility()) { texts[9].setVisibility(true); }
    if (!texts[10].getVisibility()) { texts[10].setVisibility(true); }

    if (time >= this.#sceneAnimationEnd) {
      this.#sceneAnimationEnd = time + 2000;
      this.#currentScene += 1;
    }

    switch (this.#currentScene) {
      case 1:
        texts[5].setVisibility(true);
        break;
      case 2:
        texts[5].setVisibility(false);
        this.#sceneAnimationStart = 0;
        this.#sceneAnimationEnd = 0;
        this.#currentScene = 0;
        //this.currentStage += 1;
        this.state = "PLAY";
        break;
    }

    for (const s of stars) {
      s.drop();
    }
  }

  results(time) {
    player.lives = 2;
    player.reset();
    stages[this.currentStage - 1].enemies.reset();
    this.#currentScene = 0; // Double Check
    this.state = "NEXT";
  }

  revive(time) {
    if (!texts[7].getVisibility()) { texts[7].setVisibility(true); }
    if (!texts[8].getVisibility()) { texts[8].setVisibility(true); }
    if (!texts[9].getVisibility()) { texts[9].setVisibility(true); }
    if (!texts[10].getVisibility()) { texts[10].setVisibility(true); }

    if (time >= this.#sceneAnimationEnd) {
      this.#sceneAnimationEnd = time + 3000;
      this.#currentScene += 1;
    }

    for (const s of stars) {
      s.drop();
    }

    for (const p of player.lasers) {
      p.move("up");
      stages[this.currentStage - 1].enemies.checkCollision(p);
    }

    stages[this.currentStage - 1].enemies.update(time);

    switch (this.#currentScene) {
      case 1:
        break;
      case 2:
        this.#sceneAnimationStart = 0;
        this.#sceneAnimationEnd = 0;
        this.#currentScene = 0;
        //this.currentStage += 1;
        stages[this.currentStage - 1].enemies.wait();

        if (player.lives > -1) {
          player.reset();
          this.state = "PLAY";
        } else {
          this.state = "RESULTS";
        }
        break;
    }
  }

  handleStates(time) {
    switch (this.state) {
      case "INTRO":
        this.intro(time);
        break;
      case "MENU":
        this.menu(time);
        break;
      case "EDITOR":
        this.editor(time);
        break;
      case "LOAD":
        this.load(time);
        break;
      case "PLAY":
        this.play(time);
        break;
      case "PAUSE":
        this.pause(time);
        break;
      case "NEXT":
        this.next(time);
        break;
      case "RESULTS":
        this.results(time);
        break;
      case "REVIVE":
        this.revive(time);
        break;
    }
  }

  handleEvents() {

  }
}

class GameEngine {
  #currentOption = 0;
  #currentOptionDirection = "left";
  #currentOptionAnimation = 0;

  constructor() {
    this.gameState = new GameState();
  }

  init() {
    window.addEventListener("keydown", (event) => { // Singular button presses.
      switch (event.key) {
        // Debug
        case "F1": // Set Debugging state of game and playtime
          if (texts[11].getVisibility()) { texts[11].setVisibility(false); }
          else { texts[11].setVisibility(true); }
          if (texts[12].getVisibility()) { texts[12].setVisibility(false); }
          else { texts[12].setVisibility(true); }
          break;
        case "F2": // Set Visiblity of enemy states (BUGGY)
          for(const a of stages[0].enemies.squads) {
            for(const b of a) {
              b.text.setVisibility(!b.text.visible);
            }
          }
          break;
        case "Escape":
          this.gameState.state = "MENU";
          break;
        // Menu Options
        case "ArrowUp":
          if (this.gameState.state === "MENU") {
            if (this.#currentOption - 1 >= 0) {
              texts[this.#currentOption].x = texts[this.#currentOption].x0;
              this.#currentOption -= 1;
            }
          }
          break;
        case "ArrowDown":
          if (this.gameState.state === "MENU") {
            if (this.#currentOption + 1 < 3) {
              texts[this.#currentOption].x = texts[this.#currentOption].x0;
              this.#currentOption += 1;
            }
          }
          break;
        case "Enter":
          if (this.gameState.state === "MENU") {
            if (texts[this.#currentOption].text === "PLAY PLAYER 1") { this.gameState.state = "LOAD"; }
            else if (texts[this.#currentOption].text === "PLAY PLAYER 2") { this.gameState.state = "LOAD"; }
            else if (texts[this.#currentOption].text === "LEVEL EDITOR ") { this.gameState.state = "EDITOR"; }
          }
          break;
        // Play Options
        case "p":
          if (this.gameState.state === "PLAY") { this.state = "PAUSE"; }
          else if (this.gameState.state === "PAUSE") { this.state = "PLAY"; }
          break;
        case "z":
          if (this.gameState.state === "PLAY") {
            player.fire();
          }
          break;
        // Editor Options
        case "r":
          if (this.gameState.state === "EDITOR") {
            if (!(EDITORPATH.points.length <= 0)) {
              console.log(EDITORPATH.points);
              EDITORPATH.removePoint();
            }
          }
          break;
        case "R":
          if (this.gameState.state === "EDITOR") {
            console.log(EDITORPATH.points);
            EDITORPATH.points = [];
          }
          break;
      }
    });

    window.addEventListener("click", (event) => {
      if (this.gameState.state === "EDITOR") {
        let rect = foreground.getBoundingClientRect();
        console.log(EDITORPATH.points);
        EDITORPATH.addPoint(new Vector2(event.clientX - rect.left, event.clientY - rect.top));
      }
    });
  }

  handleUserInputs() {
    if (this.gameState.state === "PLAY") { // Continous Movements
      if (currentKeysPressed["ArrowLeft"]) { player.move("left"); }
      else if (currentKeysPressed["ArrowRight"]) { player.move("right"); }
    }

    //if( this.gameState.state === "EDITOR" ) { // Continous Mouse Drag
    //    if( currentButtonsPressed[0] === 1 ) { console.log("Mouse X: "+mouseX+", Mouse Y: "+mouseY); }
    //}
  }

  update(tFrame) { // Computation Heavy, should be ran through either a web worker or main thread.
    this.gameState.handleStates(tFrame);

    if (tFrame >= this.#currentOptionAnimation && this.gameState.state == "MENU") { // Animation for the selected menu text.
      this.#currentOptionAnimation = tFrame + 20;
      if (texts[this.#currentOption].x <= texts[this.#currentOption].x0 - 15) { this.#currentOptionDirection = "right"; }
      else if (texts[this.#currentOption].x > texts[this.#currentOption].x0) { this.#currentOptionDirection = "left"; }
      if (this.#currentOptionDirection == "right") { texts[this.#currentOption].x += 1; }
      else if (this.#currentOptionDirection == "left") { texts[this.#currentOption].x -= 1; }
    }

    texts[9].setText("" + highscore);
    texts[11].setText("Time Elapsed: " + (tFrame / 1000).toFixed(1) + " s");
    texts[12].setText("Current Game State: " + this.gameState.state);
  }

  render() { // Should be very main thread heavy. Really Acts as a scene manager.
    ctx.clearRect(0, 0, screen.width, screen.height);

    for (const s of stars) {
      s.draw(ctx);
    }

    if (this.gameState.state === "MENU") {
      ctx.drawImage(imgs[0], grid.boxes[6][grid.columns / 2].x - imgs[0].width / 2, grid.boxes[6][grid.columns / 2].y - imgs[0].height / 2);

      ctx.fillStyle = "yellow";
      ctx.beginPath();
      ctx.moveTo(texts[this.#currentOption].x - texts[this.#currentOption].getHeight() * 2,
        texts[this.#currentOption].y);
      ctx.lineTo(texts[this.#currentOption].x - texts[this.#currentOption].getHeight() * 2,
        texts[this.#currentOption].y - texts[this.#currentOption].getHeight());
      ctx.lineTo(texts[this.#currentOption].x - texts[this.#currentOption].getHeight(),
        texts[this.#currentOption].y - texts[this.#currentOption].getHeight() / 2);
      ctx.closePath();
      ctx.fill();
    } else if (this.gameState.state === "EDITOR") {
      EDITORPATH.draw(ctx);
    } else if (this.gameState.state === "PLAY") {
      if (this.gameState.currentStage > 0 && this.gameState.currentStage <= 5) { // Current Stage
        for (let i = 0; i < this.gameState.currentStage; i++) {
          ctx.drawImage(imgs[1], 72 * 7 + 8 + 64 + 8 + 136 * 3 + 128 + 32 + 72 * 1 + 40 * 0, 128 + 16 + 328 + 72 * 3, 32, 64,
            grid.boxes[grid.rows - 1][grid.columns - 1].x - (i * grid.divX / 2), grid.boxes[grid.rows - 1][grid.columns - 1].y,
            grid.divX / 2, grid.divY);
        }
      }
      stages[this.gameState.currentStage - 1].enemies.draw(ctx);
      player.draw(ctx);
    } else if (this.gameState.state === "PAUSE") {
      stages[this.gameState.currentStage - 1].enemies.draw(ctx);
      player.draw(ctx);
    } else if (this.gameState.state === "NEXT") {
      if (this.gameState.currentStage > 0 && this.gameState.currentStage <= 5) { // Current Stage
        for (let i = 0; i < this.gameState.currentStage; i++) {
          ctx.drawImage(imgs[1], 72 * 7 + 8 + 64 + 8 + 136 * 3 + 128 + 32 + 72 * 1 + 40 * 0, 128 + 16 + 328 + 72 * 3, 32, 64,
            grid.boxes[grid.rows - 1][grid.columns - 1].x - (i * grid.divX / 2), grid.boxes[grid.rows - 1][grid.columns - 1].y,
            grid.divX / 2, grid.divY);
        }
      }
      stages[this.gameState.currentStage - 1].enemies.draw(ctx);
      player.draw(ctx);
    } else if (this.gameState.state === "REVIVE") {
      if (this.gameState.currentStage > 0 && this.gameState.currentStage <= 5) { // Current Stage
        for (let i = 0; i < this.gameState.currentStage; i++) {
          ctx.drawImage(imgs[1], 72 * 7 + 8 + 64 + 8 + 136 * 3 + 128 + 32 + 72 * 1 + 40 * 0, 128 + 16 + 328 + 72 * 3, 32, 64,
            grid.boxes[grid.rows - 1][grid.columns - 1].x - (i * grid.divX / 2), grid.boxes[grid.rows - 1][grid.columns - 1].y,
            grid.divX / 2, grid.divY);
        }
      }
      stages[this.gameState.currentStage - 1].enemies.draw(ctx);
      player.draw(ctx);
    }

    for (const text of texts) {
      text.draw(ctx);
    }
  }

  cleanup() { // Unusable for now.

  }

  run(tFrame) { // Unfortunately haven't found the time to fix any memory leaks if there are any.
    window.requestAnimationFrame(this.run.bind(this)); // Handles Timesteps already.

    if (tFrame - programElapsedTime > framerate) { // If we want to limit the timestep duration and provide a fps limiter.
      this.handleUserInputs();    // Handle User Inputs, all controls.

      this.update(tFrame);      // Compute Complex Maths and update game state. Audio too.
      this.render();              // Render everything that needs to be rendered.

      this.cleanup();             // Mainly for minor gc.
      programElapsedTime = tFrame;
    }
  }
}

// ----------------------------- Game Runtime ----------------------------- //

// Pre-rendering
function preRender(canvasName, canvas) {
  canvas.clearRect(0, 0, canvasName.width, canvasName.height);
  //for(const t of texts) {
  //    if( t == texts[10] ) {
  //        continue;
  //    }
  //    t.draw(canvas);
  //}

  //grid.draw(canvas);
  //entityGroup.draw(canvas);

  //for(const p of paths) {
  //    p.draw(canvas);
  //}

  //for(const t of gridTexts) {
  //    t.draw(canvas);
  //}
}
preRender(prerender, ptx);

//window.addEventListener("keydown", (event) => {
//    switch(event.key) {
//        case "r":
//            preRender(prerender, ptx);
//            break;
//    }
//});

// Game Loop
let gameEngine = new GameEngine();
gameEngine.init();
gameEngine.run();
















































