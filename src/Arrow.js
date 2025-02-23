// ===== 新增Arrow类 =====
class Arrow {
    constructor(x, y, direction, speed, damage, size) {
      this.pos = createVector(x, y);
      this.vel = direction.copy().mult(speed);
      this.damage = damage;
      this.size = size;
      this.isActive = true;
      this.rotation = direction.heading();
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
        rotate(this.rotation);
        
        // 主体
        fill(150, 75, 0);
        stroke(100, 50, 0);
        strokeWeight(2);
        beginShape();
        vertex(0, -this.size/2);
        vertex(this.size, 0);
        vertex(0, this.size/2);
        endShape(CLOSE);
        
        // 拖尾效果
        for(let i = 0; i < 3; i++) {
          fill(255, 200 - i*80);
          noStroke();
          ellipse(
            -i*this.size*0.3, 
            0, 
            this.size*(0.8 - i*0.2), 
            this.size*0.3
          );
        }
        
        pop();
    }
  }