// Class Text
class Text {
  constructor(x = 0, y = 0, text = "", colour = "white", visible = true, size = 18) {
    this.x0 = x;
    this.y0 = y;
    this.x = x;
    this.y = y;
    this.text = text;
    this.colour = colour;
    this.visible = visible;
    this.size = size;
  }

  setText(text) { this.text = text; }
  setVisibility(visible) { this.visible = visible; }
  getVisibility() { return this.visible; }
  getOriginalX() { return this.x0; }
  getOriginalY() { return this.y0; }
  getWidth() { return this.text.length * this.size; }
  getHeight() { return this.size; }
  center() {
    this.x = this.x - this.getWidth() / 2;
    this.x0 = this.x;
  }
  updatePosition(pos) {
    this.x = pos[0];
    this.y = pos[1];
  }

  draw(canvas) {
    if (this.visible) {
      canvas.font = this.size + "px Galaxian";
      canvas.fillStyle = this.colour;
      canvas.fillText(this.text, this.x, this.y);
    }
  }
}

export { Text };