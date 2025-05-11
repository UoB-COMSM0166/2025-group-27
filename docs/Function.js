function handleGameplay(now) {
  if (wave <= 5) {
    image(level1map, 0, 0, 1062, 600);
  } else if (wave > 5 && wave <= 10) {
    image(level2map, 0, 0, 1062, 600);
  } else if (wave > 10 && wave <= 15) {
    image(level3map, 0, 0, 1062, 600);
  } else {
    image(level4map, 0, 0, 1062, 600);
  }

  player.move();
  player.shoot();
  player.update();
  player.display();

  featherPool.update();
  featherPool.display();

  feathers = feathers.filter((feather) => {
    if (feathers.length > MAX_FEATHERS) {
      return false;
    }

    if (!feather.update()) {
      return false;
    }
    feather.animate();
    feather.display();
    return true;
  });

  // bullet
  bullets = bullets.filter((bullet) => {
    if (bullet.update()) {
      bullet.display();
      return true;
    }
    return false;
  });

  if (wave == 5 || wave == 10 || wave == 15) {
    obstacleBuild = false;
  }
  if (wave == 11 && !obstacleBuild) {
    obstacles = [];
    generateInitialObstacles();
  }

  // obstacle
  obstacles.forEach((obs) => {
    obs.update();
    obs.display();
  });

  // enemies
  for (let j = enemies.length - 1; j >= 0; j--) {
    let enemy = enemies[j];
    enemy.update();
    enemy.display();

    if (enemy.shouldRemove()) {
      enemies.splice(j, 1);
    }

    if (enemy instanceof BugBoss) {
      enemy.isVisionBlocked = true;
      enemy.visionBlockTimer = 999999;
      if (typeof enemy.drawFogEffect === 'function') {
        enemy.drawFogEffect();
      }
    }

    if ((enemy.isBoss || enemy instanceof BugBoss) && enemy.health <= 0) {
      bossDefeated++;
      enemies.splice(j, 1);
      
      console.log("Boss defeated, current wave:", wave);

      //victory
      if (wave === 15) {
        gameState = "vStory";
        finalStats = {
          normalEnemies: normalEnemiesDefeated,
          bosses: bossDefeated,
          level: player.level,
          attackPower: player.attackPower,
          attackSpeed: player.attackSpeed,
          attackDamage: player.attackDamage,
        };
        return;
      }

      let remainingBosses = enemies.filter(e => e.isBoss || e instanceof BugBoss);
      console.log("Remaining bosses:", remainingBosses.length);

      if (remainingBosses.length === 0) {
        bossActive = false;
        wave++;
        showFloatingText("Wave " + wave, width / 2, height / 2, color(255, 255, 0), 40);
        spawnEnemiesForWave(wave);
      }
    }
  }

  enemyBullets = enemyBullets.filter((bullet) => {
    bullet.update();
    bullet.display();
    return bullet.isActive;
  });

  expOrbs = expOrbs.filter((orb) => {
    orb.update();
    orb.display();
    return !orb.checkCollection();
  });

  for (let i = poisonTrails.length - 1; i >= 0; i--) {
    let trail = poisonTrails[i];

    if (trail.frameCounter !== undefined) {
      trail.frameCounter++;
      if (trail.frameCounter >= trail.frameDelay) {
        trail.frameCounter = 0;
        trail.frameIndex = (trail.frameIndex + 1) % trail.frameCount;
      }
    }

    if (millis() - trail.startTime > trail.duration) {
      poisonTrails.splice(i, 1);
      continue;
    }

    if (typeof poisonPoolEffectImg !== 'undefined' && poisonPoolEffectImg && trail.frameIndex !== undefined) {
      try {
        push();
        drawingContext.filter = 'contrast(1.2) brightness(1.1)';
        imageMode(CENTER);

        let frameWidth = poisonPoolEffectImg.width / trail.frameCount;
        let frameHeight = poisonPoolEffectImg.height;

        drawingContext.imageSmoothingEnabled = false;

        let alpha = map(millis() - trail.startTime, 0, trail.duration * 0.7, 255, 100);
        if (trail.colorMod) {
          tint(red(trail.colorMod), green(trail.colorMod), blue(trail.colorMod), alpha);
        } else {
          tint(255, 255, 255, alpha);
        }

        let displaySize = trail.radius * 2.2;

        image(
          poisonPoolEffectImg,
          trail.pos.x,
          trail.pos.y,
          displaySize,
          displaySize,
          trail.frameIndex * frameWidth,
          0,
          frameWidth,
          frameHeight
        );

        noTint();
        drawingContext.imageSmoothingEnabled = true;
        drawingContext.filter = 'none';
        pop();
      } catch (e) {
        continue;
      }
    } else {
      push();
      imageMode(CENTER);

      let frameWidth = ghostDeathEffect.width / 4; 
      let frameHeight = ghostDeathEffect.height;

      let progress = (millis() - trail.startTime) / trail.duration;
      let frameIndex = floor(progress * 4);
      frameIndex = constrain(frameIndex, 0, 3);

      let alpha = map(millis() - trail.startTime, 0, trail.duration, 255, 0);
      tint(255, alpha);

      image(
        ghostDeathEffect,
        trail.pos.x,
        trail.pos.y,
        trail.radius * 3,
        trail.radius * 3,
        frameIndex * frameWidth,
        0,
        frameWidth,
        frameHeight
      );

      noTint();
      pop();
    }

    if (p5.Vector.dist(player.pos, trail.pos) < trail.radius) {
      player.takeDamage(0.5);
    }
  }

  if (enemies.length === 0) {
    if (gameState !== "game") {
      return;
    }

    if (wave === 15) {
      gameState = "vStory";
      finalStats = {
        normalEnemies: normalEnemiesDefeated,
        bosses: bossDefeated,
        level: player.level,
        attackPower: player.attackPower,
        attackSpeed: player.attackSpeed,
        attackDamage: player.attackDamage,
      };
      return;
    }

    wave++;
    waveTextAnimation = 30;
    spawnEnemiesForWave(wave);
    showFloatingText(
      "Wave " + wave + "!",
      width / 2,
      height / 2,
      color(255, 200, 0)
    );
  }

  if (waveTextAnimation > 0) {
    push();
    waveTextAnimation--;
    textSize(24 + waveTextAnimation);
    fill(255, 200 + waveTextAnimation * 5, 0);
    textAlign(CENTER);
    text(`WAVE ${wave}`, width / 2, height / 2 - 50);
    pop();
  }

  let elapsedTime = floor((now - gameStartTime) / 1000);
  displayHUD(elapsedTime);

  if (player.health <= 0) {
    finalStats = {
      normalEnemies: normalEnemiesDefeated,
      bosses: bossDefeated,
      level: player.level,
      attackPower: player.attackPower,
      attackSpeed: player.attackSpeed,
      attackDamage: player.attackDamage,
    };
    gameState = "gameOver";
  }

  if (choosingUpgrade) {
    drawUpgradeScreen();
  }

  applyWeatherEffects(now);

  drawLevelFogEffect();
}
//initial function
function initButtons() {
  const baseY = height / 2 - 30;
  const baseX = width / 2 - 30;

  mainMenuButtons = [
    new Button(width / 2 - 100, baseY + 50, 200, 40, "Start Game(easy)", () => {
      buttonsound.play();
      wave = 1;
      normalEnemiesDefeated = 0;
      bossDefeated = 0;
      gameState = "story1";
      difficult = "easy";
    }),
    new Button(width / 2 - 100, baseY + 100, 200, 40, "Start Game(hard)", () => {
      buttonsound.play();
      wave = 1;
      normalEnemiesDefeated = 0;
      bossDefeated = 0;
      gameState = "story1";
      difficult = "hard";
    }),
    new Button(width / 2 - 100, baseY + 150, 200, 40, "Setting", () => {
      buttonsound.play();
      gameState = "setting";
    }),
    new Button(width / 2 - 100, baseY + 200, 200, 40, "Quit Game", () => {
      buttonsound.play();
      noLoop()
    }),
  ];

  charSelectButtons = [
    new Button(baseX - 375, height / 2 + 167.5, 200, 40, "Gunner", () => {
      buttonsound.play();
      initPlayer("gunner")
    }),
    new Button(
      baseX - 70,
      height / 2 + 167.5,
      200,
      40,
      "Archer",
      () => {
        buttonsound.play();
        initPlayer("archer")
      }),
    new Button(
      baseX + 235,
      height / 2 + 167.5,
      200,
      40,
      "Knight",
      () => {
        buttonsound.play();
        initPlayer("knight")
      }),
  ];

  pauseButtons = [
    new Button(width / 2 - 100, height / 2 - 40, 200, 40, "resume game (P)", function () {
      gameState = "game";
    }),
    new Button(width / 2 - 100, height / 2 + 20, 200, 40, "back to mainmenu (M)", function () {
      gameState = "mainMenu";
    }),
    new Button(width / 2 - 100, height / 2 + 80, 200, 40, "save game (S)", function () {
    }),
    new Button(width / 2 - 100, height / 2 + 140, 200, 40,
      player && player.isInvincible ? "close Invincible Mode (I)" : "open Invincible Mode (I)",
      function () {
        if (player) {
          player.isInvincible = !player.isInvincible;
          this.label = player.isInvincible ? "close Invincible Mode (I)" : "open Invincible Mode (I)";
          showFloatingText(player.isInvincible ? "Invincible Mode is opened!" : "Invincible Mode is closed!",
            width / 2, height / 2 - 100,
            player.isInvincible ? color(255, 215, 0) : color(255, 100, 100), 24);
        }
      })
  ];
}

