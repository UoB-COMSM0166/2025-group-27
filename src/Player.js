// ===== Player 类 =====
class Player {
  constructor(actionImg,chWidth,chHeight, type) {
    // change
    this.actionImg = actionImg;
    this.chWidth = chWidth;
    this.chHeight = chHeight;
    this.x = width / 2;
    this.y = height / 2;
    this.pos = createVector(this.x, this.y);
    this.vel = createVector(0, 0); 
    this.animations = {
      idle: [0, 1, 2],
      up: [27, 28, 29, 30, 31, 32],
      down: [9, 10, 11, 12, 13, 14],
      left: [18, 19, 20, 21, 22, 23],
      right: [18, 19, 20, 21, 22, 23]
    };
    this.currentAnimation = this.animations.idle;
    this.frameIndex = 0;
    this.animationDelay = 6; // control animation speed
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
    this.characterType = type || "melee";
    if (this.characterType === "ranged") {
      this.bulletType = "normal";
    } else {
      this.bulletType = "shotgun";
    }
    this.passiveSkills = [];
    this.shotgunLevel = 0;
    this.unlockedUpgrades = new Set();
    this.isWebbed = false;
    this.webDuration = 0;
    this.bulletTypes = new Set(this.bulletTypes || []);
    this.hitFlashTimer = 0;
    this.xp = 0;
    this.attackPower = this.characterType === "melee" ? 10 : 8;
    this.attackDamage = this.characterType === "melee" ? 10 : 8;
    this.attackSpeed = this.characterType === "melee" ? 500 : 300;
    this.moveSpeed = this.characterType === "melee" ? 3 : 4;
    this.critRate = this.characterType === "melee" ? 0 : 0.1;
    this.critDamage = this.characterType === "melee" ? 1.5 : 2;
    this.dodgeRate = this.characterType === "melee" ? 0 : 0.05;
    this.lifesteal = 0;
    this.thorns = 0;
    this.lastDamageTime = 0;
    
    // 添加宠物相关属性
    this.pet = null;
    this.invincible = false; // 无敌状态(用于防御型宠物)
    this.invincibleFlash = 0; // 无敌闪烁效果
    this.needsPetSelection = false; // 添加新属性
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
      if (obs.collidesWith(this.pos, this.chWidth, this.chHeight)) {
        // 计算 X 方向的可能移动位置
        let xOnly = createVector(this.pos.x - this.vel.x, this.pos.y);
        let yOnly = createVector(this.pos.x, this.pos.y - this.vel.y);
  
        // 优先尝试 X 方向移动
        if (!obs.collidesWith(xOnly, this.chWidth, this.chHeight)) {
          this.pos = xOnly;
        } 
        // 否则尝试 Y 方向移动
        else if (!obs.collidesWith(yOnly, this.chWidth, this.chHeight)) {
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

    // 如果需要选择宠物，优先进入宠物选择界面
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
        if (obs.collidesWith(newPos, this.chWidth, this.chHeight)) {
          let xOnly = createVector(newPos.x, this.pos.y);
          let yOnly = createVector(this.pos.x, newPos.y);
          
          if (!obs.collidesWith(xOnly, this.chWidth, this.chHeight)) {
            newPos = xOnly; // 只在 X 方向移动
          } else if (!obs.collidesWith(yOnly, this.chWidth, this.chHeight)) {
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
      // 计算角色中心
      let centerX = this.pos.x + this.chWidth / 2;
      let centerY = this.pos.y + this.chHeight / 2;
  
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
            "bounce", bombAction, 16, 16
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
              "normal", bombAction, 16, 16
            ));
          }
          break;
        case "pierce":
          bullets.push(new Bullet(
            bulletStart.x, bulletStart.y,
            p5.Vector.mult(direction, 10),
            "pierce", bombAction, 16, 16
          ));
          break;
        default:
          bullets.push(new Bullet(
            bulletStart.x, bulletStart.y,
            p5.Vector.mult(direction, 10),
            "normal", bombAction, 16, 16
          ));
          break;
      }
  
      this.fireCooldown = 60 / this.fireRate;
    }
    this.fireCooldown--;
  }
  
  update() {
    if (this.health < this.maxHealth) {
      this.health = Math.min(this.maxHealth, this.health + this.healthRegen);
    }
    
    player.pos.x = constrain(player.pos.x, 0, width - player.chWidth);
    player.pos.y = constrain(player.pos.y, 0, height - player.chHeight);
    
    // 更新宠物
    if (this.pet) {
      this.pet.update(this);
    }
  }

  display() {
    let frameX = this.currentAnimation[this.frameIndex] % (this.actionImg.width / this.chWidth) * this.chWidth;
    let frameY = Math.floor(this.currentAnimation[this.frameIndex] / (this.actionImg.width / this.chWidth)) * this.chHeight;

    push();
    if (this.direction === 'left') {
      translate(this.pos.x + this.chWidth, this.pos.y);
      scale(-1, 1);
      image(this.actionImg, 0, 0, this.chWidth * 2, this.chHeight * 2, frameX, frameY, this.chWidth, this.chHeight, CENTER);
    } else {
      image(this.actionImg, this.pos.x, this.pos.y, this.chWidth * 2, this.chHeight * 2, frameX, frameY, this.chWidth, this.chHeight, CENTER);
    }
    pop();
    
    // 显示宠物
    if (this.pet) {
      this.pet.display();
    }
  }
}