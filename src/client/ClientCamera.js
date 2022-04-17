import MovableObject from '../common/MovableObject';

class ClientCamera extends MovableObject {
  constructor(cfg) {
    super(cfg);

    Object.assign(
      this,
      {
        cfg,
        width: cfg.canvas.width,
        height: cfg.canvas.height,
      },
      cfg,
    );
  }

  focusAtGameObject(obj) {
    const pos = obj.worldPosition(50, 50);
    this.moveTo(pos.x - this.width / 2, pos.y - this.height / 2, false);
  }
}

export default ClientCamera;