function initPlayer(type) {
  if (type === "gunner") {
    player = new Player(GunnerActionUp, GunnerActionDown, GunnerActionLeft, GunnerActionRight, GunnerActionIntro, GunnerAttackUp, GunnerAttackDown, GunnerAttackLeft, GunnerAttackRight, 50.75, 100, 50.75, 100, 50.75, 100, 50.75, 100, 50.75, 100, 1, 1, 1, 1, 1, 1, 1, 1, type);
    player.attackPower = 10;
    player.attackDamage = 10;
    player.attackSpeed = 500;
    player.moveSpeed = 3;
    player.critRate = 0;
    player.critDamage = 1.5;
    player.dodgeRate = 0;
    player.lifesteal = 0;
    player.thorns = 0;
  } else if (type === "archer") {
    player = new Player(ArcherActionUp, ArcherActionDown, ArcherActionLeft, ArcherActionRight, ArcherActionIntro, ArcherActionAttackUp, ArcherActionAttackDown, ArcherActionAttackLeft, ArcherActionAttackRight, 50, 100, 50, 100, 50, 100, 50, 100, 50, 100, 1, 1, 1, 1, 1, 1, 1, 1, type);
    player.attackPower = 8;
    player.attackDamage = 50;
    player.attackSpeed = 300;
    player.moveSpeed = 4;
    player.critRate = 0.1;
    player.critDamage = 2;
    player.dodgeRate = 0.05;
    player.lifesteal = 0;
    player.thorns = 0;
    player.arrowDamage = 20;
    player.arrowSpeed = 10;
    player.maxChargeTime = 90;
    player.arrowCooldown = 20;
    player.chargeBarScale = 0.7;
  } else if (type === "knight") {
    player = new Player(KnightActionUp, KnightActionDown, KnightActionLeft, KnightActionRight, KnightActionIntro, KnightActionAttackUp, KnightActionAttackDown, KnightActionAttackLeft, KnightActionAttackRight, 50.75, 100, 50.75, 100, 43.5, 79, 50.75, 100, 50.67, 79, 100, 100, 100, 150, 150, 150, 150, 150, type);
    player.attackPower = 10;
    player.attackDamage = 100;
    player.attackSpeed = 500;
    player.moveSpeed = 3;
    player.critRate = 0;
    player.critDamage = 1.5;
    player.dodgeRate = 0;
    player.lifesteal = 0;
    player.thorns = 0;
  }
  wave = 1;
  enemies = [];

  generateInitialObstacles();

  spawnEnemiesForWave(wave);
  gameState = "guide";
}

//display related functions
function displayHUD(elapsedTime) {
  push();
  fill(255);
  textSize(14);
  textAlign(LEFT, TOP);
  text(`Time: ${elapsedTime}s`, 10, 60);
  text(`Enemies Killed: ${normalEnemiesDefeated}`, 10, 80);
  text(`Bosses Defeated: ${bossDefeated}`, 10, 100);
  textSize(24);
  textAlign(CENTER, TOP);
  text(`WAVE ${wave}`, width / 2, 10);

  if (wave % 5 !== 0) {
    let totalEnemies = Math.floor(6 + wave * 0.8);
    let progress = (enemies.length / totalEnemies) * 100;
    let barWidth = 300;
    let barHeight = 8;
    noStroke();
    fill(100);
    rect(width / 2 - barWidth / 2, 45, barWidth, barHeight);
    fill(0, 200, 0);
    rect(
      width / 2 - barWidth / 2,
      45,
      (barWidth * (100 - progress)) / 100,
      barHeight
    );
  }

  pop();
}

