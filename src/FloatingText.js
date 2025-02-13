// --- FloatingText 类 ---
class FloatingText {
  constructor(text, x, y, col) {
    this.text = text;
    this.pos = createVector(x, y);
    this.col = col;
    this.alpha = 255;
    this.lifetime = 60;
  }

  update() {
    this.pos.y -= 1;
    this.alpha -= 255 / this.lifetime;
    return this.alpha > 0;
  }

  display() {
    push();
    textAlign(CENTER);
    textSize(16);
    fill(red(this.col), green(this.col), blue(this.col), this.alpha);
    text(this.text, this.pos.x, this.pos.y);
    pop();
  }
}