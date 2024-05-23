// Vector2 class, as the name suggest 2d vectors.

class Vector2 {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  update(x, y) {
    this.x = x;
    this.y = y;
  }

  copy(v) {
    this.x = v.x;
    this.y = v.y;
    return this;
  }

  add(v, w) {
    if (w !== undefined) {
      return this.addVectors(v, w);
    }
    this.x += v.x;
    this.y += v.y;
    return this;
  }

  sub(v, w) {
    if (w !== undefined) {
      return this.subVectors(v, w);
    }
    this.x -= v.x;
    this.y -= v.y;
    return this;
  }
  subVectors(a, b) {
    this.x = a.x - b.x;
    this.y = a.y - b.y;
    return this;
  }

  addVectors(a, b) {
    this.x = a.x + b.x;
    this.y = a.y + b.y;
    return this;
  }

  subVectors(a, b) {
    this.x = a.x - b.x;
    this.y = a.y - b.y;
    return this;
  }

  multiplyScalar(scalar) {
    this.x *= scalar;
    this.y *= scalar;
    return this;
  }

  divideScalar(scalar) {
    return this.multiplyScalar(1 / scalar);
  }

  length() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  normalize() {
    return this.divideScalar(this.length() || 1);
  }

  distanceToSquared(v) {
    const dx = this.x - v.x,
      dy = this.y - v.y;
    return dx * dx + dy * dy;
  }

  distanceTo(v) {
    // Assuming v is the farther vector
    return Math.sqrt(
      (v.x - this.x) * (v.x - this.x) + (v.y - this.y) * (v.y - this.y)
    );
  }

  angle() {
    // computes the angle in radians with respect to the positive x-axis
    const angle = Math.atan2(-this.y, -this.x) + Math.PI;
    return angle;
  }
}

export { Vector2 };
