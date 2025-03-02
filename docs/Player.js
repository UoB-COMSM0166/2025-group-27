// ===== Player 类 =====
class Player {
    constructor(actionImgUp, actionImgDown, actionImgLeft, actionImgRight, actionImgIntro, chWidthUp, chHeightUp, chWidthDown, chHeightDown,chWidthLeft, chHeightLeft,chWidthRight, chHeightRight,chWidthIntro, chHeightIntro,type) {
    // change
    this.actionImgUp = actionImgUp;
    this.actionImgDown = actionImgDown;
    this.actionImgLeft = actionImgLeft;
    this.actionImgRight = actionImgRight;
    this.actionImgIntro = actionImgIntro;
    this.chWidthUp = chWidthUp;
    this.chHeightUp = chHeightUp;
    this.chWidthDown = chWidthDown;
    this.chHeightDown = chHeightDown;
    this.chWidthLeft = chWidthLeft;
    this.chHeightLeft = chHeightLeft;
    this.chWidthRight = chWidthRight;
    this.chHeightRight = chHeightRight;
    this.chWidthIntro = chWidthIntro;
    this.chHeightIntro = chHeightIntro;
    this.ImageWidth = 25; //**角色大小
    this.ImageHeight = 40; //**角色大小
    this.x = width / 2;
    this.y = height / 2;
    this.pos = createVector(this.x, this.y);
    this.vel = createVector(0, 0);
    if (type == "knight") {
      this.animations = {
        idle: [0, 1, 2],
        up: [0, 1, 2, 3],
        down: [0, 1, 2, 3],
        left: [0, 1, 2, 3],
        right: [0, 1, 2, 3]
      };
    } else if (type == "archer") {
      this.animations = {
        idle: [0, 1, 2],
        up: [27, 28, 29, 30, 31, 32],
        down: [9, 10, 11, 12, 13, 14],
        left: [18, 19, 20, 21, 22, 23],
        right: [18, 19, 20, 21, 22, 23]
      };
    } else if (type == "gunner") {
      this.animations = {
        idle: [0, 1, 2, 3],
        up: [0, 1, 2, 3],
        down: [0, 1, 2, 3],
        left: [0, 1, 2, 3],
        right: [0, 1, 2, 3]
      };
    }
    this.currentAnimation = this.animations.idle;
    this.frameIndex = 0;
    this.animationDelay = 6;
    this.animationCounter = 0;
    this.direction = 'idle';

    this.speed = 5;
    this.radius = 20;
    this.health = 100;
    this.maxHealth = 100;
    this.fireRate = 10;
    this.fireCooldown = 0;
    this.exp = 0;
    this.level = 1;
    this.expToNextLevel = 100;
    this.defense = 1;
    this.criticalChance = 0;
    this.healthRegen = 0;
    this.expBonus = 0;
    this.armorPenetration = 0;
    this.characterType = type || "gunner";
    this.bulletType = "shotgun";
    this.passiveSkills = [];
    this.shotgunLevel = 0;
    this.unlockedUpgrades = new Set();
    this.isWebbed = false;
    this.webDuration = 0;
    this.bulletTypes = new Set(this.bulletTypes || []);
    this.hitFlashTimer = 0;
    this.xp = 0;
    this.attackPower = this.characterType === "gunner" ? 10 : 8;
    this.attackDamage = this.characterType === "gunner" ? 10 : 8;
    this.attackSpeed = this.characterType === "gunner" ? 500 : 300;
    this.moveSpeed = this.characterType === "gunner" ? 3 : 4;
    this.critRate = this.characterType === "gunner" ? 0 : 0.1;
    this.critDamage = this.characterType === "gunner" ? 1.5 : 2;
    this.dodgeRate = this.characterType === "gunner" ? 0 : 0.05;
    this.lifesteal = 0;
    this.thorns = 0;
    this.lastDamageTime = 0;


    // 对于Knight类型的player
    this.isAttacking = false;
    this.attackAngle = 60; // 攻击角度
    this.attackRange = 50; // 攻击距离
    this.attackDuration = 8; // 攻击持续时间
    this.attackCooldown = 30; // 攻击冷却时间
    this.currentAttackCooldown = 0;

    // 对于Archer类型的player
    this.arrowDamage = 20; // 基础伤害
    this.arrowSpeed = 12; // 箭矢速度
    this.arrowSize = 12; // 箭矢尺寸
    this.isCharging = false; // 蓄力状态
    this.chargeStartTime = 0; // 蓄力开始时间
    this.maxChargeTime = 60; // 最大蓄力时间
    this.currentChaerge = 0;
    this.chargePower = 0; // 当前蓄力值
    this.arrowCooldown = 15; // 射击冷却时间
    this.currentArrowCooldown = 0; // 当前冷却计时
    this.arrows = []; // 存储箭矢
    this.chargeBarScale = 0.7;

    // 添加宠物相关属性
    this.invincible = false; // 无敌状态(用于防御型宠物)
    this.invincibleFlash = 0; // 无敌闪烁效果
    this.needsPetSelection = false;
    this.pet = null;
  }