//UI and input
function drawUIElements() {
  switch (gameState) {
    case "petSelection":
      showPetSelectionScreen();
      break;
    case "mainMenu":
      displayMainMenu();
      break;
    case "menu":
      displayCharacterSelection();
      break;
    case "paused":
      if (choosingPotion) displayPotionChoices();
      else displayPauseMenu();
      break;
  }
  if (bossActive) displayBossHealthBar();
}

function displayAttributes() {
  push();
  fill(0, 200);
  rectMode(CENTER);
  rect(width / 2, height / 2, 400, 400, 20);
  fill(255);
  textSize(24);
  textAlign(CENTER, CENTER);
  text("Character Attributes", width / 2, height / 2 - 160);
  textSize(18);
  textAlign(LEFT);
  let yStart = height / 2 - 120;
  let attributes = [
    `Health: ${player.health}/${player.maxHealth}`,
    `Level: ${player.level}`,
    `XP: ${player.exp}/${player.expToNextLevel}`,
    `Attack Power: ${player.attackPower}`,
    `Attack Speed: ${player.attackSpeed}ms`,
    `Crit Rate: ${(player.critRate * 100).toFixed(1)}%`,
    `Crit Damage: ${player.critDamage}x`,
    `Dodge Rate: ${(player.dodgeRate * 100).toFixed(1)}%`,
    `Lifesteal: ${player.lifesteal}`,
    `Thorns: ${player.thorns}`,
    `Move Speed: ${player.moveSpeed}`,
  ];
  attributes.forEach((attr, index) => {
    text(attr, width / 2 - 180, yStart + index * 30);
  });
  pop();
}

function displaySettingPage() {
  if (!volumeSlider) {
    volumeSlider = createSlider(0, 1, volume, 0.1);
    volumeSlider.position(width / 2 - 100, 200);

    backButton = createButton('Save and Return');
    backButton.position(width / 2 - 50, 300);
    backButton.mousePressed(() => {
      buttonsound.play();
      gameState = 'mainMenu';
      hideSettingsElements();
    });
  } else {
    showSettingsElements();
  }

  volume = volumeSlider.value();

  fill(0);
  textSize(20);
  text('Volume', width / 2 - 150, 220);
}

function showSettingsElements() {
  volumeSlider.show();
  backButton.show();
}

function hideSettingsElements() {
  volumeSlider.hide();
  backButton.hide();
}

function displayBossHealthBar() {
  if (gameState == "game") {
    let activeBosses = enemies.filter(e => e instanceof Boss && e.isActive);
    if (activeBosses.length === 0) {
      bossActive = false;
      return;
    }

    let totalMaxHealth = 0;
    let totalCurrentHealth = 0;
    for (let boss of activeBosses) {
      totalMaxHealth += boss.maxHealth;
      totalCurrentHealth += Math.max(0, boss.health);
    }

    //draw health bar
    const barWidth = width * 0.6;
    const barHeight = 20;
    const x = width / 2 - barWidth / 2;
    const y = 30;

    stroke(255, 215, 0);
    strokeWeight(2);
    fill(50);
    rect(x, y, barWidth, barHeight, 5);
    noStroke();

    if (totalMaxHealth > 0) {
      let healthPercentage = totalCurrentHealth / totalMaxHealth;
      healthPercentage = constrain(healthPercentage, 0, 1);

      fill(255, 0, 0);
      rect(x + 2, y + 2, barWidth - 4, barHeight - 4, 3);
      fill(0, 255, 0);
      rect(
        x + 2,
        y + 2,
        (barWidth - 4) * healthPercentage,
        barHeight - 4,
        3
      );
    }

    //show health value
    fill(255);
    textAlign(CENTER);
    textSize(14);
    text(
      `Boss HP: ${Math.ceil(totalCurrentHealth)} / ${totalMaxHealth}`,
      width / 2,
      y + barHeight + 15
    );

    if (activeBosses.length > 1) {
      textSize(12);
      activeBosses.forEach((boss, index) => {
        fill(255);
        text(
          `Slime ${index + 1}: ${Math.ceil(boss.health)} / ${boss.maxHealth}`,
          width / 2,
          y + barHeight + 35 + index * 15
        );
      });
    }
  }
}

//UI display
function displayMainMenu() {
  if (!mainMenuSound.isPlaying()) {
    mainMenuSound.play();
  }
  fill(255);
  textSize(24);
  textAlign(CENTER, CENTER);
  let visibleButtons = [];
  visibleButtons.push(mainMenuButtons[1], mainMenuButtons[2], mainMenuButtons[3], mainMenuButtons[4]);
  image(mainMenuPage, 0, 0, 1062, 600);
}

function displayStoryPage1() {
  image(story1, 0, 0, width, height);

  buttonW = 100;
  buttonH = 30;
  buttonX = width - buttonW - 20;
  buttonY = height - buttonH - 20;
}

function displayStoryPage2() {
  image(story2, 0, 0, width, height);

  buttonW = 100;
  buttonH = 30;
  buttonX = width - buttonW - 20;
  buttonY = height - buttonH - 20;
}

function displayStoryPage3() {
  image(story3, 0, 0, width, height);

  buttonW = 100;
  buttonH = 30;
  buttonX = width - buttonW - 20;
  buttonY = height - buttonH - 20;
}

function displayStoryPage4() {
  image(story4, 0, 0, width, height);

  buttonW = 100;
  buttonH = 30;
  buttonX = width - buttonW - 20;
  buttonY = height - buttonH - 20;
}

function displayStoryPage5() {
  image(story5, 0, 0, width, height);

  buttonW = 100;
  buttonH = 30;
  buttonX = width - buttonW - 20;
  buttonY = height - buttonH - 20;
}

function displayVictoryPage1() {
  bossMusic3.stop();
  image(victoryStory, 0, 0, width, height);

  buttonW = 100;
  buttonH = 30;
  buttonX = width - buttonW - 20;
  buttonY = height - buttonH - 20;
}

