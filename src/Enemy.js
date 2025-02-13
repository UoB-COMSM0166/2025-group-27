// ===== Enemy 类 =====
class Enemy {
  constructor(isElite = false, enemyType = "normal") {
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
    this.type = enemyType;
    this.invulnerableTime = 0;
  }

  resolveCollision() {
    for (let obs of obstacles) {
      if (obs.collidesWith(this.pos, this.radius)) {
        let closestX = constrain(this.pos.x, obs.pos.x, obs.pos.x + obs.width);
        let closestY = constrain(this.pos.y, obs.pos.y, obs.pos.y + obs.height);
        let diff = createVector(this.pos.x - closestX, this.pos.y - closestY);
        if (diff.mag() === 0) diff = createVector(1, 0);
        diff.normalize();
        this.pos.add(diff.mult(5));
      }
    }
  }

  update() {
    let desired = p5.Vector.sub(player.pos, this.pos)
      .normalize()
      .mult(this.speed);
    let steps = 4;
    let stepVec = desired.copy().div(steps);
    let newPos = this.pos.copy();
    for (let i = 0; i < steps; i++) {
      let candidate = p5.Vector.add(newPos, stepVec);
      let collision = false;
      for (let obs of obstacles) {
        if (obs.collidesWith(candidate, this.radius)) {
          collision = true;
          break;
        }
      }
      if (!collision) {
        newPos = candidate;
      } else {
        let foundPath = false;
        let angleOffsets = [PI / 12, -PI / 12, PI / 6, -PI / 6];
        for (let offset of angleOffsets) {
          let altStep = stepVec.copy().rotate(offset);
          candidate = p5.Vector.add(newPos, altStep);
          collision = false;
          for (let obs of obstacles) {
            if (obs.collidesWith(candidate, this.radius)) {
              collision = true;
              break;
            }
          }
          if (!collision) {
            newPos = candidate;
            foundPath = true;
            break;
          }
        }
        if (!foundPath) break;
      }
    }
    this.pos = newPos;
    this.checkPlayerCollision();
    this.resolveCollision();
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
    noStroke();
    fill(255, 0, 0);
    ellipse(this.pos.x, this.pos.y, this.radius * 2);
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
  constructor() {
    super(true, "boss");
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
  constructor() {
    super();
    this.health = 800;
    this.maxHealth = 800;
    this.size = 50;
    this.speed = 2;
    this.webCooldown = 0;
    this.trailInterval = 30;
    this.trailCounter = 0;
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
  }

  display() {
    fill(50, 200, 50);
    ellipse(this.pos.x, this.pos.y, this.size);
    this.displayHealthBar();
  }
}