  takeDamage(amount) {
    if (this.invincible) return; // 无敌时免疫伤害
    let actual = amount * (1 - this.defense * 0.1);
    this.health -= actual;
    this.hitFlashTimer = 10;
    showFloatingText(
      "-" + Math.floor(actual),
      this.pos.x,
      this.pos.y - 20,
      color(255, 0, 0)
    );
  }

  resolveCollision() {
    if (!this.vel) {
      this.vel = createVector(0, 0);
    }

    for (let obs of obstacles) {
      if (obs.collidesWith(this.pos, this.ImageWidth, this.ImageHeight)) {
        // 计算 X 方向的可能移动位置
        let xOnly = createVector(this.pos.x - this.vel.x, this.pos.y);
        let yOnly = createVector(this.pos.x, this.pos.y - this.vel.y);

        // 优先尝试 X 方向移动
        if (!obs.collidesWith(xOnly, this.ImageWidth, this.ImageHeight)) {
          this.pos = xOnly;
        }
        // 否则尝试 Y 方向移动
        else if (!obs.collidesWith(yOnly, this.ImageWidth, this.ImageHeight)) {
          this.pos = yOnly;
        }
        // 如果两个方向都碰撞，完全阻止移动
        else {
          this.pos.sub(this.vel);
        }
      }
    }
  }

  gainExp(amount) {
    // 如果处于第5波（Boss波），停止记录经验
    if (wave === 5) return;

    showFloatingText(
      `+${Math.floor(amount)} EXP`,
      this.pos.x,
      this.pos.y - 30,
      color(100, 255, 100)
    );
    this.exp += amount;
    while (this.exp >= this.expToNextLevel) {
      this.levelUp();
    }
  }

  levelUp() {

    this.level++;
    this.exp -= this.expToNextLevel;
    this.expToNextLevel = Math.floor(this.expToNextLevel * 1.5);
    this.health += 20;
    this.fireRate += 1;
    this.speed += 0.5;

    if (this.needsPetSelection) {
      this.needsPetSelection = false;
      gameState = "petSelection";
    } else {
      generateUpgradeOptions();
      choosingUpgrade = true;
      gameState = "upgrading";
    }
  }

  applyUpgrade(upgrade) {
    if (upgrade.oneTime) {
      this.unlockedUpgrades.add(upgrade.value);
    }
    switch (upgrade.type) {
      case "health":
        this.maxHealth += upgrade.value;
        this.health += upgrade.value;
        break;
      case "speed":
        this.speed += upgrade.value;
        break;
      case "fireRate":
        this.fireRate += upgrade.value;
        break;
      case "defense":
        this.defense += upgrade.value;
        break;
      case "healthRegen":
        this.healthRegen += upgrade.value;
        break;
      case "criticalChance":
        this.criticalChance += upgrade.value;
        break;
      case "expBonus":
        this.expBonus += upgrade.value;
        break;
      case "armorPen":
        this.armorPenetration += upgrade.value;
        break;
      case "bulletType":
        this.bulletTypes.add(upgrade.value);
        if (upgrade.value === "shotgun") {
          if (this.bulletType === "shotgun") {
            this.shotgunLevel++;
          } else {
            this.bulletType = "shotgun";
            this.shotgunLevel = 0;
          }
        } else {
          let prev = this.shotgunLevel;
          this.bulletType = upgrade.value;
          this.shotgunLevel = prev;
        }
        break;
      case "passive":
        this.passiveSkills.push(upgrade.value);
        break;
    }
    choosingUpgrade = false;
  }

