// ===== 全局变量 =====
let player;
let bullets = [];
let enemyBullets = [];
let enemies = [];
let obstacles = [];
let expOrbs = [];
let floatingTexts = [];
let poisonTrails = []; // 新增：毒气轨迹数组
let score = 0;
let wave = 1;
let gameState = "mainMenu"; // "mainMenu", "menu"（角色选择）, "game", "paused", "upgrading", "gameOver"
let lastTerrainChange = 0;
let feathers = [];
let featherSprite;
const borderOffset = 10;

// 暂停按钮和暂停时间
let pauseButton;
let pauseStartTime = 0;
let totalPausedTime = 0;

// ----- 天气相关全局变量 -----
let weather = "normal";              // 当前天气："normal", "hot", "snowy", "thunderstorm"
let lastWeatherChange = 0;           // 上一次随机选择天气的时间
let weatherStartTime = 0;            // 当前特殊天气开始的时间

let lightningZone = null;
let lightningChain = [];
let lastLightningTime = 0;
const lightningDelay = 1000; // 每道闪电延迟（毫秒）
const maxLightningChain = 3; // 最大连续闪电数
let upgradeOptions = [];
let choosingUpgrade = false;
let passiveSkills = [];
let coins = 0;
let usedBossTypes = [];
let commonEnemyAction = {};
// 以下变量属于扩展（UI、统计等）
let savedGame = null;
let normalEnemiesDefeated = 0;
let bossDefeated = 0;
let bossDefeatedCount = 0;
let finalStats = {};
let showAttributes = false;
let gameStartTime = 0;
let bossActive = false;
let potionOptions = [];
let choosingPotion = false;
let potionButtons = [];
// 波数提示动画（可选效果）
let waveTextAnimation = 0;
// 调试标记
const debug = false;
let mainMenuButtons = [];
let charSelectButtons = [];
let pauseButtons = [];

let mainMenuButton = [];
let endlessModeButton = [];
let victoryButtons = [];

// ----- 天气效果绘制 -----
// 热天效果：利用噪声生成水平条纹模拟热浪扭曲效果
function drawHeatHaze() {
  push();
  noStroke();
  for (let y = 0; y < height; y += 5) {
    let offset = map(noise(y * 0.01, millis() * 0.002), 0, 1, -10, 10);
    fill(255, 200, 200, 30);
    rect(offset, y, width, 5);
  }
  pop();
}

// 冰雪效果：粒子系统模拟雪花飘落
class Snowflake {
  constructor() {
    this.x = random(width);
    this.y = random(-50, -10);
    this.size = random(2, 5);
    this.speed = random(0.5, 1.5);
  }
  update() {
    this.y += this.speed;
    if (this.y > height) {
      this.y = random(-50, -10);
      this.x = random(width);
    }
  }
  display() {
    noStroke();
    fill(255, 255, 255, 200);
    ellipse(this.x, this.y, this.size);
  }
}
let snowflakes = [];
function setupSnow() {
  for (let i = 0; i < 100; i++) {
    snowflakes.push(new Snowflake());
  }
}
function drawSnow() {
  for (let s of snowflakes) {
    s.update();
    s.display();
  }
}

// 雷暴效果：短暂闪光模拟闪电
let lightningFlash = false;
let lightningTimer = 0;
function updateLightningFlash() {
  if (millis() - lightningTimer > 3000) {
    lightningFlash = true;
    lightningTimer = millis();
    setTimeout(() => { lightningFlash = false; }, 100);
  }
}
function drawLightningFlash() {
  if (lightningFlash) {
    push();
    fill(255, 255, 255, 200);
    rect(0, 0, width, height);
    pop();
  }
}

// 根据当前天气状态调用不同效果
function drawWeatherEffects() {
  if (weather === "hot") {
    drawHeatHaze();
  } else if (weather === "snowy") {
    drawSnow();
  } else if (weather === "thunderstorm") {
    updateLightningFlash();
    drawLightningFlash();
  }
}

