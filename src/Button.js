// ===== Button 类 =====
class Button {
  constructor(x, y, w, h, label, action) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.label = label;
    this.action = action;
  }

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

  contains(mx, my) {
    return (
      mx > this.x && mx < this.x + this.w && my > this.y && my < this.y + this.h
    );
  }
}