  move() {
    let moving = false;
    if (this.isWebbed) {
      this.webDuration--;
      if (this.webDuration <= 0) this.isWebbed = false;
      return;
    }
    let moveVec = createVector(0, 0);
    if (keyIsDown(87)) { // W 上
      this.y -= this.speed;
      this.currentAnimation = this.animations.up;
      this.direction = 'up';
      moving = true;
      moveVec.y -= 1;

    } else if (keyIsDown(83)) { // S 下
      this.y += this.speed;
      this.currentAnimation = this.animations.down;
      this.direction = 'down';
      moving = true;
      moveVec.y += 1;
    }

    if (keyIsDown(65)) { // A 左
      this.x -= this.speed;
      this.currentAnimation = this.animations.left;
      this.direction = 'left';
      moving = true;
      moveVec.x -= 1;

    } else if (keyIsDown(68)) { // D 右
      this.x += this.speed;
      this.currentAnimation = this.animations.right;
      this.direction = 'right';
      moving = true;
      moveVec.x += 1;
    }
    if (!moving) {
      this.currentAnimation = this.animations.idle;
      this.direction = 'idle';
    }

    this.animate();

    if (moveVec.mag() > 0) {
      moveVec.setMag(this.speed);
      this.vel = moveVec.copy();
      let newPos = p5.Vector.add(this.pos, moveVec);
      let canMove = true;
      for (let obs of obstacles) {
        if (obs.collidesWith(newPos, this.ImageWidth, this.ImageHeight)) {
          let xOnly = createVector(newPos.x, this.pos.y);
          let yOnly = createVector(this.pos.x, newPos.y);

          if (!obs.collidesWith(xOnly, this.ImageWidth, this.ImageHeight)) {
            newPos = xOnly; // 只在 X 方向移动
          } else if (!obs.collidesWith(yOnly, this.ImageWidth, this.ImageHeight)) {
            newPos = yOnly; // 只在 Y 方向移动
          } else {
            canMove = false; // 两个方向都被阻挡，不能移动
          }
          break;
        }
      }
      if (canMove) {
        this.pos = newPos;
        this.pos.x = constrain(this.pos.x, 0, width);
        this.pos.y = constrain(this.pos.y, 0, height);
      }
    }
    this.resolveCollision();
  }

  animate() {
    this.animationCounter++;
    if (this.animationCounter >= this.animationDelay) {
      this.animationCounter = 0;
      this.frameIndex = (this.frameIndex + 1) % this.currentAnimation.length;
    }
  }