// ----- 天气更新函数 -----
// 每隔 60000 毫秒随机选择一种天气（"normal", "hot", "snowy", "thunderstorm"）
// 如果选择的是特殊天气（hot, snowy, thunderstorm），则持续效果为20秒，之后自动恢复为 normal
function updateWeather() {
  let currentTime = millis();

  // 每隔 60000 毫秒重新随机选择天气
  if (currentTime - lastWeatherChange > 60000) {
    let weatherOptions = ["normal", "hot", "snowy", "thunderstorm"];
    weather = random(weatherOptions);
    lastWeatherChange = currentTime;
    weatherStartTime = currentTime;

    // 如果选到雷暴，则以玩家当前位置作为闪电起点
    if (weather === "thunderstorm") {
      lightningZone = player.pos.copy();
      lightningChain = [lightningZone];
      lastLightningTime = currentTime;
    }
  }

  // 如果当前天气为特殊天气且持续超过20秒，则自动恢复为 normal
  if (weather !== "normal" && currentTime - weatherStartTime > 20000) {
    weather = "normal";
  }
}

// ----- p5.js 核心函数 -----
function preload() {
  // knight
  KnightActionUp = loadImage("./assets/selected_images/characters/keyboardman/keyboardman_back.png");
  KnightActionDown = loadImage("./assets/selected_images/characters/keyboardman/keyboardman_front.png");
  KnightActionLeft = loadImage("./assets/selected_images/characters/keyboardman/keyboardman_left.png");
  KnightActionRight = loadImage("./assets/selected_images/characters/keyboardman/keyboardman_right.png");
  KnightActionIntro = loadImage("./assets/selected_images/characters/keyboardman/keyboardman_intro.png");

  KnightActionAttackUp = loadImage("./assets/selected_images/characters/keyboardman/attack/keyboardman_attack_back.png");
  KnightActionAttackDown = loadImage("./assets/selected_images/characters/keyboardman/attack/keyboardman_attack_front.png");
  KnightActionAttackLeft = loadImage("./assets/selected_images/characters/keyboardman/attack/keyboardman_attack_left.png");
  KnightActionAttackRight = loadImage("./assets/selected_images/characters/keyboardman/attack/keyboardman_attack_right.png");
  // gunner
  GunnerActionUp = loadImage("./assets/selected_images/characters/computerboy/computerboy_back.png");
  GunnerActionDown = loadImage("./assets/selected_images/characters/computerboy/computerboy_front.png");
  GunnerActionLeft = loadImage("./assets/selected_images/characters/computerboy/computerboy_left.png");
  GunnerActionRight = loadImage("./assets/selected_images/characters/computerboy/computerboy_right.png");
  GunnerActionIntro = loadImage("./assets/selected_images/characters/computerboy/computerboy_intro.png");

  GunnerAttackUp = loadImage("./assets/selected_images/characters/computerboy/attack/computerboy_attack_upward.png");
  GunnerAttackDown = loadImage("./assets/selected_images/characters/computerboy/attack/computerboy_attack_downward.png");
  GunnerAttackLeft = loadImage("./assets/selected_images/characters/computerboy/attack/computerboy_attack_left.png");
  GunnerAttackRight = loadImage("./assets/selected_images/characters/computerboy/attack/computerboy_attack_right.png");

  GunnerBulletAnimationUp = loadImage("./assets/selected_images/characters/computerboy/attack/computerboy_attack_upward.png");
  GunnerBulletAnimationDown = loadImage("./assets/selected_images/characters/computerboy/attack/computerboy_attack_downward.png");
  GunnerBulletAnimationLeft = loadImage("./assets/selected_images/characters/computerboy/attack/computerboy_attack_left.png");
  GunnerBulletAnimationRight = loadImage("./assets/selected_images/characters/computerboy/attack/computerboy_attack_right.png");

  Bup = loadImage("./assets/selected_images/characters/computerboy/attack/computerboy_attack_upward.gif");
  Bdown = loadImage("./assets/selected_images/characters/computerboy/attack/computerboy_attack_downward.gif");
  Bleft = loadImage("./assets/selected_images/characters/computerboy/attack/computerboy_attack_left.gif");
  Bright = loadImage("./assets/selected_images/characters/computerboy/attack/computerboy_attack_right.gif");
  // archer
  ArcherActionUp = loadImage("./assets/selected_images/characters/mousegirl/mousegirl_back.png");
  ArcherActionDown = loadImage("./assets/selected_images/characters/mousegirl/mousegirl_front.png");
  ArcherActionLeft = loadImage("./assets/selected_images/characters/mousegirl/mousegirl_left.png");
  ArcherActionRight = loadImage("./assets/selected_images/characters/mousegirl/mousegirl_right.png");
  ArcherActionIntro = loadImage("./assets/selected_images/characters/mousegirl/mousegirl_intro.png");

  ArcherActionAttackUp = loadImage("./assets/selected_images/characters/mousegirl/attack/mousegirl_attack_upward.png");
  ArcherActionAttackDown = loadImage("./assets/selected_images/characters/mousegirl/attack/mousegirl_attack_downward.png");
  ArcherActionAttackLeft = loadImage("./assets/selected_images/characters/mousegirl/attack/mousegirl_attack_left.png");
  ArcherActionAttackRight = loadImage("./assets/selected_images/characters/mousegirl/attack/mousegirl_attack_right.png");
  // bossAction 用于 BirdBoss
  bossAction = loadImage("./assets/candidate_images/characters/enemies/birdman/BirdBoss.png");
  featherSprite = loadImage("./assets/candidate_images/characters/enemies/birdman/falling_feather_yellow.png");
  // adjustment

  slimeBossImage = loadImage("./assets/candidate_images/effects/skill_effects/drip/cell_sphere/boss_slime_blue.png");
  slimeBoss2Image = loadImage("./assets/candidate_images/effects/skill_effects/drip/cell_sphere/boss_slime.png");
  //spiderBossAction = loadImage("./assets/images/Characters/Enemies/SpiderBoss/SpiderBoss.png");

  commonEnemyAction.idle = loadImage("./assets/candidate_images/characters/enemies/birdman_imp/cavelingSkirmisher_idleEmote1.png");
  commonEnemyAction.up = loadImage("./assets/candidate_images/characters/enemies/birdman_imp/cavelingSkirmisher_move_up.png");
  commonEnemyAction.down = loadImage("./assets/candidate_images/characters/enemies/birdman_imp/cavelingSkirmisher_move.png");
  commonEnemyAction.side = loadImage("./assets/candidate_images/characters/enemies/birdman_imp/cavelingSkirmisher_move_side.png");
  obstacle1 = loadImage("./assets/selected_images/barrier/level_1/tree1.png");
  obstacle2 = loadImage("./assets/selected_images/barrier/level_1/stone3.png");
  bombAction = loadImage("./assets/candidate_images/items/weapons/bomb/bomb.png");
  // 添加水泡和火焰效果图片
  waterBubbleImg = loadImage("./assets/candidate_images/effects/attack_effects/bubble.png");
  fireballImg = loadImage("./assets/candidate_images/effects/attack_effects/fireballProjectile_idle.png");
  poisonVortexImg = loadImage("./assets/candidate_images/effects/attack_effects/mummy_vortex_sheet.png");

  // 加载风史莱姆的龙卷风动画
  windTornadoImg = loadImage("./assets/candidate_images/effects/attack_effects/bigFireAnticipation_spawn_white.png");

  //宠物一
  summonBatImage = loadImage("./assets/candidate_images/characters/pets/bat/summonBat_idle.png");
  summonBatAttackImage = loadImage("./assets/candidate_images/characters/pets/bat/summonBat_rangedAttack_side.png");

  // 加载鸟Boss毒池特效图片
  poisonPoolEffectImg = loadImage("./assets/candidate_images/effects/skill_effects/drip/waterSplashLava.png");
}


