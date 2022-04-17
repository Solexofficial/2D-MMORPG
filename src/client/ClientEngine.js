/* eslint-disable object-curly-newline */
/* eslint-disable max-len */
import EventSourceMixin from '../common/EventSourceMixin';
import ClientCamera from './ClientCamera';
import ClientInput from './ClientInput';
import { clamp } from '../common/util';

class ClientEngine {
  constructor(canvas, game) {
    Object.assign(this, {
      canvas,
      canvases: { main: canvas },
      ctx: canvas.getContext('2d'),
      imageLoaders: [],
      sprites: {},
      images: {},
      camera: new ClientCamera({ canvas, engine: this }),
      input: new ClientInput(canvas),
      game,
      startTime: 0,
      lastRenderTime: 0,
    });
    this.focus();
    this.loop = this.loop.bind(this);
  }

  start() {
    this.loop();
  }

  loop(timestamp) {
    if (!this.startTime) {
      this.startTime = timestamp;
    }

    this.lastRenderTime = timestamp;

    const { ctx, canvas } = this;
    ctx.fillStyle = 'black';
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    this.trigger('render', timestamp);
    this.initNextFrame();
  }

  initNextFrame() {
    window.requestAnimationFrame(this.loop);
  }

  loadSprites(spritesGroup) {
    this.imageLoaders = [];

    Object.keys(spritesGroup).forEach((groupName) => {
      const group = spritesGroup[groupName];
      this.sprites[groupName] = group;

      Object.keys(group).forEach((spriteName) => {
        const { img } = group[spriteName];
        if (!this.images[img]) {
          this.imageLoaders.push(this.loadImage(img));
        }
      });
    });

    return Promise.all(this.imageLoaders);
  }

  loadImage(url) {
    return new Promise((resolve) => {
      const i = new Image();
      this.images[url] = i;
      i.onload = () => resolve(i);
      i.src = url;
    });
  }

  renderSpriteFrame({ sprite, frame, x, y, w, h }) {
    const spriteCfg = this.sprites[sprite[0]][sprite[1]];
    const [fx, fy, fw, fh] = spriteCfg.frames[frame];
    const img = this.images[spriteCfg.img];
    // const camera = this.camera;
    const { x: camX, y: camY } = this.camera;

    this.ctx.drawImage(img, fx, fy, fw, fh, x - camX, y - camY, w, h);
  }

  addCanvas(name, width, height) {
    let canvas = this.canvases[name];

    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      this.canvases[name] = canvas;
    }

    return canvas;
  }

  switchCanvas(name) {
    const canvas = this.canvases[name];

    if (canvas) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
    }

    return canvas;
  }

  focus() {
    this.canvases.main.focus();
  }

  renderCanvas(name, fromPos, toPos) {
    const canvas = this.canvases[name];

    if (canvas) {
      this.ctx.drawImage(
        canvas,
        fromPos.x,
        fromPos.y,
        fromPos.width,
        fromPos.height,
        toPos.x,
        toPos.y,
        toPos.width,
        toPos.height,
      );
    }
  }

  renderSign(opt) {
    const options = {
      color: 'Black',
      bgColor: 'rgba(252, 252, 252, .7)',
      font: '16px sans-serif',
      verticalPadding: 5,
      horizontalPadding: 3,
      textAlign: 'center',
      textBaseline: 'center',
      ...opt,
    };

    const { ctx, camera } = this;

    ctx.textBaseline = options.textBaseline;
    ctx.textAlign = options.textAlign;
    ctx.font = options.font;

    const meassure = ctx.measureText(options.text);
    const textHeight = meassure.actualBoundingBoxAscent;

    const barWidth = clamp(meassure.width + 2 * options.horizontalPadding, options.minWidth, options.maxWidth);
    const barHeight = textHeight + 2 * options.verticalPadding;

    const barX = options.x - barWidth / 2 - camera.x;
    const barY = options.y - barHeight / 2 - camera.y;

    const textWidth = clamp(meassure.width, 0, barWidth - 2 * options.horizontalPadding);

    ctx.fillStyle = options.bgColor;
    ctx.fillRect(barX, barY, barWidth, barHeight);

    ctx.fillStyle = options.color;
    ctx.fillText(options.text, barX + barWidth / 2, barY + barHeight - options.verticalPadding, textWidth);
  }
}

Object.assign(ClientEngine.prototype, EventSourceMixin);

export default ClientEngine;