  // 修改子弹发射逻辑
  shoot() {
    if (mouseIsPressed && this.fireCooldown <= 0) {
      if (this.characterType === "gunner") {
        
        let angle = atan2(mouseY - player.pos.y, mouseX - player.pos.x);
        if (angle < 0) {
          angle += TWO_PI;
        }
        let state;
        if (angle> 0.25 * PI && angle < 0.75 * PI){
          state = "Up";
        } else if (angle> 0.75 * PI && angle < 1.25 * PI) {
          state = "Left";
        } else if (angle> 1.25 * PI && angle < 1.75 * PI) {
          state = "Down";
        } else if (angle > 1.75 * PI || angle < 0.25 * PI) {
          state = "Right";
        }
        // 计算角色中心
        let centerX;
        let centerY;
        if(state === "Up" || state === "Down") {
          centerX = this.pos.x;
          centerY = this.pos.y - 20;
        } else if (state === "Left" || state === "Right") {
          centerX = this.pos.x - 20;
          centerY = this.pos.y;
        }

        // 计算朝向
        let direction = p5.Vector.sub(
          createVector(mouseX, mouseY),
          createVector(centerX, centerY)
        ).normalize();

        // 子弹从中心发射
        let bulletStart = createVector(centerX, centerY);
        
        switch (this.bulletType) {
          case "bounce":
            bullets.push(new Bullet(
              bulletStart.x, bulletStart.y,
              p5.Vector.mult(direction, 10),
              "bounce", GunnerBulletAnimationUp, GunnerBulletAnimationDown, GunnerBulletAnimationLeft, GunnerBulletAnimationRight, 34.75, 100, 113.5, 30, state
            ));
            break;
          case "shotgun":
            let count = this.shotgunLevel + 1;
            let totalWidth = (count - 1) * 15;
            let startOffset = -totalWidth / 2;
            for (let i = 0; i < count; i++) {
              let perp = createVector(-direction.y, direction.x);
              let offset = startOffset + i * 15;
              let bulletPos = p5.Vector.add(
                bulletStart,
                p5.Vector.mult(perp, offset)
              );
              bullets.push(new Bullet(
                bulletPos.x, bulletPos.y,
                p5.Vector.mult(direction, 10),
                "normal", GunnerBulletAnimationUp, GunnerBulletAnimationDown, GunnerBulletAnimationLeft, GunnerBulletAnimationRight, 34.75, 100, 113.5, 30, state
              ));
            }
            break;
          case "pierce":
            bullets.push(new Bullet(
              bulletStart.x, bulletStart.y,
              p5.Vector.mult(direction, 10),
              "pierce", GunnerBulletAnimationUp, GunnerBulletAnimationDown, GunnerBulletAnimationLeft, GunnerBulletAnimationRight, 34.75, 80, 113.5, 30, state
            ));
            break;
          default:
            bullets.push(new Bullet(
              bulletStart.x, bulletStart.y,
              p5.Vector.mult(direction, 10),
              "normal", GunnerBulletAnimationUp, GunnerBulletAnimationDown, GunnerBulletAnimationLeft, GunnerBulletAnimationRight, 34.75, 100, 113.5, 30, state
            ));
            break;
        }
      } else if (this.characterType === "knight" && !this.isAttacking) {
        console.log("C");
        this.isAttacking = true;
        this.currentAttackCooldown = this.attackCooldown;

        // 计算攻击方向（朝向鼠标）
        let center = createVector(
          this.pos.x + this.ImageWidth / 2,
          this.pos.y + this.ImageHeight / 2
        );
        this.attackDirection = p5.Vector.sub(createVector(mouseX, mouseY), center).normalize();

        // 立即检测攻击范围内的敌人
        this.detectAttack();
      }
      this.fireCooldown = 60 / this.fireRate;
    }
    if (this.fireCooldown > 0) {
      this.fireCooldown--;
    }
    if (this.attackCooldown > 0) {
      this.attackCooldown--;
    }
  }

  detectAttack() {
    let center = createVector(
      this.pos.x + this.ImageWidth / 2,
      this.pos.y + this.ImageHeight / 2
    );

    for (let i = enemies.length - 1; i >= 0; i--) {
      let enemy = enemies[i];
      let enemyPos = enemy.pos.copy().add(enemy.size / 2, enemy.size / 2);
      let toEnemy = p5.Vector.sub(enemyPos, center);
      let distance = toEnemy.mag();

      if (distance <= this.attackRange) {  // 先检测距离
        let angleBetween = degrees(this.attackDirection.angleBetween(toEnemy));
        if (abs(angleBetween) <= this.attackAngle / 2) {  // 再检测角度
          let isCrit = random() < this.critRate;
          let damage = isCrit ? this.attackDamage * this.critDamage : this.attackDamage;

          let killed = enemy.hit(damage);  // 计算伤害
          if (killed) {
            enemies.splice(i, 1);  // 确保从数组中移除
            if (enemy instanceof Boss) {
              bossDefeated++;
              bossDefeatedCount++;
            }
            normalEnemiesDefeated++;
            player.gainExp(enemy.expValue);
          }

          // 生命偷取效果
          if (this.lifesteal > 0) {
            this.health = min(this.maxHealth, this.health + damage * this.lifesteal);
          }
        }
      }
    }
  }

  update() {
    player.pos.x = constrain(player.pos.x, 0, width - player.ImageWidth);
    player.pos.y = constrain(player.pos.y, 0, height - player.ImageHeight);

    if (this.isAttacking) {
      if (this.attackDuration-- <= 0) {
        this.isAttacking = false;
        this.attackDuration = 8; // 重置持续时间
      }
    }

    if (this.currentAttackCooldown > 0) {
      this.currentAttackCooldown--;
    }

    // 更新arrrow冷却时间
    if (this.currentArrowCooldown > 0) {
      this.currentArrowCooldown--;
    }

    // 更新箭矢
    this.updateArrows();

    // 更新宠物
    if (this.pet) {
      this.pet.update(this);
    }
  }

