import ClientGameObject from './ClientGameObject';

class ClientPlayer extends ClientGameObject {
  constructor(cfg) {
    super(cfg);

    this.playerName = cfg.objCfg.playerName;
  }

  render(time) {
    super.render(time);

    const { world } = this;

    world.engine.renderSign({
      x: this.x + world.cellWidth / 2,
      y: this.y - 15,
      minWidth: world.cellWidth,
      maxWidth: world.cellWidth * 1.5,
      text: this.playerName,
    });
  }
}

export default ClientPlayer;
