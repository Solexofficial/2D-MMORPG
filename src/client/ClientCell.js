import PositionedObject from '../common/PositionedObject';
import ClientGameObject from './ClientGameObject';
import ClientPlayer from './ClientPlayer';

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
        col: cfg.cellCol,
        row: cfg.cellRow,
        objectClasses: {
          player: ClientPlayer,
        },
      },
      cfg,
    );

    this.initGameObjects();
  }

  createGameObject(objCfg, layerID) {
    const { objectClasses } = this;
    let ObjectClass;

    if (objCfg.class) {
      ObjectClass = objectClasses[objCfg.class];
    } else {
      ObjectClass = ClientGameObject;
    }

    const obj = new ObjectClass({
      cell: this,
      objCfg,
      layerID,
    });

    if (obj.type === 'spawn') {
      this.world.game.addSpawnPoint(obj);
    }

    return obj;
  }

  initGameObjects() {
    const { cellCfg } = this;

    // this.objects = cellCfg[0].map((objCfg) => new ClientGameObject({ cell: this, objCfg }));
    this.objects = cellCfg.map((layer, layerID) => layer.map((objCfg) => this.createGameObject(objCfg, layerID)));
  }

  render(time, layerID) {
    const { objects } = this;

    if (objects[layerID]) {
      objects[layerID].forEach((obj) => obj.render(time));
    }
  }

  addGameObject(objToAdd) {
    const { objects } = this;

    if (objToAdd.layerID === undefined) {
      objToAdd.layerID = objects.length;
    }

    if (!objects[objToAdd.layerID]) {
      objects[objToAdd.layerID] = [];
    }

    objects[objToAdd.layerID].push(objToAdd);
  }

  removeGameObject(objToRemove) {
    // this.objects = this.objects.filter((obj) => obj !== objToRemove);
    const { objects } = this;

    objects.forEach((layer, layerID) => (this.objects[layerID] = layer.filter((obj) => obj !== objToRemove)));
  }

  findObjectsByType(type) {
    let foundObjects = [];
    this.objects.forEach((layer) => (foundObjects = [...foundObjects, ...layer].filter((obj) => obj.type === type)));
    return foundObjects;
  }
}

export default ClientCell;
