//------------------Class Button----------------------
class Button {
  constructor(x, y, w, h, label, action) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.label = label;
    this.action = action;
  }

  // Draw the button rectangle, border, and centered text
  display() {
    push();
    fill(100);
    stroke(200);
    rectMode(CORNER);
    rect(this.x, this.y, this.w, this.h, 5);
    fill(255);
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(16);
    text(this.label, this.x + this.w / 2, this.y + this.h / 2);
    pop();
  }

  // Check if a point (mouseX, mouseY) is inside the button
  contains(mx, my) {
    return (
      mx > this.x && mx < this.x + this.w && my > this.y && my < this.y + this.h
    );
  }
}

//Class FloatingText
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

  // Draw the text with its current alpha
  display() {
    push();
    textAlign(CENTER);
    textSize(16);
    fill(red(this.col), green(this.col), blue(this.col), this.alpha);
    text(this.text, this.pos.x, this.pos.y);
    pop();
  }
}