function displayCharacterSelection() {
  fill(255);
  textSize(24);
  textAlign(CENTER, CENTER);
  image(characterChoose, 0, 0, width, height);
  image(gunnerpic, width / 2 - 350, height / 2 - 100, 100, 200);
  image(archerpic, width / 2 - 50, height / 2 - 100, 100, 200);
  image(knightpic, width / 2 + 250, height / 2 - 100, 100, 200);
}

function displayGuidePage() {
  mainMenuSound.stop();
  image(guidePage, 0, 0, width, height);

  buttonW = 100;
  buttonH = 30;
  buttonX = width - buttonW - 20;
  buttonY = height - buttonH - 20;
}

function displayPauseMenu() {
  push();
  image(pausePage, 0, 0, width, height);
  textSize(25);
  fill(255);
  textAlign(CENTER, CENTER);
  let pausedTime = floor((millis() - pauseStartTime) / 1000);
  text(`Paused for: ${pausedTime}s`, width / 2, height / 3 + 30);

  text(`Level: ${player.level}`, width / 2, height / 2);
  text(`Health: ${Math.round(player.health)}`, width / 2, height / 2 + 30);
  text(`XP: ${player.exp}`, width / 2, height / 2 + 60);
  text("Return to Main Menu (Press 'M')", width / 2, height / 2 + 90);
  text("Resume (Press 'P')", width / 2, height / 2 + 120);
  text("Toggle Invincible Mode (Press 'I')", width / 2, height / 2 + 150);
  pop();
}

function displayGameOverScreen() {
  normalMusic12.stop();
  normalMusic45.stop();
  normalMusic78.stop();
  bossMusic1.stop();
  bossMusic2.stop();
  bossMusic3.stop();
  background(0);
  textSize(20);
  fill(255);
  textAlign(CENTER, CENTER);
  image(gameOverPage, 0, 0, width, height);
}

function generateInitialObstacles() {
  const corridorWidth = 50;
  const minDistanceFromPlayer = 150;
  const minDistanceBetweenObstacles = 200;
  const numObstacles = 6;
  let attempts = 0;
  while (obstacles.length < numObstacles && attempts < 50) {
    let x = random(width * 0.1, width * 0.9);
    let y = random(height * 0.1, height * 0.9);
    let isVertical = random() < 0.5;
    let obsWidth = isVertical ? corridorWidth : random(80, 150);
    let obsHeight = isVertical ? random(80, 150) : corridorWidth;
    if (
      player &&
      p5.Vector.dist(createVector(x, y), player.pos) < minDistanceFromPlayer
    ) {
      attempts++;
      continue;
    }

    let valid = true;
    for (let obs of obstacles) {
      let distance = p5.Vector.dist(createVector(x, y), obs.pos);
      if (distance < minDistanceBetweenObstacles) {
        valid = false;
        break;
      }
    }
    obstacleBuild = true;

    if (wave <= 10) {
      if (valid)
        obstacles.push(new Obstacle(x, y, obsWidth, obsHeight, isVertical));
      attempts++;
    } if (wave > 10) {
      if (valid)
        obstacles.push(new Obstacle(x, y, 100, 100, isVertical));
      attempts++;
    }
  }
}

function drawUpgradeScreen() {
  image(skillPage, 0, 0, width, height);
  fill(0, 0, 0, 200);
  fill(255);
  textSize(32);
  textAlign(CENTER);

  for (let i = 0; i < upgradeOptions.length; i++) {
    let x = width / 4 + (i * width) / 4;
    let y = height / 2;
    let option = upgradeOptions[i];
    fill(60, 60, 60, 150);
    if (
      mouseX > x - 100 &&
      mouseX < x + 100 &&
      mouseY > y - 50 &&
      mouseY < y + 150
    ) {
      fill(80, 80, 80);
    }
    rect(x - 100, y - 50, 200, 200, 10);
    fill(255);
    textSize(22);
    text(option.name, x, y);
    textSize(20);
    textWrap(WORD);
    text(option.description, x - 100, y + 70, 200);
  }
  textAlign(LEFT);
}

