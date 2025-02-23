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
  constructor(isElite = true, enemyType = "boss", bossAction, bossWidth, bossHeight) {
    super(isElite, enemyType, bossAction, bossWidth, bossHeight);
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
    this.currentAnimation = birdBossAction.animation || [0,1,2,3]; 
    this.frameIndex = 0;
    this.animationDelay = 20;
    this.animationCounter = 0;

      //  z羽毛掉落相关变量
      this.featherFalling = false;   
      this.featherEndTime = 0;      
      this.featherOffsetY = 0;      
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
    switch(this.attackPattern) {
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
    this.pos = createVector(width / 2, height / 2);
    
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
    this.moveMultiplier15 = 30;
    this.moveMultiplier16 = 80;
    this.movedFrame15 = false;
    this.movedFrame16 = false;
    
    // 元素相关
    this.type = type;
    this.elementalColor = this.getElementalColor(type);
  }

  getElementalColor(type) {
    switch(type) {
      case "fire": return color(255, 100, 0);
      case "water": return color(0, 100, 255);
      case "poison": return color(0, 255, 0);
      case "wind": return color(200, 200, 255);
      default: return color(255);
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
    
    // 更新动画
    this.animate();
    let currentFrame = this.currentAnimation[this.frameIndex];
    
    // 计算到玩家的方向
    let dirToPlayer = p5.Vector.sub(player.pos, this.pos).normalize();
    
    // 在第15帧时移动
    if (currentFrame === 14 && !this.movedFrame15) {
      let moveVec = p5.Vector.mult(dirToPlayer, this.moveMultiplier15);
      this.pos.add(moveVec);
      this.movedFrame15 = true;
    } else if (currentFrame !== 14) {
      this.movedFrame15 = false;
    }
    
    // 在第16帧时移动
    if (currentFrame === 15 && !this.movedFrame16) {
      let moveVec = p5.Vector.mult(dirToPlayer, this.moveMultiplier16);
      this.pos.add(moveVec);
      this.movedFrame16 = true;
    } else if (currentFrame !== 15) {
      this.movedFrame16 = false;
    }
    
    // 确保不会移出屏幕
    this.pos.x = constrain(this.pos.x, 0, width);
    this.pos.y = constrain(this.pos.y, 0, height);
  }

  display() {
    push();
    // 绘制元素效果
    if (this.type === "fire" && (this.movedFrame15 || this.movedFrame16)) {
      fill(255, 100, 0, 100);
      ellipse(this.pos.x, this.pos.y, this.size * 1.2);
    }
    
    // 绘制史莱姆
    tint(this.elementalColor);
    let frameNum = this.currentAnimation[this.frameIndex];
    let col = frameNum % this.columns;
    let row = floor(frameNum / this.columns);
    
    image(
      this.slimeBossImage,
      this.pos.x - this.size/2,
      this.pos.y - this.size/2,
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

class SpiderBoss extends Boss {
  constructor(spiderBossAction, animationData) {
    // animationData 为一个对象，例如：{ frameWidth: 200, frameHeight: 160, frames: [0,4,8,12,16,...], delay: 20 }
    super(true, "boss", spiderBossAction, animationData.frameWidth, animationData.frameHeight);
    this.spiderBossAction = spiderBossAction;
    this.animationData = animationData;
    this.currentAnimation = animationData.frames;
    this.frameIndex = 0;
    this.animationDelay = animationData.delay || 20;
    this.animationCounter = 0;
    
    // SpiderBoss 特有属性
    this.health = 1000;
    this.maxHealth = 1000;
    this.size = 60;
    this.speed = 3;
    this.attackRange = 180;
    this.attackSpeed = 1;
    this.damage = 40;
    this.type = "SpiderBoss";
    
    // 攻击相关
    this.meleeAttackCooldown = 0;
    this.meleeAttackRange = 70;
    this.meleeDamage = 50;
    this.isDashing = false;
    this.dashCooldown = 0;
    this.dashDuration = 0;
    this.attackPattern = 0;
    this.patternTimer = 0;
    
    // 冻结相关
    this.isFrozen = false;
    this.freezeEndTime = 0;
    
    // 初始位置与其他属性
    this.pos = createVector(width / 2, height / 2);
    this.radius = 30;
    this.expValue = 300;
    
    // 其他计时器
    this.webCooldown = 0;
    this.meleeAttackCooldown = 0;
    this.dashCooldown = 0;
    this.webWallCooldown = 0;
    this.summonCooldown = 0;
  }


  update() {
    try {
      if (!this.isActive || !player) return;
      
      if (this.isFrozen) {
        if (millis() >= this.freezeEndTime) {
          this.isFrozen = false;
        } else {
          this.updateTimers();
          return;
        }
      }
      
      if (this.invulnerableTime > 0) this.invulnerableTime--;
      
      this.patternTimer++;
      if (this.patternTimer > 240) {
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
        let newPos = getValidSpawnPosition();
        this.pos = newPos;
        this.isFrozen = true;
        this.freezeEndTime = millis() + 2000;
      }
    } catch (error) {
      console.error("Error in SpiderBoss update:", error);
    }
  }
  
  executeAttackPattern(dirToPlayer) {
    switch(this.attackPattern) {
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
      this.webCooldown = 20;
    }
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
    // 毒气
    if (this.trailCounter >= 20) {
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
  
  performWebWallAttack(dirToPlayer) {
    if (this.webWallCooldown <= 0) {
      let perpDir = createVector(-dirToPlayer.y, dirToPlayer.x);
      for (let i = -3; i <= 3; i++) {
        let pos = p5.Vector.add(this.pos, p5.Vector.mult(perpDir, i * 30));
        let webVel = p5.Vector.mult(dirToPlayer, 3);
        enemyBullets.push(new WebProjectile(pos.x, pos.y, webVel));
      }
      this.webWallCooldown = 40;
    }
  }
  
  performSummonAttack() {
    if (this.summonCooldown <= 0) {
      for (let i = 0; i < 2; i++) {
        let minion = new Enemy(false, "normal", commonEnemyAction, 18, 22);
        minion.pos = this.pos.copy();

        minion.health = 50;
        minion.damage = 10;
        minion.speed = 2;
        // 将小怪加入全局敌人数组
        enemies.push(minion);
      }
      this.summonCooldown = 300;
      showFloatingText("Minions Summoned!", this.pos.x, this.pos.y - 30, color(255, 100, 255));
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
  
  animate() {
    // 更新动画帧
    this.animationCounter++;
    if (this.animationCounter >= this.animationDelay) {
      this.animationCounter = 0;
      this.frameIndex = (this.frameIndex + 1) % this.currentAnimation.length;
    }
  }
  
  display() {

    let frameNumber = this.currentAnimation[this.frameIndex];
  

    let frameX = frameNumber * this.frameWidth;
    let frameY = 0; 
  

    let displayW = this.size;              
    let displayH = this.size * ratio;      
  

    let drawX = this.pos.x - displayW / 2;
    let drawY = this.pos.y - displayH / 2;
  

    image(
      this.slimeBossAction, 
      drawX, drawY,         
      displayW, displayH,    
      frameX, frameY,       
      this.frameWidth,       
      this.frameHeight       
    );
  
    // 显示血条等
    this.displayHealthBar();
  }
  
  displayHealthBar() {
    displayBossHealthBar();
  }
}
