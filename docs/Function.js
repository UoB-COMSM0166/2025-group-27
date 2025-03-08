// ===== 核心游戏逻辑 =====
function handleGameplay(now) {
  if(wave<=5){
    image(level1map,0,0,1062,600);
  } else if (wave>5 && wave <=10){
    image(level2map,0,0,1062,600);
  }

  // 玩家相关操作
  player.move();
  player.shoot();
  player.update();
  player.display();


  //更新并绘制羽毛
  feathers = feathers.filter((feather) => {
    if (!feather.update()) {
      return false; // 超出屏幕等条件，移除
    }
    feather.animate(); // 如果有多帧动画
    feather.display();
    return true;
  });

  // 更新并显示子弹
  bullets = bullets.filter((bullet) => {
    if (bullet.update()) {
      bullet.display();
      return true;
    }
    return false;
  });

  // 更新并显示障碍物
  obstacles.forEach((obs) => {
    obs.update();
    obs.display();
  });

  // 更新并显示敌人
  for (let j = enemies.length - 1; j >= 0; j--) {
    let enemy = enemies[j];
    enemy.update();
    enemy.display();
    
    // 检查是否为已击败的Boss(包括BugBoss)
    if ((enemy.isBoss || enemy instanceof BugBoss) && enemy.health <= 0) {
      bossesDefeated++;
      enemies.splice(j, 1);
      bossActive = false; // 确保重置bossActive状态
      
      console.log("Boss defeated, current wave:", wave); // 调试日志
      
      // 处理第6波的特殊情况
      if (wave === 6) {
        player.needsPetSelection = true;
        gameState = "petSelection";
        return;
      }
      
      // 处理第10波的胜利情况
      if (wave === 10) {
        gameState = "victory";
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
      
      // 由于已经击败了当前波次的Boss，加载下一波
      wave++;
      showFloatingText("Wave " + wave, width / 2, height / 2, color(255, 255, 0), 40);
      spawnEnemiesForWave(wave);
    }
  }

  // 更新并显示敌人子弹，同时检测与玩家的碰撞
  enemyBullets = enemyBullets.filter((bullet) => {
    bullet.update();
    bullet.display();
    return bullet.isActive; // 过滤掉已经不活跃的子弹
  });

  // 更新经验球
  expOrbs = expOrbs.filter((orb) => {
    orb.update();
    orb.display();
    return !orb.checkCollection();
  });

  // 处理毒气伤害效果
  for (let i = poisonTrails.length - 1; i >= 0; i--) {
    let trail = poisonTrails[i];
    
    // 更新动画帧
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

    // 绘制特效
    if (trail.isClawEffect && ghostFireImg) {
      // 绘制疾风裂爪特效
      push();
      imageMode(CENTER);
      let frameWidth = ghostFireImg.width / trail.frameCount;
      let frameHeight = ghostFireImg.height;
      
      image(ghostFireImg,
        trail.pos.x, trail.pos.y,
        trail.radius * 2, trail.radius * 2,
        trail.frameIndex * frameWidth, 0,
        frameWidth, frameHeight
      );
      pop();
    } else if (typeof poisonPoolEffectImg !== 'undefined' && poisonPoolEffectImg && trail.frameIndex !== undefined) {
      // 原有的毒池特效代码保持不变
      try {
        push();
        drawingContext.filter = 'contrast(1.2) brightness(1.1)';
        imageMode(CENTER);
        
        // 计算当前帧在精灵表中的位置
        let frameWidth = poisonPoolEffectImg.width / trail.frameCount;
        let frameHeight = poisonPoolEffectImg.height;
        
        // 调整渲染质量
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
    }

    if (p5.Vector.dist(player.pos, trail.pos) < trail.radius) {
      player.takeDamage(0.5);
    }
  }

  // 如果所有敌人被消灭，则生成下一波敌人
  if (enemies.length === 0) {
    if (gameState !== "game") {
      return; // 如果不是游戏状态，不生成新敌人
    }

    // 检查是否需要宠物选择（第6波Boss战后）
    if (wave === 6 && player.needsPetSelection) {
      gameState = "petSelection";
      player.needsPetSelection = false; // 重置标志
      return; // 直接返回，不执行后续生成敌人的逻辑
    }

    if (wave === 10) {
      gameState = "victory";
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

    // 检查是否需要等待宠物选择
    if (wave === 5 && player.needsPetSelection) {
      console.log("C");
      gameState = "petSelection";
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

  // 显示波数提示动画
  if (waveTextAnimation > 0) {
    push();
    waveTextAnimation--;
    textSize(24 + waveTextAnimation);
    fill(255, 200 + waveTextAnimation * 5, 0);
    textAlign(CENTER);
    text(`WAVE ${wave}`, width / 2, height / 2 - 50);
    pop();
  }

  // 显示 HUD 信息
  let elapsedTime = floor((now - gameStartTime) / 1000);
  displayHUD(elapsedTime);

  // 判断游戏结束
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

  // 如果处于升级状态，则绘制升级界面
  if (choosingUpgrade) {
    drawUpgradeScreen();
  }

  // ★ 调用天气效果函数，应用天气效果 ★
  applyWeatherEffects(now);

  // 在绘制完所有游戏对象后，检查并绘制BugBoss的雾气效果
  for (let enemy of enemies) {
    if (enemy instanceof BugBoss && enemy.fogOpacity > 0) {
      enemy.drawFogEffect();
    }
  }
}


// 初始化相关
// ===== 角色选择和按钮初始化 =====
function initButtons() {
  const baseY = height / 2 - 30;

  mainMenuButtons = [
    new Button(width / 2 - 75, baseY - 50, 150, 40, "Resume Game", () => {
      loadSavedGame();
      gameState = "game"; // 从暂停改为直接进入游戏
    }),
    new Button(width / 2 - 75, baseY, 150, 40, "Start Game(easy)", () => {
      savedGame = null;
      wave = 1; // 重置波数
      normalEnemiesDefeated = 0; // 重置击杀数
      bossDefeated = 0;
      gameState = "menu";
      difficult = "easy";
    }),
    new Button(width / 2 - 75, baseY + 50, 150, 40, "Start Game(hard)", () => {
      savedGame = null;
      wave = 1; // 重置波数
      normalEnemiesDefeated = 0; // 重置击杀数
      bossDefeated = 0;
      gameState = "menu";
      difficult = "hard";
    }),
    new Button(width / 2 - 75, baseY + 100, 150, 40, "Setting", () => {
      gameState = "setting";
    }),
    new Button(width / 2 - 75, baseY + 150, 150, 40, "Quit Game", () =>
      noLoop()
    ),
  ];

  charSelectButtons = [
    new Button(width / 2 - 100, baseY - 30, 200, 40, "Gunner", () =>
      initPlayer("gunner")
    ),
    new Button(
      width / 2 - 100,
      baseY + 30,
      200,
      40,
      "Archer", // 间距从+20改为+30
      () => initPlayer("archer")
    ),
    new Button(
      width / 2 - 100,
      baseY + 90,
      200,
      40,
      "Knight",
      () => initPlayer("knight")
    ),
  ];

  pauseButtons = [
    new Button(
      width / 2 - 75,
      baseY,
      150,
      40,
      "Resume Game",
      () => (gameState = "game")
    ),
    new Button(width / 2 - 75, baseY + 60, 150, 40, "Main Menu", () => {
      savedGame = {
        ...savedGame,
        wave: wave, // 新增保存波数
        player: JSON.stringify({
          ...player,
          pos: { x: player.pos.x, y: player.pos.y }, // 保存精确坐标
        }),
        enemies: enemies.map((e) => ({
          ...e,
          type: e.constructor.name, // 保存具体敌人类型
          pos: { x: e.pos.x, y: e.pos.y },
        })),
      };
      gameState = "mainMenu";
    }),
  ];
}

// ===== 初始化角色时生成第一波敌人 =====
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
    player.arrowDamage = 20;          // 基础伤害
    player.arrowSpeed = 10;           // 基础速度
    player.maxChargeTime = 90;        // 增加最大蓄力时间
    player.arrowCooldown = 20;        // 冷却时间调整
    player.chargeBarScale = 0.7;      // 新增蓄力条缩放系数
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
  wave = 1; // 新增：重置波数
  enemies = [];

  generateInitialObstacles();

  spawnEnemiesForWave(wave);
  gameState = "game";
}

// display函数
// ===== HUD及波数显示 =====
function displayHUD(elapsedTime) {
  push();
  fill(255);
  textSize(14);
  textAlign(LEFT, TOP);
  text(`Time: ${elapsedTime}s`, 10, 60); // 向下移动
  text(`Enemies Killed: ${normalEnemiesDefeated}`, 10, 80); // 向下移动
  text(`Bosses Defeated: ${bossDefeated}`, 10, 100); // 向下移动

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

// ===== UI 及输入 =====
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

// ===== 显示角色属性预览 =====
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
  // 每次进入设置页面时显示控件
  if (!volumeSlider) {
    // 首次进入时创建设置元素
    volumeSlider = createSlider(0, 1, volume, 0.1);
    volumeSlider.position(width / 2 - 100, 200);

    backButton = createButton('Save and Return');
    backButton.position(width / 2 - 50, 300);
    backButton.mousePressed(() => {
      gameState = 'mainMenu'; // 返回主菜单
      hideSettingsElements(); // 隐藏设置控件
    });
  } else {
    // 非首次进入时显示控件
    showSettingsElements();
  }

  // 实时更新全局变量
  volume = volumeSlider.value();

  // 绘制设置界面文字
  fill(0);
  textSize(20);
  text('Volume', width / 2 - 150, 220);
}

// 显示设置控件
function showSettingsElements() {
  volumeSlider.show();
  backButton.show();
}

// 隐藏设置控件
function hideSettingsElements() {
  volumeSlider.hide();
  backButton.hide();
}

// === 显示Boss血条 ===
function displayBossHealthBar() {
  // 只计算活跃的Boss
  let activeBosses = enemies.filter(e => e instanceof Boss && e.isActive);
  if (activeBosses.length === 0) {
    bossActive = false;
    return;
  }

  // 计算活跃Boss的总血量
  let totalMaxHealth = 0;
  let totalCurrentHealth = 0;
  for (let boss of activeBosses) {
    totalMaxHealth += boss.maxHealth;
    totalCurrentHealth += Math.max(0, boss.health); // 确保不会出现负数
  }

  // 绘制血条
  const barWidth = width * 0.6;
  const barHeight = 20;
  const x = width / 2 - barWidth / 2;
  const y = 30;

  // 血条背景
  stroke(255, 215, 0);
  strokeWeight(2);
  fill(50);
  rect(x, y, barWidth, barHeight, 5);
  noStroke();

  // 当前血量
  if (totalMaxHealth > 0) { // 添加检查以避免除以零
    let healthPercentage = totalCurrentHealth / totalMaxHealth;
    healthPercentage = constrain(healthPercentage, 0, 1); // 确保百分比在0-1之间

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

  // 显示血量数值
  fill(255);
  textAlign(CENTER);
  textSize(14);
  text(
    `Boss HP: ${Math.ceil(totalCurrentHealth)} / ${totalMaxHealth}`,
    width / 2,
    y + barHeight + 15
  );

  // 只显示活跃Boss的单独血量
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

// ===== 其他UI函数 =====
function displayMainMenu() {
  fill(255);
  textSize(24);
  textAlign(CENTER, CENTER);
  text("Dungeon Survival", width / 2, height / 3);
  let visibleButtons = [];
  if (savedGame) {
    visibleButtons = visibleButtons.concat(mainMenuButtons);
  } else {
    // 没有存档时只显示"开始游戏"和"退出游戏"
    visibleButtons.push(mainMenuButtons[1], mainMenuButtons[2], mainMenuButtons[3], mainMenuButtons[4]);
  }

  // 修复2：统一渲染逻辑
  visibleButtons.forEach((btn) => btn.display());
}

function displayCharacterSelection() {
  fill(255);
  textSize(24);
  textAlign(CENTER, CENTER);
  text("Choose Your Character", width / 2, height / 3);
  charSelectButtons.forEach((btn) => btn.display());
}

function displayPauseMenu() {
  push();
  textSize(20);
  fill(255);
  textAlign(CENTER, CENTER);
  text("Game Paused", width / 2, height / 3);

  // 计算并显示暂停时间
  let pausedTime = floor((millis() - pauseStartTime) / 1000);
  text(`Paused for: ${pausedTime}s`, width / 2, height / 3 + 30);

  text(`Level: ${player.level}`, width / 2, height / 2);
  text(`Health: ${player.health}`, width / 2, height / 2 + 30);
  text(`XP: ${player.exp}`, width / 2, height / 2 + 60);
  text("Save Game (Press 'S')", width / 2, height / 2 + 90);
  text("Return to Main Menu (Press 'M')", width / 2, height / 2 + 120);
  text("Resume (Press 'P')", width / 2, height / 2 + 150);
  pop();
}

function displayGameOverScreen() {
  background(0);
  textSize(20);
  fill(255);
  textAlign(CENTER, CENTER);
  text("Game Over", width / 2, height / 4);
  text(
    `Enemies Killed: ${finalStats.normalEnemies}`,
    width / 2,
    height / 2 - 60
  );
  text(`Bosses Defeated: ${finalStats.bosses}`, width / 2, height / 2 - 30);
  text(`Final Level: ${finalStats.level}`, width / 2, height / 2);
  text(`ATK: ${finalStats.attackPower}`, width / 2, height / 2 + 30);
  text(`ASPD: ${finalStats.attackSpeed}ms`, width / 2, height / 2 + 60);
  text(`DMG: ${finalStats.attackDamage}`, width / 2, height / 2 + 90);
  text("Press R to Restart", width / 2, height - 50);
}

// ===== 生成障碍物 =====
function generateInitialObstacles() {
  obstacles = [];
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

    
    if (valid)
      obstacles.push(new Obstacle(x, y, obsWidth, obsHeight, isVertical));
    attempts++;
  }
}

// ===== 升级界面 =====
function drawUpgradeScreen() {
  fill(0, 0, 0, 200);
  rect(0, 0, width, height);
  fill(255);
  textSize(32);
  textAlign(CENTER);
  text("Upgrade! Choose one option", width / 2, height / 4);

  for (let i = 0; i < upgradeOptions.length; i++) {
    let x = width / 4 + (i * width) / 4;
    let y = height / 2;
    let option = upgradeOptions[i];
    fill(60, 60, 60);
    if (
      mouseX > x - 100 &&
      mouseX < x + 100 &&
      mouseY > y - 50 &&
      mouseY < y + 50
    ) {
      fill(80, 80, 80);
    }
    rect(x - 100, y - 50, 200, 100, 10);
    fill(255);
    textSize(20);
    text(option.name, x, y - 20);
    textSize(16);
    text(option.description, x, y + 20);
  }
  textAlign(LEFT);
}

// ===== 升级选项 =====
function generateUpgradeOptions() {
  let allUpgrades;
  if(player.characterType == "gunner" || player.characterType == "knight"){
    allUpgrades = [
    {
      type: "health",
      name: "生命提升",
      value: 25,
      description: "增加25点生命值上限",
    },
    {
      type: "speed",
      name: "速度提升",
      value: 0.5,
      description: "增加移动速度",
    },
    {
      type: "fireRate",
      name: "火力提升",
      value: 2,
      description: "提升射击速度",
    },
    {
      type: "defense",
      name: "防御提升",
      value: 0.2,
      description: "减少受到的伤害",
    },
    {
      type: "criticalChance",
      name: "暴击概率",
      value: 0.05,
      description: "增加5%暴击概率",
    },
    {
      type: "expBonus",
      name: "经验加成",
      value: 0.1,
      description: "获得经验值增加10%",
    },
    {
      type: "armorPen",
      name: "护甲穿透",
      value: 0.1,
      description: "忽视敌人10%防御",
    },
    {
      type: "bulletType",
      name: "散射强化",
      value: "shotgun",
      description:
        player && player.bulletType === "shotgun"
          ? `增加一颗散射子弹(当前:${player.shotgunLevel}颗)`
          : "一次发射多颗并排子弹",
      oneTime: false,
    },
    {
      type: "bulletType",
      name: "穿透子弹",
      value: "pierce",
      description: "子弹可以穿透敌人",
      oneTime: true,
    },
    {
      type: "bulletType",
      name: "弹跳子弹",
      value: "bounce",
      description: "子弹可以反弹3次",
      oneTime: true,
    },
    {
      type: "passive",
      name: "吸血",
      value: "lifesteal",
      description: "攻击恢复生命值",
      oneTime: true,
    },
    {
      type: "passive",
      name: "经验光环",
      value: "expAura",
      description: "获得50%额外经验值",
      oneTime: true,
    },
    {
      type: "passive",
      name: "反伤护甲",
      value: "thorns",
      description: "受击时反弹伤害",
      oneTime: true,
    },
  ];
  } else if (player.characterType == "archer") {
    allUpgrades = [
      {
        type: "health",
        name: "生命提升",
        value: 25,
        description: "增加25点生命值上限",
      },
      {
        type: "attack",
        name: "攻击力提升",
        value: 5,
        description: "增加5点攻击力",
      },
      {
        type: "arrowPierce",
        name: "穿透箭矢",
        value: "pierce",
        description: "箭矢可以穿透敌人",
        oneTime: true,
      },
      {
        type: "arrowSplit",
        name: "散射箭矢",
        value: "split",
        description: "箭矢在命中敌人后会散射一次",
        oneTime: true,
      },
      {
        type: "doubleShot",
        name: "双发箭矢",
        value: "double",
        description: "一次性射出两发箭矢",
        oneTime: true,
      },
      {
        type: "lifesteal",
        name: "攻击回血",
        value: "lifesteal",
        description: "攻击时恢复生命值",
        oneTime: true,
      },
    ];
  }
  upgradeOptions = [];
  let availableUpgrades = allUpgrades.filter((upg) => {
    // 确保使用Set的has方法
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

    // 检测箭矢与敌人的碰撞
    for (let j = enemies.length - 1; j >= 0; j--) {
      let enemy = enemies[j];
      if (arrow.pos.dist(enemy.pos) < enemy.size) {
        if (arrow.handleCollision(enemy)) {
          // 如果箭矢没有穿透，销毁箭矢
          arrows.splice(i, 1);
        }
        arrow.split(); // 处理散射
        break;
      }
    }
  }
}

// ===== 根据当前波数生成敌人 =====
function spawnEnemiesForWave(wave) {
  enemies = [];

  if (wave === 3) {
    let boss1 = new SlimeBoss(slimeBossImage, "fire");
    let boss2 = new SlimeBoss(slimeBossImage, "water");
    let boss3 = new SlimeBoss(slimeBoss2Image, "poison");
    let boss4 = new SlimeBoss(slimeBoss2Image, "wind");

    // 设置不同位置
    boss1.pos = createVector(width / 2 - 200, height / 2 - 70);
    boss2.pos = createVector(width / 2 + 10, height / 2 - 10);
    boss3.pos = createVector(width / 2 - 120, height / 2 - 50);
    boss4.pos = createVector(width / 2 + 60, height / 2 - 190);

    enemies.push(boss1, boss2, boss3, boss4);

    showFloatingText("Elemental Slime Bosses Appear!", width / 2, height / 2 - 40, color(0, 255, 0));
    bossActive = true;
  }

  else if (wave === 6) {
    // 生成 BirdBoss
    let bossPos = getValidSpawnPosition();
    let boss = new BirdBoss(bossAction);
    boss.pos = bossPos;
    enemies.push(boss);
    showFloatingText(
      "Bird Boss Appears!",
      width / 2,
      height / 2 - 40,
      color(0, 255, 0)
    );
    bossActive = true;
  }

  else if (wave === 9) {  // 第9波
    console.log("生成第9波boss");  // 调试日志
    let bossPos = getValidSpawnPosition();
    let boss = new BugBoss();
    boss.pos = bossPos;
    enemies.push(boss);
    showFloatingText("Bug Boss Appears!", width / 2, height / 2 - 40, color(0, 255, 0));
    bossActive = true;
  }

  else {
    // 普通敌人生成逻辑
    let baseEnemyCount;
    if(difficult == "hard"){
      baseEnemyCount = Math.floor(6 + wave * 1.1);
    } else {
      baseEnemyCount = Math.floor(6 + wave * 0.8);
    }
    for (let i = 0; i < baseEnemyCount; i++) {
      let isElite = random() < 0.2;
      let enemyType = random();
      let enemy;
      let pos = getValidSpawnPosition();

      if (enemyType < 0.4) {
        enemy = new Enemy(isElite, "normal", commonEnemyAction, 18, 22);
      } else if (enemyType < 0.75) {
        enemy = new Enemy(isElite, "ranged", commonEnemyAction, 18, 22);
      } else {
        enemy = new Enemy(isElite, "exploding", commonEnemyAction, 18, 22);
      }

      if (enemy) {
        enemy.pos = pos;
        enemies.push(enemy);
      }
    }
    bossActive = false;
  }
}


// 新增函数：获取有效的生成位置
function getValidSpawnPosition() {
  let pos;
  let isValid = false;
  let attempts = 0;
  const maxAttempts = 50;
  const safeMargin = 150; // 修改后的缓冲距离

  while (!isValid && attempts < maxAttempts) {
    pos = createVector(random(width), random(height));

    // 检查是否离玩家太近
    let tooCloseToPlayer = player && p5.Vector.dist(pos, player.pos) < safeMargin;

    // 检查是否在障碍物内或太靠近障碍物
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

  // 如果尝试多次仍找不到合适位置，则在地图边缘生成，并确保不在障碍物内
  if (!isValid) {
    let side = floor(random(4));
    let margin = safeMargin; // 使用安全边距
    do {
      switch (side) {
        case 0: // 上边
          pos = createVector(random(margin, width - margin), -margin);
          break;
        case 1: // 右边
          pos = createVector(width + margin, random(margin, height - margin));
          break;
        case 2: // 下边
          pos = createVector(random(margin, width - margin), height + margin);
          break;
        case 3: // 左边
          pos = createVector(-margin, random(margin, height - margin));
          break;
      }
      let inObstacle = false;
      for (let obs of obstacles) {
        if (obs.collidesWith(pos, safeMargin, safeMargin)) {
          inObstacle = true;
          break;
        }
      }
      if (!inObstacle) break;
    } while (true);
  }

  return pos;
}


function loadSavedGame() {
  if (!savedGame) return;

  // 加载玩家
  const playerData = JSON.parse(savedGame.player);
  player = new Player(
    playerData.pos.x,
    playerData.pos.y,
    playerData.characterType
  );
  player.bulletTypes = new Set(playerData.bulletTypes || []);
  player.unlockedUpgrades = new Set(playerData.unlockedUpgrades || []);
  Object.assign(player, playerData);
  player.bulletTypes = new Set(player.bulletTypes); // 新增
  player.unlockedUpgrades = new Set(player.unlockedUpgrades); // 新增
  player.pos = createVector(playerData.pos.x, playerData.pos.y);

  // 加载敌人
  enemies = JSON.parse(savedGame.enemies).map((eData) => {
    let enemy;
    switch (eData.type) {
      case "SpiderBoss":
        enemy = new SpiderBoss();
        break;
      case "Boss":
        enemy = new Boss();
        break;
      case "MeleeEnemy":
        enemy = new MeleeEnemy(eData.isElite);
        break;
      case "RangedEnemy":
        enemy = new RangedEnemy(eData.isElite);
        break;
      default:
        enemy = new Enemy(eData.isElite, eData.type, commonEnemyAction, 18, 22);
    }
    // 确保位置正确设置
    enemy.pos = createVector(eData.pos.x, eData.pos.y);
    Object.assign(enemy, eData);
    return enemy;
  });

  // 加载其他状态...
  gameStartTime = millis() - savedGame.gameStartTime;
}

// 药水相关
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

// ===== 辅助函数 =====

// 获取一个远离玩家的随机生成点
function getRandomSpawnPosition() {
  let x, y;
  do {
    x = random(width);
    y = random(height);
  } while (player && p5.Vector.dist(createVector(x, y), player.pos) < 100);
  return createVector(x, y);
}

// 计算点到线段的距离
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

// 显示浮动文字
function showFloatingText(text, x, y, col) {
  floatingTexts.push(new FloatingText(text, x, y, col));
}

// 添加宠物类定义
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
        showFloatingText("🛡️ 护盾消失", player.pos.x, player.pos.y - 40, color(100));
      }
    }
  }

  activateShield(player) {
    this.isShieldActive = true;
    this.shieldTimer = this.shieldDuration;
    player.invincible = true;
    showFloatingText("🛡️ 护盾激活!", player.pos.x, player.pos.y - 40, color(0, 200, 255));
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
    this.healAmount = 0.4; // 每秒回复量
    this.healTick = 0;
    this.healInterval = 60; // 每60帧（约1秒）治疗一次
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
    // 绘制治疗光环
    noFill();
    stroke(0, 255, 150, 100);
    strokeWeight(2);
    ellipse(this.pos.x, this.pos.y, this.radius * 2);

    // 绘制宠物本体
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

// 添加游戏胜利界面相关内容
function displayVictoryScreen() {
  background(0, 150);
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(32);
  text("🎉 Victory! 🎉", width / 2, height / 4);

  textSize(20);
  text(`Level: ${finalStats.level}`, width / 2, height / 3);
  text(`Normal Enemies Defeated: ${finalStats.normalEnemies}`, width / 2, height / 3 + 30);
  text(`Bosses Defeated: ${finalStats.bosses}`, width / 2, height / 3 + 60);
  text(`Attack Power: ${finalStats.attackPower}`, width / 2, height / 3 + 90);
  text(`Attack Speed: ${finalStats.attackSpeed}`, width / 2, height / 3 + 120);
  text(`Attack Damage: ${finalStats.attackDamage}`, width / 2, height / 3 + 150);

  for (let i = 0; i < victoryButtons.length; i++) {
    victoryButtons[i].display(); // 显示每个按钮
  }
}

// 创建按钮
function setupVictoryButtons() {
  victoryButtons = [
    new Button(width / 2 - 120, height - 100, 100, 40, "Main Menu", () => {
      gameState = "mainMenu";
    }),
    new Button(width / 2 + 20, height - 100, 100, 40, "Endless Mode", () => {
      gameState = "game";
      wave = 11;
      spawnEnemiesForWave(wave);
    })
  ];
}

// 添加一个新函数来生成多个Boss并分散它们
function spawnMultipleElementalBosses() {
  const bossTypes = ["fire", "water", "poison", "wind"];
  const positions = [
    {x: -100, y: -100}, // 左上
    {x: 100, y: -100},  // 右上
    {x: -100, y: 100},  // 左下
    {x: 100, y: 100}    // 右下
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