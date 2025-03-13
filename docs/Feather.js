class Feather {
  constructor(x, y, sprite) {
    this.pos = createVector(x, y);
    this.vel = createVector(0, 2);
    this.sprite = sprite;
    this.lifetime = 120; // 减少生命周期到2秒
    
    // 减少动画帧数和更新频率
    this.totalFrames = 8;
    this.currentFrame = Math.floor(random(8)); // 随机初始帧，使动画不同步
    this.frameDelay = 8; // 降低帧率
    this.frameCounter = 0;

    this.frameWidth = this.sprite.width / this.totalFrames;
    this.frameHeight = this.sprite.height;
    
    // 预计算一些值以提高性能
    this.size = {
      width: this.frameWidth,
      height: this.frameHeight
    };
  }

  update() {
    // 使用整数运算提高性能
    this.lifetime = this.lifetime - 1;
    
    // 简化速度计算
    this.pos.x += this.vel.x;
    this.pos.y += this.vel.y;
    
    // 减少动画更新频率
    if (frameCount % this.frameDelay === 0) {
      this.currentFrame = (this.currentFrame + 1) % this.totalFrames;
    }
    
    return !(this.isOffScreen() || this.lifetime <= 0);
  }

  display() {
    if (this.lifetime <= 0) return;
    
    push();
    // 使用整数运算优化透明度计算
    const alpha = Math.floor((this.lifetime / 120) * 255);
    tint(255, alpha);
    
    // 使用预计算的尺寸
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
    // 简化边界检查
    const margin = 50;
    return (this.pos.x < -margin || 
            this.pos.x > width + margin || 
            this.pos.y < -margin || 
            this.pos.y > height + margin);
  }
}
