// pet
class BasePet {
  constructor() {
    this.pos = createVector(0, 0);
    this.radius = 15;
  }

  follow(player) { }
  update(player) { }
  display() { }
}

// pet 1
class AttackPet extends BasePet {
  constructor(x, y) {
    super();
    this.pos = createVector(x, y);
    this.attackRange = 40;
    this.attackDamage = 15;
    this.speed = 4;
    this.orbitRadius = 30;
    this.angle = 0;
    this.idleImage = foxMoveFront;
    this.attackImage = foxAttackFront;
    this.currentImage = this.idleImage;
    this.frameIndex = 0;
    this.totalFrames = 4;
    this.frameDelay = 10;
    this.frameCounter = 0;
    this.isAttacking = false;
    this.attackCooldown = 0;
    this.attackTimer = 0;
  }

  follow(player) {
    this.angle += 0.05;
    const targetPos = createVector(
      player.pos.x + cos(this.angle) * this.orbitRadius,
      player.pos.y + player.ImageHeight - (35 / 2)
    );
    this.pos.lerp(targetPos, 0.1);

    if (player.vel.x > 0) {
      this.currentImage = foxMoveRight;
    } else if (player.vel.x < 0) {
      this.currentImage = foxMoveLeft;
    } else if (player.vel.y > 0) {
      this.currentImage = foxMoveFront;
    } else if (player.vel.y < 0) {
      this.currentImage = foxMoveBack;
    }
  }

  attack(enemies) {
    this.attackCooldown--;

    let detectionRange = player.ImageWidth * 3;
    let playerCenter = createVector(
      player.pos.x + player.ImageWidth / 2,
      player.pos.y + player.ImageHeight / 2
    );

    let closest = null;
    let record = Infinity;
    for (const enemy of enemies) {
      const d = p5.Vector.dist(this.pos, enemy.pos);
      if (d < record) {
        record = d;
        closest = enemy;
      }
    }

    if (closest && record < detectionRange && this.attackCooldown <= 0) {
      closest.hit(this.attackDamage);
      this.attackCooldown = 30;
      this.isAttacking = true;
      this.attackTimer = 15;

      if (player.vel.x > 0) {
        this.currentImage = foxAttackRight;
      } else if (player.vel.x < 0) {
        this.currentImage = foxAttackLeft;
      } else if (player.vel.y > 0) {
        this.currentImage = foxAttackFront;
      } else if (player.vel.y < 0) {
        this.currentImage = foxAttackBack;
      }
      showFloatingText("⚔️", this.pos.x, this.pos.y, color(255, 200, 0));
    }
  }

  display() {
    this.frameCounter++;
    if (this.frameCounter >= this.frameDelay) {
      this.frameCounter = 0;
      this.frameIndex = (this.frameIndex + 1) % this.totalFrames;
    }

    if (!this.isAttacking) {
      if (player.vel.x > 0) {
        this.currentImage = foxMoveRight;
      } else if (player.vel.x < 0) {
        this.currentImage = foxMoveLeft;
      } else if (player.vel.y > 0) {
        this.currentImage = foxMoveFront;
      } else if (player.vel.y < 0) {
        this.currentImage = foxMoveBack;
      }
    }

    let drawSize = this.isAttacking ? 45 : 35;
    push();
    imageMode(CENTER);
    if (this.isAttacking) {
      tint(255, 150, 150);
    }

    if (this.currentImage) {
      let sx = this.frameIndex * (this.currentImage.width / this.totalFrames);
      image(
        this.currentImage,
        this.pos.x,
        this.pos.y,
        drawSize,
        drawSize,
        sx,
        0,
        this.currentImage.width / this.totalFrames,
        this.currentImage.height
      );
      pop();
    }

    if (this.attackTimer > 0) {
      this.attackTimer--;
    } else {
      this.isAttacking = false;
    }
  }


  update(player) {
    if (!this.isAttacking) {
      this.follow(player);
    }
    this.attack(enemies);
  }
}

// pet 2
class DefensePet extends BasePet {
  constructor() {
    super();
    this.shieldCharge = 0;
    this.isShieldActive = false;
    this.shieldDuration = 90;
    this.shieldTimer = 0;
    this.shieldChargeInterval = 15000;
    this.lastShieldTime = 0;


    this.frameIndex = 0;
    this.frameCounter = 0;
    this.frameDelay = 10;
    this.totalFrames = 4;
    this.currentImage = cowMoveFront;
    this.petVisible = true;

    this.effectFrameIndex = 0;
    this.effectFrameCounter = 0;
    this.effectFrameDelay = 5;
    this.totalEffectFrames = 4;

  }

