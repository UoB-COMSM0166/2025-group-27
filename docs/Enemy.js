class Enemy {
  constructor(isElite = false, enemyType = "normal", enemyAction, enWidth, enHeight, idleNum = 6, upNum = 6, downNum = 6, sideNum = 6) {
    this.enemyAction = enemyAction || {};
    this.enWidth = enWidth || 22;
    this.enHeight = enHeight || 22;
    this.x = width / 2;
    this.y = height / 2;
    this.frameIndex = 0;
    this.enDelay = 6;
    this.enCounter = 0;
    this.direction = 'idle';
    this.currentAction = this.enemyAction.idle || null;
    this.framesPerDirection = 4;
    this.deathFrame = 0;
    this.isDying = false;
    this.dead = false;
    this.gainExp = false;
    this.attackDetect = true;
    this.sideNum = sideNum;
    this.idleNum = idleNum;
    this.upNum = upNum;
    this.downNum = downNum;

    this.pos = createVector(0, 0);
    this.vel = createVector(0, 0);
    this.radius = 10;
    if (difficult == "hard") {
      this.health = 120;
    } else {
      this.health = 70;
    }
    this.maxHealth = 50;
    if (difficult == "hard") {
      this.damage = 30;
    } else {
      this.damage = 10;
    }
    if (difficult == "hard") {
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
    this.collisionWidth = this.enWidth || this.radius * 2;
    this.collisionHeight = this.enHeight || this.radius * 2;
  }

  resolveCollision() {
    for (let obs of obstacles) {
      if (obs.collidesWith(this.pos, this.enWidth, this.enHeight)) {
        let xOnly = createVector(this.pos.x - this.vel.x, this.pos.y);
        let yOnly = createVector(this.pos.x, this.pos.y - this.vel.y);

        if (!obs.collidesWith(xOnly, this.enWidth, this.enHeight)) {
          this.pos = xOnly;
        }
        else if (!obs.collidesWith(yOnly, this.enWidth, this.enHeight)) {
          this.pos = yOnly;
        }
        else {
          this.pos.sub(this.vel);
        }
      }
    }
  }

  startDeathEffect() {
    this.isDying = true;
    this.deathFrame = 0;
    this.effectStartTime = millis();
  }

  shouldRemove() {
    return this.isDying && this.deathFrame >= 4;
  }

  update() {
    if (this.health <= 0) {
      this.dead = true;
      return;
    }
    if (this.health <= 0) {
      this.attackDetect = false;
    }
    if (this.invulnerableTime > 0) {
      this.invulnerableTime--;
    }

    let distToPlayer = p5.Vector.dist(this.pos, player.pos);

    // get directions to the player
    let dirToPlayer = p5.Vector.sub(player.pos, this.pos);

    let noiseOffset = createVector(
      map(noise(this.pos.x * 0.01 + frameCount * 0.01), 0, 1, -1, 1),
      map(noise(this.pos.y * 0.01 + frameCount * 0.01), 0, 1, -1, 1)
    ).mult(0.3); // this value related to random of movement

    dirToPlayer.add(noiseOffset);
    dirToPlayer.normalize();

    // detect attack range
    if (distToPlayer <= this.attackRange) {
      if (this.attackCooldown <= 0) {
        player.takeDamage(this.damage);
        this.attackCooldown = 60 / this.attackSpeed;
      }
    } else {
      let nextPos = p5.Vector.add(this.pos, p5.Vector.mult(dirToPlayer, this.speed));
      let canMove = true;
      for (let obs of obstacles) {
        if (obs.collidesWith(nextPos, this.enWidth, this.enHeight)) {
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

        let dx = player.pos.x - this.pos.x;
        let dy = this.pos.y - player.pos.y;
        let angle = atan2(dy, dx);
        if (angle < 0) angle += TWO_PI;

        if (angle >= PI / 4 && angle < 3 * PI / 4) {
          this.currentAction = this.imageUp;
          this.direction = "up";
          this.enDelay = this.upNum;
        }
        else if (angle >= 3 * PI / 4 && angle < 5 * PI / 4) {
          this.currentAction = this.imageSide;
          this.direction = "left";
          this.enDelay = this.sideNum;
        }
        else if (angle >= 5 * PI / 4 && angle < 7 * PI / 4) {
          this.currentAction = this.imageDown;
          this.direction = "down";
          this.enDelay = this.downNum;
        }
        else {
          this.currentAction = this.imageSide;
          this.direction = "right";
          this.enDelay = this.sideNum;
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
    if (this.health <= 0) {
      this.health = 0;
      this.startDeathEffect(); //apply dead effect
      return true;
    }

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
    return false;
  }

  applyKnockback(knockbackVector) {
    let totalDistance = knockbackVector.mag();

    if (totalDistance < 1) {
      this.tryMove(knockbackVector);
      return;
    }

    let stepVector = knockbackVector.copy().normalize();
    let steps = Math.floor(totalDistance);
    let remainder = totalDistance - steps;

    for (let i = 0; i < steps; i++) {
      if (!this.tryMove(stepVector)) {

        break;
      }
    }

    if (remainder > 0) {
      let remainderVector = stepVector.copy().mult(remainder);
      this.tryMove(remainderVector);
    }
  }

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
    let healthPercentage = Math.max(0, Math.min(1, this.health / this.maxHealth));
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

  isCollidingWithObstacle(position) {
    for (let obs of obstacles) {
      if (obs.collidesWith(position, this.collisionWidth, this.collisionHeight)) {
        return true;
      }
    }
    return false;
  }
}

//-------------------class MeleeEnemy----------------
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

//-----------------------class RangedEnemy------------------
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

//----------------------class Boss-------------------------
class Boss extends Enemy {
  constructor(isElite = true, enemyType = "boss", enemyAction, enWidth, enHeight) {
    super(isElite, enemyType, enemyAction, enWidth, enHeight);
    this.isActive = true;
    this.invulnerableTime = 0;
    this.isFrozen = false;
    this.freezeEndTime = 0;
  }

  hit(damage) {
    this.health -= damage;
    
    // show damage value
    showFloatingText(
      "-" + Math.floor(damage),
      this.pos.x,
      this.pos.y - 20,
      color(255, 0, 0)
    );
    
    if (this.health <= 0) {
      this.health = 0;
      this.isActive = false;
      
      //show defeat info
      let bossName = this.constructor.name.replace("Boss", "");
      showFloatingText(`${bossName} Boss Defeated!`, this.pos.x, this.pos.y - 40, color(255, 215, 0));
      
      let remainingBosses = enemies.filter(e => (e instanceof Boss || e instanceof BugBoss) && e.health > 0);
      
      if (remainingBosses.length === 0) {
        bossDefeated++;
        bossActive = false;
        
        if (wave === 5) {
          gameState = "petSelection";
          player.needsPetSelection = true;
        } else if (wave === 15) {
          gameState = "vStory";
          finalStats = {
            normalEnemies: normalEnemiesDefeated,
            bosses: bossDefeated,
            level: player.level,
            attackPower: player.attackPower,
            attackSpeed: player.attackSpeed,
            attackDamage: player.attackDamage,
          };
        } else {
          wave++;
          showFloatingText("Wave " + wave, width / 2, height / 2, color(255, 255, 0), 40);
          spawnEnemiesForWave(wave);
        }
      }
      return true;
    }
    return false;
  }
}

//-----------------------class BirdBoss------------------
class BirdBoss extends Boss {
  constructor(birdBossAction) {
    super(true, "boss", birdBossAction, 150, 120);
    this.birdBossAction = birdBossAction;

    this.health = 800;
    this.maxHealth = 800;
    this.size = 150;
    this.speed = 2.5;
    this.attackRange = 150;
    this.attackSpeed = 1.5;
    this.damage = 30;
    this.type = "BirdBoss";

    this.meleeAttackCooldown = 0;
    this.meleeAttackRange = 60;
    this.meleeDamage = 40;
    this.dashCooldown = 0;
    this.isDashing = false;
    this.dashSpeed = 15; // dash speed
    this.dashDuration = 0;
    this.attackPattern = 0;
    this.patternTimer = 0;

    this.phase = 1;
    this.webWallCooldown = 0;
    this.summonCooldown = 0;
    this.birdlings = [];
    this.enrageTimer = 0;
    this.isEnraged = false;
    this.teleportCooldown = 0;
    this.shieldActive = false;
    this.shieldHealth = 200;

    this.webCooldown = 0;
    this.trailCounter = 0;

    this.isFrozen = false;
    this.freezeEndTime = 0;

    this.pos = createVector(width / 2, height / 2);
    this.radius = 20;
    this.expValue = 200;
    this.isActive = true;

    this.currentAnimation = birdBossAction.animation || [0, 1, 2, 3];
    this.frameIndex = 0;
    this.animationDelay = 20;
    this.animationCounter = 0;

    // feather falling
    this.featherFalling = false;
    this.featherEndTime = 0;
    this.featherOffsetY = 0;

    // skill sonic screen
    this.sonicScreechCooldown = 300;
    this.sonicWaves = []; 
    this.isScreeching = false;
    this.screechwaveCount = 0;
    this.waveInterval = 15;
    this.waveTimer = 0;

    // skill feather blades
    this.featherBladesCooldown = 0;
    this.featherBladesMaxCooldown = 480;
    this.skillOptions = ['dash', 'sonicScreech', 'featherBlades'];
  }


  hit(damage) {
    if (!this.isActive) return false;

    let offsets = [
      createVector(-30, -30),
      createVector(30, -30),
      createVector(-15, 0),
      createVector(15, 0)
    ];

    for (let off of offsets) {
      let fx = this.pos.x + off.x;
      let fy = this.pos.y + off.y;
      featherPool.get(fx, fy, featherSprite);
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

        if (wave === 5) {
          gameState = "petSelection";
          player.needsPetSelection = true;
        } else {
          wave++;
          setTimeout(() => {
            spawnEnemiesForWave(wave);
          }, 500);
        }

        if (wave === 15) {
          gameState = "vStory";
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

      if (this.featherFalling) {
        this.featherOffsetY += 2;
        if (millis() >= this.featherEndTime) {
          this.featherFalling = false;
        }
      }

      if (!this.isFrozen) {
        let dirToPlayer = p5.Vector.sub(player.pos, this.pos);
        let distToPlayer = dirToPlayer.mag();
        dirToPlayer.normalize();

        // update attack mode
        this.patternTimer++;
        if (this.patternTimer > 180) {
          this.attackPattern = (this.attackPattern + 1) % 2;
          this.patternTimer = 0;
        }

        if (this.isDashing) { //dash
          this.pos.add(p5.Vector.mult(dirToPlayer, this.dashSpeed));
          this.dashDuration--;
          if (this.dashDuration <= 0) {
            this.isDashing = false;
          }
        } else { //move commonly
          if (distToPlayer > this.attackRange) {
            this.pos.add(p5.Vector.mult(dirToPlayer, this.speed));
          }

          if (this.dashCooldown > 0) this.dashCooldown--;
          if (this.meleeAttackCooldown > 0) this.meleeAttackCooldown--;

          this.executeAttackPattern(dirToPlayer);

          if (distToPlayer < this.meleeAttackRange && this.meleeAttackCooldown <= 0) {
            this.performMeleeAttack();
          }
        }
      }

      if (this.invulnerableTime > 0) {
        this.invulnerableTime--;
      }

      this.animate();

      if (this.featherBladesCooldown > 0) {
        this.featherBladesCooldown--;
      }

      if (random() < 0.005 && !this.isDashing && !this.isScreeching) {
        let skill = random(this.skillOptions);

        if (skill === 'dash' && this.dashCooldown <= 0) {
          this.initiateDash();
        } else if (skill === 'sonicScreech' && this.sonicScreechCooldown <= 0) {
          this.sonicScreech();
        } else if (skill === 'featherBlades' && this.featherBladesCooldown <= 0) {
          this.releaseFeatherBlades();
        }
      }
    }
    catch (error) {
      console.error("Error in BirdBoss update:", error);
    }

    if (this.sonicScreechCooldown > 0) {
      this.sonicScreechCooldown--;
    }

    if (!this.isScreeching && this.sonicScreechCooldown <= 0) {
      let distToPlayer = p5.Vector.dist(this.pos, player.pos);
      if (distToPlayer < this.attackRange * 1.5) {
        this.sonicScreech();
      }
    }

    if (this.isScreeching) {
      this.waveTimer++;

      if (this.waveTimer >= this.waveInterval && this.screechwaveCount < 5) {
        this.sonicWaves.push({
          x: this.pos.x,
          y: this.pos.y,
          radius: 20,
          maxRadius: 200,
          alpha: 230
        });

        this.screechwaveCount++;
        this.waveTimer = 0;
      }

      if (this.screechwaveCount >= 5 && this.sonicWaves.length === 0) {
        this.isScreeching = false;
      }
    }

    for (let i = this.sonicWaves.length - 1; i >= 0; i--) {
      let wave = this.sonicWaves[i];

      wave.radius += 3;
      wave.alpha -= 2;

      // detect collision with players
      if (player && !player.stunned) {
        let distToPlayer = dist(wave.x, wave.y, player.pos.x, player.pos.y);
        if (distToPlayer < wave.radius + player.radius + 15 &&
          distToPlayer > wave.radius - 20) {
          //stun players
          player.stunned = true;
          player.stunDuration = 75; //duration time
          showFloatingText("Stunned!", player.pos.x, player.pos.y - 30, color(255, 255, 0), 20);
        }
      }

      // draw sonic screen wave
      push();
      noFill();
      strokeWeight(5);
      let c1 = color(100, 200, 255, wave.alpha);
      let c2 = color(200, 100, 255, wave.alpha * 0.7);
      let interColor = lerpColor(c1, c2, wave.radius / wave.maxRadius);
      stroke(interColor);
      ellipse(wave.x, wave.y, wave.radius * 2);

      stroke(255, 255, 255, wave.alpha * 0.5);
      strokeWeight(2);
      ellipse(wave.x, wave.y, wave.radius * 1.8);
      pop();

      if (wave.radius >= wave.maxRadius || wave.alpha <= 0) {
        this.sonicWaves.splice(i, 1);
      }
    }
  }

  executeAttackPattern(dirToPlayer) {
    switch (this.attackPattern) {
      case 0: // dash attack
        if (this.dashCooldown <= 0 && !this.isDashing) {
          this.performDashAttack();
        }
        break;
      case 1: // poison attack
        this.trailCounter++;
        if (this.trailCounter >= 10) {
          this.performPoisonAttack();
        }
        break;
    }
  }

  performPoisonAttack() {
    if (this.trailCounter >= 10) {
      const MAX_POISON_TRAILS = 20;
      if (poisonTrails.length < MAX_POISON_TRAILS) {
        for (let i = 0; i < 4; i++) {
          let angle = (i * PI) / 2;
          let offset = createVector(cos(angle) * 40, sin(angle) * 40);
          let poisonPos = p5.Vector.add(this.pos, offset);

          poisonTrails.push({
            pos: poisonPos,
            radius: 20,
            startTime: millis(),
            duration: 4000,
            frameIndex: 0,
            frameCount: 4,
            frameDelay: 8,
            frameCounter: 0,
            colorMod: color(255, 200, 50, 220)
          });
        }
      }
      this.trailCounter = 0;
    }
  }

  performDashAttack() {
    if (this.dashCooldown <= 0 && !this.isDashing) {
      this.isDashing = true;
      this.dashDuration = 20;
      this.dashCooldown = 120;
    }
  }

  performMeleeAttack() {
    player.takeDamage(this.meleeDamage);
    this.meleeAttackCooldown = 15;
  }

  handleDashing(dirToPlayer) {
    this.dashDuration--;
    if (this.dashDuration > 0) {
      this.pos.add(p5.Vector.mult(dirToPlayer, this.dashSpeed));
    } else {
      this.isDashing = false;
      this.dashDuration = 0;
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
    this.meleeAttackCooldown--;
    this.dashCooldown--;
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
  }

  displayHealthBar() {
    displayBossHealthBar();
  }

  featherAttack() {
    const rows = 2;
    const feathersPerRow = 8;
    const rowSpacing = 40;

    for (let row = 0; row < rows; row++) {
      for (let i = 0; i < feathersPerRow; i++) {
        if (feathers.length < MAX_FEATHERS) {
          const angle = (TWO_PI / feathersPerRow) * i;
          const xOffset = cos(angle) * 100;
          const yOffset = row * rowSpacing;

          const feather = new Feather(
            this.pos.x + xOffset,
            this.pos.y + yOffset,
            featherSprite
          );

          const vel = createVector(0, 2 + row * 0.5);
          feather.vel = vel;

          feathers.push(feather);
        }
      }
    }
  }

  sonicScreech() {
    this.isScreeching = true;
    this.screechwaveCount = 0;
    this.waveTimer = 0;

    this.sonicScreechCooldown = 300;

    // skill alarm text
    showFloatingText("Sonic Screech!", this.pos.x, this.pos.y - 40, color(255, 50, 50), 24);
  }

  releaseFeatherBlades() {
    this.featherBladesCooldown = this.featherBladesMaxCooldown;

    // skill alarm text
    showFloatingText("Feather Blade Assault!", this.pos.x, this.pos.y - 40, color(200, 200, 255), 24);

    let baseAngle = 0;
    if (player) {
      let dirToPlayer = p5.Vector.sub(player.pos, this.pos);
      baseAngle = dirToPlayer.heading();
    }

    let numberOfBlades = 10;
    let angleIncrement = TWO_PI / numberOfBlades;

    for (let i = 0; i < numberOfBlades; i++) {
      let attackAngle = baseAngle + i * angleIncrement;
      let bladeVel = createVector(cos(attackAngle), sin(attackAngle)).mult(6);
      enemyBullets.push(new FeatherProjectile(this.pos.x, this.pos.y, bladeVel, this.damage));
    }
  }
}

//---------------------class SlimeBoss-------------------------
class SlimeBoss extends Boss {
  constructor(slimeBossImage, type = "normal") {
    super(true, "slimeBoss", slimeBossImage, 200, 160);

    this.health = 200;
    this.maxHealth = 200;
    this.damage = 25;
    this.speed = 2.5;
    this.size = 120;
    this.isActive = true;

    let offsetX = 0;
    let offsetY = 0;

    switch (type) {
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

    this.pos = createVector(width / 2 + offsetX, height / 2 + offsetY);

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

    this.moveDistance1 = 1;
    this.moveDistance2 = 1;

    this.spawnTime = millis();
    this.initialStopDelay = 0;


    // movement related
    this.movedFrame15 = false;
    this.movedFrame16 = false;

    this.type = type;
    this.elementalColor = this.getElementalColor(type);
    this.elementalEffects = [];
    this.poisonPools = [];

    // skill related
    this.skillCooldown = 180;
    this.skillDelay = 300;

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
        return color(255, 60, 60, 220);
      case "water":
        return color(135, 206, 250, 200);
      case "poison":
        return color(148, 0, 211, 180);
      case "wind":
        return color(245, 245, 245, 220);
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

      if (millis() - this.spawnTime < this.initialStopDelay) {
        return;
      }
      this.animate();
      let currentFrame = this.currentAnimation[this.frameIndex];

      let dirToPlayer = p5.Vector.sub(player.pos, this.pos).normalize();

      if (!this.isDashing) {
        if (currentFrame === 15 && !this.movedFrame15) {
          let moveVec = p5.Vector.mult(dirToPlayer, this.moveDistance1);
          this.pos.add(moveVec);
          this.movedFrame15 = true;
        } else if (currentFrame !== 15) {
          this.movedFrame15 = false;
        }

        if (currentFrame === 16 && !this.movedFrame16) {
          let moveVec = p5.Vector.mult(dirToPlayer, this.moveDistance2);
          this.pos.add(moveVec);
          this.movedFrame16 = true;
        } else if (currentFrame !== 16) {
          this.movedFrame16 = false;
        }
      }

      // update sill cooldown
      if (this.skillCooldown > 0) {
        this.skillCooldown--;
      } else {
        console.log("Fire Slime casting skill, setting cooldown to:", this.skillDelay);

        this.useElementalSkill();
        this.skillCooldown = this.skillDelay;

        if (this.type === "fire") {
          this.skillDelay = Math.max(180, this.skillDelay);
        }
      }

      if (this.elementalEffects) {
        this.updateElementalEffects();
      }

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

  // flameSlime
  fireSkill() {
    console.log("Fire skill triggered, current cooldown:", this.skillCooldown);

    const flameCount = 12;
    const radius = this.flameRadius * 0.65;
    const innerRadius = this.flameRadius * 0.5;

    this.elementalEffects = this.elementalEffects.filter(effect => effect.type !== "fireRing");

    for (let i = 0; i < flameCount; i++) {
      const angle = (TWO_PI / flameCount) * i;
      const offsetX = cos(angle) * radius;
      const offsetY = sin(angle) * radius;

      const flameDuration = this.flameDuration || 90;

      this.elementalEffects.push({
        type: "fireRing",
        basePos: this.pos.copy(),
        pos: createVector(this.pos.x + offsetX, this.pos.y + offsetY),
        angle: angle,
        radius: this.flameRadius * 0.15,
        orbitRadius: radius,
        duration: flameDuration,
        damage: this.flameDamage / 60,
        startTime: millis(),
        rotationSpeed: 0.02,
        frameIndex: 0,
        frameCount: 6,
        frameDelay: 5,
        frameCounter: 0,
        visualScale: 2.0,
        creationTime: millis()
      });

      if (i % 2 === 0) {
        const innerAngle = angle + (TWO_PI / flameCount / 2);
        const innerOffsetX = cos(innerAngle) * innerRadius;
        const innerOffsetY = sin(innerAngle) * innerRadius;

        this.elementalEffects.push({
          type: "fireRing",
          basePos: this.pos.copy(),
          pos: createVector(this.pos.x + innerOffsetX, this.pos.y + innerOffsetY),
          angle: innerAngle,
          radius: this.flameRadius * 0.12,
          orbitRadius: innerRadius,
          duration: this.flameDuration,
          damage: this.flameDamage / 60,
          startTime: millis(),
          rotationSpeed: -0.01,
          frameIndex: Math.floor(random(6)),
          frameCount: 6,
          frameDelay: 6,
          frameCounter: 0,
          visualScale: 1.7
        });
      }
    }
  }

  // waterSlime skill
  waterSkill() {
    let dirToPlayer = p5.Vector.sub(player.pos, this.pos).normalize();

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
        radius: this.waveRadius * 0.5,
        duration: 90,
        slowDuration: this.slowDuration,
        slowAmount: this.slowAmount,
        pulseTime: millis(),
        frameIndex: 0,
        frameCount: 6,
        frameDelay: 8,
        frameCounter: 0,
        rotation: random(TWO_PI)
      });
    }
  }

  // poisonSlime skill
  poisonSkill() {
    this.poisonPools.push({
      pos: this.pos.copy(),
      radius: this.poisonRadius * 0.5,
      duration: this.poisonDuration,
      damage: this.poisonDamage,
      startRadius: this.poisonRadius * 0.5,
      maxRadius: this.poisonRadius * 1.5,
      spreadSpeed: this.poisonSpreadSpeed,
      frameIndex: 0,
      frameCount: 7,
      frameDelay: 8,
      frameCounter: 0,
      scale: 1.0
    });
  }

  // windSlime skill
  windSkill() {
    let angleToPlayer = atan2(player.pos.y - this.pos.y, player.pos.x - this.pos.x);

    for (let i = -1; i <= 1; i++) {
      let tornadoAngle = angleToPlayer + i * PI / 6;

      this.elementalEffects.push({
        type: "wind",
        pos: this.pos.copy(),
        angle: tornadoAngle,
        radius: this.windRadius * 0.6,
        duration: this.windDuration,
        force: this.windForce,
        startTime: millis(),
        particles: Array(20).fill().map(() => ({
          pos: this.pos.copy(),
          vel: p5.Vector.random2D().mult(random(2, 5)),
          life: random(20, 40)
        })),
        frameIndex: 0,
        frameCount: 12,
        frameDelay: 4,
        frameCounter: 0,
        scale: 0.8,
        moveSpeed: 3,
        moveDirection: p5.Vector.fromAngle(tornadoAngle).mult(3)
      });
    }
  }

  updateElementalEffects() {
    const now = millis();
    const MAX_EFFECT_LIFETIME = 10000;

    for (let i = this.elementalEffects.length - 1; i >= 0; i--) {
      let effect = this.elementalEffects[i];

      if (typeof effect.duration !== 'number') {
        console.log("Found effect with invalid duration:", effect.type);
        this.elementalEffects.splice(i, 1);
        continue;
      }
      if (effect.creationTime && now - effect.creationTime > MAX_EFFECT_LIFETIME) {
        console.log("Force removing long-lived effect:", effect.type);
        this.elementalEffects.splice(i, 1);
        continue;
      }

      if (effect.duration <= 0) {
        this.elementalEffects.splice(i, 1);
        continue;
      }

      effect.duration--;

      switch (effect.type) {
        case "fireRing":
          effect.angle += effect.rotationSpeed;
          const newX = effect.basePos.x + cos(effect.angle) * effect.orbitRadius;
          const newY = effect.basePos.y + sin(effect.angle) * effect.orbitRadius;
          effect.pos.x = newX;
          effect.pos.y = newY;

          if (effect.frameCounter !== undefined) {
            effect.frameCounter++;
            if (effect.frameCounter >= effect.frameDelay) {
              effect.frameCounter = 0;
              effect.frameIndex = (effect.frameIndex + 1) % effect.frameCount;
            }
          }

          if (p5.Vector.dist(player.pos, effect.pos) < effect.radius + player.radius) {
            player.takeDamage(effect.damage);
            showFloatingText("Burning!", player.pos.x, player.pos.y - 20, color(255, 100, 0));
          }

          effect.basePos = this.pos.copy();
          break;

        case "water":
          effect.pos.add(effect.vel);

          if (effect.frameCounter !== undefined) {
            effect.frameCounter++;
            if (effect.frameCounter >= effect.frameDelay) {
              effect.frameCounter = 0;
              effect.frameIndex = (effect.frameIndex + 1) % effect.frameCount;
            }
          }

          if (effect.rotation !== undefined) {
            effect.rotation += 0.02;
          }

          let pulse = sin((millis() - effect.pulseTime) / 100) * 10;
          if (p5.Vector.dist(player.pos, effect.pos) < effect.radius + pulse) {
            player.speed *= effect.slowAmount;
            setTimeout(() => player.speed /= effect.slowAmount, effect.slowDuration);
            showFloatingText("Slowed!", player.pos.x, player.pos.y - 20, color(0, 100, 255));
          }
          break;

        case "wind":
          if (effect.moveDirection) {
            effect.pos.add(effect.moveDirection);
          }

          if (effect.frameCounter !== undefined) {
            effect.frameCounter++;
            if (effect.frameCounter >= effect.frameDelay) {
              effect.frameCounter = 0;
              effect.frameIndex = (effect.frameIndex + 1) % effect.frameCount;
            }
          }

          effect.particles.forEach(p => {
            p.pos.add(p.vel);
            p.life--;
          });
          effect.particles = effect.particles.filter(p => p.life > 0);

          if (effect.particles.length < 10) {
            for (let j = 0; j < 3; j++) {
              effect.particles.push({
                pos: effect.pos.copy().add(random(-30, 30), random(-30, 30)),
                vel: p5.Vector.fromAngle(effect.angle + random(-0.5, 0.5)).mult(random(2, 5)),
                life: random(10, 20)
              });
            }
          }

          let playerDist = p5.Vector.dist(player.pos, effect.pos);
          if (playerDist < effect.radius) {
            let pushStrength = map(playerDist, 0, effect.radius, effect.force, effect.force * 0.3);
            let pushDir = p5.Vector.fromAngle(effect.angle).mult(pushStrength);
            player.pos.add(pushDir);
            showFloatingText("Blown Away!", player.pos.x, player.pos.y - 20, color(200, 200, 255));
          }

          for (let j = bullets.length - 1; j >= 0; j--) {
            let bullet = bullets[j];
            let bulletDist = p5.Vector.dist(bullet.pos, effect.pos);
            if (bulletDist < effect.radius) {
              let bulletPush = p5.Vector.fromAngle(effect.angle).mult(1.5);
              bullet.vel.add(bulletPush);
            }
          }
          break;
      }
    }

    if (this.type === "poison") {
      for (let i = this.poisonPools.length - 1; i >= 0; i--) {
        let pool = this.poisonPools[i];
        pool.duration--;

        pool.radius = min(pool.maxRadius, pool.radius + pool.spreadSpeed);

        if (pool.frameCounter !== undefined) {
          pool.frameCounter++;
          if (pool.frameCounter >= pool.frameDelay) {
            pool.frameCounter = 0;
            pool.frameIndex = (pool.frameIndex + 1) % pool.frameCount;
          }
        }

        if (pool.startRadius && pool.maxRadius) {
          pool.scale = map(pool.radius, pool.startRadius, pool.maxRadius, 0.8, 1.6);
        }

        // deteck if player is in poison
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

    for (let effect of this.elementalEffects) {
      switch (effect.type) {
        case "fire":
          if (fireballImg) {
            push();
            imageMode(CENTER);
            translate(effect.pos.x, effect.pos.y);

            let frameWidth = fireballImg.width / 6;
            let frameHeight = fireballImg.height;

            let displaySize = effect.radius * 2.5;

            image(
              fireballImg,
              0, 0,
              displaySize, displaySize,
              effect.frameIndex * frameWidth, 0,
              frameWidth, frameHeight
            );

            drawingContext.shadowBlur = 8;
            drawingContext.shadowColor = color(255, 120, 0, 150);
            noFill();
            noStroke();
            ellipse(0, 0, displaySize * 0.9);
            drawingContext.shadowBlur = 0;

            pop();
          } else {
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

            let frameWidth = fireballImg.width / 6;
            let frameHeight = fireballImg.height;

            let displaySize = effect.radius * (effect.visualScale || 2.5);

            image(
              fireballImg,
              0, 0,
              displaySize, displaySize,
              effect.frameIndex * frameWidth, 0,
              frameWidth, frameHeight
            );

            drawingContext.shadowBlur = 8;
            drawingContext.shadowColor = color(255, 120, 0, 150);
            noFill();
            noStroke();
            ellipse(0, 0, displaySize * 0.9);
            drawingContext.shadowBlur = 0;

            pop();
          } else {
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

            if (effect.rotation !== undefined) {
              rotate(effect.rotation);
            }

            let frameWidth = waterBubbleImg.width / 6;
            let frameHeight = waterBubbleImg.height;

            let displaySize = effect.radius * 3;

            image(
              waterBubbleImg,
              0, 0,
              displaySize, displaySize,
              effect.frameIndex * frameWidth, 0,
              frameWidth, frameHeight
            );

            drawingContext.shadowBlur = 10;
            drawingContext.shadowColor = color(80, 120, 255, 120);
            noFill();
            noStroke();
            ellipse(0, 0, displaySize * 0.9);
            drawingContext.shadowBlur = 0;

            pop();
          } else {
            fill(100, 150, 255, 150);
            noStroke();
            ellipse(effect.pos.x, effect.pos.y, effect.radius * 2);
          }
          break;

        case "wind":
          if (windTornadoImg && effect.frameIndex !== undefined) {
            push();
            imageMode(CENTER);
            translate(effect.pos.x, effect.pos.y);
            rotate(effect.angle);

            let frameWidth = windTornadoImg.width / effect.frameCount;
            let frameHeight = windTornadoImg.height;

            let displaySize = effect.radius * (effect.scale || 0.8);

            image(
              windTornadoImg,
              0, 0,
              displaySize, displaySize,
              effect.frameIndex * frameWidth, 0,
              frameWidth, frameHeight
            );

            drawingContext.shadowBlur = 15;
            drawingContext.shadowColor = color(255, 255, 255, 150);
            noFill();
            noStroke();
            ellipse(0, 0, displaySize * 0.6);
            drawingContext.shadowBlur = 0;

            pop();
          }

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

    // draw poison
    if (this.type === "poison" && this.poisonPools) {
      for (let pool of this.poisonPools) {
        if (poisonVortexImg) {
          push();
          imageMode(CENTER);
          translate(pool.pos.x, pool.pos.y);

          let frameWidth = poisonVortexImg.width / pool.frameCount;
          let frameHeight = poisonVortexImg.height;

          let displaySize = pool.radius * 2 * pool.scale;

          image(
            poisonVortexImg,
            0, 0,
            displaySize, displaySize,
            pool.frameIndex * frameWidth, 0,
            frameWidth, frameHeight
          );

          drawingContext.shadowBlur = 15;
          drawingContext.shadowColor = color(0, 200, 50, 120);
          noFill();
          noStroke();
          ellipse(0, 0, displaySize * 0.9);
          drawingContext.shadowBlur = 0;

          pop();
        } else {
          for (let r = 0; r < 3; r++) {
            let alpha = map(r, 0, 2, 100, 30);
            fill(0, 200, 0, alpha);
            noStroke();
            ellipse(pool.pos.x, pool.pos.y, pool.radius * 2 * (1 - r * 0.2));
          }
        }
      }
    }

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

  featherAttack() {
    const rows = 2;
    const feathersPerRow = 8;
    const rowSpacing = 40;

    for (let row = 0; row < rows; row++) {
      for (let i = 0; i < feathersPerRow; i++) {
        if (feathers.length < MAX_FEATHERS) {
          const angle = (TWO_PI / feathersPerRow) * i;
          const xOffset = cos(angle) * 100;
          const yOffset = row * rowSpacing;

          const feather = new Feather(
            this.pos.x + xOffset,
            this.pos.y + yOffset,
            featherSprite
          );

          const vel = createVector(0, 2 + row * 0.5);
          feather.vel = vel;

          feathers.push(feather);
        }
      }
    }
  }
}

//----------------------------class BugBoss------------------
class BugBoss extends Enemy {
  constructor() {
    super(true, "boss", commonEnemyAction, 40, 40);

    this.health = 2400;
    this.maxHealth = 2400;
    this.radius = 30;
    this.speed = 2;
    this.damage = 20;
    this.attackRange = 100;
    this.expValue = 100;
    this.isBoss = true;

    // ghostFire
    this.ghostFireCooldown = 0;
    this.ghostFireInterval = 150;

    // rapidClaw
    this.rapidClawCooldown = 90;
    this.rapidClawInterval = 225;
    this.isRapidClawActive = false;
    this.rapidClawStage = 0;
    this.attackAnimationTime = 0;
    this.attackAnimationDuration = 20;
    this.attackDamageTime = 10;
    this.attackDelay = 5;
    this.attackDelayCounter = 0;
    this.baseClawDamage = 30;
    this.baseClawRange = 80;

    this.frameIndex = 0;
    this.frameDelay = 8;
    this.frameCounter = 0;
    this.totalFrames = 6;

    // basic direction
    this.direction = 'down';

    this.customImages = {
      left: bugBossSide,
      right: bugBossSide,
      up: bugBossUp,
      down: bugBossDown
    };

    this.attackImages = {
      left: bugBossAttackSide,
      right: bugBossAttackSide,
      up: bugBossAttackUp,
      down: bugBossAttackDown
    };

    this.ghostFireCooldown = random(60, 120);
    this.rapidClawCooldown = random(120, 240);
  }

  update() {
    if (this.invulnerableTime > 0) {
      this.invulnerableTime--;
    }

    if (this.isRapidClawActive) {
      this.updateRapidClawAttack();
      return;
    }

    this.frameCounter++;
    if (this.frameCounter >= this.frameDelay) {
      this.frameCounter = 0;
      this.frameIndex = (this.frameIndex + 1) % this.totalFrames;
    }

    let dirToPlayer = p5.Vector.sub(player.pos, this.pos);

    // set direction
    if (Math.abs(dirToPlayer.x) > Math.abs(dirToPlayer.y)) {
      this.direction = dirToPlayer.x > 0 ? 'right' : 'left';
    } else {
      this.direction = dirToPlayer.y > 0 ? 'down' : 'up';
    }

    let distToPlayer = dirToPlayer.mag();
    if (distToPlayer < this.attackRange) {
      dirToPlayer.normalize().mult(this.speed * 0.5);

      //attack player
      if (this.attackCooldown <= 0) {
        player.takeDamage(this.damage);
        this.attackCooldown = 60;
        showFloatingText("Attack!", this.pos.x, this.pos.y - 30, color(255, 0, 0));
      } else {
        this.attackCooldown--;
      }
    } else {
      dirToPlayer.normalize().mult(this.speed);
    }

    this.vel = dirToPlayer;
    this.pos.add(this.vel);

    //ghostFire
    if (this.ghostFireCooldown <= 0) {
      this.castGhostFire();
      this.ghostFireCooldown = this.ghostFireInterval;
      showFloatingText("GhostFire!", this.pos.x, this.pos.y - 40, color(70, 180, 255), 20);
    } else {
      this.ghostFireCooldown--;
    }

    //rapidClaw
    if (this.rapidClawCooldown <= 0) {
      this.startRapidClawAttack();
      this.rapidClawCooldown = this.rapidClawInterval;
    } else {
      this.rapidClawCooldown--;
    }

    this.resolveCollision();
  }

  startRapidClawAttack() {
    showFloatingText("RapidClaw!", this.pos.x, this.pos.y - 40, color(255, 100, 100), 20);
    this.isRapidClawActive = true;
    this.rapidClawStage = 0;
    this.attackAnimationTime = 0;
    this.teleportToPlayer();
  }

  teleportToPlayer() {
    let dirToPlayer = p5.Vector.sub(player.pos, this.pos);

    if (Math.abs(dirToPlayer.x) > Math.abs(dirToPlayer.y)) {
      this.direction = dirToPlayer.x > 0 ? 'right' : 'left';
    } else {
      this.direction = dirToPlayer.y > 0 ? 'down' : 'up';
    }

    let teleportDistance = 80;
    let teleportDirection = dirToPlayer.copy().normalize().mult(teleportDistance);
    this.pos = p5.Vector.add(player.pos, teleportDirection.mult(-1)); // 反方向

    //draw effect
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

  updateRapidClawAttack() {
    if (this.attackDelayCounter > 0) {
      this.attackDelayCounter--;
      return;
    }

    this.attackAnimationTime++;

    if (this.attackAnimationTime === this.attackDamageTime) {
      this.performRapidClawDamage();
    }

    if (this.attackAnimationTime >= this.attackAnimationDuration) {
      this.attackAnimationTime = 0;
      this.rapidClawStage++;

      if (this.rapidClawStage >= 3) {
        this.isRapidClawActive = false;
        return;
      }

      this.attackDelayCounter = this.attackDelay;
      this.teleportToPlayer();
    }

    let totalFramesInAttack = 6;
    this.frameIndex = Math.floor((this.attackAnimationTime / this.attackAnimationDuration) * totalFramesInAttack);
    if (this.frameIndex >= totalFramesInAttack) this.frameIndex = totalFramesInAttack - 1;
  }

  performRapidClawDamage() {

    let stageDamage = this.baseClawDamage * (1 + this.rapidClawStage * 0.5);
    let stageRange = this.baseClawRange * (1 + this.rapidClawStage * 0.5);

    let attackArea = this.calculateAttackArea(stageRange);
    let hitPlayerSuccess = this.checkPlayerInAttackArea(attackArea);

    if (hitPlayerSuccess) {
      player.takeDamage(stageDamage);
      showFloatingText("-" + stageDamage, player.pos.x, player.pos.y - 20, color(255, 0, 0));

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

    this.visualizeAttackArea(attackArea, this.rapidClawStage + 6);
  }

  //count attackArea
  calculateAttackArea(range) {
    let area = {};

    switch (this.direction) {
      case 'left':
        area = {
          x: this.pos.x - range / 2,
          y: this.pos.y - range / 4,
          w: range,
          h: range / 2
        };
        break;
      case 'right':
        area = {
          x: this.pos.x - range / 2,
          y: this.pos.y - range / 4,
          w: range,
          h: range / 2
        };
        break;
      case 'up':
        area = {
          x: this.pos.x - range / 4,
          y: this.pos.y - range / 2,
          w: range / 2,
          h: range
        };
        break;
      case 'down':
        area = {
          x: this.pos.x - range / 4,
          y: this.pos.y - range / 2,
          w: range / 2,
          h: range
        };
        break;
    }

    return area;
  }

  checkPlayerInAttackArea(area) {
    let center = createVector(area.x + area.w / 2, area.y + area.h / 2);
    let radius = max(area.w, area.h) / 2;

    let dist = p5.Vector.dist(center, player.pos);
    return dist < radius + player.radius;
  }

  visualizeAttackArea(area, slashCount = 6) {
    let angleOffset = this.direction === 'left' || this.direction === 'right' ? 0 : HALF_PI;

    let length = area.w * (0.8 + this.rapidClawStage * 0.3);

    for (let i = 0; i < slashCount; i++) {
      let angle = map(i, 0, slashCount - 1, -PI / 3, PI / 3) + angleOffset;
      if (this.direction === 'left') angle += PI;

      let x = this.pos.x + cos(angle) * length / 2;
      let y = this.pos.y + sin(angle) * length / 2;

      poisonTrails.push({
        pos: createVector(x, y),
        radius: 10 + this.rapidClawStage * 5,
        startTime: millis(),
        duration: 300,
        frameIndex: 0,
        frameCounter: 0,
        frameCount: this.clawEffectFrames,
        frameDelay: this.clawEffectDelay,
        isClawEffect: true
      });
    }
  }

  display() {
    push();
    imageMode(CENTER);

    let currentImage;

    if (this.isRapidClawActive) {
      currentImage = this.attackImages[this.direction];
    } else {
      currentImage = this.customImages[this.direction];
    }

    let frameWidth = currentImage.width / this.totalFrames;
    let frameHeight = currentImage.height;

    if (this.direction === 'left') {
      translate(this.pos.x, this.pos.y);
      scale(-1, 1);
      image(
        currentImage,
        0, 0,
        this.radius * 2.5, this.radius * 2.5,
        this.frameIndex * frameWidth, 0,
        frameWidth, frameHeight
      );
    } else {
      image(
        currentImage,
        this.pos.x, this.pos.y,
        this.radius * 2.5, this.radius * 2.5,
        this.frameIndex * frameWidth, 0,
        frameWidth, frameHeight
      );
    }

    pop();

    this.displayHealthBar();
  }

  displayHealthBar() {
    bossActive = true;

    //draw health bar
    push();
    fill(100, 100, 100, 200);
    rect(width / 2 - 200, 50, 400, 20);

    //count value
    let healthPercent = this.health / this.maxHealth;
    fill(255, 0, 0);
    rect(width / 2 - 200, 50, 400 * healthPercent, 20);
    pop();
  }

  castGhostFire() {
    for (let i = 0; i < 6; i++) {
      let angle = TWO_PI * i / 6;
      let radius = 50;
      let x = this.pos.x + cos(angle) * radius;
      let y = this.pos.y + sin(angle) * radius;

      enemyBullets.push(new GhostFire(x, y));
    }
  }

  castVisionBlock() {
    this.isVisionBlocked = true;
    this.visionBlockTimer = this.visionBlockDuration;
  }
}

class FeatherPool {
  constructor(maxSize = 80) {
    this.pool = [];
    this.maxSize = maxSize;
    this.active = [];
  }

  get(x, y, sprite) {
    if (this.active.length >= this.maxSize) {
      if (this.active.length > 0) {
        this.release(this.active[0]);
      }
    }

    let feather;
    if (this.pool.length > 0) {
      feather = this.pool.pop();
      feather.reset(x, y, sprite);
    } else {
      feather = new Feather(x, y, sprite);
    }

    this.active.push(feather);
    return feather;
  }

  release(feather) {
    const index = this.active.indexOf(feather);
    if (index !== -1) {
      this.active.splice(index, 1);

      feather.lifetime = 0;
      this.pool.push(feather);
    }
  }

  update() {
    for (let i = this.active.length - 1; i >= 0; i--) {
      const feather = this.active[i];
      if (!feather.update()) {
        this.release(feather);
      }
    }
  }

  display() {
    for (const feather of this.active) {
      if (!feather.isOffScreen()) {
        feather.display();
      }
    }
  }
}

const featherPool = new FeatherPool(80);

//--------------------class FeatherProjectile-----------------
class FeatherProjectile {
  constructor(x, y, vel, damage) {
    this.pos = createVector(x, y);
    this.vel = vel;
    this.damage = damage || 20;
    this.lifespan = 120;
    this.width = 24;
    this.height = 24;
    this.hitRadius = 10;
    this.isActive = true;

    this.frameIndex = 0;
    this.totalFrames = 8;
    this.animationSpeed = 0.2;
  }

  update() {
    this.pos.add(this.vel);

    this.frameIndex = (this.frameIndex + this.animationSpeed) % this.totalFrames;

    this.lifespan--;
    if (this.lifespan <= 0) {
      this.isActive = false;
      return;
    }

    if (this.pos.x < 0 || this.pos.x > width || this.pos.y < 0 || this.pos.y > height) {
      this.isActive = false;
      return;
    }

    if (player && this.isActive) {
      let distToPlayer = dist(this.pos.x, this.pos.y, player.pos.x, player.pos.y);
      if (distToPlayer < this.hitRadius + player.radius) {
        player.takeDamage(this.damage);
        for (let i = 0; i < 5; i++) {
          poisonTrails.push({
            pos: createVector(
              this.pos.x + random(-10, 10),
              this.pos.y + random(-10, 10)
            ),
            radius: random(3, 8),
            startTime: millis(),
            duration: 500,
            color: color(200, 240, 255, 150)
          });
        }

        this.isActive = false;
        return;
      }
    }
  }

  display() {
    push();
    let angle = this.vel.heading() + PI / 2;

    translate(this.pos.x, this.pos.y);
    rotate(angle);

    if (featherBladeSprite) {
      let currentFrame = Math.floor(this.frameIndex);
      let frameWidth = featherBladeSprite.width / 8;

      tint(220, 240, 255, 230);

      image(
        featherBladeSprite,
        -this.width / 2,
        -this.height / 2,
        this.width,
        this.height,
        currentFrame * frameWidth,
        0,
        frameWidth,
        featherBladeSprite.height
      );
    } else {
      fill(200, 240, 255);
      noStroke();
      rect(-this.width / 2, -this.height / 2, this.width, this.height);
    }

    pop();

    //trail effects
    if (frameCount % 2 === 0) {
      poisonTrails.push({
        pos: createVector(
          this.pos.x,
          this.pos.y
        ),
        radius: random(2, 5),
        startTime: millis(),
        duration: 300,
        color: color(200, 240, 255, 100)
      });
    }
  }
}
