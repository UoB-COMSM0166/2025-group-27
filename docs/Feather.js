class Feather {
  constructor(x, y, sprite) {
    this.pos = createVector(x, y);
    this.vel = createVector(0, 2);
    this.sprite = sprite;
    this.lifetime = 80;
    
    this.totalFrames = 8;
    this.currentFrame = Math.floor(random(8));
    this.frameDelay = 8;
    this.frameCounter = 0;

    this.frameWidth = this.sprite ? this.sprite.width / this.totalFrames : 0;
    this.frameHeight = this.sprite ? this.sprite.height : 0;
    
    this.size = {
      width: this.frameWidth,
      height: this.frameHeight
    };
  }

  reset(x, y, sprite) {
    this.pos.x = x;
    this.pos.y = y;
    this.vel.set(0, 2);
    this.lifetime = 80;
    
    if (sprite && this.sprite !== sprite) {
      this.sprite = sprite;
      this.frameWidth = this.sprite.width / this.totalFrames;
      this.frameHeight = this.sprite.height;
      this.size = {
        width: this.frameWidth,
        height: this.frameHeight
      };
    }
    
    this.currentFrame = Math.floor(random(8));
    this.frameCounter = 0;
    return this;
  }

  update() {
    this.lifetime--;
    
    this.pos.x += this.vel.x;
    this.pos.y += this.vel.y;
    
    if (frameCount % this.frameDelay === 0) {
      this.currentFrame = (this.currentFrame + 1) % this.totalFrames;
    }
    
    return this.lifetime > 0 && !this.isOffScreen();
  }

  display() {
    if (this.lifetime <= 0 || !this.sprite) return;
    
    push();
    const alpha = Math.floor((this.lifetime / 80) * 255);
    tint(255, alpha);
    
    image(
      this.sprite,
      Math.floor(this.pos.x),
      Math.floor(this.pos.y),
      this.size.width,
      this.size.height,
      this.currentFrame * this.frameWidth,
      0,
      this.frameWidth,
      this.frameHeight
    );
    pop();
  }

  isOffScreen() {
    const margin = 50;
    return (this.pos.x < -margin || 
            this.pos.x > width + margin || 
            this.pos.y < -margin || 
            this.pos.y > height + margin);
  }
}
