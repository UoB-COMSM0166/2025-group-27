// ===== Player 类 =====
class Player {
  constructor(actionImgUp, actionImgDown, actionImgLeft, actionImgRight, actionImgIntro, AttackImageUp, AttackImageDown, AttackImageLeft, AttackImageRight, chWidthUp, chHeightUp, chWidthDown, chHeightDown, chWidthLeft, chHeightLeft, chWidthRight, chHeightRight, chWidthIntro, chHeightIntro, attackWidthUp, attackHeightUp, attackWidthDown, attackHeightDown, attackWidthLeft, attackHeightLeft, attackWidthRight, attackHeightRight, type) {
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

    this.ImageWidth = 35; //**角色大小
    this.ImageHeight = 60; //**角色大小
    this.aImageWidth = 70; //**角色大小（攻击时
    this.aImageHeight = 70; //**角色大小（攻击时
    this.aaImageWidth = 100; //**角色大小（攻击时 左右
    this.aaImageHeight = 90; //**角色大小（攻击时 左右
    this.x = width / 2;
    this.y = height / 2;
    this.pos = createVector(this.x, this.y);
    this.vel = createVector(0, 0);
    if (type == "archer") {
      this.animations = {
        idle: [0, 1, 2, 3],
        up: [0, 1, 2, 3],
        down: [0, 1, 2, 3],
        left: [0, 1, 2, 3],
        right: [0, 1, 2, 3]
      };
    } else if (type == "knight") {
      this.attackImgUp = AttackImageUp;
      this.attackImgDown = AttackImageDown;
      this.attackImgLeft = AttackImageLeft;
      this.attackImgRight = AttackImageRight;

      this.attackWidthUp = attackWidthUp;
      this.attackHeightUp = attackHeightUp;
      this.attackWidthDown = attackWidthDown;
      this.attackHeightDown = attackHeightDown;
      this.attackWidthLeft = attackWidthLeft;
      this.attackHeightLeft = attackHeightLeft;
      this.attackWidthRight = attackWidthRight;
      this.attackHeightRight = attackHeightRight;
      this.animations = {
        idle: [0, 1, 2],
        up: [0, 1, 2, 3],
        down: [0, 1, 2, 3],
        left: [0, 1, 2, 3],
        right: [0, 1, 2, 3],
        attackup: [0, 1, 2, 3, 4],
        attackdown: [0, 1, 2, 3, 4],
        attackleft: [0, 1, 2, 3, 4],
        attackright: [0, 1, 2, 3, 4]
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
    this.attackAngle = 90; // 攻击角度
    this.attackRange = 80; // 攻击距离
    this.attackDuration = 8; // 攻击持续时间
    this.attackCooldown = 30; // 攻击冷却时间
    this.currentAttackCooldown = 0;
    this.attackFrames = 5; // 总攻击帧数
    this.currentAttackFrame = 0; // 当前攻击帧
    this.attackAnimationSpeed = 3; // 每3帧切换一次
    this.knightType = "normal";
    this.reborn = false;
    this.spinningSlash = false;
    this.dash = false;

    this.dashing = false; // 疾走状态
    this.dashDuration = 0; // 疾走剩余时间
    this.dashCooldown = 0; // 疾走冷却
    this.dashSpeedMultiplier = 1.8; // 疾走速度倍率
    this.canAttack = true; // 能否攻击
    
    this.spinningSlashCooldown = 0; // 旋风劈冷却
    this.spinningSlashRange = 80; // 旋风劈范围
    
    this.rebornUsed = false; // 是否使用过复活
    this.giantMode = false; // 巨人模式
    this.berserkerMode = false; // 狂战士模式

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

    // Archer 相关升级属性
    this.arrowPierce = false; // 箭矢是否穿透
    this.arrowSplit = false; // 箭矢是否散射
    this.doubleShot = false; // 是否双发
    this.lifesteal = 0; // 攻击回血比例
    this.autoCharge = false; //自动蓄力

    // 添加宠物相关属性
    this.invincible = false; // 无敌状态(用于防御型宠物)
    this.invincibleFlash = 0; // 无敌闪烁效果
    this.needsPetSelection = false;
    this.pet = null;
  }

  takeDamage(amount) {
    if(this.reborn){
    if (this.health > 10 && (this.health - amount) <= 10 && !this.rebornUsed) {
      this.health = 100; // 复活并恢复100生命
      this.rebornUsed = true;
      showFloatingText("Reborn!", this.pos.x, this.pos.y - 20, color(255, 215, 0));
      return;
    }
  }
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
      // Archer 相关升级
      case "arrowPierce":
        this.arrowPierce = true;
        break;
      case "arrowSplit":
        this.arrowSplit = true;
        break;
      case "doubleShot":
        this.doubleShot = true;
        break;
      case "lifesteal":
        this.lifesteal = 0.1; // 攻击回血比例
        break;
      case "autoCharge":
        this.autoCharge = true;
        break;
      // knight 相关升级
      case "healthBoostAndLifeSteal":
        this.knightType = "giant";
        this.lifesteal = 0.2;
        this.maxHealth = 300;
        break;
      case "berserker":
        this.knightType = "berserker";
        this.berserkerMode = true;
        this.critRate = 0.5;
        this.critDamage = 2.0;
        break;
      case "reborn":
        this.reborn = true;
        break;
      case "fastWalk":
        this.dash = true;
        break;
      case "spinningSlash":
        this.spinningSlash = true;
        break;
      case "attackRange":
        this.attackRange += 5;
        break;
      case "attackAngle":
        this.attackAngle += 5;
        break;
    }
    choosingUpgrade = false;
  }

  performSpinningSlash() {
    if (this.spinningSlashCooldown <= 0 && this.canAttack) {
      this.spinningSlashCooldown = 600; // 10秒冷却
      enemies.forEach(enemy => {
        const d = dist(this.pos.x, this.pos.y, enemy.pos.x, enemy.pos.y);
        if (d < this.spinningSlashRange) {
          const isCrit = random() < this.critRate;
          const damage = isCrit ? 
            this.attackDamage * this.critDamage : 
            this.attackDamage;
            let killed = enemy.hit(damage);  // 计算伤害
            if (killed) {
              enemy.startDeathEffect();
              if (enemy instanceof Boss) {
                bossDefeated++;
                bossDefeatedCount++;
              }
              normalEnemiesDefeated++;
              if(enemy.gainExp == false) {
                player.gainExp(enemy.expValue);
                enemy.gainExp = true;
              }
              
              if(enemy.dead){
                enemies.splice(i, 1);
              }
            }
  
            // 生命偷取效果
            if (this.lifesteal > 0) {
              this.health = min(this.maxHealth, this.health + damage * this.lifesteal);
            }
        }
      });
    }
  }

  move() {
    if(this.characterType == "knight" && this.dash){
  if (this.dashCooldown <= 0 && keyIsDown(16)) { // 16 是 Shift 键的键码
    this.dashing = true;
    this.dashDuration = 90; // 疾走持续 30 帧（0.5 秒）
    this.dashCooldown = 180; // 疾走冷却 3 秒（60 帧/秒）
    this.canAttack = false; // 疾走期间不能攻击
  }

  let currentSpeed = this.speed;
  if (this.dashing) {
    currentSpeed *= this.dashSpeedMultiplier; // 疾走时速度提升
    this.dashDuration--;
    if (this.dashDuration <= 0) {
      this.dashing = false;
      this.canAttack = true; // 疾走结束后恢复攻击能力
    }
  }

  let moving = false;
  if (this.isWebbed) {
    this.webDuration--;
    if (this.webDuration <= 0) this.isWebbed = false;
    return;
  }

  let moveVec = createVector(0, 0);

  let dx = mouseX - this.pos.x;
  let dy = this.pos.y - mouseY; // 反转 Y 轴方向
  let angle = atan2(dy, dx);
  if (angle < 0) angle += TWO_PI;

  // ++++ 使用 currentSpeed 替代 this.speed ++++
  if (keyIsDown(87)) { // W 上
    this.y -= currentSpeed;
    this.currentAnimation = this.animations.up;
    this.direction = 'up';
    moving = true;
    moveVec.y -= 1;
    if (mouseIsPressed && this.characterType != "knight") {
      if (angle >= PI / 4 && angle < 3 * PI / 4) {       // 45°~135° → 上
        this.currentAnimation = this.animations.up;
        this.direction = "up";
      }
      else if (angle >= 3 * PI / 4 && angle < 5 * PI / 4) { // 135°~225° → 左
        this.currentAnimation = this.animations.left;
        this.direction = "left";
      }
      else if (angle >= 5 * PI / 4 && angle < 7 * PI / 4) { // 225°~315° → 下
        this.currentAnimation = this.animations.down;
        this.direction = "down";
      }
      else {                                       // 315°~45° → 右
        this.currentAnimation = this.animations.right;
        this.direction = "right";
      }
    }
  } else if (keyIsDown(83)) { // S 下
    this.y += currentSpeed;
    this.currentAnimation = this.animations.down;
    this.direction = 'down';
    moving = true;
    moveVec.y += 1;
    if (mouseIsPressed && this.characterType != "knight") {
      if (angle >= PI / 4 && angle < 3 * PI / 4) {       // 45°~135° → 上
        this.currentAnimation = this.animations.up;
        this.direction = "up";
      }
      else if (angle >= 3 * PI / 4 && angle < 5 * PI / 4) { // 135°~225° → 左
        this.currentAnimation = this.animations.left;
        this.direction = "left";
      }
      else if (angle >= 5 * PI / 4 && angle < 7 * PI / 4) { // 225°~315° → 下
        this.currentAnimation = this.animations.down;
        this.direction = "down";
      }
      else {                                       // 315°~45° → 右
        this.currentAnimation = this.animations.right;
        this.direction = "right";
      }
    }
  }

  if (keyIsDown(65)) { // A 左
    this.x -= currentSpeed;
    this.currentAnimation = this.animations.left;
    this.direction = 'left';
    moving = true;
    moveVec.x -= 1;
    if (mouseIsPressed && this.characterType != "knight") {
      if (angle >= PI / 4 && angle < 3 * PI / 4) {       // 45°~135° → 上
        this.currentAnimation = this.animations.up;
        this.direction = "up";
      }
      else if (angle >= 3 * PI / 4 && angle < 5 * PI / 4) { // 135°~225° → 左
        this.currentAnimation = this.animations.left;
        this.direction = "left";
      }
      else if (angle >= 5 * PI / 4 && angle < 7 * PI / 4) { // 225°~315° → 下
        this.currentAnimation = this.animations.down;
        this.direction = "down";
      }
      else {                                       // 315°~45° → 右
        this.currentAnimation = this.animations.right;
        this.direction = "right";
      }
    }
  } else if (keyIsDown(68)) { // D 右
    this.x += currentSpeed;
    this.currentAnimation = this.animations.right;
    this.direction = 'right';
    moving = true;
    moveVec.x += 1;
    if (mouseIsPressed && this.characterType != "knight") {
      if (angle >= PI / 4 && angle < 3 * PI / 4) {       // 45°~135° → 上
        this.currentAnimation = this.animations.up;
        this.direction = "up";
      }
      else if (angle >= 3 * PI / 4 && angle < 5 * PI / 4) { // 135°~225° → 左
        this.currentAnimation = this.animations.left;
        this.direction = "left";
      }
      else if (angle >= 5 * PI / 4 && angle < 7 * PI / 4) { // 225°~315° → 下
        this.currentAnimation = this.animations.down;
        this.direction = "down";
      }
      else {                                       // 315°~45° → 右
        this.currentAnimation = this.animations.right;
        this.direction = "right";
      }
    }
  }

  if (!moving && !this.isAttacking) {
    this.currentAnimation = this.animations.idle;
    this.direction = 'idle';
  }

  if (this.characterType === "knight" && mouseIsPressed) {
    let dx = mouseX - this.pos.x;
    let dy = this.pos.y - mouseY; // 反转 Y 轴方向
    let angle = atan2(dy, dx);

    // 角度规范化到 0~2π
    if (angle < 0) angle += TWO_PI;
    console.log("angle: " + angle);
    // 使用新的角度区间判断
    if (angle >= PI / 4 && angle < 3 * PI / 4 && !this.dashing) {       // 45°~135° → 上
      this.currentAnimation = this.animations.attackup;
      this.direction = "attackup";
    }
    else if (angle >= 3 * PI / 4 && angle < 5 * PI / 4 && !this.dashing) { // 135°~225° → 左
      this.currentAnimation = this.animations.attackleft;
      this.direction = "attackleft";
    }
    else if (angle >= 5 * PI / 4 && angle < 7 * PI / 4 && !this.dashing) { // 225°~315° → 下
      this.currentAnimation = this.animations.attackdown;
      this.direction = "attackdown";
    }
    else {
      if(!this.dashing){                                     // 315°~45° → 右
      this.currentAnimation = this.animations.attackright;
      this.direction = "attackright";
      }
    }
  }

  this.animate();

  if (moveVec.mag() > 0) {
    moveVec.setMag(currentSpeed); // 使用 currentSpeed
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
  
    } else {
    let moving = false;
    if (this.isWebbed) {
      this.webDuration--;
      if (this.webDuration <= 0) this.isWebbed = false;
      return;
    }
    let moveVec = createVector(0, 0);

    let dx = mouseX - this.pos.x;
    let dy = this.pos.y - mouseY; // 反转Y轴方向
    let angle = atan2(dy, dx);
    if (angle < 0) angle += TWO_PI;

    if (keyIsDown(87)) { // W 上
      this.y -= this.speed;
      this.currentAnimation = this.animations.up;
      this.direction = 'up';
      moving = true;
      moveVec.y -= 1;
      if (mouseIsPressed && this.characterType != "knight") {
        if (angle >= PI / 4 && angle < 3 * PI / 4) {       // 45°~135° → 上
          this.currentAnimation = this.animations.up;
          this.direction = "up";
        }
        else if (angle >= 3 * PI / 4 && angle < 5 * PI / 4) { // 135°~225° → 左
          this.currentAnimation = this.animations.left;
          this.direction = "left";
        }
        else if (angle >= 5 * PI / 4 && angle < 7 * PI / 4) { // 225°~315° → 下
          this.currentAnimation = this.animations.down;
          this.direction = "down";
        }
        else {                                       // 315°~45° → 右
          this.currentAnimation = this.animations.right;
          this.direction = "right";
        }
      }
    } else if (keyIsDown(83)) { // S 下
      this.y += this.speed;
      this.currentAnimation = this.animations.down;
      this.direction = 'down';
      moving = true;
      moveVec.y += 1;
      if (mouseIsPressed && this.characterType != "knight") {
        if (angle >= PI / 4 && angle < 3 * PI / 4) {       // 45°~135° → 上
          this.currentAnimation = this.animations.up;
          this.direction = "up";
        }
        else if (angle >= 3 * PI / 4 && angle < 5 * PI / 4) { // 135°~225° → 左
          this.currentAnimation = this.animations.left;
          this.direction = "left";
        }
        else if (angle >= 5 * PI / 4 && angle < 7 * PI / 4) { // 225°~315° → 下
          this.currentAnimation = this.animations.down;
          this.direction = "down";
        }
        else {                                       // 315°~45° → 右
          this.currentAnimation = this.animations.right;
          this.direction = "right";
        }
      }
    }

    if (keyIsDown(65)) { // A 左
      this.x -= this.speed;
      this.currentAnimation = this.animations.left;
      this.direction = 'left';
      moving = true;
      moveVec.x -= 1;
      if (mouseIsPressed && this.characterType != "knight") {
        if (angle >= PI / 4 && angle < 3 * PI / 4) {       // 45°~135° → 上
          this.currentAnimation = this.animations.up;
          this.direction = "up";
        }
        else if (angle >= 3 * PI / 4 && angle < 5 * PI / 4) { // 135°~225° → 左
          this.currentAnimation = this.animations.left;
          this.direction = "left";
        }
        else if (angle >= 5 * PI / 4 && angle < 7 * PI / 4) { // 225°~315° → 下
          this.currentAnimation = this.animations.down;
          this.direction = "down";
        }
        else {                                       // 315°~45° → 右
          this.currentAnimation = this.animations.right;
          this.direction = "right";
        }
      }

    } else if (keyIsDown(68)) { // D 右
      this.x += this.speed;
      this.currentAnimation = this.animations.right;
      this.direction = 'right';
      moving = true;
      moveVec.x += 1;
      if (mouseIsPressed && this.characterType != "knight") {
        if (angle >= PI / 4 && angle < 3 * PI / 4) {       // 45°~135° → 上
          this.currentAnimation = this.animations.up;
          this.direction = "up";
        }
        else if (angle >= 3 * PI / 4 && angle < 5 * PI / 4) { // 135°~225° → 左
          this.currentAnimation = this.animations.left;
          this.direction = "left";
        }
        else if (angle >= 5 * PI / 4 && angle < 7 * PI / 4) { // 225°~315° → 下
          this.currentAnimation = this.animations.down;
          this.direction = "down";
        }
        else {                                       // 315°~45° → 右
          this.currentAnimation = this.animations.right;
          this.direction = "right";
        }
      }
    }
    if (!moving && !this.isAttacking) {
      this.currentAnimation = this.animations.idle;
      this.direction = 'idle';
    }

    if (this.characterType === "knight" && mouseIsPressed) {
      let dx = mouseX - this.pos.x;
      let dy = this.pos.y - mouseY; // 反转Y轴方向
      let angle = atan2(dy, dx);

      // 角度规范化到0~2π
      if (angle < 0) angle += TWO_PI;
      console.log("angle: " + angle);
      // 使用新的角度区间判断
      if (angle >= PI / 4 && angle < 3 * PI / 4) {       // 45°~135° → 上
        this.currentAnimation = this.animations.attackup;
        this.direction = "attackup";
      }
      else if (angle >= 3 * PI / 4 && angle < 5 * PI / 4) { // 135°~225° → 左
        this.currentAnimation = this.animations.attackleft;
        this.direction = "attackleft";
      }
      else if (angle >= 5 * PI / 4 && angle < 7 * PI / 4) { // 225°~315° → 下
        this.currentAnimation = this.animations.attackdown;
        this.direction = "attackdown";
      }
      else {                                       // 315°~45° → 右
        this.currentAnimation = this.animations.attackright;
        this.direction = "attackright";
      }
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
  }

  animate() {
    this.animationCounter++;
    if (this.animationCounter >= this.animationDelay) {
      this.animationCounter = 0;
      this.frameIndex = (this.frameIndex + 1) % this.currentAnimation.length;
    }
  }

  animateAttack() {
    this.animationCounter++;
    if (this.animationCounter >= this.animationDelay) {
      this.animationCounter = 0;
      this.frameIndex = (this.frameIndex + 1) % this.currentAnimation.length;
      this.isAttacking = false;
    }
  }

  // 修改子弹发射逻辑
  shoot() {
    if(!mouseIsPressed && this.characterType == "archer" && this.autoCharge == true){
      this.startCharge();
      // 攻击回血
      if (this.unlockedUpgrades.has("lifesteal")) {
        this.health = min(this.health + this.attackDamage * 0.1, this.maxHealth);
      }
    }
    if(mouseIsPressed && this.characterType == "archer" && this.autoCharge == true){
      this.releaseArrow();
    }
    if (mouseIsPressed && this.fireCooldown <= 0) {
      if (this.characterType === "gunner") {
        let angle = atan2(mouseY - player.pos.y, mouseX - player.pos.x);
        if (angle < 0) {
          angle += TWO_PI;
        }
        let state;
        if (angle > 0.25 * PI && angle < 0.75 * PI) {
          state = "Up";
        } else if (angle > 0.75 * PI && angle < 1.25 * PI) {
          state = "Left";
        } else if (angle > 1.25 * PI && angle < 1.75 * PI) {
          state = "Down";
        } else if (angle > 1.75 * PI || angle < 0.25 * PI) {
          state = "Right";
        }
        // 计算角色中心
        let centerX;
        let centerY;
        if (state === "Up" || state === "Down") {
          centerX = this.pos.x;
          centerY = this.pos.y - 20;
        } else if (state === "Left" || state === "Right") {
          centerX = this.pos.x - 20;
          centerY = this.pos.y;
        }
        gunsound.play();
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
              "bounce", Bup, Bdown, Bleft, Bright, state
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
                "normal", Bup, Bdown, Bleft, Bright, state
              ));
            }
            break;
          case "pierce":
            bullets.push(new Bullet(
              bulletStart.x, bulletStart.y,
              p5.Vector.mult(direction, 10),
              "pierce", Bup, Bdown, Bleft, Bright, state
            ));
            break;
          default:
            bullets.push(new Bullet(
              bulletStart.x, bulletStart.y,
              p5.Vector.mult(direction, 10),
              "normal", Bup, Bdown, Bleft, Bright, state
            ));
            break;
        }
      } else if (this.characterType === "knight" && !this.isAttacking && this.dashing == false) {
        this.isAttacking = true;
        this.currentAttackFrame = 0;
        this.currentAttackCooldown = this.attackCooldown;

        // 计算攻击方向（朝向鼠标）
        let center = createVector(
          this.pos.x + this.ImageWidth / 2,
          this.pos.y + this.ImageHeight / 2
        );
        this.attackDirection = p5.Vector.sub(createVector(mouseX, mouseY), center).normalize();

        // 立即检测攻击范围内的敌人
        this.detectAttack();
      } else if (this.characterType === "archer" && !this.isCharging && this.autoCharge == false) {
        // 开始蓄力
        this.startCharge();
        // 攻击回血
        if (this.unlockedUpgrades.has("lifesteal")) {
          this.health = min(this.health + this.attackDamage * 0.1, this.maxHealth);
        }
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
    keyboardsound.play();
    let center = createVector(
      this.pos.x + this.ImageWidth / 2,
      this.pos.y + this.ImageHeight / 2
    );

    for (let i = enemies.length - 1; i >= 0; i--) {
      let enemy = enemies[i];
      if(enemy.attackDetect){
      let enemyPos = enemy.pos.copy();
      let toEnemy = p5.Vector.sub(enemyPos, center);
      let distance = toEnemy.mag();

      if (distance <= this.attackRange) {  // 先检测距离
        let angleBetween = degrees(this.attackDirection.angleBetween(toEnemy));
        if (abs(angleBetween) <= this.attackAngle / 2) {  // 再检测角度
          let isCrit = random() < this.critRate;
          let damage = isCrit ? this.attackDamage * this.critDamage : this.attackDamage;

          let killed = enemy.hit(damage);  // 计算伤害
          if (killed) {
            enemy.startDeathEffect();
            if (enemy instanceof Boss) {
              bossDefeated++;
              bossDefeatedCount++;
            }
            normalEnemiesDefeated++;
            if(enemy.gainExp == false) {
              this.gainExp(enemy.expValue);
              enemy.gainExp = true;
            }
            
            if(enemy.dead){
              enemies.splice(i, 1);
            }
          }

          // 生命偷取效果
          if (this.lifesteal > 0) {
            this.health = min(this.maxHealth, this.health + damage * this.lifesteal);
          }
        }
      }
    }
    }
  }

  update() {
    if (this.dashCooldown > 0) this.dashCooldown--;

    if (this.spinningSlashCooldown > 0) this.spinningSlashCooldown--;

    if (this.berserkerMode) {
      this.critRate = 0.5;
      this.critDamage = 2.0;
    }

    if (this.isAttacking) {
      if (frameCount % this.attackAnimationSpeed === 0) {
        if (this.currentAttackFrame < this.attackFrames - 1) {
          this.currentAttackFrame++;
        } else {
          this.isAttacking = false;
          this.currentAttackFrame = 0;
        }
      }
    }

    player.pos.x = constrain(player.pos.x, 0, width - player.ImageWidth);
    player.pos.y = constrain(player.pos.y, 0, height - player.ImageHeight);

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
    if (this.characterType === "knight") {
      if (this.isAttacking === false) {
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
      } else {
        if (this.characterType === "knight" && this.direction === "attackup") {
          let frameX = this.currentAnimation[this.frameIndex] % (this.attackImgUp.width / this.attackWidthUp) * this.attackWidthUp;
          let frameY = Math.floor(this.currentAnimation[this.frameIndex] / (this.attackImgUp.width / this.attackWidthUp)) * this.attackHeightUp;
          push();
          image(this.attackImgUp, this.pos.x - 20, this.pos.y, this.aImageWidth, this.aImageHeight, frameX, frameY, this.attackWidthUp, this.attackHeightUp);
          pop();
        } else if (this.characterType === "knight" && this.direction === "attackdown") {
          let frameX = this.currentAnimation[this.frameIndex] % (this.attackImgDown.width / this.attackWidthDown) * this.attackWidthDown;
          let frameY = Math.floor(this.currentAnimation[this.frameIndex] / (this.attackImgDown.width / this.attackWidthDown)) * this.attackHeightDown;
          push();
          image(this.attackImgDown, this.pos.x - 20, this.pos.y, this.aImageWidth, this.aImageHeight, frameX, frameY, this.attackWidthDown, this.attackHeightDown);
          pop();
        } else if (this.characterType === "knight" && this.direction === "attackleft") {
          let frameX = this.currentAnimation[this.frameIndex] % (this.attackImgLeft.width / this.attackWidthLeft) * this.attackWidthLeft;
          let frameY = Math.floor(this.currentAnimation[this.frameIndex] / (this.attackImgLeft.width / this.attackWidthLeft)) * this.attackHeightLeft;
          push();
          image(this.attackImgLeft, this.pos.x - 50, this.pos.y, this.aaImageWidth, this.aaImageHeight, frameX, frameY, this.attackWidthLeft, this.attackHeightLeft);
          pop();
        } else if (this.characterType === "knight" && this.direction === "attackright") {
          let frameX = this.currentAnimation[this.frameIndex] % (this.attackImgRight.width / this.attackWidthRight) * this.attackWidthRight;
          let frameY = Math.floor(this.currentAnimation[this.frameIndex] / (this.attackImgRight.width / this.attackWidthRight)) * this.attackHeightRight;
          push();
          image(this.attackImgRight, this.pos.x, this.pos.y, this.aaImageWidth, this.aaImageHeight, frameX, frameY, this.attackWidthRight, this.attackHeightRight);
          pop();
        }
      }
    } else {
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
        let frameY = Math.floor(this.currentAnimation[this.frameIndex] / (this.actionImgLeft.width / this.chWidthLeft)) * this.chHeightLeft;
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

    if (this.currentImage) {
      let frameX = this.frameIndex * this.frameWidth;
      let frameY = 0;
      image(this.currentImage, this.pos.x, this.pos.y, this.frameWidth, this.currentImage.height, frameX, frameY, this.frameWidth, this.currentImage.height);
    }

    // 显示宠物
    if (this.pet) {
      this.pet.display();
    }
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

    arrowsound.play();

    let angle = atan2(mouseY - player.pos.y, mouseX - player.pos.x);
    if (angle < 0) {
      angle += TWO_PI;
    }
    let state;
    if (angle > 0.25 * PI && angle < 0.75 * PI) {
      state = "v";
      this.arrows.push(new Arrow(
        center.x, center.y,
        direction,
        chargeParams.speed,
        chargeParams.damage,
        chargeParams.size,
        ArcherActionAttackDown,
        state,
        this.arrowPierce,
        this.arrowSplit
      ));
    } else if (angle > 0.75 * PI && angle < 1.25 * PI) {
      state = "h";
      this.arrows.push(new Arrow(
        center.x, center.y,
        direction,
        chargeParams.speed,
        chargeParams.damage,
        chargeParams.size,
        ArcherActionAttackLeft,
        state,
        this.arrowPierce,
        this.arrowSplit
      ));
    } else if (angle > 1.25 * PI && angle < 1.75 * PI) {
      state = "v";
      this.arrows.push(new Arrow(
        center.x, center.y,
        direction,
        chargeParams.speed,
        chargeParams.damage,
        chargeParams.size,
        ArcherActionAttackUp,
        state,
        this.arrowPierce,
        this.arrowSplit
      ));
    } else if (angle > 1.75 * PI || angle < 0.25 * PI) {
      state = "h";
      this.arrows.push(new Arrow(
        center.x, center.y,
        direction,
        chargeParams.speed,
        chargeParams.damage,
        chargeParams.size,
        ArcherActionAttackRight,
        state,
        this.arrowPierce,
        this.arrowSplit
      ));
    }

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
        if(enemy.attackDetect){
        let enemyCenter = createVector(
          enemy.pos.x + enemy.enWidth * 0.5,
          enemy.pos.y + enemy.enHeight * 0.5
        );

        // 使用矢量距离计算
        let distVec = p5.Vector.sub(arrow.pos, enemyCenter);
        if (distVec.mag() < enemy.enHeight * 1.0) { // 增加碰撞范围
          if (arrow.handleCollision(enemy)) {
            let isCrit = random() < this.critRate;
            let finalDamage = isCrit ?
                arrow.damage * this.critDamage :
                arrow.damage;
            if(this.doubleShot) {
              finalDamage = finalDamage * 2;
            }
            let killed = enemy.hit(finalDamage);
            if (killed) {
              enemy.startDeathEffect();
                
                if (enemy instanceof Boss) {
                    bossDefeated++;
                    bossDefeatedCount++;
                }
                normalEnemiesDefeated++;
                if(enemy.gainExp == false) {
                  player.gainExp(enemy.expValue);
                  enemy.gainExp = true;
                }
                
                if(enemy.dead){
                  enemies.splice(j, 1);
                }
            }

          // 生命偷取
          if (this.lifesteal > 0) {
            this.health = Math.min(
              this.maxHealth,
              this.health + finalDamage * this.lifesteal
            );
          }
          // 处理穿透和散射
          if (!arrow.canPierce) {
            arrow.isActive = false;
          }
          if (arrow.canSplit) {
            arrow.split();
          }
          break;
        }
      }
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