//upgrade options
function generateUpgradeOptions() {
  let allUpgrades;
  if (player.characterType == "gunner") {
    allUpgrades = [
      {
        type: "health",
        name: "Health Boost",
        value: 25,
        description: "Increase max HP by 25",
      },
      {
        type: "speed",
        name: "Speed Boost",
        value: 0.5,
        description: "Increase movement speed",
      },
      {
        type: "fireRate",
        name: "Fire Rate",
        value: 2,
        description: "Increase shooting speed",
      },
      {
        type: "defense",
        name: "Defense Boost",
        value: 0.2,
        description: "Reduce incoming damage",
      },
      {
        type: "criticalChance",
        name: "Critical Chance",
        value: 0.05,
        description: "Increase critical chance by 5%",
      },
      {
        type: "expBonus",
        name: "EXP Bonus",
        value: 0.1,
        description: "Gain 10% more EXP",
      },
      {
        type: "armorPen",
        name: "Armor Penetration",
        value: 0.1,
        description: "Ignore 10% of enemy defense",
      },
      {
        type: "bulletType",
        name: "Shotgun Spread",
        value: "shotgun",
        description:
          player && player.bulletType === "shotgun"
            ? `Add an additional shotgun pellet (Current:${player.shotgunLevel})`
            : "Fire multiple pellets in spread pattern",
        oneTime: false,
      },
      {
        type: "bulletType",
        name: "Piercing Rounds",
        value: "pierce",
        description: "Bullets can penetrate enemies",
        oneTime: true,
      },
      {
        type: "bulletType",
        name: "Ricochet Rounds",
        value: "bounce",
        description: "Bullets can bounce 3 times",
        oneTime: true,
      },
      {
        type: "passive",
        name: "Life Steal",
        value: "lifesteal",
        description: "Heal on attack",
        oneTime: true,
      },
      {
        type: "passive",
        name: "Thorn Armor",
        value: "thorns",
        description: "Reflect damage when hit",
        oneTime: true,
      },
    ]
  } else if (player.characterType == "archer") {
    allUpgrades = [
      {
        type: "health",
        name: "Health Boost",
        value: 25,
        description: "Increase max HP by 25",
      },
      {
        type: "speed",
        name: "Speed Boost",
        value: 0.5,
        description: "Increase movement speed",
      },
      {
        type: "fireRate",
        name: "Fire Rate",
        value: 2,
        description: "Increase shooting speed",
      },
      {
        type: "defense",
        name: "Defense Boost",
        value: 0.2,
        description: "Reduce incoming damage",
      },
      {
        type: "criticalChance",
        name: "Critical Chance",
        value: 0.05,
        description: "Increase critical chance by 5%",
      },
      {
        type: "expBonus",
        name: "EXP Bonus",
        value: 0.1,
        description: "Gain 10% more EXP",
      },
      {
        type: "armorPen",
        name: "Armor Penetration",
        value: 0.1,
        description: "Ignore 10% of enemy defense",
      },
      {
        type: "attack",
        name: "Attack Boost",
        value: 5,
        description: "Increase attack by 5",
      },
      {
        type: "arrowPierce",
        name: "Piercing Arrows",
        value: "pierce",
        description: "Arrows can penetrate enemies",
        oneTime: true,
      },
      {
        type: "arrowSplit",
        name: "Split Arrows",
        value: "split",
        description: "Arrows split on hit",
        oneTime: true,
      },
      {
        type: "doubleShot",
        name: "Double Shot",
        value: "double",
        description: "Fire two arrows simultaneously (Double damage!)",
        oneTime: true,
      },
      {
        type: "lifesteal",
        name: "Life Steal",
        value: "lifesteal",
        description: "Heal on attack",
        oneTime: true,
      },
      {
        type: "autoCharge",
        name: "Auto-Charge",
        value: "autoCharge",
        description: "Automatically charge arrows when not attacking",
        oneTime: true,
      },
    ];
  } else if (player.characterType == "knight") {
    allUpgrades = [
      {
        type: "health",
        name: "Health Boost",
        value: 25,
        description: "Increase max HP by 25",
      },
      {
        type: "speed",
        name: "Speed Boost",
        value: 0.5,
        description: "Increase movement speed",
      },
      {
        type: "defense",
        name: "Defense Boost",
        value: 0.2,
        description: "Reduce incoming damage",
      },
      {
        type: "expBonus",
        name: "EXP Bonus",
        value: 0.1,
        description: "Gain 10% more EXP",
      },
      {
        type: "armorPen",
        name: "Armor Penetration",
        value: 0.1,
        description: "Ignore 10% of enemy defense",
      },
      {
        type: "attackRange",
        name: "Attack Range Boost",
        description: "Increase Attack Range",
      },
      {
        type: "attackAngle",
        name: "Attack Angle Boost",
        description: "Increase Attack Angle",
      },
      {
        type: "healthBoostAndLifeSteal",
        name: "Life Steal Giant",
        description: "Max Health 300 and gain 20% Life Steal",
        oneTime: true,
      },
      {
        type: "berserker",
        name: "Berserker",
        description: "50% critical rate, 200% critical damage",
        oneTime: true,
      },
      {
        type: "reborn",
        name: "Blessing of Phoenix",
        description: "gain 100 HP after dying (One Time!)",
        oneTime: true,
      },
      {
        type: "highDamage",
        name: "Mjölnir",
        description: "20% critical rate, 400% critical damage",
        oneTime: true,
      },
      {
        type: "fastWalk",
        name: "Gullinbursti",
        description: "Press [Shift] to move faster",
        oneTime: true,
      },
      {
        type: "spinningSlash",
        name: "Gungnir",
        description: "Press [E] to launch Gungnir(Spinning Slash skill)",
        oneTime: true,
      },
    ];
  }
  upgradeOptions = [];
  let availableUpgrades = allUpgrades.filter((upg) => {
    if (upg.oneTime) {
      return !(player.unlockedUpgrades instanceof Set
        ? player.unlockedUpgrades.has(upg.value)
        : player.unlockedUpgrades.includes(upg.value));
    }
    return true;
  });
  for (let i = 0; i < 3 && availableUpgrades.length > 0; i++) {
    let index = floor(random(availableUpgrades.length));
    upgradeOptions.push(availableUpgrades[index]);
    availableUpgrades.splice(index, 1);
  }
}

function updateArrows() {
  for (let i = arrows.length - 1; i >= 0; i--) {
    let arrow = arrows[i];
    arrow.update();
    arrow.display();

    for (let j = enemies.length - 1; j >= 0; j--) {
      let enemy = enemies[j];
      if (arrow.pos.dist(enemy.pos) < enemy.size) {
        if (arrow.handleCollision(enemy)) {
          arrows.splice(i, 1);
        }
        arrow.split();
        break;
      }
    }
  }
}