  display() {
    if (this.direction === "up") {
      let frameX = this.currentAnimation[this.frameIndex] % (this.actionImgUp.width / this.chWidthUp) * this.chWidthUp;
      let frameY = Math.floor(this.currentAnimation[this.frameIndex] / (this.actionImgUp.width / this.chWidthUp)) * this.chHeightUp;
      push();
      image(this.actionImgUp, this.pos.x, this.pos.y, this.ImageWidth, this.ImageHeight, frameX, frameY, this.chWidthUp, this.chHeightUp);
      pop();
    } else if (this.direction === "down") {
      let frameX = this.currentAnimation[this.frameIndex] % (this.actionImgDown.width / this.chWidthDown) * this.chWidthDown;
      let frameY = Math.floor(this.currentAnimation[this.frameIndex] / (this.actionImgDown.width / this.chWidthDown)) * this.chHeightDown;
      push();
      image(this.actionImgDown, this.pos.x, this.pos.y, this.ImageWidth, this.ImageHeight, frameX, frameY, this.chWidthDown, this.chHeightDown);
      pop();
    } else if (this.direction === "left") {
      let frameX = this.currentAnimation[this.frameIndex] % (this.actionImgLeft.width / this.chWidthLeft) * this.chWidthLeft;
      let frameY = Math.floor(this.currentAnimation[this.frameIndex] / (this.actionImgLeft.width / this.chWidth)) * this.chHeightLeft;
      push();
      image(this.actionImgLeft, this.pos.x, this.pos.y, this.ImageWidth, this.ImageHeight, frameX, frameY, this.chWidthLeft, this.chHeightLeft);
      pop();
    } else if (this.direction === "right") {
      let frameX = this.currentAnimation[this.frameIndex] % (this.actionImgRight.width / this.chWidthRight) * this.chWidthRight;
      let frameY = Math.floor(this.currentAnimation[this.frameIndex] / (this.actionImgRight.width / this.chWidthRight)) * this.chHeightRight;
      push();
      image(this.actionImgRight, this.pos.x, this.pos.y, this.ImageWidth, this.ImageHeight, frameX, frameY, this.chWidthRight, this.chHeightRight);
      pop();
    } else if (this.direction === "idle") {
      let frameX = this.currentAnimation[this.frameIndex] % (this.actionImgIntro.width / this.chWidthIntro) * this.chWidthIntro;
      let frameY = Math.floor(this.currentAnimation[this.frameIndex] / (this.actionImgIntro.width / this.chWidthIntro)) * this.chHeightIntro;
      push();
      image(this.actionImgIntro, this.pos.x, this.pos.y, this.ImageWidth, this.ImageHeight, frameX, frameY, this.chWidthIntro, this.chHeightIntro);
      pop();
    }

    // 攻击范围可视化
    if (this.characterType === "knight" && this.isAttacking) {
      this.drawAttackArea();
    }

    if (this.characterType === "archer") {
      // 显示箭矢
      this.arrows.forEach(arrow => arrow.display());

      // 显示蓄力条
      if (this.isCharging) {
        this.calculateCharge();
        this.drawChargeBar();
      }
    }

    // 显示宠物
    if (this.pet) {
      this.pet.display();
    }
  }

  // 绘制攻击范围
  drawAttackArea() {
    let center = createVector(
      this.pos.x + this.ImageWidth / 2,
      this.pos.y + this.ImageHeight / 2
    );

    push();
    translate(center.x, center.y);
    rotate(this.attackDirection.heading());

    // 绘制攻击扇形
    noFill();
    stroke(255, 200, 0, 150);
    strokeWeight(2);
    arc(0, 0,
      this.attackRange * 2,
      this.attackRange * 2,
      -radians(this.attackAngle / 2),
      radians(this.attackAngle / 2)
    );

    // 绘制攻击方向线
    stroke(255, 100, 0, 200);
    line(0, 0, this.attackRange, 0);

    pop();
  }

  // Archer相关函数
  startCharge() {
    if (this.currentArrowCooldown <= 0 && !this.isCharging) {
      this.isCharging = true;
      this.chargeStartTime = frameCount;
      this.currentCharge = 0;
    }
  }

