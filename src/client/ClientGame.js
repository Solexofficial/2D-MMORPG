import ClientEngine from './ClientEngine';
import ClientWorld from './ClientWorld';

import sprites from '../configs/sprites';
import levelCfg from '../configs/world.json';
import gameObjects from '../configs/gameObjects.json';

class ClientGame {
  constructor(cfg) {
    Object.assign(this, {
      cfg,
      gameObjects,
      player: null,
    });
    this.engine = this.createEngine();
    this.world = this.createWorld();
    this.initEngine();
    this.initKeys();
  }

  setPlayer(player) {
    this.player = player;
  }

  createEngine() {
    return new ClientEngine(document.getElementById(this.cfg.tagId));
  }

  createWorld() {
    return new ClientWorld(this, this.engine, levelCfg);
  }

  initKeys() {
    this.engine.input.onKey({
      ArrowLeft: (keydown) => {
        console.log(keydown);
        if (keydown) {
          this.player.moveByCellCoord(-1, 0, (cell) => {
            console.log('#### cell', cell.findObjectsByType('grass'));
            return cell.findObjectsByType('grass').length;
          });
        }
      },
    });
  }

  initEngine() {
    this.engine.loadSprites(sprites).then(() => {
      // eslint-disable-next-line no-unused-vars
      this.world.init();
      this.engine.on('render', (_, time) => {
        this.world.render(time);
      });
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
