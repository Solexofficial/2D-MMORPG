class ClientEngine {
  constructor(canvas) {
    Object.assign(this, {
      canvas,
      ctx: null,
      imageLoaders: [],
      sprites: {},
      images: {},
    });

    this.ctx = canvas.getContext('2d');

    this.loop = this.loop.bind(this);
  }

  start() {
    this.loop();
  }

  loop(timestamp) {
    console.log(timestamp);
    const { ctx, canvas } = this;
    ctx.fillStyle = 'black';
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    this.initNextFrame();
  }

  initNextFrame() {
    window.requestAnimationFrame(this.loop);
  }

  loadSprites(spritesGroup) {
    this.imageLoaders = [];

    for (const groupName in spritesGroup) {
      if (Object.prototype.hasOwnProperty.call(groupName, spritesGroup)) {
        const group = spritesGroup[groupName];
        this.sprites[groupName] = group;
        console.log(group);

        for (const spriteName in group) {
          if (Object.prototype.hasOwnProperty.call(group, spriteName)) {
            const { img } = group[spriteName];
            console.log('#img', img);
            if (!this.images[img]) {
              this.imageLoaders.push(this.loadImage(img));
            }
          }
        }
      }
    }

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
}

export default ClientEngine;
