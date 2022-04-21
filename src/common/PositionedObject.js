/* eslint-disable object-curly-newline */
import EventSourceMixin from './EventSourceMixin';

class PositionedObject {
  constructor(cfg) {
    Object.assign(
      this,
      {
        cfg,
        x: 0,
        y: 0,
        width: 0,
        height: 0,
      },
      cfg,
    );
  }

  /**
   * Координаты объекта в мире
   * @param {int} offsetPercentX Сдвиг относительно верхнего левого угла
   *  в процентах от размера объекта
   * @param {int} offsetPercentY Сдвиг относительно верхнего левого угла
   *  в процентах от размера объекта
   */
  worldPosition(offsetPercentX = 0, offsetPercentY = 0) {
    return {
      x: this.x + (this.width * offsetPercentX) / 100,
      y: this.y + (this.height * offsetPercentY) / 100,
    };
  }

  worldBounds() {
    const { x, y, width, height } = this;
    return {
      x,
      y,
      width,
      height,
    };
  }

  /**
   * Координаты объекта относительно окна отображения (канваса)
   * @param {int} offsetPercentX Сдвиг относительно верхнего левого угла
   *  в процентах от размера объекта
   * @param {int} offsetPercentY Сдвиг относительно верхнего левого угла
   *  в процентах от размера объекта
   */

  canvasPosition(offsetPercentX = 0, offsetPercentY = 0) {
    const pos = this.worldPosition(offsetPercentX, offsetPercentY);

    return {
      x: pos.x,
      y: pos.y,
    };
  }
}

Object.assign(PositionedObject.prototype, EventSourceMixin);

export default PositionedObject;