function setup() {
  createCanvas(800, 600);
  gameStartTime = millis();
  generateInitialObstacles();
  initButtons();
  setupVictoryButtons();
  gameState = "mainMenu";
  setupSnow(); // 初始化雪花粒子

  // 初始化暂停按钮
  pauseButton = new Button(width - 110, 10, 100, 30, "Pause", () => {
    if (gameState === "game") {
      gameState = "paused";
      pauseStartTime = millis();
    }
  });
}

function draw() {
  background(51);
  updateWeather();
  noStroke();
  strokeWeight(1);

  switch (gameState) {
    case "mainMenu":
      displayMainMenu();
      break;
    case "menu":
      displayCharacterSelection();
      break;
    case "petSelection":
      showPetSelectionScreen();
      break;
    case "game":
      handleGameplay(millis());
      pauseButton.display();
      break;
    case "paused":
      displayPauseMenu();
      break;
    case "upgrading":
      drawUpgradeScreen();
      break;
    case "gameOver":
      displayGameOverScreen();
      break;
    case "victory":
      displayVictoryScreen();
      break;
  }

  // 处理浮动文字
  floatingTexts = floatingTexts.filter((ft) => {
    if (ft.update()) {
      ft.display();
      return true;
    }
    return false;
  });

  if (bossActive) {
    displayBossHealthBar();
  }

  if (showAttributes) {
    displayAttributes();
  }

  // 叠加当前天气效果（不改变原始背景色）
  drawWeatherEffects();

  // 显示当前天气文本（调试用）
  textSize(16);
  fill(255);
  text("当前天气：" + weather, 70, height - 10);

  // === 添加血条和经验条 ===
  drawPlayerStats();
  // 绘制边界
  stroke(255, 0, 0);
  strokeWeight(4);
  noFill();
  rect(0, 0, width, height);
}