//generate enemies
function spawnEnemiesForWave(waveNumber) {
  // fog effect
  if (waveNumber === 15) {
    levelFogEnabled = true;
  } else if (waveNumber > 15) {
    levelFogEnabled = false;
  }

  enemies = [];

  if (waveNumber === 5) {
    // stop normal music
    if (normalMusic12 && normalMusic12.isPlaying()) { normalMusic12.stop(); }
    if (normalMusic45 && normalMusic45.isPlaying()) { normalMusic45.stop(); }
    if (normalMusic78 && normalMusic78.isPlaying()) { normalMusic78.stop(); }
    // stop other music
    if (bossMusic2 && bossMusic2.isPlaying()) { bossMusic2.stop(); }
    if (bossMusic3 && bossMusic3.isPlaying()) { bossMusic3.stop(); }
    // plsy boss music
    if (bossMusic1 && !bossMusic1.isPlaying()) {
      bossMusic1.play();
    }

    let boss1 = new SlimeBoss(slimeBossImage, "fire");
    let boss2 = new SlimeBoss(slimeBossImage, "water");
    let boss3 = new SlimeBoss(slimeBoss2Image, "poison");
    let boss4 = new SlimeBoss(slimeBoss2Image, "wind");

    boss1.pos = createVector(width / 2 - 200, height / 2 - 270);
    boss2.pos = createVector(width / 2 + 210, height / 2 - 210);
    boss3.pos = createVector(width / 2 - 220, height / 2 + 150);
    boss4.pos = createVector(width / 2 + 60, height / 2 - 190);

    boss1.skillDelay = 60;
    boss1.skillCooldown = Math.floor(Math.random() * boss1.skillDelay);

    boss2.skillDelay = 180;
    boss2.skillCooldown = Math.floor(Math.random() * boss2.skillDelay);

    boss3.skillDelay = 300;
    boss3.skillCooldown = Math.floor(Math.random() * boss3.skillDelay);

    boss4.skillDelay = 240;
    boss4.skillCooldown = Math.floor(Math.random() * boss4.skillDelay);

    boss1.moveDistance1 = 40;
    boss1.moveDistance2 = 60;

    boss2.moveDistance1 = 30;
    boss2.moveDistance2 = 40;

    boss3.moveDistance1 = 15;
    boss3.moveDistance2 = 20;

    boss4.moveDistance1 = 55;
    boss4.moveDistance2 = 45;

    boss1.initialStopDelay = 0;
    boss2.initialStopDelay = 500;
    boss3.initialStopDelay = 800;
    boss4.initialStopDelay = 1200;

    enemies.push(boss1, boss2, boss3, boss4);

    showFloatingText("Elemental Slime Bosses Appear!", width / 2, height / 2 - 40, color(0, 255, 0));
    bossActive = true;
  }

  else if (waveNumber === 10) {
    // stop normal music
    if (normalMusic12 && normalMusic12.isPlaying()) { normalMusic12.stop(); }
    if (normalMusic45 && normalMusic45.isPlaying()) { normalMusic45.stop(); }
    if (normalMusic78 && normalMusic78.isPlaying()) { normalMusic78.stop(); }
    // stop other music
    if (bossMusic1 && bossMusic1.isPlaying()) { bossMusic1.stop(); }
    if (bossMusic3 && bossMusic3.isPlaying()) { bossMusic3.stop(); }
    // display boss music
    if (bossMusic2 && !bossMusic2.isPlaying()) {
      bossMusic2.play();
    }

    // Birdboss
    let bossPos = getValidSpawnPosition();
    let boss = new BirdBoss(bossAction);
    boss.pos = bossPos;
    enemies.push(boss);
    showFloatingText("Bird Boss Appears!", width / 2, height / 2 - 40, color(0, 255, 0));
    bossActive = true;
  }

  else if (waveNumber === 15) {  //Bugboss
    // stop normal music
    if (normalMusic12 && normalMusic12.isPlaying()) { normalMusic12.stop(); }
    if (normalMusic45 && normalMusic45.isPlaying()) { normalMusic45.stop(); }
    if (normalMusic78 && normalMusic78.isPlaying()) { normalMusic78.stop(); }
    // stop other music
    if (bossMusic1 && bossMusic1.isPlaying()) { bossMusic1.stop(); }
    if (bossMusic2 && bossMusic2.isPlaying()) { bossMusic2.stop(); }
    // display boss music
    if (bossMusic3 && !bossMusic3.isPlaying()) {
      bossMusic3.play();
    }
    let bossPos = getValidSpawnPosition();
    let boss = new BugBoss();
    boss.pos = bossPos;
    enemies.push(boss);
    showFloatingText("Bug Boss Appears!", width / 2, height / 2 - 40, color(0, 255, 0));
    bossActive = true;
  }

  else {
    //stop music
    if (bossMusic1 && bossMusic1.isPlaying()) { bossMusic1.stop(); }
    if (bossMusic2 && bossMusic2.isPlaying()) { bossMusic2.stop(); }
    if (bossMusic3 && bossMusic3.isPlaying()) { bossMusic3.stop(); }

    //play music
    if (waveNumber === 1 || waveNumber === 2 || waveNumber === 3 || waveNumber === 4) {
      if (normalMusic45 && normalMusic45.isPlaying()) { normalMusic45.stop(); }
      if (normalMusic78 && normalMusic78.isPlaying()) { normalMusic78.stop(); }
      if (normalMusic12 && !normalMusic12.isPlaying()) {
        normalMusic12.play();
      }
    } else if (waveNumber === 6 || waveNumber === 7 || waveNumber === 8 || waveNumber === 9) {
      if (normalMusic12 && normalMusic12.isPlaying()) { normalMusic12.stop(); }
      if (normalMusic78 && normalMusic78.isPlaying()) { normalMusic78.stop(); }
      if (normalMusic45 && !normalMusic45.isPlaying()) {
        normalMusic45.play();
      }
    } else if (waveNumber === 11 || waveNumber === 12 || waveNumber === 13 || waveNumber === 14) {
      if (normalMusic12 && normalMusic12.isPlaying()) { normalMusic12.stop(); }
      if (normalMusic45 && normalMusic45.isPlaying()) { normalMusic45.stop(); }
      if (normalMusic78 && !normalMusic78.isPlaying()) {
        normalMusic78.play();
      }
    }

    let baseEnemyCount;
    if (difficult == "hard") {
      baseEnemyCount = Math.floor(6 + waveNumber * 1.1);
    } else {
      baseEnemyCount = Math.floor(6 + waveNumber * 0.8);
    }
    for (let i = 0; i < baseEnemyCount; i++) {
      let isElite = random() < 0.2;
      let enemyType = random();
      let enemy;
      let pos = getValidSpawnPosition();

      if (waveNumber <= 5) {
        if (enemyType < 0.4) {
          enemy = new Enemy(isElite, "normal", commonEnemyAction, 18, 22);
        } else if (enemyType < 0.75) {
          enemy = new Enemy(isElite, "ranged", commonEnemyAction, 18, 22);
        } else {
          enemy = new Enemy(isElite, "exploding", commonEnemyAction, 18, 22);
        }
      } else if (waveNumber > 5 && waveNumber <= 10) {
        if (enemyType < 0.4) {
          enemy = new Enemy(isElite, "normal", commonEnemyAction1, 20, 20, 5, 8, 8, 8);
        } else if (enemyType < 0.75) {
          enemy = new Enemy(isElite, "ranged", commonEnemyAction1, 20, 20, 5, 8, 8, 8);
        } else {
          enemy = new Enemy(isElite, "exploding", commonEnemyAction1, 20, 20, 5, 8, 8, 8);
        }
      } else if (waveNumber > 10) {
        if (enemyType < 0.4) {
          enemy = new Enemy(isElite, "normal", commonEnemyAction2, 18, 18, 5, 6, 6, 6);
        } else if (enemyType < 0.75) {
          enemy = new Enemy(isElite, "ranged", commonEnemyAction2, 18, 18, 5, 6, 6, 6);
        } else {
          enemy = new Enemy(isElite, "exploding", commonEnemyAction2, 18, 18, 5, 6, 6, 6);
        }
      }

      if (enemy) {
        enemy.pos = pos;
        enemies.push(enemy);
      }
    }
    bossActive = false;
  }
}

