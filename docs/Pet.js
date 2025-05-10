// Base class for all pets
class BasePet {
  constructor() {
    // Current position vector of the pet
    this.pos = createVector(0, 0);
    // Default collision/display radius
    this.radius = 15;
  }

  follow(player) { }
  update(player) { }
  display() { }
}

// pet 1 Blaze
// An attack‐oriented pet that orbits the player and damages nearby enemies
class AttackPet extends BasePet {
  constructor(x, y) {
    super();
    // Initialize orbit position
    this.pos = createVector(x, y);
    // Combat stats
    this.attackRange = 40;
    this.attackDamage = 10;
    this.speed = 4;
    // Orbiting behavior
    this.orbitRadius = 30;
    this.angle = 0;
    // Animation setup
    this.idleImage = foxMoveFront;
    this.attackImage = foxAttackFront;
    this.currentImage = this.idleImage;
    this.frameIndex = 0;
    this.totalFrames = 4;
    this.frameDelay = 10;
    this.frameCounter = 0;
    // Attack state
    this.isAttacking = false;
    this.attackCooldown = 0;
    this.attackTimer = 0;
  }

  // Orbit around the player and choose correct idle animation based on player movement
  follow(player) {
    this.angle += 0.05;
    const targetPos = createVector(
      player.pos.x + cos(this.angle) * this.orbitRadius,
      player.pos.y + player.ImageHeight - (35 / 2)
    );
    // Smoothly interpolate towards the target orbit position
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

  // Detect the closest enemy in range and perform an attack if possible
  attack(enemies) {
    this.attackCooldown--;

    // Determine detection radius around the player
    let detectionRange = player.ImageWidth * 3;
    let playerCenter = createVector(
      player.pos.x + player.ImageWidth / 2,
      player.pos.y + player.ImageHeight / 2
    );

    let closest = null;
    let record = Infinity;
    // Find the closest enemy
    for (const enemy of enemies) {
      const d = p5.Vector.dist(this.pos, enemy.pos);
      if (d < record) {
        record = d;
        closest = enemy;
      }
    }
    // If an enemy is within range and cooldown has expired, attack
    if (closest && record < detectionRange && this.attackCooldown <= 0) {
      // Reset cooldown and switch to attack state
      let killed = closest.hit(this.attackDamage);
      this.attackCooldown = 30;
      this.isAttacking = true;
      this.attackTimer = 15;

      // Select attack sprite based on player direction
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
  // Render the pet, animate frames, tint when attacking
  display() {
    this.frameCounter++;
    if (this.frameCounter >= this.frameDelay) {
      this.frameCounter = 0;
      this.frameIndex = (this.frameIndex + 1) % this.totalFrames;
    }

    // If not in attack state, ensure idle sprite matches movement direction
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

    // Choose draw size: larger while attacking
    let drawSize = this.isAttacking ? 50 : 40;
    push();
    imageMode(CENTER);
    if (this.isAttacking) {
      tint(255, 150, 150);
    }

    // Draw the correct frame from the sprite sheet
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

    // Count down attack timer; when zero, exit attack state
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

// pet 2 Aegis
// A defensive pet that periodically shields the player, making them invincible for a short time
class DefensePet extends BasePet {
  constructor() {
    super();
    // Shield mechanics
    this.shieldCharge = 0;
    this.isShieldActive = false;
    this.shieldDuration = 90; // duration of active shield in frames
    this.shieldTimer = 0;
    this.shieldChargeInterval = 15000;  // ms between shield activations
    this.lastShieldTime = 0;
    // Animation for the pet itself
    this.frameIndex = 0;
    this.frameCounter = 0;
    this.frameDelay = 10;
    this.totalFrames = 4;
    this.currentImage = cowMoveFront;
    this.petVisible = true;// hide pet during shield
    // Shield effect animation 
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
      // Check if enough time has passed to activate shield
      if (millis() - this.lastShieldTime > this.shieldChargeInterval) {
        this.activateShield(player);
        this.lastShieldTime = millis();
      }
    } else {
      // Countdown shield duration
      this.shieldTimer--;
      if (this.shieldTimer <= 0) {
        this.deactivateShield(player);
      }
    }
  }

  // Turn on shield: player becomes invincible, pet hides
  activateShield(player) {
    this.isShieldActive = true;
    this.shieldTimer = this.shieldDuration;
    player.invincible = true;
    this.petVisible = false;
    showFloatingText("Shield activation!", player.pos.x, player.pos.y - 40, color(0, 200, 255));
  }

  // Turn off shield: revert player invincibility and show pet again
  deactivateShield(player) {
    this.isShieldActive = false;
    player.invincible = false;
    this.petVisible = true;
    showFloatingText("Shield disappearing", player.pos.x, player.pos.y - 40, color(100));
  }

  // Draw either the shield effect or the pet sprite + charge % indicator
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

    // Choose movement sprite based on player direction
    if (player.vel.x > 0) {
      this.currentImage = cowMoveRight;
    } else if (player.vel.x < 0) {
      this.currentImage = cowMoveLeft;
    } else if (player.vel.y > 0) {
      this.currentImage = cowMoveFront;
    } else if (player.vel.y < 0) {
      this.currentImage = cowMoveBack;
    }

    // Draw the pet
    if (this.currentImage) {
      let sx = this.frameIndex * (this.currentImage.width / this.totalFrames);
      push();
      imageMode(CENTER);
      image(
        this.currentImage,
        this.pos.x,
        this.pos.y,
        40, 40,
        sx,
        0,
        this.currentImage.width / this.totalFrames,
        this.currentImage.height
      );
      pop();
    }

    // Show shield charge percentage below pet
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

// pet 3 Aurora
// A healing pet that orbits and periodically restores the player's health
class HealerPet extends BasePet {
  constructor() {
    super();
    // Healing parameters
    this.healAmount = 0.4; // HP per heal tick
    this.healTick = 0;     // countdown to next heal
    this.healInterval = 60; // frames between heals
    // Orbit behavior
    this.angle = 0;
    this.orbitRadius = 30;
    // Animation
    this.frameIndex = 0;
    this.frameCounter = 0;
    this.frameDelay = 10;
    this.totalFrames = 4;
    this.currentImage = fairyMoveFront;
  }
  // Orbit around the player smoothly
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

  // Draw healing pet circle and animate sprite based on movement
  display() {
    // Draw an aura circle
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

    // Choose sprite orientation
    if (player.vel.x > 0) {
      this.currentImage = fairyMoveRight;
    } else if (player.vel.x < 0) {
      this.currentImage = fairyMoveLeft;
    } else if (player.vel.y > 0) {
      this.currentImage = fairyMoveFront;
    } else if (player.vel.y < 0) {
      this.currentImage = fairyMoveBack;
    }

    // Draw the fairy sprite
    if (this.currentImage) {
      let sx = this.frameIndex * (this.currentImage.width / this.totalFrames);
      push();
      imageMode(CENTER);
      image(
        this.currentImage,
        this.pos.x,
        this.pos.y,
        40, 40,
        sx,
        0,
        this.currentImage.width / this.totalFrames,
        this.currentImage.height
      );
      pop();
    }
  }
}

// Renders the pet selection UI and handles click–to–choose logic
function showPetSelectionScreen() {
  push();
  imageMode(CORNER);
  image(selectPetsImage, 0, 0, 1062, 600);
  pop();

  // Define bounding boxes for each pet option
  const box1 = { x: 126, y: 160, w: 200, h: 340 };
  const box2 = { x: 426, y: 160, w: 200, h: 340 };
  const box3 = { x: 726, y: 160, w: 200, h: 340 };

  const eggW = 115, eggH = 115;
  const offset1 = { x: 0, y: -25 };
  const offset2 = { x: 10, y: -25 };

  // Compute egg centers for each option
  const center1 = {
    x: box1.x + box1.w / 2 + offset1.x,
    y: box1.y + box1.h / 2 + offset1.y
  };
  const center2 = {
    x: box2.x + box2.w / 2 + offset2.x,
    y: box2.y + box2.h / 2 + offset2.y
  };
  const center3 = {
    x: box3.x + box3.w / 2 + offset2.x,
    y: box3.y + box3.h / 2 + offset2.y
  };

  // Draw eggs for each pet
  push();
  imageMode(CENTER);
  image(eggFox, center1.x, center1.y, eggW, eggH);
  image(eggCow, center2.x, center2.y, eggW, eggH);
  image(eggFairy, center3.x, center3.y, eggW, eggH);
  pop();

  // Compute name‐click regions at bottom of each box
  const nameRegionHeight = 40;
  const nameRect1 = {
    x: box1.x,
    y: box1.y + box1.h - nameRegionHeight,
    w: box1.w,
    h: nameRegionHeight
  };
  const nameRect2 = {
    x: box2.x,
    y: box2.y + box2.h - nameRegionHeight,
    w: box2.w,
    h: nameRegionHeight
  };
  const nameRect3 = {
    x: box3.x,
    y: box3.y + box3.h - nameRegionHeight,
    w: box3.w,
    h: nameRegionHeight
  };

  // If player clicks in one of the name regions, select that pet
  if (mouseIsPressed) {
    if (mouseX >= nameRect1.x && mouseX <= nameRect1.x + nameRect1.w &&
      mouseY >= nameRect1.y && mouseY <= nameRect1.y + nameRect1.h) {
      if (!selectionSound.isPlaying()) {
        selectionSound.loop();
      }
      buttonsound.play();
      player.pet = new AttackPet(player.pos.x, player.pos.y);
      selectedPetFrontImage = foxMoveFront;
      gameState = "petReveal";
      petRevealTimer = 0;
      petRevealFrameIndex = 0;
      petRevealFrameCounter = 0;
    } else if (mouseX >= nameRect2.x && mouseX <= nameRect2.x + nameRect2.w &&
      mouseY >= nameRect2.y && mouseY <= nameRect2.y + nameRect2.h) {
      if (!selectionSound.isPlaying()) {
        selectionSound.loop();
      }
      buttonsound.play();
      player.pet = new DefensePet();
      selectedPetFrontImage = cowMoveFront;
      gameState = "petReveal";
      petRevealTimer = 0;
      petRevealFrameIndex = 0;
      petRevealFrameCounter = 0;
    } else if (mouseX >= nameRect3.x && mouseX <= nameRect3.x + nameRect3.w &&
      mouseY >= nameRect3.y && mouseY <= nameRect3.y + nameRect3.h) {
      if (!selectionSound.isPlaying()) {
        selectionSound.loop();
      }
      buttonsound.play();
      player.pet = new HealerPet();
      selectedPetFrontImage = fairyMoveFront;
      gameState = "petReveal";
      petRevealTimer = 0;
      petRevealFrameIndex = 0;
      petRevealFrameCounter = 0;
    }
  }
}

// Displays the chosen pet with a reveal animation, then proceeds to the game
function displayPetReveal() {
  push();
  imageMode(CORNER);
  image(petRevealBackground, 0, 0, width, height);
  pop();

  push();
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
  // After the reveal duration, finish selection
  if (petRevealTimer >= 130) {
    if (selectionSound.isPlaying()) {
      selectionSound.stop();
    }
    finishPetSelection();
  }
}


function finishPetSelection() {
  player.needsPetSelection = false;
  wave++;
  gameState = "game";
  spawnEnemiesForWave(wave);
}