  follow(player) {
    if (this.petVisible) {
      const target = p5.Vector.add(player.pos, createVector(80, 60));
      this.pos.lerp(target, 0.1);
    }
  }

  update(player) {
    if (!this.isShieldActive) {
      this.follow(player);
      if (millis() - this.lastShieldTime > this.shieldChargeInterval) {
        this.activateShield(player);
        this.lastShieldTime = millis();
      }
    } else {
      this.shieldTimer--;
      if (this.shieldTimer <= 0) {
        this.deactivateShield(player);
      }
    }
  }

  activateShield(player) {
    this.isShieldActive = true;
    this.shieldTimer = this.shieldDuration;
    player.invincible = true;
    this.petVisible = false;
    showFloatingText("Shield activation!", player.pos.x, player.pos.y - 40, color(0, 200, 255));
  }

  deactivateShield(player) {
    this.isShieldActive = false;
    player.invincible = false;
    this.petVisible = true;
    showFloatingText("Shield disappearing", player.pos.x, player.pos.y - 40, color(100));
  }

  display() {
    if (this.isShieldActive) {
      push();
      imageMode(CENTER);
      let shieldX = player.pos.x + player.ImageWidth / 2;
      let shieldY = player.pos.y + player.ImageHeight / 2;
      let shieldDiameter = max(player.ImageWidth, player.ImageHeight) + 40;

      this.effectFrameCounter++;
      if (this.effectFrameCounter >= this.effectFrameDelay) {
        this.effectFrameCounter = 0;
        this.effectFrameIndex = (this.effectFrameIndex + 1) % this.totalEffectFrames;
      }
      let sx = this.effectFrameIndex * (cowCover.width / this.totalEffectFrames);
      image(cowCover, shieldX, shieldY, shieldDiameter, shieldDiameter,
        sx, 0, cowCover.width / this.totalEffectFrames, cowCover.height);
      pop();
      return;
    }

    this.frameCounter++;
    if (this.frameCounter >= this.frameDelay) {
      this.frameCounter = 0;
      this.frameIndex = (this.frameIndex + 1) % this.totalFrames;
    }

    if (player.vel.x > 0) {
      this.currentImage = cowMoveRight;
    } else if (player.vel.x < 0) {
      this.currentImage = cowMoveLeft;
    } else if (player.vel.y > 0) {
      this.currentImage = cowMoveFront;
    } else if (player.vel.y < 0) {
      this.currentImage = cowMoveBack;
    }

    if (this.currentImage) {
      let sx = this.frameIndex * (this.currentImage.width / this.totalFrames);
      push();
      imageMode(CENTER);
      image(
        this.currentImage,
        this.pos.x,
        this.pos.y,
        35, 35,
        sx,
        0,
        this.currentImage.width / this.totalFrames,
        this.currentImage.height
      );
      pop();
    }

    if (!this.isShieldActive) {
      push();
      textSize(12);
      fill(255);
      textAlign(CENTER);
      let progress = floor(((millis() - this.lastShieldTime) / this.shieldChargeInterval) * 100);
      text(`${progress}%`, this.pos.x, this.pos.y + 25);
      pop();
    }
  }
}

// pet 3
class HealerPet extends BasePet {
  constructor() {
    super();
    this.healAmount = 0.4;
    this.healTick = 0;
    this.healInterval = 60;
    this.angle = 0;
    this.orbitRadius = 30;
    this.frameIndex = 0;
    this.frameCounter = 0;
    this.frameDelay = 10;
    this.totalFrames = 4;
    this.currentImage = fairyMoveFront;
  }

  follow(player) {
    this.angle += 0.02;
    const orbitX = player.pos.x + cos(this.angle) * this.orbitRadius;
    const orbitY = player.pos.y + sin(this.angle) * this.orbitRadius;
    this.pos = createVector(orbitX, orbitY);
  }

  update(player) {
    this.follow(player);
    this.healTick++;
    if (this.healTick >= this.healInterval) {
      this.healTick = 0;
      if (player.health < player.maxHealth) {
        player.health = min(player.health + this.healAmount, player.maxHealth);
        showFloatingText(
          "+" + this.healAmount,
          player.pos.x,
          player.pos.y - 20,
          color(0, 255, 0)
        );
      }
    }
  }

