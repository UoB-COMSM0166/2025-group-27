// ===== Enemy 类 =====
class Enemy {
  constructor(isElite = false, enemyType = "normal", enemyAction, enWidth, enHeight) {
    this.enemyAction = enemyAction;
    this.enWidth = enWidth;
    this.enHeight = enHeight;
    this.x = width / 2;
    this.y = height / 2;
    this.frameIndex = 0;
    this.enDelay = 6;
    this.enCounter = 0;
    this.direction = 'idle';
    this.currentAction = this.enemyAction.idle;
    this.framesPerDirection = 4; 

    this.pos = createVector(random(width), random(height));
    this.vel = createVector(0, 0);
    this.radius = 15;
    this.health = 50;
    this.maxHealth = 50;
    this.damage = 10;
    this.speed = 2;
    this.knockbackResist = 0.5;
    this.isElite = isElite;
    this.expValue = 10;
    this.attackCooldown = 0;
    this.attackRange = 1;  //initial attackrange
    this.attackSpeed = 1;
    this.type = enemyType;
    this.invulnerableTime = 0;
  }

  resolveCollision() {
    for (let obs of obstacles) {
      if (obs.collidesWith(this.pos, this.enWidth, this.enHeight)) {
        // 计算 X 方向的可能移动位置
        let xOnly = createVector(this.pos.x - this.vel.x, this.pos.y);
        let yOnly = createVector(this.pos.x, this.pos.y - this.vel.y);
  
        // 优先尝试 X 方向移动
        if (!obs.collidesWith(xOnly, this.enWidth, this.enHeight)) {
          this.pos = xOnly;
        } 
        // 否则尝试 Y 方向移动
        else if (!obs.collidesWith(yOnly, this.enWidth, this.enHeight)) {
          this.pos = yOnly;
        } 
        // 如果两个方向都碰撞，完全阻止移动
        else {
          this.pos.sub(this.vel);
        }
      }
    }
  }

  update() {
    let canMove;
    let distToPlayer = p5.Vector.dist(this.pos, player.pos);
    if (distToPlayer <= this.attackRange) {
      if (this.attackCooldown <= 0) {
        player.takeDamage(this.damage);
        this.attackCooldown = 60 / this.attackSpeed;
      }
    } else {
      let direction = p5.Vector.sub(player.pos, this.pos)
        .normalize()
        .mult(this.speed);
      let nextPos = p5.Vector.add(this.pos, direction);
      canMove = true;
      for (let obs of obstacles) {
        if (obs.collidesWith(nextPos, this.enWidth, this.enHeight)) {
          canMove = false;
          break;
        }
      }      
    }
    this.attackCooldown--;
    let dx = player.pos.x - this.pos.x;
    let dy = player.pos.y - this.pos.y;
    if (abs(dx) > 0.1) {
      if(canMove){
        this.pos.x += this.speed * Math.sign(dx);
      }
      this.direction = dx > 0 ? 'right' : 'left';
      this.currentAction = this.enemyAction.side;
    } else {
      if(canMove){
        this.pos.y += this.speed * Math.sign(dy);
      }
      this.direction = dy > 0 ? 'down' : 'up';
      this.currentAction = this.enemyAction[this.direction];
    } 
    this.animate();
  }

  checkPlayerCollision() {
    if (p5.Vector.dist(this.pos, player.pos) < this.radius + player.radius) {
      let knockbackDir = p5.Vector.sub(this.pos, player.pos)
        .normalize()
        .mult(20);
      this.pos.add(knockbackDir);
      player.takeDamage(this.damage);
    }
  }

  hit(damage, knockback = true) {
    this.health -= damage;
    if (knockback) {
      let knockbackDir = p5.Vector.sub(this.pos, player.pos)
        .normalize()
        .mult(10 * (1 - this.knockbackResist));
      this.pos.add(knockbackDir);
    }
    showFloatingText(
      "-" + Math.floor(damage),
      this.pos.x,
      this.pos.y - 20,
      color(255, 0, 0)
    );
    return this.health <= 0;
  }

  animate() {
    this.enCounter++;
    if (this.enCounter >= this.enDelay) {
        this.enCounter = 0;
        this.frameIndex = (this.frameIndex + 1) % this.framesPerDirection;
    }
  }

