// ===== 核心游戏逻辑 =====
function handleGameplay(now) {
  // 玩家相关操作
  player.move();
  player.shoot();
  player.update();
  player.display();

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
  }

  // 更新并显示敌人子弹，同时检测与玩家的碰撞
  enemyBullets = enemyBullets.filter((bullet) => {
    if (bullet.update()) {
      bullet.display();
      if (
        p5.Vector.dist(bullet.pos, player.pos) <
        player.radius + bullet.radius
      ) {
        if (bullet instanceof WebProjectile) {
          player.isWebbed = true;
          player.webDuration = 120;
          showFloatingText("Webbed!", player.pos.x, player.pos.y, color(200));
        } else {
          player.takeDamage(bullet.damage);
        }
        return false;
      }
      return true;
    }
    return false;
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
    if (millis() - trail.startTime > trail.duration) {
      poisonTrails.splice(i, 1);
      continue;
    }

    let alpha = map(millis() - trail.startTime, 0, 3000, 255, 0);
    fill(0, 200, 0, alpha * 0.3);
    noStroke();
    ellipse(trail.pos.x, trail.pos.y, trail.radius * 2);

    if (p5.Vector.dist(player.pos, trail.pos) < trail.radius) {
      player.takeDamage(0.5);
    }
  }

  // 如果所有敌人被消灭，则生成下一波敌人
  if (enemies.length === 0) {
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
    new Button(width / 2 - 75, baseY, 150, 40, "Start Game", () => {
      savedGame = null;
      wave = 1; // 重置波数
      normalEnemiesDefeated = 0; // 重置击杀数
      bossDefeated = 0;
      gameState = "menu";
    }),
    new Button(width / 2 - 75, baseY + 50, 150, 40, "Quit Game", () =>
      noLoop()
    ),
  ];

  charSelectButtons = [
    new Button(width / 2 - 100, baseY - 30, 200, 40, "Melee Character", () =>
      initPlayer("melee")
    ),
    new Button(
      width / 2 - 100,
      baseY + 30,
      200,
      40,
      "Ranged Character", // 间距从+20改为+30
      () => initPlayer("ranged")
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
  player = new Player(playerAction, 26, 26, type);
  if (type === "melee") {
    player.attackPower = 10;
    player.attackDamage = 10;
    player.attackSpeed = 500;
    player.moveSpeed = 3;
    player.critRate = 0;
    player.critDamage = 1.5;
    player.dodgeRate = 0;
    player.lifesteal = 0;
    player.thorns = 0;
  } else if (type === "ranged") {
    player.attackPower = 8;
    player.attackDamage = 8;
    player.attackSpeed = 300;
    player.moveSpeed = 4;
    player.critRate = 0.1;
    player.critDamage = 2;
    player.dodgeRate = 0.05;
    player.lifesteal = 0;
    player.thorns = 0;
  }
  wave = 1; // 新增：重置波数
  enemies = [];
  spawnEnemiesForWave(wave);
  generateInitialObstacles();
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

// === 显示Boss血条 ===
function displayBossHealthBar() {
  let boss = enemies.find((e) => e instanceof Boss);
  if (!boss) return;
  const barWidth = width * 0.6;
  const barHeight = 20;
  const x = width / 2 - barWidth / 2;
  const y = 30;
  stroke(255, 215, 0);
  strokeWeight(2);
  fill(50);
  rect(x, y, barWidth, barHeight, 5);
  noStroke();
  fill(255, 0, 0);
  rect(x + 2, y + 2, barWidth - 4, barHeight - 4, 3);
  fill(0, 255, 0);
  rect(
    x + 2,
    y + 2,
    (barWidth - 4) * (boss.health / boss.maxHealth),
    barHeight - 4,
    3
  );
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
    visibleButtons.push(mainMenuButtons[1], mainMenuButtons[2]);
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
  const numObstacles = 6;
  let attempts = 0;
  while (obstacles.length < numObstacles && attempts < 50) {
    let x = random(width * 0.1, width * 0.9);
    let y = random(height * 0.1, height * 0.9);
    let isVertical = random() < 0.5;
    let obsWidth = isVertical ? corridorWidth : random(100, 200);
    let obsHeight = isVertical ? random(100, 200) : corridorWidth;
    if (
      player &&
      p5.Vector.dist(createVector(x, y), player.pos) < minDistanceFromPlayer
    ) {
      attempts++;
      continue;
    }
    let valid = true;
    for (let obs of obstacles) {
      if (p5.Vector.dist(createVector(x, y), obs.pos) < 120) {
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
  const allUpgrades = [
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
      type: "healthRegen",
      name: "生命恢复",
      value: 0.1,
      description: "每秒恢复0.1点生命值",
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

// ===== 根据当前波数生成敌人 =====
function spawnEnemiesForWave(currentWave) {
  enemies = [];
  if (currentWave % 5 === 0) {
    enemies.push(new SpiderBoss(spiderBossAction));
    showFloatingText(
      "Spider Boss Appears!",
      width / 2,
      height / 2 - 40,
      color(0, 255, 0)
    );
    bossActive = true;
  } else {
    let baseEnemyCount = Math.floor(6 + currentWave * 0.8);
    for (let i = 0; i < baseEnemyCount; i++) {
      let isElite = random() < 0.2;
      let enemyType = random();
      let enemy;
      if (enemyType < 0.4) {
        enemy = new Enemy(isElite, "normal", commonEnemyAction, 18, 22);
      } else if (enemyType < 0.75) {
        enemy = new Enemy(isElite, "ranged", commonEnemyAction, 18, 22);
      } else {
        enemy = new Enemy(isElite, "exploding", commonEnemyAction, 18, 22);
      }
      if (enemy) enemies.push(enemy);
    }
    bossActive = false;
  }
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
      // 添加其他敌人类型...
      case "MeleeEnemy": // 新增：处理近战敌人
        enemy = new MeleeEnemy(eData.pos.x, eData.pos.y);
        break;
      case "RangedEnemy": // 新增：处理远程敌人
        enemy = new RangedEnemy(eData.pos.x, eData.pos.y);
        break;
      default:
        enemy = new Enemy();
    }
    Object.assign(enemy, eData);
    enemy.pos = createVector(eData.pos.x, eData.pos.y);
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