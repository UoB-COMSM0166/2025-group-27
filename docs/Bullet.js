// --- Bullet 类 ---
class Bullet {
  constructor(x, y, vel, type = "normal", bImageUp, bImageDown, bImageLeft, bImageRight, bUpWidth, bUpHeight, bLeftWidth, bLeftHeight, state) {
    this.pos = createVector(x, y);
    this.vel = vel;
    this.radius = 5;
    this.type = type;
    this.damage = 10;
    this.pierceCount = type === "pierce" ? 3 : 0;
    this.bounceCount = 0;
    this.maxBounces = type === "bounce" ? 3 : 0;
    this.animations = {
      shoot1: [0, 1, 2, 3, 4, 5, 6, 7, 8],
      shoot2: [8, 7, 6, 5, 4, 3, 2, 1, 0],
    };
    this.shootDirection;
    if(state === "Up") {
      this.bWidth = bUpWidth;
      this.bHeight = bUpHeight;
      this.bImage = bImageDown;
      this.shootDirection = "up";
      this.ImageWidth = 20;
      this.ImageHeight = 80;
      this.currentAnimation = this.animations.shoot2;
    } else if (state === "Down") {
      this.bWidth = bUpWidth;
      this.bHeight = bUpHeight;
      this.bImage = bImageUp;
      this.shootDirection = "down";
      this.ImageWidth = 20;
      this.ImageHeight = 80;
      this.currentAnimation = this.animations.shoot2;
    } else if (state === "Left") {
      this.bWidth = bLeftWidth;
      this.bHeight = bLeftHeight;
      this.bImage = bImageLeft;
      this.shootDirection = "left";
      this.ImageWidth = 80;
      this.ImageHeight = 20;
      this.currentAnimation = this.animations.shoot1;
    } else if (state === "Right") {
      this.bWidth = bLeftWidth;
      this.bHeight = bLeftHeight;
      this.bImage = bImageRight;
      this.shootDirection = "right";
      this.ImageWidth = 80;
      this.ImageHeight = 20;
      this.currentAnimation = this.animations.shoot1;
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

  animate() {
    this.animationCounter++;
    if (this.animationCounter >= this.animationDelay) {
      this.animationCounter = 0;
      this.frameIndex = (this.frameIndex + 1) % this.currentAnimation.length;
    }
  }

  display() {
    this.animate();
    if(this.shootDirection === "up"){
      let frameX = this.currentAnimation[this.frameIndex] % (this.bImage.width / this.bWidth) * this.bWidth;
      let frameY = Math.floor(this.currentAnimation[this.frameIndex] / (this.bImage.width / this.bWidth)) * this.bHeight;
      if (this.type === "bounce") {
        stroke(255, 200, 0, 100);
        strokeWeight(2);
        line(
          this.pos.x - this.vel.x,
          this.pos.y - this.vel.y,
          this.pos.x,
          this.pos.y
        );
      }
      image(this.bImage, this.pos.x, this.pos.y, this.ImageWidth, this.ImageHeight, frameX / 2, frameY / 2, this.bWidth, this.bHeight);
    } else if(this.shootDirection === "down"){
      let frameX = this.currentAnimation[this.frameIndex] % (this.bImage.width / this.bWidth) * this.bWidth;
      let frameY = Math.floor(this.currentAnimation[this.frameIndex] / (this.bImage.width / this.bWidth)) * this.bHeight;
      if (this.type === "bounce") {
        stroke(255, 200, 0, 100);
        strokeWeight(2);
        line(
          this.pos.x - this.vel.x,
          this.pos.y - this.vel.y,
          this.pos.x,
          this.pos.y
        );
      }
      image(this.bImage, this.pos.x, this.pos.y, this.ImageWidth, this.ImageHeight, frameX / 2, frameY / 2, this.bWidth, this.bHeight);
    } else if(this.shootDirection === "left"){
      let frameX = this.currentAnimation[this.frameIndex] % (this.bImage.width / this.bWidth) * this.bWidth;
      let frameY = Math.floor(this.currentAnimation[this.frameIndex] / (this.bImage.width / this.bWidth)) * this.bHeight;
      if (this.type === "bounce") {
        stroke(255, 200, 0, 100);
        strokeWeight(2);
        line(
          this.pos.x - this.vel.x,
          this.pos.y - this.vel.y,
          this.pos.x,
          this.pos.y
        );
      }
      image(this.bImage, this.pos.x, this.pos.y, this.ImageWidth, this.ImageHeight, frameX / 2, frameY / 2, this.bWidth, this.bHeight);
    } else if(this.shootDirection === "right"){
      let frameX = this.currentAnimation[this.frameIndex] % (this.bImage.width / this.bWidth) * this.bWidth;
      let frameY = Math.floor(this.currentAnimation[this.frameIndex] / (this.bImage.width / this.bWidth)) * this.bHeight;
      if (this.type === "bounce") {
        stroke(255, 200, 0, 100);
        strokeWeight(2);
        line(
          this.pos.x - this.vel.x,
          this.pos.y - this.vel.y,
          this.pos.x,
          this.pos.y
        );
      }
      image(this.bImage, this.pos.x, this.pos.y, this.ImageWidth, this.ImageHeight, frameX / 2, frameY / 2, this.bWidth, this.bHeight);
    }
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
  }

  display() {
    fill(200, 200, 200, 150);
    ellipse(this.pos.x, this.pos.y, this.radius * 2);
  }
}


