import sprites from '../configs/sprites';
import ClientEngine from './ClientEngine';

class ClientGame {
  constructor(cfg) {
    Object.assign(this, {
      cfg,
    });
    this.engine = this.createEngine();
    this.initEngine();
  }

  createEngine() {
    return new ClientEngine(document.getElementById(this.cfg.tagId));
  }

  initEngine() {
    this.engine.loadSprites(sprites).then(() => {
      console.log('Engine', this.engine);
      this.engine.start();
    });
  }

  static init(cfg) {
    if (!ClientGame.game) {
      ClientGame.game = new ClientGame(cfg);
    }
  }
}
export default ClientGame;
