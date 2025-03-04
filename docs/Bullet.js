// --- Bullet 类 ---
class Bullet {
  constructor(x, y, vel, type = "normal", bImageUp, bImageDown, bImageLeft, bImageRight, state) {
    this.pos = createVector(x, y);
    this.vel = vel;
    this.radius = 5;
    this.type = type;
    this.damage = 10;
    this.pierceCount = type === "pierce" ? 3 : 0;
    this.bounceCount = 0;
    this.maxBounces = type === "bounce" ? 3 : 0;
    this.shootDirection;
    if(state === "Up") {
      this.bImage = bImageDown;
      this.shootDirection = "up";
      this.ImageWidth = 20;
      this.ImageHeight = 80;
      this.bWidth = 30;
      this.bHeight = 100;
    } else if (state === "Down") {
      this.bImage = bImageUp;
      this.shootDirection = "down";
      this.ImageWidth = 20;
      this.ImageHeight = 80;
      this.bWidth = 30;
      this.bHeight = 100;
    } else if (state === "Left") {
      this.bImage = bImageLeft;
      this.shootDirection = "left";
      this.ImageWidth = 80;
      this.ImageHeight = 20;
      this.bWidth = 100;
      this.bHeight = 30;
    } else if (state === "Right") {
      this.bImage = bImageRight;
      this.shootDirection = "right";
      this.ImageWidth = 80;
      this.ImageHeight = 20;
      this.bWidth = 100;
      this.bHeight = 30;
    }

    this.frameIndex = 0;
    this.animationDelay = 10; // control animation speed
    this.animationCounter = 0;
  }

  update() {
    this.pos.add(this.vel);

    // 检测敌人碰撞
    for (let i = enemies.length - 1; i >= 0; i--) {
      let enemy = enemies[i];
      if (p5.Vector.dist(this.pos, enemy.pos) < enemy.radius + this.radius) {
        let killed = enemy.hit(this.damage);
        if (killed) {
          enemies.splice(i, 1);
          if (enemy instanceof Boss) {
            // 检查是否是 Boss
            bossDefeated++;
            bossDefeatedCount++;
            if (wave === 6) {
              player.needsPetSelection = true;
              gameState = "petSelection";
            }
          }
          normalEnemiesDefeated++;
          player.gainExp(enemy.expValue);
        }
        if (this.type === "pierce") {
          this.pierceCount--;
          if (this.pierceCount <= 0) return false;
        } else if (this.type !== "bounce") {
          return false;
        }
      }
    }

    // 检测障碍物碰撞
    for (let obs of obstacles) {
      if (obs.collidesWithCircle(this.pos, this.radius)) {
        if (this.type === "bounce") {
          let closestX = constrain(
            this.pos.x,
            obs.pos.x,
            obs.pos.x + obs.width
          );
          let closestY = constrain(
            this.pos.y,
            obs.pos.y,
            obs.pos.y + obs.height
          );
          if (abs(this.pos.x - closestX) < abs(this.pos.y - closestY)) {
            this.vel.y *= -1;
          } else {
            this.vel.x *= -1;
          }
          this.bounceCount++;
          showFloatingText(
            "Bounce!",
            this.pos.x,
            this.pos.y,
            color(255, 200, 0)
          );
          if (this.bounceCount > this.maxBounces) return false;
          this.pos.add(this.vel);
        } else if (this.type === "pierce") {
          this.pierceCount--;
          if (this.pierceCount <= 0) return false;
        } else {
          return false;
        }
      }
    }

    // 边界检测
    if (
      this.pos.x < 0 ||
      this.pos.x > width ||
      this.pos.y < 0 ||
      this.pos.y > height
    ) {
      if (this.type === "bounce") {
        if (this.pos.x < 0 || this.pos.x > width) {
          this.vel.x *= -1;
          this.pos.x = constrain(this.pos.x, 0, width);
        }
        if (this.pos.y < 0 || this.pos.y > height) {
          this.vel.y *= -1;
          this.pos.y = constrain(this.pos.y, 0, height);
        }
        this.bounceCount++;
        showFloatingText("Bounce!", this.pos.x, this.pos.y, color(255, 200, 0));
        if (this.bounceCount > this.maxBounces) return false;
      } else {
        return false;
      }
    }
    return true;
  }


  display() {
    push();
    translate(this.pos.x, this.pos.y);
    image(
      this.bImage,
      0, 0,
      this.ImageWidth,
      this.ImageHeight,
      0,
      0,
      this.bImage.width,
      this.bImage.height
    );
  pop();
  }
}

// --- EnemyBullet 类 ---
class EnemyBullet {
  constructor(x, y, vel) {
    this.pos = createVector(x, y);
    this.vel = vel;
    this.radius = 5;
    this.damage = 10;
  }

  update() {
    this.pos.add(this.vel);
    for (let obs of obstacles) {
      if (obs.collidesWithCircle(this.pos, this.radius)) return false;
    }
    return !(
      this.pos.x < 0 ||
      this.pos.x > width ||
      this.pos.y < 0 ||
      this.pos.y > height
    );
  }

  display() {
    fill(200, 100, 255);
    noStroke();
    ellipse(this.pos.x, this.pos.y, this.radius * 2);
  }
}

// --- WebProjectile 类 ---
class WebProjectile extends EnemyBullet {
  constructor(x, y, vel) {
    super(x, y, vel);
    this.radius = 10;
    
    // 添加动画属性
    this.frameIndex = 0;
    this.frameCount = 6; // acidProjectile2图片有6帧
    this.frameDelay = 6;
    this.frameCounter = 0;
  }

  update() {
    // 更新位置
    this.pos.add(this.vel);
    
    // 更新动画帧
    this.frameCounter++;
    if (this.frameCounter >= this.frameDelay) {
      this.frameCounter = 0;
      this.frameIndex = (this.frameIndex + 1) % this.frameCount;
    }
    
    return !(this.pos.x < 0 || this.pos.x > width || this.pos.y < 0 || this.pos.y > height);
  }

  display() {
    // 使用特效图片渲染
    if (typeof webEffectImg !== 'undefined' && webEffectImg) {
      try {
        push();
        imageMode(CENTER);
        
        // 计算当前帧在精灵表中的位置
        let frameWidth = webEffectImg.width / this.frameCount;
        let frameHeight = webEffectImg.height;
        
        // 禁用平滑，保留像素感
        drawingContext.imageSmoothingEnabled = false;
        
        // 绘制当前帧
        let displaySize = this.radius * 2.5;
        
        // 根据移动方向旋转图像
        let angle = this.vel.heading() + HALF_PI;
        translate(this.pos.x, this.pos.y);
        rotate(angle);
        
        image(
          webEffectImg,
          0, 
          0,
          displaySize, 
          displaySize * 1.2, // 稍微拉长
          this.frameIndex * frameWidth, 
          0,
          frameWidth, 
          frameHeight
        );
        
        drawingContext.imageSmoothingEnabled = true;
        pop();
      } catch (e) {
        // 后备渲染方法
        fill(200, 200, 200, 150);
        ellipse(this.pos.x, this.pos.y, this.radius * 2);
      }
    } else {
      // 默认渲染方法
      fill(200, 200, 200, 150);
      ellipse(this.pos.x, this.pos.y, this.radius * 2);
    }
  }
}