function getValidSpawnPosition() {
  let pos;
  let isValid = false;
  let attempts = 0;
  const maxAttempts = 200;
  const safeMargin = 200;

  while (!isValid && attempts < maxAttempts) {
    pos = createVector(random(width), random(height));

    let tooCloseToPlayer = player && p5.Vector.dist(pos, player.pos) < safeMargin;

    let nearObstacle = false;
    for (let obs of obstacles) {
      if (obs.collidesWith(pos, safeMargin, safeMargin)) {
        nearObstacle = true;
        break;
      }
    }
    if (!tooCloseToPlayer && !nearObstacle) {
      isValid = true;
    }
    attempts++;
  }
  if (!isValid) {
    let side = floor(random(4));
    let margin = safeMargin;
    do {
      switch (side) {
        case 0:
          pos = createVector(random(margin, width - margin), -margin);
          break;
        case 1:
          pos = createVector(width + margin, random(margin, height - margin));
          break;
        case 2:
          pos = createVector(random(margin, width - margin), height + margin);
          break;
        case 3:
          pos = createVector(-margin, random(margin, height - margin));
          break;
      }
      let inObstacle = false;
      for (let obs of obstacles) {
        if (obs.collidesWithCircle(pos, safeMargin)) {
          inObstacle = true;
          break;
        }
      }
      if (!inObstacle) break;
    } while (true);
  }

  return pos;
}

// potion related
function choosePotion() {
  choosingPotion = true;
  gameState = "paused";
  potionButtons = [];
  const possibleEffects = [
    {
      name: "Attack Boost",
      effect: "Attack Power +5",
      apply: () => (player.attackPower += 5),
    },
    {
      name: "Speed Boost",
      effect: "Attack Speed -50ms",
      apply: () => (player.attackSpeed = max(100, player.attackSpeed - 50)),
    },
    {
      name: "Health Boost",
      effect: "Restore 20 HP",
      apply: () => (player.health = min(player.maxHealth, player.health + 20)),
    },
    {
      name: "Crit Boost",
      effect: "Crit Rate +5%",
      apply: () => (player.critRate = min(0.8, player.critRate + 0.05)),
    },
    {
      name: "Dodge Boost",
      effect: "Dodge Rate +5%",
      apply: () => (player.dodgeRate = min(0.8, player.dodgeRate + 0.05)),
    },
    {
      name: "Lifesteal Boost",
      effect: "Lifesteal +1",
      apply: () => (player.lifesteal = min(5, player.lifesteal + 1)),
    },
    {
      name: "Thorns Boost",
      effect: "Thorns +2",
      apply: () => (player.thorns = min(10, player.thorns + 2)),
    },
  ];
  potionOptions = [];
  const buttonWidth = 280;
  const buttonHeight = 35;
  const verticalSpacing = 80;
  const startY = height / 2 - 90;
  for (let i = 0; i < 3; i++) {
    const numEffects = floor(random(1, 4));
    const selectedEffects = [];
    const availableEffects = [...possibleEffects];
    for (let j = 0; j < numEffects; j++) {
      const randomIndex = floor(random(availableEffects.length));
      selectedEffects.push(availableEffects[randomIndex]);
      availableEffects.splice(randomIndex, 1);
    }
    const potionName = selectedEffects.map((e) => e.name).join(" + ");
    const potionEffect = selectedEffects.map((e) => e.effect).join("，");
    const applyEffects = () => {
      selectedEffects.forEach((effect) => effect.apply());
      choosingPotion = false;
      gameState = "game";
    };
    potionOptions.push({
      name: potionName,
      effect: potionEffect,
      apply: applyEffects,
    });
    const buttonY = startY + i * verticalSpacing;
    potionButtons.push(
      new Button(
        width / 2 - buttonWidth / 2,
        buttonY,
        buttonWidth,
        buttonHeight,
        potionName,
        applyEffects
      )
    );
  }
  potionButtons.push(
    new Button(
      width / 2 - 75,
      startY + 3 * verticalSpacing + 20,
      150,
      35,
      "Skip Upgrade",
      () => {
        player.exp = 0;
        choosingPotion = false;
        gameState = "game";
      }
    )
  );
}

// count distance
function distToLine(point, lineStart, lineEnd) {
  let a = point.x - lineStart.x;
  let b = point.y - lineStart.y;
  let c = lineEnd.x - lineStart.x;
  let d = lineEnd.y - lineStart.y;
  let dot = a * c + b * d;
  let len_sq = c * c + d * d;
  let param = len_sq !== 0 ? dot / len_sq : -1;
  let xx, yy;
  if (param < 0) {
    xx = lineStart.x;
    yy = lineStart.y;
  } else if (param > 1) {
    xx = lineEnd.x;
    yy = lineEnd.y;
  } else {
    xx = lineStart.x + param * c;
    yy = lineStart.y + param * d;
  }
  return dist(point.x, point.y, xx, yy);
}

function showFloatingText(text, x, y, col) {
  floatingTexts.push(new FloatingText(text, x, y, col));
}

class Pet {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.radius = 15;
    this.attackRange = 40;
    this.attackDamage = 15;
    this.speed = 4;
    this.attackCooldown = 0;
    this.orbitRadius = 30;
    this.angle = 0;
  }

  follow(player) {
    this.angle += 0.05;
    const targetPos = createVector(
      player.pos.x + cos(this.angle) * this.orbitRadius,
      player.pos.y + sin(this.angle) * this.orbitRadius
    );
    this.pos.lerp(targetPos, 0.1);
  }

  attack(enemies) {
    this.attackCooldown--;

    let closest = null;
    let record = Infinity;
    for (const enemy of enemies) {
      const d = p5.Vector.dist(this.pos, enemy.pos);
      if (d < record) {
        record = d;
        closest = enemy;
      }
    }

    if (closest && record < this.attackRange && this.attackCooldown <= 0) {
      closest.hit(this.attackDamage);
      this.attackCooldown = 30;
      showFloatingText("⚔️", this.pos.x, this.pos.y, color(255, 200, 0));
    }
  }

  display() {
    push();
    fill(255, 200, 0);
    noStroke();
    translate(this.pos.x, this.pos.y);
    rotate(frameCount * 0.1);
    triangle(-10, 0, 0, -15, 10, 0);
    triangle(-10, 0, 0, 15, 10, 0);
    pop();
  }
}

