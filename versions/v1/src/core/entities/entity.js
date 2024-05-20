import { withinBounds } from "../gameplay/collision.js";

// Entity Class
class Entity {
  constructor(x = 0, y = 0, speed = 0) {
    this.x0 = x;
    this.y0 = y;
    this.x = x;
    this.y = y;
    this.width = 0;
    this.height = 0;
    this.speed = speed;
    this.angle = 0;
    this.visible = false;
  }

  collision(object, offset = 1) { return withinBounds(this, object, offset); }
  isAlive() { return this.visible; }
  setWidth(width) { this.width = width; }
  setHeight(height) { this.height = height; }
  setOriginalX(x0) { this.x0 = x0; }
  setOriginalY(y0) { this.y0 = y0; }
  setVisibility(visible) { this.visible = visible; }
}

export { Entity };