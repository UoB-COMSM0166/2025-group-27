// ===== 新增Arrow类 =====
class Arrow {
    constructor(x, y, direction, speed, damage, size, img, state, canPierce = false, canSplit = false) {
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

      this.canPierce = canPierce; //穿透
      this.canSplit = canSplit; //散射
      this.hasSplit = false; //是否已经散射
      this.hitEnemies = new Set();
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

    handleCollision(enemy) {
      if (this.canPierce) {
        if (!this.hitEnemies.has(enemy)) { // **避免重复伤害**
          this.hitEnemies.add(enemy);
          return true; // 造成伤害
        }
        // 穿透逻辑，不销毁箭矢
        return false;
      } else {
        // 普通箭矢，碰撞后销毁
        this.isActive = false;
        return true;
      }
    }

    split() {
      if (this.canSplit && !this.hasSplit) {
        this.hasSplit = true;
        // 创建两个新的箭矢，方向稍微偏移
        let angleOffset = PI / 12; // 15度偏移
        let dir1 = this.vel.copy().rotate(-angleOffset);
        let dir2 = this.vel.copy().rotate(angleOffset);
        player.arrows.push(new Arrow(this.pos.x, this.pos.y, dir1, this.vel.mag()*0.1, this.damage, this.size, this.img, this.state, this.canPierce, false));
        player.arrows.push(new Arrow(this.pos.x, this.pos.y, dir2, this.vel.mag()*0.1, this.damage, this.size, this.img, this.state, this.canPierce, false));
      }
    }
  }