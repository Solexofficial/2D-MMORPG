import { clamp } from './util';
import PositionedObject from './PositionedObject';

class MovableObject extends PositionedObject {
  constructor(cfg) {
    super(cfg);

    Object.assign(
      this,
      {
        toX: 0,
        toY: 0,
        deltaX: 0,
        deltaY: 0,

        speed: 0,

        motionStartTime: 0,
        motionProgress: 1,

        clampToMap: true, // по умолчанию объект не должен вылетать за пределы карты
      },
      cfg,
    );
  }

  // eslint-disable-next-line no-unused-vars
  animateMotion(time) {
    if (this.speed) {
      const me = this;

      const [newX, newY] = [me.toX, me.toY];

      if (newX === me.toX && newY === me.toY) {
        me.speed = 0;
        me.motionStartTime = 0;
        me.motionProgress = 1;
        me.trigger('motion-stopped');
      }

      me.x = newX;
      me.y = newY;
    }
  }

  render(time) {
    // eslint-disable-next-line no-unused-expressions
    this.speed && this.animateMotion(time);
  }

  // eslint-disable-next-line no-unused-vars
  moveTo(x, y, smooth = true, speed = 200) {
    let [newX, newY] = [x, y];
    const { width, height } = this;

    if (this.clampToMap && this.engine) {
      const world = this.engine.game.getWorld();
      if (world) {
        // Делаем, чтобы камера не выходила за пределы мира
        // левый верхний угол
        newX = clamp(x, 0, world.width - width);
        newY = clamp(y, 0, world.height - height);
      }
    }

    this.x = newX;
    this.y = newY;
  }
}

export default MovableObject;