class Pet2 {
  constructor() {
    this.pos = createVector(0, 0);
    this.radius = 15;
    this.shieldCharge = 0;
    this.isShieldActive = false;
    this.shieldDuration = 90;
    this.shieldTimer = 0;
    this.shieldChargeInterval = 15000;
    this.lastShieldTime = 0;
  }

  follow(player) {
    const target = p5.Vector.add(player.pos, createVector(30, 20));
    this.pos.lerp(target, 0.1);
  }

  update(player) {
    if (!this.isShieldActive) {
      if (millis() - this.lastShieldTime > this.shieldChargeInterval) {
        this.activateShield(player);
        this.lastShieldTime = millis();
      }
    }

    if (this.isShieldActive) {
      this.shieldTimer--;
      if (this.shieldTimer <= 0) {
        this.isShieldActive = false;
        player.invincible = false;
        showFloatingText("🛡️ Shield Disappear!", player.pos.x, player.pos.y - 40, color(100));
      }
    }
  }

  activateShield(player) {
    this.isShieldActive = true;
    this.shieldTimer = this.shieldDuration;
    player.invincible = true;
    showFloatingText("🛡️ Shield Active!", player.pos.x, player.pos.y - 40, color(0, 200, 255));
  }

  display() {
    if (this.isShieldActive) {
      push();
      fill(0, 200, 255, 50);
      stroke(0, 150, 255);
      ellipse(this.pos.x, this.pos.y, 40);
      pop();
    }

    fill(0, 150, 255);
    ellipse(this.pos.x, this.pos.y, this.radius * 2);

    if (!this.isShieldActive) {
      push();
      textSize(12);
      fill(255);
      textAlign(CENTER);
      text(`${floor((millis() - this.lastShieldTime) / this.shieldChargeInterval * 100)}%`,
        this.pos.x, this.pos.y + 25);
      pop();
    }
  }
}

class Pet3 {
  constructor() {
    this.pos = createVector(0, 0);
    this.radius = 15;
    this.healAmount = 0.4; //heal amount per second
    this.healTick = 0;
    this.healInterval = 60;
    this.angle = 0;
    this.orbitRadius = 30;
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
    // heal circle
    noFill();
    stroke(0, 255, 150, 100);
    strokeWeight(2);
    ellipse(this.pos.x, this.pos.y, this.radius * 2);

    fill(0, 255, 150);
    noStroke();
    beginShape();
    for (let i = 0; i < 5; i++) {
      let angle = TWO_PI * i / 5 - PI / 2;
      let x = this.pos.x + cos(angle) * this.radius;
      let y = this.pos.y + sin(angle) * this.radius;
      vertex(x, y);
    }
    endShape(CLOSE);
    pop();
  }
}

//game victory
function displayVictoryScreen() {
  background(0, 150);
  image(victoryPage, 0, 0, width, height);
  fill(255);
  textAlign(CENTER, CENTER);

  textSize(25);
  text(`Normal Enemies Defeated: ${finalStats.normalEnemies}`, width / 2, height / 3 + 200);
  text(`Bosses Defeated: ${finalStats.bosses}`, width / 2, height / 3 + 230);
}

// create button
function setupVictoryButtons() {
  victoryButtons = [
    new Button(width / 2 - 120, height - 100, 100, 40, "Main Menu", () => {
      buttonsound.play();
      gameState = "mainMenu";
    }),
    new Button(width / 2 + 20, height - 100, 100, 40, "Endless Mode", () => {
      buttonsound.play();
      gameState = "game";
      wave = 16;
      spawnEnemiesForWave(wave);
    })
  ];
}

function spawnMultipleElementalBosses() {
  const bossTypes = ["fire", "water", "poison", "wind"];
  const positions = [
    { x: -100, y: -100 },
    { x: 100, y: -100 },
    { x: -100, y: 100 },
    { x: 100, y: 100 }
  ];

  for (let i = 0; i < bossTypes.length; i++) {
    const boss = new SlimeBoss(slimeBossImage, bossTypes[i]);
    boss.pos = createVector(
      width / 2 + positions[i].x,
      height / 2 + positions[i].y
    );
    enemies.push(boss);
  }

  bossActive = true;
}

function updateDeathEffect(enemy) {
  const FRAME_DURATION = 80;

  if (!enemy.effectStartTime) {
    enemy.effectStartTime = millis();
  }

  const elapsed = millis() - enemy.effectStartTime;
  enemy.deathFrame = floor(elapsed / FRAME_DURATION);

  if (enemy.deathFrame >= 4) {
    enemy.isDying = false;
    enemy.dead = true;
    enemy.attackDetect = false;
    let index = enemies.indexOf(enemy);
    enemies.splice(index, 1);

    if (enemy.onEffectComplete) {
      enemy.onEffectComplete();
    }
    return;
  }

  const frameWidth = deathEffect1.width / 4;
  push();
  image(deathEffect1,
    enemy.pos.x - 20,
    enemy.pos.y - 20,
    60, 80,
    enemy.deathFrame * frameWidth, 0,
    frameWidth, deathEffect1.height
  );
  pop();
}

function drawLevelFogEffect() {
  if (!levelFogEnabled) {
    levelFogOpacity = Math.max(0, levelFogOpacity - fogTransitionSpeed);
    if (levelFogOpacity <= 0) return;
  } else {
    levelFogOpacity = Math.min(maxLevelFogOpacity, levelFogOpacity + fogTransitionSpeed);
  }

  const playerCenterX = player.pos.x + player.ImageWidth / 2;
  const playerCenterY = player.pos.y + player.ImageHeight / 2;

  push();
  noStroke();
  fill(16, 16, 26, levelFogOpacity * 0.95);
  rect(0, 0, width, height);

  erase();

  const steps = 60;
  
  for (let i = steps; i >= 0; i--) {
    let ratio = i / steps;
    let r = levelFogRadius * ratio;

    let alphaValue = 2.5 * (1 - ratio * ratio);
    
    noStroke();
    fill(200, alphaValue);
    ellipse(playerCenterX, playerCenterY, r * 2, r * 2);
  }

  noErase();

  noFill();
  noStroke();
  strokeWeight(8);
  ellipse(playerCenterX, playerCenterY, levelFogRadius * 2 - 5, levelFogRadius * 2 - 5);
  
  noStroke();
  strokeWeight(3);
  ellipse(playerCenterX, playerCenterY, levelFogRadius * 2, levelFogRadius * 2);
  
  pop();
}