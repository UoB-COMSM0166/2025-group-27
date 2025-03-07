// ===== Enemy 类 =====
class Enemy {
  constructor(isElite = false, enemyType = "normal", enemyAction, enWidth, enHeight) {
    this.enemyAction = enemyAction || {};
    this.enWidth = enWidth || 22;  // 确保有默认值
    this.enHeight = enHeight || 22;
    this.x = width / 2;
    this.y = height / 2;
    this.frameIndex = 0;
    this.enDelay = 6;
    this.enCounter = 0;
    this.direction = 'idle';
    this.currentAction = this.enemyAction.idle || null;
    this.framesPerDirection = 4;

    this.pos = createVector(0, 0);
    this.vel = createVector(0, 0);
    this.radius = 10;
    if(difficult == "hard"){
      this.health = 80;
    } else {
      this.health = 50;
    }
    this.maxHealth = 50;
    if(difficult == "hard"){
      this.damage = 30;
    } else {
      this.damage = 10;
    }
    if(difficult == "hard"){
      this.speed = 10;
    } else {
      this.speed = 2;
    }
    this.knockbackResist = 0.5;
    this.isElite = isElite;
    this.expValue = 10;
    this.attackCooldown = 0;
    this.attackRange = 1;  //initial attackrange
    this.attackSpeed = 1;
    this.type = enemyType;
    this.invulnerableTime = 0;
    this.imageUp = this.enemyAction.up;
    this.imageDown = this.enemyAction.down;
    this.imageSide = this.enemyAction.side;

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
        let dx = player.pos.x - this.pos.x;
        let dy = this.pos.y - player.pos.y; // 反转Y轴方向
        let angle = atan2(dy, dx);
        if (angle < 0) angle += TWO_PI;

        if (angle >= PI / 4 && angle < 3 * PI / 4) {       // 45°~135° → 上
          this.currentAction = this.imageUp;
          this.direction = "up";
        }
        else if (angle >= 3 * PI / 4 && angle < 5 * PI / 4) { // 135°~225° → 左
          this.currentAction = this.imageSide;
          this.direction = "left";
        }
        else if (angle >= 5 * PI / 4 && angle < 7 * PI / 4) { // 225°~315° → 下
          this.currentAction = this.imageDown;
          this.direction = "down";
        }
        else {                                       // 315°~45° → 右
          this.currentAction = this.imageSide;
          this.direction = "right";
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

  applyKnockback(knockbackVector) {
    // 计算击退总长度
    let totalDistance = knockbackVector.mag();

    if (totalDistance < 1) {
      this.tryMove(knockbackVector);
      return;
    }

    // 将击退向量拆成若干步
    let stepVector = knockbackVector.copy().normalize();
    let steps = Math.floor(totalDistance);
    let remainder = totalDistance - steps;

    // 逐步移动
    for (let i = 0; i < steps; i++) {
      if (!this.tryMove(stepVector)) {

        break;
      }
    }

    // 处理剩余距离
    if (remainder > 0) {
      let remainderVector = stepVector.copy().mult(remainder);
      this.tryMove(remainderVector);
    }
  }

  //尝试移动给定的向量距离，
  tryMove(moveVec) {
    let newPos = p5.Vector.add(this.pos, moveVec);
    if (!this.isCollidingWithObstacle(newPos)) {
      this.pos = newPos;
      return true;
    }
    return false;
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
      image(this.currentAction, 0, 0, this.enWidth * 1.5, this.enHeight * 1.5, frameX, 0, this.enWidth, this.enHeight);
    } else {
      image(this.currentAction, this.pos.x, this.pos.y, this.enWidth * 1.5, this.enHeight * 1.5, frameX, 0, this.enWidth, this.enHeight);
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
  constructor(isElite = true, enemyType = "boss", enemyAction, enWidth, enHeight) {
    super(isElite, enemyType, enemyAction, enWidth, enHeight);
    this.isActive = true;
    this.invulnerableTime = 0;
    this.isFrozen = false;
    this.freezeEndTime = 0;
  }

  hit(damage) {
    if (!this.isActive) return false;

    // 扣血
    this.health -= damage;
    showFloatingText("-" + Math.floor(damage), this.pos.x, this.pos.y - 20, color(255, 0, 0));

    // 检查是否死亡
    if (this.health <= 0) {
      this.health = 0; // 确保血量不会小于0
      this.isActive = false;

      // 显示击败提示
      let bossName = this.constructor.name.replace('Boss', '');
      showFloatingText(`${bossName} Boss Defeated!`, this.pos.x, this.pos.y - 40, color(255, 215, 0));

      // 检查是否所有Boss都被击败
      let remainingActiveBosses = enemies.filter(e => e instanceof Boss && e.isActive).length;
      if (remainingActiveBosses === 0) {
        bossActive = false;
        // 增加Boss击败计数
        bossDefeated++;
      }

      return true;
    }
    return false;
  }
}


class BirdBoss extends Boss {
  constructor(birdBossAction) {
    // 调用 Boss 构造函数
    super(true, "boss", birdBossAction, 200, 160);
    this.birdBossAction = birdBossAction;
    this.feathers = [];

    // Boss 属性设置（可根据需求调整数值）
    this.health = 600;
    this.maxHealth = 600;
    this.size = 100;
    this.speed = 2.5;
    this.attackRange = 150;
    this.attackSpeed = 1.5;
    this.damage = 30;
    this.type = "BirdBoss";

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

    // 额外属性
    this.phase = 1;
    this.webWallCooldown = 0;
    this.summonCooldown = 0;
    this.birdlings = []; // BirdBoss召唤的小兵
    this.enrageTimer = 0;
    this.isEnraged = false;
    this.teleportCooldown = 0;
    this.shieldActive = false;
    this.shieldHealth = 200;

    // 初始化计时器
    this.webCooldown = 0;
    this.trailCounter = 0;

    // 初始化冻结状态
    this.isFrozen = false;
    this.freezeEndTime = 0;

    // 初始位置
    this.pos = createVector(width / 2, height / 2);
    this.radius = 25;
    this.expValue = 200;
    this.isActive = true;

    // 假设 birdBossAction 已内置动画信息，例如当前动画数组、帧延迟等
    this.currentAnimation = birdBossAction.animation || [0, 1, 2, 3];
    this.frameIndex = 0;
    this.animationDelay = 20;
    this.animationCounter = 0;

    //  z羽毛掉落相关变量
    this.featherFalling = false;
    this.featherEndTime = 0;
    this.featherOffsetY = 0;
  }


  hit(damage) {
    if (!this.isActive) return false;

    // 生成4片羽毛，以Boss当前位置为中心稍作偏移
    let offsets = [
      createVector(-30, -30),
      createVector(30, -30),
      createVector(-15, 0),
      createVector(15, 0)
    ];
    for (let off of offsets) {
      let fx = this.pos.x + off.x;
      let fy = this.pos.y + off.y;
      let feather = new Feather(fx, fy, featherSprite);
      this.feathers.push(feather);
    }

    if (this.invulnerableTime <= 0) {
      if (this.shieldActive) {
        this.shieldHealth -= damage;
        showFloatingText("-" + Math.floor(damage), this.pos.x, this.pos.y - 20, color(0, 255, 255));
        if (this.shieldHealth <= 0) {
          this.shieldActive = false;
          showFloatingText("Shield Broken!", this.pos.x, this.pos.y - 30, color(255, 255, 0));
        }
      } else {
        this.health -= damage;
        this.invulnerableTime = 5;
        showFloatingText("-" + Math.floor(damage), this.pos.x, this.pos.y - 20, color(255, 0, 0));
      }

      if (this.health <= 0) {
        this.isActive = false;
        enemies = enemies.filter(e => e !== this);
        bossActive = false;
        showFloatingText("Boss Defeated!", this.pos.x, this.pos.y - 40, color(255, 215, 0));

        if (wave === 6) {
          gameState = "petSelection";
          player.needsPetSelection = true;
        } else {
          wave++;
          setTimeout(() => {
            spawnEnemiesForWave(wave);
          }, 500);
        }

        if (wave === 10) {
          gameState = "victory";
          finalStats = {
            normalEnemies: normalEnemiesDefeated,
            bosses: bossesDefeated,
            level: player.level,
            attackPower: player.attackPower,
            attackSpeed: player.attackSpeed,
            attackDamage: player.attackDamage,
          };
          return;
        }
        return true;
      }
    }
    return false;
  }



  update() {
    try {
      if (!this.isActive || !player) return;

      // 始终更新羽毛掉落动画和羽毛数组
      if (this.featherFalling) {
        this.featherOffsetY += 2;
        if (millis() >= this.featherEndTime) {
          this.featherFalling = false;
        }
      }
      // 更新所有由 Boss 生成的羽毛对象
      for (let i = this.feathers.length - 1; i >= 0; i--) {
        let f = this.feathers[i];
        f.update();
        if (f.isOffScreen()) {
          this.feathers.splice(i, 1);
        }
      }

      this.animate();

      // 如果 Boss 处于冻结状态，则只更新计时器，不执行移动和攻击
      if (this.isFrozen) {
        if (millis() >= this.freezeEndTime) {
          this.isFrozen = false;
        } else {

          this.updateTimers();
          return;
        }
      }

      // 正常 Boss 更新逻辑：无敌时间、攻击模式、移动、攻击等
      if (this.invulnerableTime > 0) {
        this.invulnerableTime--;
      }

      this.patternTimer++;
      if (this.patternTimer > 180) {  // 从240降到180
        this.attackPattern = (this.attackPattern + 1) % 5;
        this.patternTimer = 0;
        let patternNames = ["Web Attack", "Dash Attack", "Poison Attack", "Web Wall", "Summon"];
        showFloatingText(patternNames[this.attackPattern], this.pos.x, this.pos.y - 40, color(255, 255, 0));
      }


      if (this.health < this.maxHealth * 0.6 && !this.isEnraged) {
        this.isEnraged = true;
        this.enrageTimer = 300;
        this.speed *= 1.5;
        this.damage *= 1.5;
        showFloatingText("Boss Enraged!", this.pos.x, this.pos.y - 40, color(255, 0, 0));
      }

      let distToPlayer = p5.Vector.dist(this.pos, player.pos);
      let dirToPlayer = p5.Vector.sub(player.pos, this.pos).normalize();

      if (!this.shieldActive) {
        if (this.isDashing) {
          this.handleDashing(dirToPlayer);
        } else {
          this.handleNormalMovement(dirToPlayer);
        }
        if (distToPlayer <= this.meleeAttackRange && this.meleeAttackCooldown <= 0) {
          this.performMeleeAttack();
        }
        this.executeAttackPattern(dirToPlayer);
      }

      this.updateTimers();

      this.pos.x = constrain(this.pos.x, 0, width);
      this.pos.y = constrain(this.pos.y, 0, height);

      if (p5.Vector.dist(this.pos, player.pos) < this.radius + player.radius) {
        let knockbackDir = p5.Vector.sub(player.pos, this.pos).normalize();
        player.pos.add(knockbackDir.mult(20)); // 将玩家击退20个单位
        this.isFrozen = true;
        this.freezeEndTime = millis() + 2000; // Boss 冻结2秒
      }

      this.animate();
    }
    catch (error) {
      console.error("Error in BirdBoss update:", error);
    }
  }

  executeAttackPattern(dirToPlayer) {
    switch (this.attackPattern) {
      case 0:
        this.performWebAttack(dirToPlayer);
        break;
      case 1:
        this.performDashAttack();
        break;
      case 2:
        this.performPoisonAttack();
        break;
      case 3:
        this.performWebWallAttack(dirToPlayer);
        break;
      case 4:
        this.performSummonAttack();
        break;
    }
  }

  performWebAttack(dirToPlayer) {
    if (this.webCooldown <= 0) {
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

  performSummonAttack() {
    if (this.summonCooldown <= 0) {
      let bulletCount = 8;
      for (let i = 0; i < bulletCount; i++) {
        let angle = (TWO_PI / bulletCount) * i;
        let bulletVel = p5.Vector.fromAngle(angle).mult(5);
        // 创建并加入 enemyBullets
        let bullet = new EnemyBullet(this.pos.x, this.pos.y, bulletVel);
        enemyBullets.push(bullet);
      }

      this.summonCooldown = 50;
      showFloatingText("Radial Attack!", this.pos.x, this.pos.y - 30, color(255, 100, 255));
    }
  }


  performWebWallAttack(dirToPlayer) {
    if (this.webWallCooldown > 0) return;
    let perpDir = createVector(-dirToPlayer.y, dirToPlayer.x);
    let segmentCount = 5;
    let spacing = 20;

    for (let i = -Math.floor(segmentCount / 2); i <= Math.floor(segmentCount / 2); i++) {
      let offset = p5.Vector.mult(perpDir, i * spacing);
      let spawnPos = p5.Vector.add(this.pos, offset);

      let bulletVel = p5.Vector.mult(dirToPlayer, 5);
      let web = new WebProjectile(spawnPos.x, spawnPos.y, bulletVel);
      enemyBullets.push(web);
    }

    this.webWallCooldown = 180;
    showFloatingText("Web Wall!", this.pos.x, this.pos.y - 30, color(255, 100, 255));
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
    if (this.trailCounter >= 20) {
      // 在四个方向创建毒池
      for (let i = 0; i < 4; i++) {
        let angle = (i * PI) / 2;
        let offset = createVector(cos(angle) * 40, sin(angle) * 40);
        let poisonPos = p5.Vector.add(this.pos, offset);
        
        poisonTrails.push({
          pos: poisonPos,
          radius: 40,  // 从35增加到40
          startTime: millis(),
          duration: 4000,
          // 更新动画属性 - 从6帧改为4帧
          frameIndex: 0,
          frameCount: 4,  // 新图片有4帧
          frameDelay: 8,
          frameCounter: 0,
          // 保留颜色调整
          colorMod: color(255, 200, 50, 220)
        });
      }
      this.trailCounter = 0;
      showFloatingText("Poison Splash!", this.pos.x, this.pos.y - 30, color(0, 255, 0));
    }
  }

  performMeleeAttack() {
    player.takeDamage(this.meleeDamage);
    this.meleeAttackCooldown = 45;
    showFloatingText("Melee Attack!", this.pos.x, this.pos.y - 30, color(255, 0, 0));
  }

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

  updateTimers() {
    this.webCooldown--;
    this.meleeAttackCooldown--;
    this.dashCooldown--;
    this.webWallCooldown--;
    this.summonCooldown--;
    this.trailCounter++;
  }

  updateBirdlings() {
    for (let i = this.birdlings.length - 1; i >= 0; i--) {
      let birdling = this.birdlings[i];
      birdling.update();
      birdling.display();
      if (birdling.health <= 0) {
        this.birdlings.splice(i, 1);
      }
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
    // 绘制 Boss
    let frameWidth = 200;
    let frameHeight = 160;
    let columns = floor(this.birdBossAction.width / frameWidth);
    let frameX = (this.currentAnimation[this.frameIndex] % columns) * frameWidth;
    let frameY = floor(this.currentAnimation[this.frameIndex] / columns) * frameHeight;

    let drawWidth = this.size;
    let drawHeight = this.size * (frameHeight / frameWidth);
    let drawX = this.pos.x - drawWidth / 2;
    let drawY = this.pos.y - drawHeight / 2;

    image(
      this.birdBossAction,
      drawX,
      drawY,
      drawWidth,
      drawHeight,
      frameX,
      frameY,
      frameWidth,
      frameHeight
    );

    this.displayHealthBar();

    // 绘制羽毛
    for (let f of this.feathers) {
      f.display();
    }
  }

  displayHealthBar() {
    displayBossHealthBar();
  }
}

class SlimeBoss extends Boss {
  constructor(slimeBossImage, type = "normal") {
    super(true, "slimeBoss", slimeBossImage, 200, 160);

    // Boss 基础属性
    this.health = 200;
    this.maxHealth = 200;
    this.damage = 25;
    this.speed = 2.5;
    this.size = 120;
    this.isActive = true;
    
    // 根据Boss类型设置位置偏移
    let offsetX = 0;
    let offsetY = 0;
    
    switch(type) {
      case "fire":
        offsetX = -80;
        offsetY = -80;
        break;
      case "water":
        offsetX = 80;
        offsetY = -80;
        break;
      case "poison":
        offsetX = -80;
        offsetY = 80;
        break;
      case "wind":
        offsetX = 80;
        offsetY = 80;
        break;
    }
    
    // 设置位置（中心位置 + 偏移）
    this.pos = createVector(width / 2 + offsetX, height / 2 + offsetY);

    // 动画相关
    this.slimeBossImage = slimeBossImage;
    this.columns = 4;
    this.rows = 5;
    this.totalFrames = 19;
    this.frameWidth = this.slimeBossImage.width / this.columns;
    this.frameHeight = this.slimeBossImage.height / this.rows;
    this.currentAnimation = Array.from({ length: this.totalFrames }, (_, i) => i);
    this.frameIndex = 0;
    this.animationDelay = 6;
    this.animationCounter = 0;

    // 移动相关
    this.movedFrame15 = false;
    this.movedFrame16 = false;

    // 元素相关
    this.type = type;
    this.elementalColor = this.getElementalColor(type);
    this.elementalEffects = [];
    this.poisonPools = []; // 确保初始化毒池数组

    // 技能相关
    this.skillCooldown = 180;
    this.skillDelay = 180;

    // 元素技能属性
    this.initElementalProperties(type);
  }

  initElementalProperties(type) {
    switch (type) {
      case "fire":
        this.flameDamage = 40;
        this.flameRadius = 150;
        this.flameDuration = 90;
        this.dashSpeed = 20;
        break;
      case "water":
        this.waveSpeed = 8;
        this.slowDuration = 180;
        this.slowAmount = 0.3;
        this.waveRadius = 50;
        this.wavesCount = 3;
        break;
      case "poison":
        this.poisonDamage = 8;
        this.poisonDuration = 240;
        this.poisonRadius = 60;
        this.poisonSpreadSpeed = 0.5;
        break;
      case "wind":
        this.windForce = 15;
        this.windRadius = 200;
        this.windDuration = 60;
        this.windAngle = PI / 2;
        break;
    }
  }

  getElementalColor(type) {
    switch (type) {
      case "fire":
        return color(255, 60, 60, 220);    // 炽热红（带轻微灼烧透明感）
      case "water":
        return color(135, 206, 250, 200);    // 淡蓝（类似水的半透明效果）
      case "poison":
        return color(148, 0, 211, 180);     // 毒液紫（带荧光效果）
      case "wind":
        return color(245, 245, 245, 220);   // 纯白（带气态模糊效果）
      default:
        return color(255);
    }
  }

  animate() {
    this.animationCounter++;
    if (this.animationCounter >= this.animationDelay) {
      this.animationCounter = 0;
      this.frameIndex = (this.frameIndex + 1) % this.totalFrames;
    }
  }

  update() {
    if (!this.isActive || !player) return;

    try {
      // 更新动画
      this.animate();
      let currentFrame = this.currentAnimation[this.frameIndex];

      // 计算到玩家的方向
      let dirToPlayer = p5.Vector.sub(player.pos, this.pos).normalize();

      // 基本移动逻辑
      if (!this.isDashing) {
        if (currentFrame === 14 && !this.movedFrame15) {
          let moveVec = p5.Vector.mult(dirToPlayer, 30);
          this.pos.add(moveVec);
          this.movedFrame15 = true;
        } else if (currentFrame !== 14) {
          this.movedFrame15 = false;
        }

        if (currentFrame === 15 && !this.movedFrame16) {
          let moveVec = p5.Vector.mult(dirToPlayer, 80);
          this.pos.add(moveVec);
          this.movedFrame16 = true;
        } else if (currentFrame !== 15) {
          this.movedFrame16 = false;
        }
      }

      // 更新技能冷却
      if (this.skillCooldown > 0) {
        this.skillCooldown--;
      } else {
        this.useElementalSkill();
        this.skillCooldown = this.skillDelay;
      }

      // 更新元素效果
      if (this.elementalEffects) {
        this.updateElementalEffects();
      }

      // 确保不会移出屏幕
      this.pos.x = constrain(this.pos.x, 0, width);
      this.pos.y = constrain(this.pos.y, 0, height);
    } catch (error) {
      console.error("Error in SlimeBoss update:", error);
    }
  }

  useElementalSkill() {
    switch (this.type) {
      case "fire":
        this.fireSkill();
        break;
      case "water":
        this.waterSkill();
        break;
      case "poison":
        this.poisonSkill();
        break;
      case "wind":
        this.windSkill();
        break;
    }
  }

  // 火焰史莱姆技能 - 调整内环距离防止重合
  fireSkill() {
    // 设置环绕火焰 - 双层火环设计
    const flameCount = 12; // 增加火焰数量
    const radius = this.flameRadius * 0.65; // 主环半径
    const innerRadius = this.flameRadius * 0.5; // 增加内环半径，从0.4改为0.5
    
    // 创建双层火焰环
    for (let i = 0; i < flameCount; i++) {
      // 主环火焰
      const angle = (TWO_PI / flameCount) * i;
      const offsetX = cos(angle) * radius;
      const offsetY = sin(angle) * radius;
      
      // 添加主环火焰
      this.elementalEffects.push({
        type: "fireRing",
        basePos: this.pos.copy(),
        pos: createVector(this.pos.x + offsetX, this.pos.y + offsetY),
        angle: angle,
        radius: this.flameRadius * 0.15,
        orbitRadius: radius,
        duration: this.flameDuration,
        damage: this.flameDamage / 60,
        startTime: millis(),
        rotationSpeed: 0.02,
        frameIndex: 0,
        frameCount: 6,
        frameDelay: 5,
        frameCounter: 0,
        visualScale: 2.0
      });
      
      // 添加内环火焰 - 角度错开，形成交错效果
      if (i % 2 === 0) { 
        const innerAngle = angle + (TWO_PI / flameCount / 2);
        const innerOffsetX = cos(innerAngle) * innerRadius;
        const innerOffsetY = sin(innerAngle) * innerRadius;
        
        this.elementalEffects.push({
          type: "fireRing",
          basePos: this.pos.copy(),
          pos: createVector(this.pos.x + innerOffsetX, this.pos.y + innerOffsetY),
          angle: innerAngle,
          radius: this.flameRadius * 0.12, // 内环火焰稍小
          orbitRadius: innerRadius,
          duration: this.flameDuration,
          damage: this.flameDamage / 60,
          startTime: millis(),
          rotationSpeed: -0.01, // 反向旋转
          frameIndex: Math.floor(random(6)), // 随机初始帧，增加变化
          frameCount: 6,
          frameDelay: 6,
          frameCounter: 0,
          visualScale: 1.7 // 减小视觉尺寸从1.8到1.7
        });
      }
    }

    showFloatingText("Ring of Fire!", this.pos.x, this.pos.y - 30, color(255, 100, 0));
  }

  // 水流史莱姆技能
  waterSkill() {
    let dirToPlayer = p5.Vector.sub(player.pos, this.pos).normalize();

    // 发射多个水波
    for (let i = 0; i < this.wavesCount; i++) {
      let angle = -PI / 6 + (i * PI / 6);
      let rotatedDir = createVector(
        dirToPlayer.x * cos(angle) - dirToPlayer.y * sin(angle),
        dirToPlayer.x * sin(angle) + dirToPlayer.y * cos(angle)
      );

      this.elementalEffects.push({
        type: "water",
        pos: this.pos.copy(),
        vel: p5.Vector.mult(rotatedDir, this.waveSpeed),
        radius: this.waveRadius * 0.5, // 缩小尺寸
        duration: 90,
        slowDuration: this.slowDuration,
        slowAmount: this.slowAmount,
        pulseTime: millis(),
        // 更新动画相关属性
        frameIndex: 0,         
        frameCount: 6,         // 修正为6帧
        frameDelay: 8,         // 略微增加延迟使动画更平滑
        frameCounter: 0,       
        rotation: random(TWO_PI) 
      });
    }

    showFloatingText("Water Waves!", this.pos.x, this.pos.y - 30, color(0, 100, 255));
  }

  // 毒液史莱姆技能
  poisonSkill() {
    // 创建扩散的毒池
    this.poisonPools.push({
      pos: this.pos.copy(),
      radius: this.poisonRadius * 0.5, // 初始半径更小
      duration: this.poisonDuration,
      damage: this.poisonDamage,
      startRadius: this.poisonRadius * 0.5,
      maxRadius: this.poisonRadius * 1.5,
      spreadSpeed: this.poisonSpreadSpeed,
      // 添加动画相关属性
      frameIndex: 0,
      frameCount: 7, // 根据图片看起来有7帧
      frameDelay: 8,
      frameCounter: 0,
      scale: 1.0 // 初始缩放系数
    });

    showFloatingText("Toxic Pool!", this.pos.x, this.pos.y - 30, color(0, 255, 0));
  }

  // 疾风史莱姆技能 - 调整帧数和尺寸
  windSkill() {
    // 获取朝向玩家的角度
    let angleToPlayer = atan2(player.pos.y - this.pos.y, player.pos.x - this.pos.x);
    
    // 创建三道龙卷风，扇形分布
    for (let i = -1; i <= 1; i++) {
      // 在基础角度上添加偏移，创建扇形效果
      let tornadoAngle = angleToPlayer + i * PI/6; // 每个龙卷风间隔30度
      
      this.elementalEffects.push({
        type: "wind",
        pos: this.pos.copy(),
        angle: tornadoAngle,
        radius: this.windRadius * 0.6, // 减小半径
        duration: this.windDuration,
        force: this.windForce,
        startTime: millis(),
        // 风的粒子效果
        particles: Array(20).fill().map(() => ({
          pos: this.pos.copy(),
          vel: p5.Vector.random2D().mult(random(2, 5)),
          life: random(20, 40)
        })),
        // 龙卷风动画属性
        frameIndex: 0,
        frameCount: 12,         // 修正为12帧
        frameDelay: 4,          // 动画速度
        frameCounter: 0,
        scale: 0.8,             // 减小缩放系数
        // 龙卷风移动属性
        moveSpeed: 3,           // 移动速度
        moveDirection: p5.Vector.fromAngle(tornadoAngle).mult(3) // 移动方向
      });
    }

    showFloatingText("Tornado Blast!", this.pos.x, this.pos.y - 30, color(200, 200, 255));
  }

  updateElementalEffects() {
    // 更新所有元素效果
    for (let i = this.elementalEffects.length - 1; i >= 0; i--) {
      let effect = this.elementalEffects[i];
      effect.duration--;

      switch (effect.type) {
        case "fire":
          // 原有火焰效果代码保留...
          break;
          
        case "fireRing":
          // 更新环绕火焰位置
          effect.angle += effect.rotationSpeed;
          const newX = effect.basePos.x + cos(effect.angle) * effect.orbitRadius;
          const newY = effect.basePos.y + sin(effect.angle) * effect.orbitRadius;
          effect.pos.x = newX;
          effect.pos.y = newY;
          
          // 更新动画帧
          if (effect.frameCounter !== undefined) {
            effect.frameCounter++;
            if (effect.frameCounter >= effect.frameDelay) {
              effect.frameCounter = 0;
              effect.frameIndex = (effect.frameIndex + 1) % effect.frameCount;
            }
          }
          
          // 检测与玩家的碰撞
          if (p5.Vector.dist(player.pos, effect.pos) < effect.radius + player.radius) {
            player.takeDamage(effect.damage);
            showFloatingText("Burning!", player.pos.x, player.pos.y - 20, color(255, 100, 0));
          }
          
          // 更新基础位置以跟随史莱姆
          effect.basePos = this.pos.copy();
          break;

        case "water":
          // 水波移动和脉动
          effect.pos.add(effect.vel);
          
          // 更新动画帧
          if (effect.frameCounter !== undefined) {
            effect.frameCounter++;
            if (effect.frameCounter >= effect.frameDelay) {
              effect.frameCounter = 0;
              effect.frameIndex = (effect.frameIndex + 1) % effect.frameCount;
            }
          }
          
          // 旋转效果
          if (effect.rotation !== undefined) {
            effect.rotation += 0.02;
          }
          
          // 检测碰撞
          let pulse = sin((millis() - effect.pulseTime) / 100) * 10;
          if (p5.Vector.dist(player.pos, effect.pos) < effect.radius + pulse) {
            player.speed *= effect.slowAmount;
            setTimeout(() => player.speed /= effect.slowAmount, effect.slowDuration);
            showFloatingText("Slowed!", player.pos.x, player.pos.y - 20, color(0, 100, 255));
          }
          break;

        case "wind":
          // 更新龙卷风位置 - 向前移动
          if (effect.moveDirection) {
            effect.pos.add(effect.moveDirection);
          }
          
          // 更新动画帧
          if (effect.frameCounter !== undefined) {
            effect.frameCounter++;
            if (effect.frameCounter >= effect.frameDelay) {
              effect.frameCounter = 0;
              effect.frameIndex = (effect.frameIndex + 1) % effect.frameCount;
            }
          }
          
          // 更新龙卷风粒子效果
          effect.particles.forEach(p => {
            p.pos.add(p.vel);
            p.life--;
          });
          effect.particles = effect.particles.filter(p => p.life > 0);
          
          // 添加新的粒子以保持效果
          if (effect.particles.length < 10) {
            for (let j = 0; j < 3; j++) {
              effect.particles.push({
                pos: effect.pos.copy().add(random(-30, 30), random(-30, 30)),
                vel: p5.Vector.fromAngle(effect.angle + random(-0.5, 0.5)).mult(random(2, 5)),
                life: random(10, 20)
              });
            }
          }

          // 检测是否影响玩家
          let playerDist = p5.Vector.dist(player.pos, effect.pos);
          if (playerDist < effect.radius) {
            // 计算推力方向和强度（距离中心越近推力越大）
            let pushStrength = map(playerDist, 0, effect.radius, effect.force, effect.force * 0.3);
            let pushDir = p5.Vector.fromAngle(effect.angle).mult(pushStrength);
            player.pos.add(pushDir);
            showFloatingText("Blown Away!", player.pos.x, player.pos.y - 20, color(200, 200, 255));
          }
          
          // 检测是否影响玩家子弹
          for (let j = bullets.length - 1; j >= 0; j--) {
            let bullet = bullets[j];
            let bulletDist = p5.Vector.dist(bullet.pos, effect.pos);
            if (bulletDist < effect.radius) {
              // 为子弹添加反向推力
              let bulletPush = p5.Vector.fromAngle(effect.angle).mult(1.5);
              bullet.vel.add(bulletPush);
            }
          }
          break;
      }

      if (effect.duration <= 0) {
        this.elementalEffects.splice(i, 1);
      }
    }

    // 更新毒池
    if (this.type === "poison") {
      for (let i = this.poisonPools.length - 1; i >= 0; i--) {
        let pool = this.poisonPools[i];
        pool.duration--;

        // 毒池扩散
        pool.radius = min(pool.maxRadius,
          pool.startRadius + (pool.maxRadius - pool.startRadius) *
          (1 - pool.duration / this.poisonDuration));
        
        // 更新动画帧
        if (pool.frameCounter !== undefined) {
          pool.frameCounter++;
          if (pool.frameCounter >= pool.frameDelay) {
            pool.frameCounter = 0;
            pool.frameIndex = (pool.frameIndex + 1) % pool.frameCount;
          }
        }
        
        // 更新缩放系数 - 随着范围增加而增大
        if (pool.startRadius && pool.maxRadius) {
          pool.scale = map(pool.radius, pool.startRadius, pool.maxRadius, 0.8, 1.6);
        }

        if (p5.Vector.dist(player.pos, pool.pos) < pool.radius) {
          player.takeDamage(pool.damage / 60);
          showFloatingText("Poisoned!", player.pos.x, player.pos.y - 20, color(0, 255, 0));
        }

        if (pool.duration <= 0) {
          this.poisonPools.splice(i, 1);
        }
      }
    }
  }

  display() {
    push();
    
    // 绘制元素效果 - 确保所有类型的效果都被渲染
    for (let effect of this.elementalEffects) {
      switch (effect.type) {
        case "fire":
          if (fireballImg) {
            push();
            imageMode(CENTER);
            translate(effect.pos.x, effect.pos.y);
            
            // 计算当前帧在精灵表中的位置
            let frameWidth = fireballImg.width / 6;
            let frameHeight = fireballImg.height;
            
            // 绘制当前帧
            let displaySize = effect.radius * 2.5;
            
            image(
              fireballImg,
              0, 0,
              displaySize, displaySize,
              effect.frameIndex * frameWidth, 0,
              frameWidth, frameHeight
            );
            
            // 添加辉光效果
            drawingContext.shadowBlur = 8;
            drawingContext.shadowColor = color(255, 120, 0, 150);
            noFill();
            noStroke(); // 移除边缘线，与毒液效果一致
            ellipse(0, 0, displaySize * 0.9);
            drawingContext.shadowBlur = 0;
            
            pop();
          } else {
            // 后备绘制方法
            fill(255, 100, 0, 150);
            noStroke();
            ellipse(effect.pos.x, effect.pos.y, effect.radius * 2);
          }
          break;
          
        case "fireRing":
          if (fireballImg) {
            push();
            imageMode(CENTER);
            translate(effect.pos.x, effect.pos.y);
            
            // 计算当前帧在精灵表中的位置
            let frameWidth = fireballImg.width / 6;
            let frameHeight = fireballImg.height;
            
            // 绘制当前帧
            let displaySize = effect.radius * (effect.visualScale || 2.5);
            
            image(
              fireballImg,
              0, 0,
              displaySize, displaySize,
              effect.frameIndex * frameWidth, 0,
              frameWidth, frameHeight
            );
            
            // 添加辉光效果
            drawingContext.shadowBlur = 8;
            drawingContext.shadowColor = color(255, 120, 0, 150);
            noFill();
            noStroke(); // 移除边缘线，与毒液效果一致
            ellipse(0, 0, displaySize * 0.9);
            drawingContext.shadowBlur = 0;
            
            pop();
          } else {
            // 后备绘制方法
            fill(255, 100, 0, 150);
            noStroke();
            ellipse(effect.pos.x, effect.pos.y, effect.radius * 2);
          }
          break;

        case "water":
          if (waterBubbleImg) {
            push();
            imageMode(CENTER);
            translate(effect.pos.x, effect.pos.y);
            
            // 应用旋转
            if (effect.rotation !== undefined) {
              rotate(effect.rotation);
            }
            
            // 计算当前帧在精灵表中的位置
            let frameWidth = waterBubbleImg.width / 6;
            let frameHeight = waterBubbleImg.height;
            
            // 绘制当前帧
            let displaySize = effect.radius * 3;
            
            image(
              waterBubbleImg,
              0, 0,
              displaySize, displaySize,
              effect.frameIndex * frameWidth, 0,
              frameWidth, frameHeight
            );
            
            // 添加辉光效果
            drawingContext.shadowBlur = 10;
            drawingContext.shadowColor = color(80, 120, 255, 120);
            noFill();
            noStroke(); // 移除边缘线，与毒液效果一致
            ellipse(0, 0, displaySize * 0.9);
            drawingContext.shadowBlur = 0;
            
            pop();
          } else {
            // 后备绘制方法
            fill(100, 150, 255, 150);
            noStroke();
            ellipse(effect.pos.x, effect.pos.y, effect.radius * 2);
          }
          break;
          
        case "wind":
          if (windTornadoImg && effect.frameIndex !== undefined) {
            // 绘制龙卷风动画
            push();
            imageMode(CENTER);
            translate(effect.pos.x, effect.pos.y);
            rotate(effect.angle); // 旋转到正确方向
            
            // 计算当前帧在精灵表中的位置 - 修正为12帧
            let frameWidth = windTornadoImg.width / effect.frameCount;
            let frameHeight = windTornadoImg.height;
            
            // 绘制当前帧 - 减小尺寸
            let displaySize = effect.radius * (effect.scale || 0.8);
            
            image(
              windTornadoImg,
              0, 0,
              displaySize, displaySize,
              effect.frameIndex * frameWidth, 0,
              frameWidth, frameHeight
            );
            
            // 添加辉光效果
            drawingContext.shadowBlur = 15;
            drawingContext.shadowColor = color(255, 255, 255, 150);
            noFill();
            noStroke();
            ellipse(0, 0, displaySize * 0.6); // 减小辉光尺寸
            drawingContext.shadowBlur = 0;
            
            pop();
          }
          
          // 绘制风效果粒子
          push();
          for (let p of effect.particles) {
            let particleAlpha = map(p.life, 0, 40, 50, 200);
            fill(255, 255, 255, particleAlpha);
            noStroke();
            ellipse(p.pos.x, p.pos.y, 4);
          }
          pop();
          break;
      }
    }
    
    // 绘制毒池 - 保持当前代码
    if (this.type === "poison" && this.poisonPools) {
      for (let pool of this.poisonPools) {
        if (poisonVortexImg) {
          // 使用精灵表绘制动画帧
          push();
          imageMode(CENTER);
          translate(pool.pos.x, pool.pos.y);
          
          // 计算当前帧在精灵表中的位置
          let frameWidth = poisonVortexImg.width / pool.frameCount;
          let frameHeight = poisonVortexImg.height;
          
          // 随着毒池扩散逐渐增大动画尺寸
          let displaySize = pool.radius * 2 * pool.scale;
          
          // 绘制当前帧
          image(
            poisonVortexImg,
            0, 0,
            displaySize, displaySize,
            pool.frameIndex * frameWidth, 0,
            frameWidth, frameHeight
          );
          
          // 添加轻微辉光效果，但不绘制边缘线
          drawingContext.shadowBlur = 15;
          drawingContext.shadowColor = color(0, 200, 50, 120);
          noFill();
          noStroke(); // 移除边缘线
          ellipse(0, 0, displaySize * 0.9);
          drawingContext.shadowBlur = 0;
          
          pop();
        } else {
          // 后备绘制方法
          for (let r = 0; r < 3; r++) {
            let alpha = map(r, 0, 2, 100, 30);
            fill(0, 200, 0, alpha);
            noStroke(); // 确保没有边缘线
            ellipse(pool.pos.x, pool.pos.y, pool.radius * 2 * (1 - r * 0.2));
          }
        }
      }
    }

    // 绘制Boss本体
    tint(this.elementalColor);
    let frameNum = this.currentAnimation[this.frameIndex];
    let col = frameNum % this.columns;
    let row = floor(frameNum / this.columns);

    image(
      this.slimeBossImage,
      this.pos.x - this.size / 2,
      this.pos.y - this.size / 2,
      this.size,
      this.size,
      col * this.frameWidth,
      row * this.frameHeight,
      this.frameWidth,
      this.frameHeight
    );
    noTint();
    pop();
  }

  displayHealthBar() {
    displayBossHealthBar();
  }
}

// === 改进BugBoss类，添加疾风裂爪技能 ===
class BugBoss extends Enemy {
  constructor() {
    // 从Enemy继承
    super(true, "boss", commonEnemyAction, 40, 40);
    
    // 基本属性
    this.health = 800;
    this.maxHealth = 800;
    this.radius = 30;
    this.speed = 2;
    this.damage = 20;
    this.attackRange = 100;
    this.expValue = 100;
    this.isBoss = true; // 确保标记为Boss
    
    // 幽冥鬼火技能
    this.ghostFireCooldown = 0;
    this.ghostFireInterval = 300; // 5秒一次
    
    // 疾风裂爪技能
    this.rapidClawCooldown = 180; // 初始冷却时间
    this.rapidClawInterval = 450; // 7.5秒一次
    this.isRapidClawActive = false; // 是否正在施放技能
    this.rapidClawStage = 0; // 当前是第几次攻击(0-2)
    this.attackAnimationTime = 0; // 攻击动画计时
    this.attackAnimationDuration = 20; // 减少到20帧(原来是30)
    this.attackDamageTime = 10; // 减少到10帧(原来是15)
    this.attackDelay = 5; // 减少到5帧(原来是10)
    this.attackDelayCounter = 0; // 攻击延迟计时器
    this.baseClawDamage = 30; // 基础伤害
    this.baseClawRange = 80; // 基础范围
    
    // 动画属性
    this.frameIndex = 0;
    this.frameDelay = 8;
    this.frameCounter = 0;
    this.totalFrames = 6;
    
    // 当前朝向
    this.direction = 'down';
    
    // 为了方便处理不同方向的显示
    this.customImages = {
      left: bugBossSide,
      right: bugBossSide,
      up: bugBossUp,
      down: bugBossDown
    };
    
    // 攻击动画图片
    this.attackImages = {
      left: bugBossAttackSide,
      right: bugBossAttackSide,
      up: bugBossAttackUp,
      down: bugBossAttackDown
    };
    
    // 设置初始技能冷却时间为随机值
    this.ghostFireCooldown = random(60, 120);
    this.rapidClawCooldown = random(120, 240);
  }
  
  update() {
    // 更新无敌时间
    if (this.invulnerableTime > 0) {
      this.invulnerableTime--;
    }
    
    // 判断是否正在施放疾风裂爪技能
    if (this.isRapidClawActive) {
      this.updateRapidClawAttack();
      return; // 在技能期间不执行普通更新
    }
    
    // 更新动画
    this.frameCounter++;
    if (this.frameCounter >= this.frameDelay) {
      this.frameCounter = 0;
      this.frameIndex = (this.frameIndex + 1) % this.totalFrames;
    }
    
    // 追踪玩家
    let dirToPlayer = p5.Vector.sub(player.pos, this.pos);
    
    // 根据移动方向设置朝向
    if (Math.abs(dirToPlayer.x) > Math.abs(dirToPlayer.y)) {
      this.direction = dirToPlayer.x > 0 ? 'right' : 'left';
    } else {
      this.direction = dirToPlayer.y > 0 ? 'down' : 'up';
    }
    
    // 根据距离调整行为
    let distToPlayer = dirToPlayer.mag();
    if (distToPlayer < this.attackRange) {
      // 在攻击范围内，减速移动
      dirToPlayer.normalize().mult(this.speed * 0.5);
      
      // 近距离攻击玩家
      if (this.attackCooldown <= 0) {
        player.takeDamage(this.damage);
        this.attackCooldown = 60;
        showFloatingText("Attack!", this.pos.x, this.pos.y - 30, color(255, 0, 0));
      } else {
        this.attackCooldown--;
      }
    } else {
      // 正常移动
      dirToPlayer.normalize().mult(this.speed);
    }
    
    // 应用移动
    this.vel = dirToPlayer;
    this.pos.add(this.vel);
    
    // 幽冥鬼火技能
    if (this.ghostFireCooldown <= 0) {
      this.castGhostFire();
      this.ghostFireCooldown = this.ghostFireInterval;
      showFloatingText("幽冥鬼火!", this.pos.x, this.pos.y - 40, color(70, 180, 255), 20);
    } else {
      this.ghostFireCooldown--;
    }
    
    // 疾风裂爪技能
    if (this.rapidClawCooldown <= 0) {
      this.startRapidClawAttack();
      this.rapidClawCooldown = this.rapidClawInterval;
    } else {
      this.rapidClawCooldown--;
    }
    
    // 处理碰撞
    this.resolveCollision();
  }
  
  // 启动疾风裂爪攻击
  startRapidClawAttack() {
    showFloatingText("疾风裂爪!", this.pos.x, this.pos.y - 40, color(255, 100, 100), 20);
    this.isRapidClawActive = true;
    this.rapidClawStage = 0;
    this.attackAnimationTime = 0;
    this.teleportToPlayer();
  }
  
  // 瞬移到玩家附近
  teleportToPlayer() {
    // 计算玩家方向
    let dirToPlayer = p5.Vector.sub(player.pos, this.pos);
    
    // 更新朝向
    if (Math.abs(dirToPlayer.x) > Math.abs(dirToPlayer.y)) {
      this.direction = dirToPlayer.x > 0 ? 'right' : 'left';
    } else {
      this.direction = dirToPlayer.y > 0 ? 'down' : 'up';
    }
    
    // 瞬移到玩家附近的位置
    let teleportDistance = 80;
    let teleportDirection = dirToPlayer.copy().normalize().mult(teleportDistance);
    this.pos = p5.Vector.add(player.pos, teleportDirection.mult(-1)); // 反方向
    
    // 添加瞬移特效
    for (let i = 0; i < 15; i++) {
      let angle = random(TWO_PI);
      let distance = random(10, 30);
      let x = this.pos.x + cos(angle) * distance;
      let y = this.pos.y + sin(angle) * distance;
      
      poisonTrails.push({
        pos: createVector(x, y),
        radius: random(10, 20),
        startTime: millis(),
        duration: random(500, 1000)
      });
    }
  }
  
  // 处理疾风裂爪攻击
  updateRapidClawAttack() {
    if (this.attackDelayCounter > 0) {
      // 在攻击之间的延迟
      this.attackDelayCounter--;
      return;
    }
    
    this.attackAnimationTime++;
    
    // 检查是否应该造成伤害
    if (this.attackAnimationTime === this.attackDamageTime) {
      this.performRapidClawDamage();
    }
    
    // 检查当前攻击动画是否结束
    if (this.attackAnimationTime >= this.attackAnimationDuration) {
      this.attackAnimationTime = 0;
      this.rapidClawStage++;
      
      // 如果已经完成所有三次攻击，结束技能
      if (this.rapidClawStage >= 3) {
        this.isRapidClawActive = false;
        return;
      }
      
      // 在继续下一次攻击前添加延迟
      this.attackDelayCounter = this.attackDelay;
      // 瞬移到玩家附近做下一次攻击
      this.teleportToPlayer();
    }
    
    // 更新攻击动画帧
    let totalFramesInAttack = 6; // 攻击动画总帧数
    this.frameIndex = Math.floor((this.attackAnimationTime / this.attackAnimationDuration) * totalFramesInAttack);
    if (this.frameIndex >= totalFramesInAttack) this.frameIndex = totalFramesInAttack - 1;
  }
  
  // 执行疾风裂爪伤害
  performRapidClawDamage() {
    // 根据攻击阶段增加伤害和范围
    let stageDamage = this.baseClawDamage * (1 + this.rapidClawStage * 0.5);
    let stageRange = this.baseClawRange * (1 + this.rapidClawStage * 0.5); // 增加范围增长系数(原来是0.2)
    
    // 根据方向确定攻击区域
    let attackArea = this.calculateAttackArea(stageRange);
    let hitPlayerSuccess = this.checkPlayerInAttackArea(attackArea);
    
    if (hitPlayerSuccess) {
      player.takeDamage(stageDamage);
      showFloatingText("-" + stageDamage, player.pos.x, player.pos.y - 20, color(255, 0, 0));
      
      // 攻击效果
      for (let i = 0; i < 8; i++) {
        let angle = random(TWO_PI);
        let distance = random(10, 30);
        let x = player.pos.x + cos(angle) * distance;
        let y = player.pos.y + sin(angle) * distance;
        
        poisonTrails.push({
          pos: createVector(x, y),
          radius: random(5, 15),
          startTime: millis(),
          duration: random(300, 800)
        });
      }
    }
    
    // 可视化攻击区域，根据阶段增加特效数量
    this.visualizeAttackArea(attackArea, this.rapidClawStage + 6); // 增加特效数量
  }
  
  // 计算攻击区域
  calculateAttackArea(range) {
    let area = {};
    
    switch(this.direction) {
      case 'left':
        area = {
          x: this.pos.x - range/2,
          y: this.pos.y - range/4,
          w: range,
          h: range/2
        };
        break;
      case 'right':
        area = {
          x: this.pos.x - range/2,
          y: this.pos.y - range/4,
          w: range,
          h: range/2
        };
        break;
      case 'up':
        area = {
          x: this.pos.x - range/4,
          y: this.pos.y - range/2,
          w: range/2,
          h: range
        };
        break;
      case 'down':
        area = {
          x: this.pos.x - range/4,
          y: this.pos.y - range/2,
          w: range/2,
          h: range
        };
        break;
    }
    
    return area;
  }
  
  // 检查玩家是否在攻击区域内
  checkPlayerInAttackArea(area) {
    // 简化为圆形检测
    let center = createVector(area.x + area.w/2, area.y + area.h/2);
    let radius = max(area.w, area.h)/2;
    
    let dist = p5.Vector.dist(center, player.pos);
    return dist < radius + player.radius;
  }
  
  // 可视化攻击区域（仅用于调试）
  visualizeAttackArea(area, slashCount = 6) {
    // 添加攻击轨迹特效
    let angleOffset = this.direction === 'left' || this.direction === 'right' ? 0 : HALF_PI;
    
    // 根据攻击阶段增加特效范围
    let length = area.w * (0.8 + this.rapidClawStage * 0.3); // 增加特效范围
    
    for (let i = 0; i < slashCount; i++) {
      let angle = map(i, 0, slashCount-1, -PI/3, PI/3) + angleOffset; // 增加扇形范围
      if (this.direction === 'left') angle += PI;
      
      let x = this.pos.x + cos(angle) * length/2;
      let y = this.pos.y + sin(angle) * length/2;
      
      poisonTrails.push({
        pos: createVector(x, y),
        radius: 10 + this.rapidClawStage * 5, // 增加特效大小
        startTime: millis(),
        duration: 300
      });
    }
  }
  
  // 显示方法 - 根据当前状态选择不同的绘制方式
  display() {
    push();
    imageMode(CENTER);
    
    // 根据当前状态选择合适的图像
    let currentImage;
    
    if (this.isRapidClawActive) {
      // 使用攻击动画
      currentImage = this.attackImages[this.direction];
    } else {
      // 使用移动动画
      currentImage = this.customImages[this.direction];
    }
    
    // 计算当前帧位置
    let frameWidth = currentImage.width / this.totalFrames;
    let frameHeight = currentImage.height;
    
    // 翻转左方向的图像
    if (this.direction === 'left') {
      translate(this.pos.x, this.pos.y);
      scale(-1, 1);
      image(
        currentImage, 
        0, 0, 
        this.radius * 2.5, this.radius * 2.5, // 稍微放大
        this.frameIndex * frameWidth, 0, 
        frameWidth, frameHeight
      );
    } else {
      image(
        currentImage, 
        this.pos.x, this.pos.y, 
        this.radius * 2.5, this.radius * 2.5, // 稍微放大
        this.frameIndex * frameWidth, 0, 
        frameWidth, frameHeight
      );
    }
    
    pop();
    
    // 显示血条
    this.displayHealthBar();
  }
  
  // 其他方法保持不变 (displayHealthBar, castGhostFire等)
  // ...
  
  // 添加缺失的displayHealthBar方法
  displayHealthBar() {
    // 确保设置全局Boss状态
    bossActive = true;
    
    // 在全局范围显示Boss血条
    push();
    fill(100, 100, 100, 200);
    rect(width/2 - 200, 50, 400, 20);
    
    // 计算血量百分比
    let healthPercent = this.health / this.maxHealth;
    fill(255, 0, 0);
    rect(width/2 - 200, 50, 400 * healthPercent, 20);
    pop();
  }
  
  // 添加缺失的castGhostFire方法
  castGhostFire() {
    // 在Boss周围生成6个鬼火
    for (let i = 0; i < 6; i++) {
      let angle = TWO_PI * i / 6;
      let radius = 50;
      let x = this.pos.x + cos(angle) * radius;
      let y = this.pos.y + sin(angle) * radius;
      
      // 创建并添加到全局数组
      enemyBullets.push(new GhostFire(x, y));
    }
  }
}