  display() {
    let healthBarWidth = 30,
      healthBarHeight = 4;
    let healthPercentage = this.health / this.maxHealth;
    fill(255, 0, 0);
    rect(
      this.pos.x - healthBarWidth / 2,
      this.pos.y - this.radius - 10,
      healthBarWidth,
      healthBarHeight
    );
    fill(0, 255, 0);
    rect(
      this.pos.x - healthBarWidth / 2,
      this.pos.y - this.radius - 10,
      healthBarWidth * healthPercentage,
      healthBarHeight
    );
    if (!this.enemyAction) {
      console.error("currentSprite is undefined!");
      return;
    }
    let frameX = this.frameIndex * this.enWidth;
    

    push();
    if (this.direction === 'left') {
      translate(this.pos.x + this.enWidth, this.pos.y);
      scale(-1, 1);
      image(this.currentAction, 0, 0, this.enWidth, this.enHeight, frameX, 0, this.enWidth, this.enHeight);
    } else {
      image(this.currentAction, this.pos.x, this.pos.y, this.enWidth, this.enHeight, frameX, 0, this.enWidth, this.enHeight);
    }
    pop();
  }
}

// --- MeleeEnemy 类 ---
class MeleeEnemy extends Enemy {
  constructor(x, y) {
    super(false, "melee");
    this.pos = createVector(x, y);
    this.attackRange = 40;
    this.attackCooldown = 0;
    this.attackSpeed = 1;
    this.damage = 15;
    this.speed = 3;
    this.color = color(255, 100, 100);
  }

  update() {
    let distToPlayer = p5.Vector.dist(this.pos, player.pos);
    if (distToPlayer <= this.attackRange) {
      if (this.attackCooldown <= 0) {
        player.takeDamage(this.damage);
        this.attackCooldown = 60 / this.attackSpeed;
      }
    } else {
      let direction = p5.Vector.sub(player.pos, this.pos)
        .normalize()
        .mult(this.speed);
      let nextPos = p5.Vector.add(this.pos, direction);
      let canMove = true;
      for (let obs of obstacles) {
        if (obs.collidesWith(nextPos, this.radius)) {
          canMove = false;
          break;
        }
      }
      if (canMove) this.pos.add(direction);
    }
    this.attackCooldown--;
  }

  display() {
    let healthBarWidth = 30,
      healthBarHeight = 4;
    let healthPercentage = this.health / this.maxHealth;
    fill(255, 0, 0);
    rect(
      this.pos.x - healthBarWidth / 2,
      this.pos.y - this.radius - 10,
      healthBarWidth,
      healthBarHeight
    );
    fill(0, 255, 0);
    rect(
      this.pos.x - healthBarWidth / 2,
      this.pos.y - this.radius - 10,
      healthBarWidth * healthPercentage,
      healthBarHeight
    );
    fill(this.color);
    noStroke();
    ellipse(this.pos.x, this.pos.y, this.radius * 2);
  }
}

// --- RangedEnemy 类 ---
class RangedEnemy extends Enemy {
  constructor(x, y) {
    super(false, "ranged");
    this.pos = createVector(x, y);
    this.attackRange = 200;
    this.attackCooldown = 0;
    this.attackSpeed = 0.5;
    this.damage = 10;
    this.speed = 1.5;
    this.color = color(200, 100, 255);
  }

  update() {
    let distToPlayer = p5.Vector.dist(this.pos, player.pos);
    if (distToPlayer <= this.attackRange) {
      if (this.attackCooldown <= 0) {
        let direction = p5.Vector.sub(player.pos, this.pos).normalize().mult(5);
        enemyBullets.push(new EnemyBullet(this.pos.x, this.pos.y, direction));
        this.attackCooldown = 60 / this.attackSpeed;
      }
      if (distToPlayer < this.attackRange * 0.5) {
        let direction = p5.Vector.sub(this.pos, player.pos)
          .normalize()
          .mult(this.speed);
        this.pos.add(direction);
      }
    } else {
      let direction = p5.Vector.sub(player.pos, this.pos)
        .normalize()
        .mult(this.speed);
      this.pos.add(direction);
    }
    this.attackCooldown--;
  }

