class Player {
  constructor(actionImgUp, actionImgDown, actionImgLeft, actionImgRight,
    actionImgIntro, AttackImageUp, AttackImageDown, AttackImageLeft,
    AttackImageRight, chWidthUp, chHeightUp, chWidthDown, chHeightDown,
    chWidthLeft, chHeightLeft, chWidthRight, chHeightRight, chWidthIntro,
    chHeightIntro, attackWidthUp, attackHeightUp, attackWidthDown,
    attackHeightDown, attackWidthLeft, attackHeightLeft, attackWidthRight,
    attackHeightRight, type
  ) {
    // Store all directional and intro sprites + their frame dimensions
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

    this.ImageWidth = 40;
    this.ImageHeight = 65;
    this.aImageWidth = 70;
    this.aImageHeight = 70;
    this.aaImageWidth = 100;
    this.aaImageHeight = 90;
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
      // Knight attack sprites
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
    // Animation control
    this.currentAnimation = this.animations.idle;
    this.frameIndex = 0;
    this.animationDelay = 6;
    this.animationCounter = 0;
    this.direction = 'idle';

    // Core stats
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
    // Character classification
    this.characterType = type || "gunner";
    this.bulletType = "shotgun";
    this.passiveSkills = [];
    this.shotgunLevel = 0;
    this.unlockedUpgrades = new Set();
    // Status effects
    this.isWebbed = false;
    this.webDuration = 0;
    this.bulletTypes = new Set(this.bulletTypes || []);
    this.hitFlashTimer = 0;
    this.xp = 0;
    // Attack properties (knight vs. gunner vs. archer)
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

    // Knight
    this.isAttacking = false;
    this.attackAngle = 90;
    this.attackRange = 80;
    this.attackDuration = 8;
    this.attackCooldown = 30;
    this.currentAttackCooldown = 0;
    this.attackFrames = 5;
    this.currentAttackFrame = 0;
    this.attackAnimationSpeed = 3;
    this.knightType = "normal";
    // Knight dash/spin mechanics
    this.reborn = false;
    this.spinningSlash = false;
    this.dash = false;
    this.dashing = false;
    this.dashDuration = 0;
    this.dashCooldown = 0;
    this.dashSpeedMultiplier = 1.8;
    this.canAttack = true;
    this.spinningSlashCooldown = 0;
    this.spinningSlashRange = 80;
    this.rebornUsed = false;
    this.giantMode = false;
    this.berserkerMode = false;

    // Archer class
    this.arrowDamage = 30;
    this.arrowSpeed = 12;
    this.arrowSize = 12;
    this.isCharging = false;
    this.chargeStartTime = 0;
    this.maxChargeTime = 60;
    this.currentChaerge = 0;
    this.chargePower = 0;
    this.arrowCooldown = 15;
    this.currentArrowCooldown = 0;
    this.arrows = [];
    this.chargeBarScale = 0.7;

    // Archer updrade
    this.arrowPierce = false;
    this.arrowSplit = false;
    this.doubleShot = false;
    this.lifesteal = 0;
    this.autoCharge = false;

    // pet attributes
    this.invincible = false;
    this.invincibleFlash = 0;
    this.needsPetSelection = false;
    this.pet = null;

    this.stunned = false;
    this.stunDuration = 0;

    this.isInvincible = false;
  }