// 新增函数：绘制主角的血条和经验条
function drawPlayerStats() {
  // 检查 player 对象是否已定义
  if (!player) {
    console.warn("Player object is not defined.");
    return;
  }

  // 血条
  const healthBarWidth = 200;
  const healthBarHeight = 20;
  const healthPercentage = player.health / player.maxHealth;
  fill(255, 0, 0); // 红色表示已损失的血量
  rect(10, 10, healthBarWidth, healthBarHeight);
  fill(0, 255, 0); // 绿色表示当前血量
  rect(10, 10, healthBarWidth * healthPercentage, healthBarHeight);
  fill(255);
  textSize(12);
  textAlign(CENTER, CENTER);
  text(
    `HP: ${Math.floor(player.health)} / ${player.maxHealth}`,
    10 + healthBarWidth / 2,
    10 + healthBarHeight / 2
  );

  // 经验条
  const expBarWidth = 200;
  const expBarHeight = 10;
  const expPercentage = player.exp / player.expToNextLevel;
  fill(100); // 灰色表示未获得的经验
  rect(10, 40, expBarWidth, expBarHeight);
  fill(0, 0, 255); // 蓝色表示当前经验
  rect(10, 40, expBarWidth * expPercentage, expBarHeight);
  fill(255);
  textSize(10);
  textAlign(CENTER, CENTER);
  text(
    `EXP: ${Math.floor(player.exp)} / ${player.expToNextLevel}`,
    10 + expBarWidth / 2,
    40 + expBarHeight / 2
  );
}

// 修改角色选择后的流程
function initPlayer(type) {
  player = new Player(playerAction, 26, 26, type);
  player.needsPetSelection = false;
  // ... 其他初始化代码 ...

  gameState = "petSelection"; // 角色选择后进入宠物选择
}