  display() {
    let healthBarWidth = 30,
      healthBarHeight = 4;
    let healthPercentage = this.health / this.maxHealth;
    fill(255, 0, 0);
    rect(
      this.pos.x - healthBarWidth / 2,
      this.pos.y - this.radius - 10,
      healthBarWidth,
      healthBarHeight
    );
    fill(0, 255, 0);
    rect(
      this.pos.x - healthBarWidth / 2,
      this.pos.y - this.radius - 10,
      healthBarWidth * healthPercentage,
      healthBarHeight
    );
    fill(this.color);
    noStroke();
    ellipse(this.pos.x, this.pos.y, this.radius * 2);
    if (debug) {
      noFill();
      stroke(200, 100, 255, 50);
      ellipse(this.pos.x, this.pos.y, this.attackRange * 2);
      noStroke();
    }
  }
}

// === Boss 类 ===
class Boss extends Enemy {
  constructor(isElite = true, enemyType = "boss", bossAction, bossWidth, bossHeight) {
    super(isElite, enemyType, bossAction, bossWidth, bossHeight);
    this.size = 40;
    this.health = 600;
    this.maxHealth = 600;
    this.damage = 20;
  }

  display() {
    fill(255, 165, 0);
    ellipse(this.pos.x, this.pos.y, this.size);
    this.displayHealthBar();
  }

  displayHealthBar() {
    displayBossHealthBar();
  }
}

// === SpiderBoss 类 ===
class SpiderBoss extends Boss {
  constructor(spiderBossAction) {
    super(true, "boss", spiderBossAction, 200, 160);
    this.spiderBossAction = spiderBossAction
    this.health = 800;
    this.maxHealth = 800;
    this.size = 50;
    this.speed = 2;
    this.webCooldown = 0;
    this.trailInterval = 30;
    this.trailCounter = 0;
    this.animation = {
      move: [0, 4, 8, 12, 16, 1, 5, 9, 13, 17, 2, 6, 10, 14, 18, 3, 7, 11, 15, 19]
    };
    this.currentAnimation = this.animation.move;
    this.frameIndex = 0;
    this.animationDelay = 20; // control animation speed
    this.animationCounter = 0;
    this.direction = 'move';
    // 位置初始化
    this.pos = createVector(width / 2, height / 2);
  }

  update() {
    let direction = p5.Vector.sub(player.pos, this.pos)
      .normalize()
      .mult(this.speed);
    this.pos.add(direction);

    // 生成毒气路径
    this.trailCounter++;
    if (this.trailCounter >= this.trailInterval) {
      poisonTrails.push({
        pos: this.pos.copy(),
        radius: 40,
        startTime: millis(),
        duration: 3000,
      });
      this.trailCounter = 0;
    }

    // 发射蛛网
    if (this.webCooldown <= 0) {
      let toPlayer = p5.Vector.sub(player.pos, this.pos).normalize();
      let webVel = toPlayer.mult(4);
      enemyBullets.push(new WebProjectile(this.pos.x, this.pos.y, webVel));
      this.webCooldown = 180;
    } else {
      this.webCooldown--;
    }
    this.animate();
  }

  animate() {
    this.animationCounter++;
    if (this.animationCounter >= this.animationDelay) {
        this.animationCounter = 0;
        this.frameIndex = (this.frameIndex + 1) % this.currentAnimation.length;
    }
  }

  display() {
    let frameWidth = 200; // 修正后的帧宽度
    let frameHeight = 160; // 修正后的帧高度
    let columns = floor(this.spiderBossAction.width / frameWidth); // 计算精灵表列数
    let frameX = (this.currentAnimation[this.frameIndex] % columns) * frameWidth;
    let frameY = floor(this.currentAnimation[this.frameIndex] / columns) * frameHeight;

    // 绘制精灵
    image(
      this.spiderBossAction,
      this.pos.x - this.size / 2,
      this.pos.y - this.size / 2,
      this.size,
      this.size * (frameHeight / frameWidth), // 按比例缩放高度
      frameX,
      frameY,
      frameWidth,
      frameHeight
    );
    this.displayHealthBar();
  }
}