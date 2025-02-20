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
  }

  takeDamage(amount) {
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
    generateUpgradeOptions();
    choosingUpgrade = true;
    gameState = "upgrading";
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
    gameState = "game";
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
      let newPos = p5.Vector.add(this.pos, moveVec);
      let canMove = true;
      for (let obs of obstacles) {
        if (obs.collidesWith(newPos, this.radius)) {
          let xOnly = createVector(newPos.x, this.pos.y);
          let yOnly = createVector(this.pos.x, newPos.y);
          if (!obs.collidesWith(xOnly, this.radius)) newPos = xOnly;
          else if (!obs.collidesWith(yOnly, this.radius)) newPos = yOnly;
          else canMove = false;
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

  shoot() {
    if (mouseIsPressed && this.fireCooldown <= 0) {
      let direction = p5.Vector.sub(
        createVector(mouseX, mouseY),
        this.pos
      ).normalize();
      switch (this.bulletType) {
        case "bounce":
          bullets.push(
            new Bullet(
              this.pos.x,
              this.pos.y,
              p5.Vector.mult(direction, 10),
              "bounce"
            )
          );
          break;
        case "shotgun":
          let count = this.shotgunLevel + 1;
          let totalWidth = (count - 1) * 15;
          let startOffset = -totalWidth / 2;
          for (let i = 0; i < count; i++) {
            let perp = createVector(-direction.y, direction.x);
            let offset = startOffset + i * 15;
            let bulletPos = p5.Vector.add(
              this.pos,
              p5.Vector.mult(perp, offset)
            );
            bullets.push(
              new Bullet(
                bulletPos.x,
                bulletPos.y,
                p5.Vector.mult(direction, 10),
                "normal"
              )
            );
          }
          break;
        case "pierce":
          bullets.push(
            new Bullet(
              this.pos.x,
              this.pos.y,
              p5.Vector.mult(direction, 10),
              "pierce"
            )
          );
          break;
        default:
          bullets.push(
            new Bullet(
              this.pos.x,
              this.pos.y,
              p5.Vector.mult(direction, 10),
              "normal"
            )
          );
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
  }

  display() {
    let frameX = this.currentAnimation[this.frameIndex] % (this.actionImg.width / this.chWidth) * this.chWidth;
    let frameY = Math.floor(this.currentAnimation[this.frameIndex] / (this.actionImg.width / this.chWidth)) * this.chHeight;

    push();
    if (this.direction === 'left') {
      translate(this.pos.x + this.chWidth, this.pos.y);
      scale(-1, 1);
      image(this.actionImg, 0, 0, this.chWidth, this.chHeight, frameX, frameY, this.chWidth, this.chHeight);
    } else {
      image(this.actionImg, this.pos.x, this.pos.y, this.chWidth, this.chHeight, frameX, frameY, this.chWidth, this.chHeight);
    }
    pop();
  }
}