class Feather {
  constructor(x, y, sprite) {
    this.pos = createVector(x, y);
    this.vel = createVector(0, 2);
    this.sprite = sprite;

    // 8 帧
    this.totalFrames = 8;
    this.currentFrame = 0;
    this.frameDelay = 5; // 切换速度
    this.frameCounter = 0;

    this.frameWidth = this.sprite.width / this.totalFrames;
    this.frameHeight = this.sprite.height;
  }

  update() {
    this.pos.add(this.vel);
    // 动画计数
    this.frameCounter++;
    if (this.frameCounter >= this.frameDelay) {
      this.frameCounter = 0;
      this.currentFrame = (this.currentFrame + 1) % this.totalFrames;
    }
  }

  display() {
    let sx = this.currentFrame * this.frameWidth;
    let sy = 0;
    image(
      this.sprite,
      this.pos.x,
      this.pos.y,
      this.frameWidth,
      this.frameHeight,
      sx,
      sy,
      this.frameWidth,
      this.frameHeight
    );
  }

  isOffScreen() {
    return this.pos.y > height + 50;
  }
}