  calculateCharge() {
    if (this.isCharging) {
      const chargeFrames = frameCount - this.chargeStartTime;
      this.currentCharge = Math.min(chargeFrames / this.maxChargeTime, 1);
      this.chargePower = this.currentCharge; // 更新蓄力值

      // 动态调整缩放系数
      this.chargeBarScale = 0.6 + this.chargePower * 0.4;

      return {
        damage: lerp(this.arrowDamage, this.arrowDamage * 3, pow(this.chargePower, 2)),
        speed: lerp(this.arrowSpeed, this.arrowSpeed * 2, this.chargePower),
        size: lerp(this.arrowSize, this.arrowSize * 1.5, this.chargePower)
      };
    }
    return {
      damage: this.arrowDamage,
      speed: this.arrowSpeed,
      size: this.arrowSize
    };
  }

  releaseArrow() {
    if (!this.isCharging) return;

    // 计算参数
    const chargeParams = this.calculateCharge();
    const center = createVector(
      this.pos.x + this.ImageWidth / 2,
      this.pos.y + this.ImageHeight / 2
    );

    // 计算方向（朝向鼠标）
    const target = createVector(mouseX, mouseY);
    const direction = p5.Vector.sub(target, center).normalize();

    // 创建箭矢
    this.arrows.push(new Arrow(
      center.x, center.y,
      direction,
      chargeParams.speed,
      chargeParams.damage,
      chargeParams.size
    ));

    // 重置状态
    this.isCharging = false;
    this.currentCharge = 0;
    this.currentArrowCooldown = this.arrowCooldown;
  }

  updateArrows() {
    for (let i = this.arrows.length - 1; i >= 0; i--) {
      let arrow = this.arrows[i];
      // 添加速度衰减模拟空气阻力
      arrow.vel.mult(0.99);

      // 更新位置
      arrow.pos.add(arrow.vel);

      // 边界检测
      if (arrow.pos.x < -50 || arrow.pos.x > width + 50 ||
        arrow.pos.y < -50 || arrow.pos.y > height + 50) {
        arrow.isActive = false;
      }

      // 精确碰撞检测
      for (let j = enemies.length - 1; j >= 0; j--) {
        let enemy = enemies[j];
        let enemyCenter = createVector(
          enemy.pos.x + enemy.enWidth * 0.5,
          enemy.pos.y + enemy.enHeight * 0.5
        );

        // 使用矢量距离计算
        let distVec = p5.Vector.sub(arrow.pos, enemyCenter);
        if (distVec.mag() < enemy.enHeight * 1.0) { // 增加碰撞范围
          let isCrit = random() < this.critRate;
          let finalDamage = isCrit ?
            arrow.damage * this.critDamage :
            arrow.damage;
          let killed = enemy.hit(finalDamage);
          if (killed) {
            enemies.splice(j, 1);
            if (enemy instanceof Boss) {
              bossDefeated++;
              bossDefeatedCount++;
            }
            normalEnemiesDefeated++;
            this.gainExp(enemy.expValue);
          }

          // 生命偷取
          if (this.lifesteal > 0) {
            this.health = Math.min(
              this.maxHealth,
              this.health + finalDamage * this.lifesteal
            );
          }

          arrow.isActive = false;
          break;
        }
      }

      if (!arrow.isActive) {
        this.arrows.splice(i, 1);
      }
    }
  }

  // 绘制蓄力条
  drawChargeBar() {
    const baseBarWidth = 80 * this.chargeBarScale; // 基准宽度
    const barHeight = 8 * this.chargeBarScale; // 动态高度
    const posX = this.pos.x + this.ImageWidth / 2 - baseBarWidth / 2;
    const posY = this.pos.y - 30;

    // 动态背景框（随蓄力进度缩放）
    fill(50, 150);
    rect(posX, posY,
      baseBarWidth * (0.5 + this.currentCharge * 0.5), // 宽度动态变化
      barHeight,
      3 * this.chargeBarScale);

    // 蓄力进度（添加动画效果）
    const animatedPower = this.currentCharge * (1 + sin(frameCount * 0.2) * 0.1);
    fill(
      lerpColor(
        color(255, 100, 100),
        color(50, 255, 100),
        this.currentCharge
      )
    );
    rect(posX, posY,
      baseBarWidth * animatedPower,
      barHeight,
      3 * this.chargeBarScale);

    // 动态文字提示
    fill(255);
    textSize(10 * this.chargeBarScale);
    textAlign(CENTER);
    text(
      `${Math.round(this.currentCharge * 100)}%`,
      this.pos.x + this.ImageWidth / 2,
      posY - 8 * this.chargeBarScale
    );
  }
}