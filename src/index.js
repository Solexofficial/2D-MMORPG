/* eslint-disable no-console */
import './index.scss';
import characterSprite from './assets/Male-5-Walk.png';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const spriteW = 48;
const spriteH = 48;
const shots = 3;
const GAME_WIDTH = parseInt(canvas.getAttribute('width'), 10);
const GAME_HEIGHT = parseInt(canvas.getAttribute('height'), 10);

let cycle = 0;
let bottomPressed = false;
let upPressed = false;
let leftPressed = false;
let rightPressed = false;
let pY = 276;
let pX = 276;
let side = 0;

function keyDownHandler(e) {
  if (e.key === 'Down' || e.key === 'ArrowDown') {
    bottomPressed = true;
  }
  if (e.key === 'Left' || e.key === 'ArrowLeft') {
    leftPressed = true;
  }
  if (e.key === 'Up' || e.key === 'ArrowUp') {
    upPressed = true;
  }
  if (e.key === 'Right' || e.key === 'ArrowRight') {
    rightPressed = true;
  }
}

function keyUpHandler(e) {
  if (e.key === 'Down' || e.key === 'ArrowDown') {
    bottomPressed = false;
  }
  if (e.key === 'Left' || e.key === 'ArrowLeft') {
    leftPressed = false;
  }
  if (e.key === 'Up' || e.key === 'ArrowUp') {
    upPressed = false;
  }
  if (e.key === 'Right' || e.key === 'ArrowRight') {
    rightPressed = false;
  }
}

document.addEventListener('keydown', keyDownHandler);
document.addEventListener('keyup', keyUpHandler);

const img = document.createElement('img');
img.src = characterSprite;

img.addEventListener('load', () => {
  setInterval(() => {
    if (bottomPressed) {
      side = 0;
      if (pY < GAME_HEIGHT - spriteH) {
        pY += 10;
      }
      cycle = (cycle + 1) % shots;
    }

    if (upPressed) {
      side = 144;
      if (pY > 0) {
        pY -= 10;
      }
      cycle = (cycle + 1) % shots;
    }

    if (leftPressed) {
      side = 48;
      if (pX > 0) {
        pX -= 10;
      }
      cycle = (cycle + 1) % shots;
    }

    if (rightPressed) {
      side = 96;
      if (pX < GAME_WIDTH - spriteW) {
        pX += 10;
      }
      cycle = (cycle + 1) % shots;
    }

    ctx.clearRect(0, 0, 600, 600);
    ctx.drawImage(img, cycle * spriteW, side, spriteW, spriteH, pX, pY, 48, 48);
  }, 40);
});
