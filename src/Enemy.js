// ===== Enemy 类 =====
class Enemy {
  constructor(isElite = false, enemyType = "normal", enemyAction, enWidth, enHeight) {
    this.enemyAction = enemyAction;
    this.enWidth = enWidth || 22;  // 确保有默认值
    this.enHeight = enHeight || 22;
    this.x = width / 2;
    this.y = height / 2;
    this.frameIndex = 0;
    this.enDelay = 6;
    this.enCounter = 0;
    this.direction = 'idle';
    this.currentAction = this.enemyAction.idle;
    this.framesPerDirection = 4; 

    this.pos = createVector(0, 0);
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
    
    // 添加碰撞盒尺寸
    this.collisionWidth = this.enWidth || this.radius * 2;
    this.collisionHeight = this.enHeight || this.radius * 2;
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
    if (this.invulnerableTime > 0) {
      this.invulnerableTime--;
    }

    let distToPlayer = p5.Vector.dist(this.pos, player.pos);
    
    // 计算到玩家的方向
    let dirToPlayer = p5.Vector.sub(player.pos, this.pos);
    
    // 添加一些随机偏移，使移动不那么机械
    let noiseOffset = createVector(
      map(noise(this.pos.x * 0.01 + frameCount * 0.01), 0, 1, -1, 1),
      map(noise(this.pos.y * 0.01 + frameCount * 0.01), 0, 1, -1, 1)
    ).mult(0.3); // 调整这个值可以改变随机性的程度
    
    dirToPlayer.add(noiseOffset);
    dirToPlayer.normalize();

    // 检查攻击范围
    if (distToPlayer <= this.attackRange) {
      if (this.attackCooldown <= 0) {
        player.takeDamage(this.damage);
        this.attackCooldown = 60 / this.attackSpeed;
      }
    } else {
      // 计算下一个位置
      let nextPos = p5.Vector.add(this.pos, p5.Vector.mult(dirToPlayer, this.speed));
      
      // 检查障碍物碰撞
      let canMove = true;
      for (let obs of obstacles) {
        if (obs.collidesWith(nextPos, this.enWidth, this.enHeight)) {
          // 尝试沿着障碍物移动
          let leftDir = createVector(-dirToPlayer.y, dirToPlayer.x);
          let rightDir = createVector(dirToPlayer.y, -dirToPlayer.x);
          
          let leftPos = p5.Vector.add(this.pos, p5.Vector.mult(leftDir, this.speed));
          let rightPos = p5.Vector.add(this.pos, p5.Vector.mult(rightDir, this.speed));
          
          let leftBlocked = obs.collidesWith(leftPos, this.enWidth, this.enHeight);
          let rightBlocked = obs.collidesWith(rightPos, this.enWidth, this.enHeight);
          
          if (!leftBlocked) {
            nextPos = leftPos;
          } else if (!rightBlocked) {
            nextPos = rightPos;
          } else {
            canMove = false;
          }
          break;
        }
      }
      
      if (canMove) {
        this.pos = nextPos;
        // 更新朝向
        let dx = nextPos.x - this.pos.x;
        let dy = nextPos.y - this.pos.y;
        if (abs(dx) > abs(dy)) {
          this.direction = dx > 0 ? 'right' : 'left';
          this.currentAction = this.enemyAction.side;
        } else {
          this.direction = dy > 0 ? 'down' : 'up';
          this.currentAction = this.enemyAction[this.direction];
        }
      }
    }
    
    this.attackCooldown--;
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

  // 添加碰撞检测方法
  isCollidingWithObstacle(position) {
    for (let obs of obstacles) {
      if (obs.collidesWith(position, this.collisionWidth, this.collisionHeight)) {
        return true;
      }
    }
    return false;
  }
}

// --- MeleeEnemy 类 ---
class MeleeEnemy extends Enemy {
  constructor(isElite = false) {
    super(isElite, "melee");
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
  constructor(isElite = false) {
    super(isElite, "ranged");
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
    super(true, "boss", commonEnemyAction, 40, 40);
    this.size = 40;
    this.health = 600;
    this.maxHealth = 600;
    this.damage = 20;
    this.radius = 20;
    this.expValue = 50;
    this.attackRange = 100;
    this.attackSpeed = 1;
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
    // 基础属性进一步增强
    this.health = 1500;
    this.maxHealth = 1500;
    this.size = 50;
    this.speed = 2.5;
    this.webCooldown = 0;
    this.trailInterval = 20;
    this.trailCounter = 0;
    this.radius = 25;
    this.expValue = 200;
    this.attackRange = 150;
    this.attackSpeed = 1.5;
    this.damage = 30;
    this.type = "SpiderBoss";
    
    // 攻击相关属性
    this.meleeAttackCooldown = 0;
    this.meleeAttackRange = 60;
    this.meleeDamage = 40;
    this.dashCooldown = 0;
    this.isDashing = false;
    this.dashSpeed = 10;
    this.dashDuration = 0;
    this.attackPattern = 0;
    this.patternTimer = 0;
    
    // 新增属性
    this.phase = 1;             // Boss战斗阶段
    this.webWallCooldown = 0;   // 蛛网墙冷却
    this.summonCooldown = 0;    // 召唤小蜘蛛冷却
    this.spiderlings = [];      // 小蜘蛛数组
    this.enrageTimer = 0;       // 狂暴计时器
    this.isEnraged = false;     // 是否处于狂暴状态
    this.teleportCooldown = 0;  // 传送冷却
    this.shieldActive = false;  // 护盾状态
    this.shieldHealth = 200;    // 护盾值
    
    // 添加状态检查标志
    this.isActive = true;
  }

  update() {
    try {
      if (!this.isActive || !player) {
        console.warn("Boss or player is not active");
        return;
      }

      if (this.invulnerableTime > 0) {
        this.invulnerableTime--;
      }

      // 检查阶段转换
      if (this.health < this.maxHealth * 0.6 && this.phase === 1) {
        this.phase = 2;
        this.isEnraged = true;
        this.enrageTimer = 300;
        showFloatingText("Boss Enraged!", this.pos.x, this.pos.y - 40, color(255, 0, 0));
      }

      // 更新攻击模式
      this.patternTimer++;
      if (this.patternTimer > 240) { // 缩短模式切换时间
        this.attackPattern = (this.attackPattern + 1) % 5; // 增加到5种攻击模式
        this.patternTimer = 0;
      }

      let distToPlayer = p5.Vector.dist(this.pos, player.pos);
      let dirToPlayer = p5.Vector.sub(player.pos, this.pos).normalize();

      // 狂暴状态效果
      if (this.isEnraged) {
        this.speed = 3.5;
        this.damage *= 1.5;
        this.enrageTimer--;
        if (this.enrageTimer <= 0) {
          this.isEnraged = false;
          this.speed = 2.5;
          this.damage = 30;
        }
      }

      // 处理移动和攻击
      if (!this.shieldActive) {
        if (this.isDashing) {
          this.handleDashing(dirToPlayer);
        } else {
          this.handleNormalMovement(dirToPlayer);
        }

        // 近战攻击检测
        if (distToPlayer <= this.meleeAttackRange && this.meleeAttackCooldown <= 0) {
          this.performMeleeAttack();
        }

        // 根据不同攻击模式执行攻击
        switch(this.attackPattern) {
          case 0: // 改进的蛛网攻击
            this.performWebAttack(dirToPlayer);
            break;
          case 1: // 改进的冲刺攻击
            this.performDashAttack();
            break;
          case 2: // 改进的毒气攻击
            this.performPoisonAttack();
            break;
          case 3: // 新增：蛛网墙
            this.performWebWallAttack(dirToPlayer);
            break;
          case 4: // 新增：召唤小蜘蛛
            this.performSummonAttack();
            break;
        }
      }

      // 第二阶段特殊机制
      if (this.phase === 2) {
        // 随机传送
        if (this.teleportCooldown <= 0 && random() < 0.01) {
          this.performTeleport();
        }
        
        // 护盾机制
        if (!this.shieldActive && this.health < this.maxHealth * 0.3 && random() < 0.005) {
          this.activateShield();
        }
      }

      // 更新小蜘蛛
      this.updateSpiderlings();

      // 更新计时器
      this.updateTimers();

      // 添加边界检查
      this.pos.x = constrain(this.pos.x, 0, width);
      this.pos.y = constrain(this.pos.y, 0, height);

      // 确保生命值不会小于0
      this.health = Math.max(0, this.health);

    } catch (error) {
      console.error("Error in SpiderBoss update:", error);
      this.isActive = false;
    }
  }

  // 新增的攻击方法
  performWebAttack(dirToPlayer) {
    if (this.webCooldown <= 0) {
      // 发射更多蛛网，呈扇形
      for (let i = -2; i <= 2; i++) {
        let angle = i * 0.3;
        let rotatedDir = createVector(
          dirToPlayer.x * cos(angle) - dirToPlayer.y * sin(angle),
          dirToPlayer.x * sin(angle) + dirToPlayer.y * cos(angle)
        );
        let webVel = p5.Vector.mult(rotatedDir, 6);
        enemyBullets.push(new WebProjectile(this.pos.x, this.pos.y, webVel));
      }
      this.webCooldown = 100;
    }
  }

  performWebWallAttack(dirToPlayer) {
    if (this.webWallCooldown <= 0) {
      // 创建垂直于玩家方向的蛛网墙
      let perpDir = createVector(-dirToPlayer.y, dirToPlayer.x);
      for (let i = -3; i <= 3; i++) {
        let pos = p5.Vector.add(this.pos, p5.Vector.mult(perpDir, i * 30));
        let webVel = p5.Vector.mult(dirToPlayer, 3);
        enemyBullets.push(new WebProjectile(pos.x, pos.y, webVel));
      }
      this.webWallCooldown = 180;
    }
  }

  performSummonAttack() {
    if (this.summonCooldown <= 0 && this.spiderlings.length < 4) {
      for (let i = 0; i < 2; i++) {
        let spiderling = new MeleeEnemy(true);
        spiderling.pos = this.pos.copy();
        spiderling.health = 30;
        spiderling.damage = 15;
        spiderling.speed = 3;
        this.spiderlings.push(spiderling);
      }
      this.summonCooldown = 300;
      showFloatingText("Spiderlings Summoned!", this.pos.x, this.pos.y - 30, color(255, 100, 255));
    }
  }

  performTeleport() {
    let newPos = getValidSpawnPosition();
    this.pos = newPos;
    this.teleportCooldown = 180;
    // 传送后立即进行范围攻击
    for (let i = 0; i < 8; i++) {
      let angle = (i * PI) / 4;
      let dir = createVector(cos(angle), sin(angle));
      enemyBullets.push(new WebProjectile(this.pos.x, this.pos.y, p5.Vector.mult(dir, 5)));
    }
    showFloatingText("Teleport!", this.pos.x, this.pos.y - 30, color(128, 0, 128));
  }

  activateShield() {
    this.shieldActive = true;
    this.shieldHealth = 200;
    showFloatingText("Shield Activated!", this.pos.x, this.pos.y - 30, color(0, 255, 255));
  }

  hit(damage) {
    try {
      if (!this.isActive) return false;
      
      if (this.invulnerableTime <= 0) {
        if (this.shieldActive) {
          this.shieldHealth -= damage;
          if (this.shieldHealth <= 0) {
            this.shieldActive = false;
            showFloatingText("Shield Broken!", this.pos.x, this.pos.y - 30, color(255, 255, 0));
          }
        } else {
          this.health -= damage;
          this.invulnerableTime = 5;
        }
        showFloatingText("-" + Math.floor(damage), this.pos.x, this.pos.y - 20, color(255, 0, 0));
      }
      
      if (this.health <= 0) {
        this.isActive = false;
        // 确保清理所有相关实体
        this.spiderlings = [];
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error in SpiderBoss hit:", error);
      return true; // 出错时移除 Boss
    }
  }

  display() {
    // 显示小蜘蛛
    this.spiderlings.forEach(spiderling => spiderling.display());

    // 显示传送效果
    if (this.teleportCooldown > 160) {
      push();
      noFill();
      stroke(128, 0, 128, 150);
      strokeWeight(3);
      ellipse(this.pos.x, this.pos.y, this.size * 2);
      pop();
    }

    // 显示护盾效果
    if (this.shieldActive) {
      push();
      noFill();
      stroke(0, 255, 255, 150);
      strokeWeight(3);
      ellipse(this.pos.x, this.pos.y, this.size * 1.5);
      pop();
    }

    // 显示狂暴效果
    if (this.isEnraged) {
      push();
      noFill();
      stroke(255, 0, 0, 150);
      strokeWeight(2);
      ellipse(this.pos.x, this.pos.y, this.size * 1.2);
      pop();
    }

    // 显示Boss本体
    fill(50, 200, 50);
    noStroke();
    ellipse(this.pos.x, this.pos.y, this.size);

    // 显示血条
    let healthBarWidth = 50;
    let healthBarHeight = 6;
    let healthPercentage = this.health / this.maxHealth;
    
    fill(255, 0, 0);
    rect(
      this.pos.x - healthBarWidth / 2,
      this.pos.y - this.size - 15,
      healthBarWidth,
      healthBarHeight
    );
    fill(0, 255, 0);
    rect(
      this.pos.x - healthBarWidth / 2,
      this.pos.y - this.size - 15,
      healthBarWidth * healthPercentage,
      healthBarHeight
    );
  }

  // 添加缺失的移动处理方法
  handleDashing(dirToPlayer) {
    this.dashDuration--;
    if (this.dashDuration > 0) {
      this.pos.add(p5.Vector.mult(dirToPlayer, this.dashSpeed));
    } else {
      this.isDashing = false;
    }
  }

  handleNormalMovement(dirToPlayer) {
    let nextPos = p5.Vector.add(this.pos, p5.Vector.mult(dirToPlayer, this.speed));
    let canMove = true;
    for (let obs of obstacles) {
      if (obs.collidesWith(nextPos, this.size, this.size)) {
        canMove = false;
        break;
      }
    }
    if (canMove) {
      this.pos.add(p5.Vector.mult(dirToPlayer, this.speed));
    }
  }

  // 添加缺失的攻击方法
  performMeleeAttack() {
    player.takeDamage(this.meleeDamage);
    this.meleeAttackCooldown = 45;
    showFloatingText("Melee Attack!", this.pos.x, this.pos.y - 30, color(255, 0, 0));
  }

  performDashAttack() {
    if (this.dashCooldown <= 0 && !this.isDashing) {
      this.isDashing = true;
      this.dashDuration = 30;
      this.dashCooldown = 180;
      showFloatingText("Dash Attack!", this.pos.x, this.pos.y - 30, color(255, 100, 0));
    }
  }

  performPoisonAttack() {
    if (this.trailCounter >= this.trailInterval) {
      // 在Boss周围生成多个毒气区域
      for (let i = 0; i < 4; i++) {
        let angle = (i * PI) / 2;
        let offset = createVector(cos(angle) * 40, sin(angle) * 40);
        let poisonPos = p5.Vector.add(this.pos, offset);
        poisonTrails.push({
          pos: poisonPos,
          radius: 40,
          startTime: millis(),
          duration: 4000,
        });
      }
      this.trailCounter = 0;
    }
  }

  // 添加小蜘蛛更新方法
  updateSpiderlings() {
    // 更新小蜘蛛状态
    for (let i = this.spiderlings.length - 1; i >= 0; i--) {
      let spiderling = this.spiderlings[i];
      spiderling.update();
      spiderling.display();
      if (spiderling.health <= 0) {
        this.spiderlings.splice(i, 1);
      }
    }
  }

  // 添加计时器更新方法
  updateTimers() {
    this.webCooldown--;
    this.meleeAttackCooldown--;
    this.dashCooldown--;
    this.trailCounter++;
    this.webWallCooldown--;
    this.summonCooldown--;
    this.teleportCooldown--;
  }
}