  // Handle incoming damage, including defense, reborn, and invincibility
  takeDamage(amount) {
    if (this.isInvincible) {
      showFloatingText("Invincible!", this.pos.x, this.pos.y - 20, color(255, 215, 0), 18);
      return;
    }

    // Knight “reborn” mechanic triggers when dropping below threshold
    if (this.reborn) {
      if (this.health > 10 && (this.health - amount) <= 10 && !this.rebornUsed) {
        this.health = Math.min(100, this.maxHealth); // reborn
        this.rebornUsed = true;
        showFloatingText("Reborn!", this.pos.x, this.pos.y - 20, color(255, 215, 0));
        return;
      }
    }
    if (this.invincible) return;
    // Apply defense reduction
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

  // Prevent passing through obstacles by backtracking along velocity
  resolveCollision() {
    if (!this.vel) {
      this.vel = createVector(0, 0);
    }

    for (let obs of obstacles) {
      if (obs.collidesWith(this.pos, this.ImageWidth, this.ImageHeight)) {
        // Test moving only in X direction
        let xOnly = createVector(this.pos.x - this.vel.x, this.pos.y);
        // Test moving only in Y direction
        let yOnly = createVector(this.pos.x, this.pos.y - this.vel.y);

        if (!obs.collidesWith(xOnly, this.ImageWidth, this.ImageHeight)) {
          this.pos = xOnly;
        }
        else if (!obs.collidesWith(yOnly, this.ImageWidth, this.ImageHeight)) {
          this.pos = yOnly;
        }
        else {
          // Otherwise, retract completely
          this.pos.sub(this.vel);
        }
      }
    }
  }

  // Gain experience, trigger level-ups (skips at wave 5 boss)
  gainExp(amount) {
    if (wave === 5) return;

    // apply expBonus
    if (this.expBonus) {
      amount = amount * (1 + this.expBonus);
    }

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

  // Increase level
  levelUp() {
    this.level++;
    this.exp -= this.expToNextLevel;
    this.expToNextLevel = Math.floor(this.expToNextLevel * 1.5);
    this.maxHealth += 20;
    this.health += 20;
    this.health = Math.min(this.health, this.maxHealth);
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
  // Apply a single upgrade to the player, updating stats and showing feedback text
  applyUpgrade(upgrade) {
    // If it’s a one-time unlock, record it
    if (upgrade.oneTime) {
      this.unlockedUpgrades.add(upgrade.value);
    }
    switch (upgrade.type) {
      case "health":
        this.maxHealth += upgrade.value;
        this.health += upgrade.value;
        showFloatingText(`+${upgrade.value} HP`, this.pos.x, this.pos.y - 30, color(0, 255, 0));
        break;
      case "speed":
        this.speed += upgrade.value;
        showFloatingText(`+Speed`, this.pos.x, this.pos.y - 30, color(0, 200, 255));
        break;
      case "fireRate":
        this.fireRate += upgrade.value;
        showFloatingText(`+Fire Rate`, this.pos.x, this.pos.y - 30, color(255, 150, 0));
        break;
      case "defense":
        this.defense += upgrade.value;
        showFloatingText(`+Defense`, this.pos.x, this.pos.y - 30, color(100, 100, 255));
        break;
      case "healthRegen":
        this.healthRegen = this.healthRegen || 0;
        this.healthRegen += upgrade.value;
        showFloatingText(`+HP Regen`, this.pos.x, this.pos.y - 30, color(50, 255, 50));
        break;
      case "criticalChance":
        this.criticalChance = this.criticalChance || 0;
        this.critRate = this.critRate || 0;
        this.criticalChance += upgrade.value;
        this.critRate += upgrade.value;
        showFloatingText(`+${upgrade.value * 100}% Crit`, this.pos.x, this.pos.y - 30, color(255, 50, 50));
        break;
      case "expBonus":
        this.expBonus = this.expBonus || 0;
        this.expBonus += upgrade.value;
        showFloatingText(`+${upgrade.value * 100}% EXP`, this.pos.x, this.pos.y - 30, color(150, 255, 150));
        break;
      case "armorPen":
        this.armorPenetration = this.armorPenetration || 0;
        this.armorPenetration += upgrade.value;
        showFloatingText(`+Armor Pen`, this.pos.x, this.pos.y - 30, color(150, 0, 255));
        break;
      case "bulletType":
        this.bulletTypes = this.bulletTypes || new Set();
        this.bulletTypes.add(upgrade.value);
        if (upgrade.value === "shotgun") {
          if (this.bulletType === "shotgun") {
            this.shotgunLevel = this.shotgunLevel || 0;
            this.shotgunLevel++;
            showFloatingText(`Shotgun Level ${this.shotgunLevel + 1}`, this.pos.x, this.pos.y - 30, color(255, 200, 50));
          } else {
            this.bulletType = "shotgun";
            this.shotgunLevel = 0;
            showFloatingText(`Shotgun Unlocked!`, this.pos.x, this.pos.y - 30, color(255, 200, 50));
          }
        } else {
          let prev = this.shotgunLevel || 0;
          this.bulletType = upgrade.value;
          this.shotgunLevel = prev;
          showFloatingText(`${upgrade.value} Bullets!`, this.pos.x, this.pos.y - 30, color(255, 200, 50));
        }
        break;
      case "passive":
        this.passiveSkills = this.passiveSkills || [];
        this.passiveSkills.push(upgrade.value);
        showFloatingText(`Skill: ${upgrade.value}`, this.pos.x, this.pos.y - 30, color(200, 150, 255));
        break;
      //Archer upgrade
      case "arrowPierce":
        this.arrowPierce = true;
        showFloatingText(`Piercing Arrows!`, this.pos.x, this.pos.y - 30, color(200, 255, 100));
        break;
      case "arrowSplit":
        this.arrowSplit = true;
        showFloatingText(`Split Arrows!`, this.pos.x, this.pos.y - 30, color(100, 255, 200));
        break;
      case "doubleShot":
        this.doubleShot = true;
        showFloatingText(`Double Shot!`, this.pos.x, this.pos.y - 30, color(255, 100, 200));
        break;
      case "lifesteal":
        this.lifesteal = 0.1;
        showFloatingText(`Life Steal!`, this.pos.x, this.pos.y - 30, color(255, 0, 100));
        break;
      case "autoCharge":
        this.autoCharge = true;
        showFloatingText(`Auto-Charge!`, this.pos.x, this.pos.y - 30, color(100, 200, 255));
        break;
      // knight upgrade
      case "healthBoostAndLifeSteal":
        this.knightType = "giant";
        this.lifesteal = 0.2;
        this.maxHealth = 300;
        this.health = 300;
        showFloatingText(`Life Steal Giant!`, this.pos.x, this.pos.y - 30, color(255, 150, 150));
        break;
      case "berserker":
        this.knightType = "berserker";
        this.berserkerMode = true;
        this.critRate = 0.5;
        this.critDamage = 2.0;
        showFloatingText(`Berserker Mode!`, this.pos.x, this.pos.y - 30, color(255, 0, 0));
        break;
      case "reborn":
        this.reborn = true;
        this.rebornUsed = false;
        showFloatingText(`Phoenix Blessing!`, this.pos.x, this.pos.y - 30, color(255, 100, 0));
        break;
      case "highDamage":
        this.knightType = "mjolnir";
        this.critRate = 0.2;
        this.critDamage = 4.0;
        showFloatingText(`Mjölnir Power!`, this.pos.x, this.pos.y - 30, color(0, 150, 255));
        break;
      case "fastWalk":
        this.dash = true;
        showFloatingText(`Fast Walk Unlocked!`, this.pos.x, this.pos.y - 30, color(100, 255, 100));
        break;
      case "spinningSlash":
        this.spinningSlash = true;
        showFloatingText(`Spinning Slash (E)!`, this.pos.x, this.pos.y - 30, color(255, 150, 0));
        break;
      case "attackRange":
        this.attackRange = this.attackRange || 30;
        this.attackRange += 5;
        showFloatingText(`+Attack Range`, this.pos.x, this.pos.y - 30, color(255, 200, 100));
        break;
      case "attackAngle":
        this.attackAngle = this.attackAngle || 60;
        this.attackAngle += 10;
        showFloatingText(`+Attack Angle`, this.pos.x, this.pos.y - 30, color(255, 100, 200));
        break;
      case "attack":
        this.attackDamage = this.attackDamage || 10;
        this.attackDamage += upgrade.value;
        showFloatingText(`+${upgrade.value} Attack`, this.pos.x, this.pos.y - 30, color(255, 50, 50));
        break;
      default:
        console.log("Unknown upgrade type:", upgrade.type);
        break;
    }
    choosingUpgrade = false;
  }

  // Perform the knight’s spinning slash attack in a circular area
  performSpinningSlash() {
    if (!this.spinningSlash || this.spinningSlashCooldown > 0) return;

    this.spinningSlashCooldown = 180;
    showFloatingText("Spinning Slash!", this.pos.x, this.pos.y - 30, color(255, 150, 0));

    const radius = this.attackRange || 100;
    const angle = this.attackAngle || 360;

    push();
    noFill();
    stroke(255, 150, 0, 150);
    strokeWeight(3);
    ellipse(this.pos.x + this.ImageWidth / 2, this.pos.y + this.ImageHeight / 2, radius * 2);
    pop();

    for (let i = enemies.length - 1; i >= 0; i--) {
      const enemy = enemies[i];
      const dist = p5.Vector.dist(
        createVector(this.pos.x + this.ImageWidth / 2, this.pos.y + this.ImageHeight / 2),
        createVector(enemy.pos.x + enemy.radius, enemy.pos.y + enemy.radius)
      );

      if (dist <= radius) {
        //count damage
        let damage = this.attackDamage || 30;
        let isCrit = random() < (this.critRate || 0);
        if (isCrit) {
          damage *= (this.critDamage || 1.5);
          showFloatingText("CRIT!", enemy.pos.x, enemy.pos.y - 20, color(255, 0, 0), 18);
        }

        let killed = enemy.hit(damage);
        if (killed) {
          enemy.startDeathEffect();
          if (enemy instanceof Boss) {
            bossDefeated++;
            bossDefeatedCount++;
          }
          normalEnemiesDefeated++;
          if (!enemy.gainExp) {
            this.gainExp(enemy.expValue);
            enemy.gainExp = true;
          }

          if (enemy.dead) {
            enemies.splice(i, 1);
          }
        }
      }
    }
  }
  // Handle player movement input
  move() {
    if (this.stunned) {
      this.stunDuration--;
      if (this.stunDuration <= 0) {
        this.stunned = false;
      }
      return;
    }
    // Knight dash logic
    if (this.characterType == "knight" && this.dash) {
      if (this.dashCooldown <= 0 && keyIsDown(16)) { //shift
        this.dashing = true;
        this.dashDuration = 90;
        this.dashCooldown = 180;
        this.canAttack = false;
      }
      // Compute current speed, applying dash multiplier if active
      let currentSpeed = this.speed;
      if (this.dashing) {
        currentSpeed *= this.dashSpeedMultiplier;
        this.dashDuration--;
        if (this.dashDuration <= 0) {
          this.dashing = false;
          this.canAttack = true;
        }
      }

      let moving = false;
      // Handle web slowdown
      if (this.isWebbed) {
        this.webDuration--;
        if (this.webDuration <= 0) this.isWebbed = false;
        return;
      }

      let moveVec = createVector(0, 0);
      // Vector from player to mouse for aiming/orientation
      let dx = mouseX - this.pos.x;
      let dy = this.pos.y - mouseY;
      let angle = atan2(dy, dx);
      if (angle < 0) angle += TWO_PI;

      // WASD movement with directional animation logic
      if (keyIsDown(87)) { //W
        this.y -= currentSpeed;
        this.currentAnimation = this.animations.up;
        this.direction = 'up';
        moving = true;
        moveVec.y -= 1;
        if (mouseIsPressed && this.characterType != "knight") {
          if (angle >= PI / 4 && angle < 3 * PI / 4) {       // 45°~135° → up
            this.currentAnimation = this.animations.up;
            this.direction = "up";
          }
          else if (angle >= 3 * PI / 4 && angle < 5 * PI / 4) { // 135°~225° → left
            this.currentAnimation = this.animations.left;
            this.direction = "left";
          }
          else if (angle >= 5 * PI / 4 && angle < 7 * PI / 4) { // 225°~315° → down
            this.currentAnimation = this.animations.down;
            this.direction = "down";
          }
          else {                                       // 315°~45° → right
            this.currentAnimation = this.animations.right;
            this.direction = "right";
          }
        }
      } else if (keyIsDown(83)) { //S
        this.y += currentSpeed;
        this.currentAnimation = this.animations.down;
        this.direction = 'down';
        moving = true;
        moveVec.y += 1;
        if (mouseIsPressed && this.characterType != "knight") {
          if (angle >= PI / 4 && angle < 3 * PI / 4) {
            this.currentAnimation = this.animations.up;
            this.direction = "up";
          }
          else if (angle >= 3 * PI / 4 && angle < 5 * PI / 4) {
            this.currentAnimation = this.animations.left;
            this.direction = "left";
          }
          else if (angle >= 5 * PI / 4 && angle < 7 * PI / 4) {
            this.currentAnimation = this.animations.down;
            this.direction = "down";
          }
          else {
            this.currentAnimation = this.animations.right;
            this.direction = "right";
          }
        }
      }

      // Move left when A is held
      if (keyIsDown(65)) { //A
        this.x -= currentSpeed;
        this.currentAnimation = this.animations.left;
        this.direction = 'left';
        moving = true;
        moveVec.x -= 1;
        // If firing with mouse (and not knight), override facing based on angle
        if (mouseIsPressed && this.characterType != "knight") {
          if (angle >= PI / 4 && angle < 3 * PI / 4) {
            this.currentAnimation = this.animations.up;
            this.direction = "up";
          }
          else if (angle >= 3 * PI / 4 && angle < 5 * PI / 4) {
            this.currentAnimation = this.animations.left;
            this.direction = "left";
          }
          else if (angle >= 5 * PI / 4 && angle < 7 * PI / 4) {
            this.currentAnimation = this.animations.down;
            this.direction = "down";
          }
          else {
            this.currentAnimation = this.animations.right;
            this.direction = "right";
          }
        }
        // Move right when D is held
      } else if (keyIsDown(68)) { //D
        this.x += currentSpeed;
        this.currentAnimation = this.animations.right;
        this.direction = 'right';
        moving = true;
        moveVec.x += 1;
        // Same angle‐based facing override when shooting
        if (mouseIsPressed && this.characterType != "knight") {
          if (angle >= PI / 4 && angle < 3 * PI / 4) {
            this.currentAnimation = this.animations.up;
            this.direction = "up";
          }
          else if (angle >= 3 * PI / 4 && angle < 5 * PI / 4) {
            this.currentAnimation = this.animations.left;
            this.direction = "left";
          }
          else if (angle >= 5 * PI / 4 && angle < 7 * PI / 4) {
            this.currentAnimation = this.animations.down;
            this.direction = "down";
          }
          else {
            this.currentAnimation = this.animations.right;
            this.direction = "right";
          }
        }
      }
      // If not moving or attacking, revert to idle animation
      if (!moving && !this.isAttacking) {
        this.currentAnimation = this.animations.idle;
        this.direction = 'idle';
      }
      // Knight attack input: change animation based on mouse angle
      if (this.characterType === "knight" && mouseIsPressed) {
        let dx = mouseX - this.pos.x;
        let dy = this.pos.y - mouseY;
        let angle = atan2(dy, dx);

        if (angle < 0) angle += TWO_PI;
        console.log("angle: " + angle);
        if (angle >= PI / 4 && angle < 3 * PI / 4 && !this.dashing) {
          this.currentAnimation = this.animations.attackup;
          this.direction = "attackup";
        }
        else if (angle >= 3 * PI / 4 && angle < 5 * PI / 4 && !this.dashing) {
          this.currentAnimation = this.animations.attackleft;
          this.direction = "attackleft";
        }
        else if (angle >= 5 * PI / 4 && angle < 7 * PI / 4 && !this.dashing) {
          this.currentAnimation = this.animations.attackdown;
          this.direction = "attackdown";
        }
        else {
          if (!this.dashing) {
            this.currentAnimation = this.animations.attackright;
            this.direction = "attackright";
          }
        }
      }
      this.animate();
      // If there is motion vector, attempt to move and check obstacle collisions
      if (moveVec.mag() > 0) {
        moveVec.setMag(currentSpeed);
        this.vel = moveVec.copy();
        let newPos = p5.Vector.add(this.pos, moveVec);
        let canMove = true;
        for (let obs of obstacles) {
          if (obs.collidesWith(newPos, this.ImageWidth, this.ImageHeight)) {
            // try sliding along X only
            let xOnly = createVector(newPos.x, this.pos.y);
            // try sliding along Y only
            let yOnly = createVector(this.pos.x, newPos.y);

            if (!obs.collidesWith(xOnly, this.ImageWidth, this.ImageHeight)) {
              newPos = xOnly;
            } else if (!obs.collidesWith(yOnly, this.ImageWidth, this.ImageHeight)) {
              newPos = yOnly;
            } else {
              canMove = false;
            }
            break;
          }
        }
        // If movement is valid, update position and clamp to bounds
        if (canMove) {
          this.pos = newPos;
          this.pos.x = constrain(this.pos.x, 0, width);
          this.pos.y = constrain(this.pos.y, 0, height);
        }
      }
      this.resolveCollision();

    } else {
      // If not in “combat” mode, simpler movement logic below
      let moving = false;
      // Web effect prevents movement until expired
      if (this.isWebbed) {
        this.webDuration--;
        if (this.webDuration <= 0) this.isWebbed = false;
        return;
      }
      let moveVec = createVector(0, 0);
      // Compute angle to mouse for aiming/facing
      let dx = mouseX - this.pos.x;
      let dy = this.pos.y - mouseY;
      let angle = atan2(dy, dx);
      if (angle < 0) angle += TWO_PI;

      if (keyIsDown(87)) { //W
        this.y -= this.speed;
        this.currentAnimation = this.animations.up;
        this.direction = 'up';
        moving = true;
        moveVec.y -= 1;
        // override facing while shooting if not knight
        if (mouseIsPressed && this.characterType != "knight") {
          if (angle >= PI / 4 && angle < 3 * PI / 4) {
            this.currentAnimation = this.animations.up;
            this.direction = "up";
          }
          else if (angle >= 3 * PI / 4 && angle < 5 * PI / 4) {
            this.currentAnimation = this.animations.left;
            this.direction = "left";
          }
          else if (angle >= 5 * PI / 4 && angle < 7 * PI / 4) {
            this.currentAnimation = this.animations.down;
            this.direction = "down";
          }
          else {
            this.currentAnimation = this.animations.right;
            this.direction = "right";
          }
        }
      } else if (keyIsDown(83)) { //S
        this.y += this.speed;
        this.currentAnimation = this.animations.down;
        this.direction = 'down';
        moving = true;
        moveVec.y += 1;
        if (mouseIsPressed && this.characterType != "knight") {
          if (angle >= PI / 4 && angle < 3 * PI / 4) {
            this.currentAnimation = this.animations.up;
            this.direction = "up";
          }
          else if (angle >= 3 * PI / 4 && angle < 5 * PI / 4) {
            this.currentAnimation = this.animations.left;
            this.direction = "left";
          }
          else if (angle >= 5 * PI / 4 && angle < 7 * PI / 4) {
            this.currentAnimation = this.animations.down;
            this.direction = "down";
          }
          else {
            this.currentAnimation = this.animations.right;
            this.direction = "right";
          }
        }
      }

      if (keyIsDown(65)) { //A
        this.x -= this.speed;
        this.currentAnimation = this.animations.left;
        this.direction = 'left';
        moving = true;
        moveVec.x -= 1;
        if (mouseIsPressed && this.characterType != "knight") {
          if (angle >= PI / 4 && angle < 3 * PI / 4) {
            this.currentAnimation = this.animations.up;
            this.direction = "up";
          }
          else if (angle >= 3 * PI / 4 && angle < 5 * PI / 4) {
            this.currentAnimation = this.animations.left;
            this.direction = "left";
          }
          else if (angle >= 5 * PI / 4 && angle < 7 * PI / 4) {
            this.currentAnimation = this.animations.down;
            this.direction = "down";
          }
          else {
            this.currentAnimation = this.animations.right;
            this.direction = "right";
          }
        }

      } else if (keyIsDown(68)) {
        this.x += this.speed;
        this.currentAnimation = this.animations.right;
        this.direction = 'right';
        moving = true;
        moveVec.x += 1;
        if (mouseIsPressed && this.characterType != "knight") {
          if (angle >= PI / 4 && angle < 3 * PI / 4) {
            this.currentAnimation = this.animations.up;
            this.direction = "up";
          }
          else if (angle >= 3 * PI / 4 && angle < 5 * PI / 4) {
            this.currentAnimation = this.animations.left;
            this.direction = "left";
          }
          else if (angle >= 5 * PI / 4 && angle < 7 * PI / 4) {
            this.currentAnimation = this.animations.down;
            this.direction = "down";
          }
          else {
            this.currentAnimation = this.animations.right;
            this.direction = "right";
          }
        }
      }
      // Reset to idle if not moving or attacking
      if (!moving && !this.isAttacking) {
        this.currentAnimation = this.animations.idle;
        this.direction = 'idle';
      }

      // Knight attack facing logic again
      if (this.characterType === "knight" && mouseIsPressed) {
        let dx = mouseX - this.pos.x;
        let dy = this.pos.y - mouseY;
        let angle = atan2(dy, dx);

        if (angle < 0) angle += TWO_PI;
        console.log("angle: " + angle);
        if (angle >= PI / 4 && angle < 3 * PI / 4) {
          this.currentAnimation = this.animations.attackup;
          this.direction = "attackup";
        }
        else if (angle >= 3 * PI / 4 && angle < 5 * PI / 4) {
          this.currentAnimation = this.animations.attackleft;
          this.direction = "attackleft";
        }
        else if (angle >= 5 * PI / 4 && angle < 7 * PI / 4) {
          this.currentAnimation = this.animations.attackdown;
          this.direction = "attackdown";
        }
        else {
          this.currentAnimation = this.animations.attackright;
          this.direction = "attackright";
        }
      }
      this.animate();

      // Move and obstacle‐check if vector is nonzero
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
              newPos = xOnly;
            } else if (!obs.collidesWith(yOnly, this.ImageWidth, this.ImageHeight)) {
              newPos = yOnly;
            } else {
              canMove = false;
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
  // Advance the current animation frames for movement/idle
  animate() {
    this.animationCounter++;
    if (this.animationCounter >= this.animationDelay) {
      this.animationCounter = 0;
      // Loop frame index within the current animation sequence
      this.frameIndex = (this.frameIndex + 1) % this.currentAnimation.length;
    }
  }
  // Advance frames for attack animations, then exit attack state
  animateAttack() {
    this.animationCounter++;
    if (this.animationCounter >= this.animationDelay) {
      this.animationCounter = 0;
      this.frameIndex = (this.frameIndex + 1) % this.currentAnimation.length;
      this.isAttacking = false;
    }
  }

  // Handle player firing logic for all character types
  shoot() {
    if (this.stunned) {
      return;
    }

    // Automatic charge for archers when autoCharge unlocked
    if (!mouseIsPressed && this.characterType == "archer" && this.autoCharge == true) {
      this.startCharge();
      // lifesteal on auto-charge
      if (this.unlockedUpgrades.has("lifesteal")) {
        this.health = min(this.health + this.attackDamage * 0.1, this.maxHealth);
      }
    }
    // Release arrow if charging and autoCharge
    if (mouseIsPressed && this.characterType == "archer" && this.autoCharge == true) {
      this.releaseArrow();
    }
    // Primary fire when cooldown allows
    if (mouseIsPressed && this.fireCooldown <= 0) {
      if (this.characterType === "gunner") {
        // Determine cardinal direction based on mouse angle
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
        // Compute normalized direction to mouse
        let direction = p5.Vector.sub(
          createVector(mouseX, mouseY),
          createVector(centerX, centerY)
        ).normalize();

        let bulletStart = createVector(centerX, centerY);
        // Spawn bullets based on current bulletType
        switch (this.bulletType) {
          case "bounce":
            bullets.push(new Bullet(
              bulletStart.x, bulletStart.y,
              p5.Vector.mult(direction, 10),
              "bounce", Bup, Bdown, Bleft, Bright, state
            ));
            break;
          case "shotgun":
            // Spread multiple pellets
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
        // Initiate a melee attack
        this.isAttacking = true;
        this.currentAttackFrame = 0;
        this.currentAttackCooldown = this.attackCooldown;
        // Compute attack direction towards mouse
        let center = createVector(
          this.pos.x + this.ImageWidth / 2,
          this.pos.y + this.ImageHeight / 2
        );
        this.attackDirection = p5.Vector.sub(createVector(mouseX, mouseY), center).normalize();

        //detect enemies
        this.detectAttack();
      } else if (this.characterType === "archer" && !this.isCharging && this.autoCharge == false) {
        this.startCharge();
        //lifesteal
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
  // Melee attack collision detection for knight
  detectAttack() {
    keyboardsound.play();
    let center = createVector(
      this.pos.x + this.ImageWidth / 2,
      this.pos.y + this.ImageHeight / 2
    );

    for (let i = enemies.length - 1; i >= 0; i--) {
      let enemy = enemies[i];
      if (enemy.attackDetect) {
        let enemyPos = enemy.pos.copy();
        let toEnemy = p5.Vector.sub(enemyPos, center);
        let distance = toEnemy.mag();
        // Check range and angle cone
        if (distance <= this.attackRange) {
          let angleBetween = degrees(this.attackDirection.angleBetween(toEnemy));
          if (abs(angleBetween) <= this.attackAngle / 2) {
            // Critical chance
            let isCrit = random() < this.critRate;
            let damage = isCrit ? this.attackDamage * this.critDamage : this.attackDamage;

            let killed = enemy.hit(damage);
            if (killed) {
              enemy.startDeathEffect();
              if (enemy instanceof Boss) {
                bossDefeated++;
                bossDefeatedCount++;
              }
              normalEnemiesDefeated++;
              if (enemy.gainExp == false) {
                this.gainExp(enemy.expValue);
                enemy.gainExp = true;
              }

              if (enemy.dead) {
                enemies.splice(i, 1);
              }
            }
            // Lifesteal from melee
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
    // Advance knight attack animation frames
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
    // Clamp player inside the world
    player.pos.x = constrain(player.pos.x, 0, width - player.ImageWidth);
    player.pos.y = constrain(player.pos.y, 0, height - player.ImageHeight);

    if (this.currentAttackCooldown > 0) {
      this.currentAttackCooldown--;
    }

    if (this.currentArrowCooldown > 0) {
      this.currentArrowCooldown--;
    }
    // handle arrow movement & collisions
    this.updateArrows();
    // Update pet if one is active
    if (this.pet) {
      this.pet.update(this);
    }
    // Passive health regen each second
    if (this.healthRegen && frameCount % 60 === 0) {
      const healAmount = this.healthRegen;
      if (this.health < this.maxHealth) {
        this.health = Math.min(this.health + healAmount, this.maxHealth);
        showFloatingText(`+${healAmount}`, this.pos.x, this.pos.y - 20, color(0, 255, 0), 14);
      }
    }
    // Adjust speed when holding SHIFT in dash mode
    if (this.dash && keyIsDown(SHIFT)) {
      this.baseSpeed = this.baseSpeed || this.speed;
      this.speed = this.baseSpeed * 1.5; //speed up 50%
    } else if (this.dash) {
      this.baseSpeed = this.baseSpeed || this.speed;
      this.speed = this.baseSpeed;
    }
  }
  // Render the player sprite each frame
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

    if (this.stunned) {
      push();
      textSize(16);
      fill(255, 255, 0);
      text("✦", this.pos.x - 10, this.pos.y - 30);
      text("✦", this.pos.x, this.pos.y - 40);
      text("✦", this.pos.x + 10, this.pos.y - 30);
      pop();
    }

    if (this.characterType === "archer") {
      // display arrow
      this.arrows.forEach(arrow => arrow.display());

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

    if (this.pet) {
      this.pet.display();
    }
  }

  // Begin charging an archer shot
  startCharge() {
    if (this.currentArrowCooldown <= 0 && !this.isCharging) {
      this.isCharging = true;
      this.chargeStartTime = frameCount;
      this.currentCharge = 0;
    }
  }
  // Compute charge parameters (damage, speed, size) based on charge percent
  calculateCharge() {
    if (this.isCharging) {
      const chargeFrames = frameCount - this.chargeStartTime;
      this.currentCharge = Math.min(chargeFrames / this.maxChargeTime, 1);
      this.chargePower = this.currentCharge;

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
  // Fire the charged arrow and reset charge state
  releaseArrow() {
    if (!this.isCharging) return;
    const chargeParams = this.calculateCharge();
    const center = createVector(
      this.pos.x + this.ImageWidth / 2,
      this.pos.y + this.ImageHeight / 2
    );
    const target = createVector(mouseX, mouseY);
    const direction = p5.Vector.sub(target, center).normalize();
    arrowsound.play();

    // Determine arrow sprite orientation by mouse angle
    let angle = atan2(mouseY - player.pos.y, mouseX - player.pos.x);
    if (angle < 0) {
      angle += TWO_PI;
    }
    let state;
    if (angle > 0.25 * PI && angle < 0.75 * PI) {
      state = "v";
      // Spawn the arrow
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

    this.isCharging = false;
    this.currentCharge = 0;
    this.currentArrowCooldown = this.arrowCooldown;
  }
  // Update all active arrows
  updateArrows() {
    for (let i = this.arrows.length - 1; i >= 0; i--) {
      let arrow = this.arrows[i];

      arrow.vel.mult(0.99);

      arrow.pos.add(arrow.vel);

      //detect boundry
      if (arrow.pos.x < -50 || arrow.pos.x > width + 50 ||
        arrow.pos.y < -50 || arrow.pos.y > height + 50) {
        arrow.isActive = false;
      }

      for (let j = enemies.length - 1; j >= 0; j--) {
        let enemy = enemies[j];
        if (enemy.attackDetect) {
          let enemyCenter = createVector(
            enemy.pos.x + enemy.enWidth * 0.5,
            enemy.pos.y + enemy.enHeight * 0.5
          );

          let distVec = p5.Vector.sub(arrow.pos, enemyCenter);
          if (distVec.mag() < enemy.enHeight * 1.0) {
            if (arrow.handleCollision(enemy)) {
              let isCrit = random() < this.critRate;
              let finalDamage = isCrit ?
                arrow.damage * this.critDamage :
                arrow.damage;
              if (this.doubleShot) {
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
                if (enemy.gainExp == false) {
                  player.gainExp(enemy.expValue);
                  enemy.gainExp = true;
                }

                if (enemy.dead) {
                  enemies.splice(j, 1);
                }
              }

              //life steal
              if (this.lifesteal > 0) {
                this.health = Math.min(
                  this.maxHealth,
                  this.health + finalDamage * this.lifesteal
                );
              }
              //pierce and split
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
      // Remove inactive arrows
      if (!arrow.isActive) {
        this.arrows.splice(i, 1);
      }
    }
  }
  // Draw the UI charge bar for archer charging
  drawChargeBar() {
    const baseBarWidth = 80 * this.chargeBarScale;
    const barHeight = 8 * this.chargeBarScale;
    const posX = this.pos.x + this.ImageWidth / 2 - baseBarWidth / 2;
    const posY = this.pos.y - 30;
    // Draw background bar
    fill(50, 150);
    rect(posX, posY,
      baseBarWidth * (0.5 + this.currentCharge * 0.5),
      barHeight,
      3 * this.chargeBarScale);

    // Draw animated fill bar that oscillates slightly
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

    // Draw percentage text
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