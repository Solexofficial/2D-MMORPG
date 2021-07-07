/* eslint-disable no-console */
import './index.scss';
import characterSprite from './assets/Male-5-Walk.png';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const spriteW = 48;
const spriteH = 48;
const shots = 3;

let cycle = 0;
let pX = (canvas.width - spriteW) / 2;
let pY = (canvas.height - spriteH) / 2;
let direction = 0;

function keyDownHandler(e) {
  switch (e.key) {
    case 'Down':
    case 'ArrowDown':
      direction = 'bottom';
      break;
    case 'Left':
    case 'ArrowLeft':
      direction = 'left';
      break;
    case 'Up':
    case 'ArrowUp':
      direction = 'up';
      break;
    case 'Right':
    case 'ArrowRight':
      direction = 'right';
      break;
    default:
      break;
  }
}

function keyUpHandler(e) {
  switch (e.key) {
    case 'Down':
    case 'ArrowDown':
    case 'Left':
    case 'ArrowLeft':
    case 'Up':
    case 'ArrowUp':
    case 'Right':
    case 'ArrowRight':
      break;
    default:
      break;
  }
}

document.addEventListener('keydown', keyDownHandler);
document.addEventListener('keyup', keyUpHandler);

const img = document.createElement('img');
img.src = characterSprite;

img.addEventListener('load', () => {
  setInterval(() => {
    switch (direction) {
      case 'up':
        direction = spriteH * 3;
        pY = pY > 0 ? (pY -= 10) : 0;
        cycle = (cycle + 1) % shots;
        break;
      case 'right':
        direction = spriteH * 2;
        pX = pX < canvas.width - spriteW ? (pX += 10) : canvas.height - spriteW;
        cycle = (cycle + 1) % shots;
        break;
      case 'bottom':
        direction = spriteH * 0;
        pY = pY < canvas.height - spriteH ? (pY += 10) : canvas.width - spriteH;
        cycle = (cycle + 1) % shots;
        break;
      case 'left':
        direction = spriteH;
        pX = pX > 0 ? (pX -= 10) : 0;
        cycle = (cycle + 1) % shots;
        break;
      default:
        break;
    }

    ctx.clearRect(0, 0, 600, 600);
    ctx.drawImage(img, cycle * spriteW, direction, spriteW, spriteH, pX, pY, spriteW, spriteH);
  }, 40);
});
