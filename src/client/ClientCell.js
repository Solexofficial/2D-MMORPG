import PositionedObject from '../common/PositionedObject';
import ClientGameObject from './ClientGameObject';

class ClientCell extends PositionedObject {
  constructor(cfg) {
    super();
    const { cellWidth, cellHeight } = cfg.world;

    Object.assign(
      this,
      {
        cfg,
        objects: [],
        x: cellWidth * cfg.cellCol,
        y: cellWidth * cfg.cellRow,
        width: cellWidth,
        height: cellHeight,
      },
      cfg,
    );

    this.initGameObjects();
  }

  initGameObjects() {
    const { cellCfg } = this;

    this.objects = cellCfg[0].map((objCfg) => new ClientGameObject({ cell: this, objCfg }));
  }

  render(time) {
    const { objects } = this;

    objects.map((obj) => obj.render(time));
  }

  addGameObject(objToAdd) {
    this.objects.push(objToAdd);
  }

  removeGameObject(objToRemove) {
    this.objects = this.objects.filter((obj) => obj !== objToRemove);
  }

  findObjectsByType(type) {
    return this.objects.filter((obj) => obj.type === type);
  }
}

export default ClientCell;