  display() {
    push();
    noFill();
    stroke(0, 255, 150, 100);
    strokeWeight(2);
    ellipse(this.pos.x, this.pos.y, this.radius * 2);
    pop();

    this.frameCounter++;
    if (this.frameCounter >= this.frameDelay) {
      this.frameCounter = 0;
      this.frameIndex = (this.frameIndex + 1) % this.totalFrames;
    }

    if (player.vel.x > 0) {
      this.currentImage = fairyMoveRight;
    } else if (player.vel.x < 0) {
      this.currentImage = fairyMoveLeft;
    } else if (player.vel.y > 0) {
      this.currentImage = fairyMoveFront;
    } else if (player.vel.y < 0) {
      this.currentImage = fairyMoveBack;
    }

    if (this.currentImage) {
      let sx = this.frameIndex * (this.currentImage.width / this.totalFrames);
      push();
      imageMode(CENTER);
      image(
        this.currentImage,
        this.pos.x,
        this.pos.y,
        35, 35,
        sx,
        0,
        this.currentImage.width / this.totalFrames,
        this.currentImage.height
      );
      pop();
    }
  }
}

function showPetSelectionScreen() {
  push();
  background(0, 180);

  fill(255);
  textSize(36);
  textAlign(CENTER, CENTER);
  text("Choose your combat partner!", width / 2, height / 6);

  let boxWidth = 300;
  let boxHeight = 200;
  let yOffset = height / 2 - 100;

  fill(50, 50, 50, 200);
  rect(width / 4 - boxWidth / 2, yOffset, boxWidth, boxHeight, 15);
  rect(width / 2 - boxWidth / 2, yOffset, boxWidth, boxHeight, 15);
  rect(width * 3 / 4 - boxWidth / 2, yOffset, boxWidth, boxHeight, 15);

  fill(255);
  textSize(24);
  text("Blaze 🔥", width / 4, yOffset + 40);
  text("Aegis 🛡️", width / 2, yOffset + 40);
  text("Aurora ✨", width * 3 / 4, yOffset + 40);

  let eggY = yOffset + (40 + 180) / 2;
  imageMode(CENTER);
  image(eggFox, width / 4, eggY, 100, 100);
  image(eggCow, width / 2, eggY, 100, 100);
  image(eggFairy, width * 3 / 4, eggY, 100, 100);

  textSize(16);
  fill(255, 230);
  text("Auto-attacks nearby enemies", width / 4, yOffset + 180);
  text("Gives a 1.5s shield every 15s", width / 2, yOffset + 180);
  text("Heals 0.4 HP per second", width * 3 / 4, yOffset + 180);
  pop();


  if (mouseIsPressed) {
    if (mouseX > width / 4 - boxWidth / 2 && mouseX < width / 4 + boxWidth / 2 &&
      mouseY > yOffset && mouseY < yOffset + boxHeight) {

      player.pet = new AttackPet(player.pos.x, player.pos.y);
      selectedPetFrontImage = foxMoveFront;
      gameState = "petReveal";
      petRevealTimer = 0;
      petRevealFrameIndex = 0;
      petRevealFrameCounter = 0;
    } else if (mouseX > width / 2 - boxWidth / 2 && mouseX < width / 2 + boxWidth / 2 &&
      mouseY > yOffset && mouseY < yOffset + boxHeight) {

      player.pet = new DefensePet();
      selectedPetFrontImage = cowMoveFront;
      gameState = "petReveal";
      petRevealTimer = 0;
      petRevealFrameIndex = 0;
      petRevealFrameCounter = 0;
    } else if (mouseX > width * 3 / 4 - boxWidth / 2 && mouseX < width * 3 / 4 + boxWidth / 2 &&
      mouseY > yOffset && mouseY < yOffset + boxHeight) {

      player.pet = new HealerPet();
      selectedPetFrontImage = fairyMoveFront;
      gameState = "petReveal";
      petRevealTimer = 0;
      petRevealFrameIndex = 0;
      petRevealFrameCounter = 0;
    }
  }
}

function displayPetReveal() {
  push();
  background(0);
  imageMode(CENTER);

  if (selectedPetFrontImage) {
    let frameWidth = selectedPetFrontImage.width / petRevealTotalFrames;
    let frameHeight = selectedPetFrontImage.height;
    petRevealFrameCounter++;
    if (petRevealFrameCounter >= petRevealFrameDelay) {
      petRevealFrameCounter = 0;
      petRevealFrameIndex = (petRevealFrameIndex + 1) % petRevealTotalFrames;
    }
    let sx = petRevealFrameIndex * frameWidth;
    image(
      selectedPetFrontImage,
      width / 2,
      height / 2,
      150,
      150,
      sx,
      0,
      frameWidth,
      frameHeight
    );
  }
  pop();

  petRevealTimer++;
  if (petRevealTimer > 60) {
    finishPetSelection();
  }
}


function finishPetSelection() {
  player.needsPetSelection = false;
  wave++;
  spawnEnemiesForWave(wave);
  gameState = "game";
}