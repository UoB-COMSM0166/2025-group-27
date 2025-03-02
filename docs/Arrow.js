// ===== 新增Arrow类 =====
class Arrow {
    constructor(x, y, direction, speed, damage, size, img, state) {
      this.pos = createVector(x, y);
      this.vel = direction.copy().mult(speed);
      this.damage = damage;
      this.size = size;
      this.isActive = true;
      this.rotation = direction.heading();
      this.img = img;
      this.imgWidth = size * 2;
      this.imgHeight = size;
      this.state = state;
    }
  
    update() {
      if (!this.isActive) return;
      this.pos.add(this.vel);
      
      // 边界检测
      if (this.pos.x < 0 || this.pos.x > width || 
          this.pos.y < 0 || this.pos.y > height) {
        this.isActive = false;
      }
    }
  
    display() {
        push();
        translate(this.pos.x, this.pos.y);
        
        // 主体
        if(this.state === "h") {
          image(
            this.img,
            0, 0,
            this.imgWidth,
            this.imgHeight,
            0,
            0,
            this.img.width,
            this.img.height
          );
        } else if (this.state === "v") {
          image(
            this.img,
            0, 0,
            this.imgHeight,
            this.imgWidth,
            0,
            0,
            this.img.width,
            this.img.height
          );
        }
        pop();
    }
  }