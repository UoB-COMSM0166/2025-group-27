// ===== 全局变量 =====
let difficult; //难度
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
let obstacleBuild = false;
//亮度以及音量
let volumeSlider;
let backButton;
let volume;   // 默认音量

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
let commonEnemyAction1 = {};
let commonEnemyAction2 = {};
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
// 热气动画控制
let currentFrame = 0;
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
  let allImage;
  let frameWidth, frameHeight;
  let totalFrames = 16;
  allImage = sunpic;
  frameWidth = allImage.width / totalFrames; // 计算单帧宽度
  frameHeight = allImage.height;
  let sx = currentFrame * frameWidth;
  push();
  noStroke();
  image(allImage, 0, 0, 1062, 600, sx, 0, frameWidth, frameHeight);
  for (let y = 0; y < height; y += 5) {
    let offset = map(noise(y * 0.01, millis() * 0.002), 0, 1, -10, 10);
    fill(255, 200, 200, 30);
    rect(offset, y, width, 5);
  }
  pop();
  if (frameCount % 6 === 0) { // 每6帧切换一次
    currentFrame = (currentFrame + 1) % totalFrames;
  }
}

// 冰雪效果：粒子系统模拟雪花飘落
class Snowflake {
  constructor() {
    this.x = random(width);
    this.y = random(-50, -10);
    this.size = random(8, 20);
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
    image(snowflakepic, this.x, this.y, this.size, this.size);
    // ellipse(this.x, this.y, this.size);
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
    image(lightningpic, width / 2, height / 2, 150, 150);
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
  if(gameState == "game"){
  // 每隔 60000 毫秒重新随机选择天气
  if (currentTime - lastWeatherChange > 30000) {
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
}

  // 如果当前天气为特殊天气且持续超过20秒，则自动恢复为 normal
  if (weather !== "normal" && currentTime - weatherStartTime > 20000) {
    weather = "normal";
  }
}

// ----- p5.js 核心函数 -----
function preload() {
  // maps
  level1map = loadImage("./assets/selected_images/maps/level1.png");
  level2map = loadImage("./assets/selected_images/maps/level2.png");
  level3map = loadImage("./assets/selected_images/maps/level3.png");
  // weather
  snowflakepic = loadImage("./assets/selected_images/weather/flake.gif");
  lightningpic = loadImage("./assets/selected_images/weather/lightning.gif");
  sunpic = loadImage("./assets/selected_images/weather/sun_yellow.png");
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

  Bup = loadImage("./assets/selected_images/characters/computerboy/attack/galaxiteProjectile_up.png");
  Bdown = loadImage("./assets/selected_images/characters/computerboy/attack/galaxiteProjectile_down.png");
  Bleft = loadImage("./assets/selected_images/characters/computerboy/attack/galaxiteProjectile_left.png");
  Bright = loadImage("./assets/selected_images/characters/computerboy/attack/galaxiteProjectile_right.png");
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

  // 加载普通敌人背景音乐
  normalMusic12 = loadSound("./assets/candidate_sounds/Music/Sea_Biome_1.ogg");
  normalMusic45 = loadSound("./assets/candidate_sounds/Music/Stone_Biome_2_R1.ogg");
  normalMusic78 = loadSound("./assets/candidate_sounds/Music/Mold_Dungeon_v6.ogg");

  bossMusic1 = loadSound("./assets/candidate_sounds/Music/bossmusic.ogg");
  bossMusic2 = loadSound("./assets/candidate_sounds/Music/Snake_Boss.ogg");
  bossMusic3 = loadSound("./assets/candidate_sounds/Music/Final_Boss_Phase_1.ogg");
  //1~5关敌人
  commonEnemyAction.idle = loadImage("./assets/candidate_images/characters/enemies/birdman_imp/cavelingSkirmisher_idleEmote1.png");
  commonEnemyAction.up = loadImage("./assets/candidate_images/characters/enemies/birdman_imp/cavelingSkirmisher_move_up.png");
  commonEnemyAction.down = loadImage("./assets/candidate_images/characters/enemies/birdman_imp/cavelingSkirmisher_move.png");
  commonEnemyAction.side = loadImage("./assets/candidate_images/characters/enemies/birdman_imp/cavelingSkirmisher_move_side.png");
  //6~10关敌人
  commonEnemyAction1.idle = loadImage("./assets/candidate_images/characters/enemies/whitehaired_imp/infectedCaveling_idle.png");
  commonEnemyAction1.up = loadImage("./assets/candidate_images/characters/enemies/whitehaired_imp/infectedCaveling_move_up.png");
  commonEnemyAction1.down = loadImage("./assets/candidate_images/characters/enemies/whitehaired_imp/infectedCaveling_move.png");
  commonEnemyAction1.side = loadImage("./assets/candidate_images/characters/enemies/whitehaired_imp/infectedCaveling_move_side.png");
  //11~15关敌人
  commonEnemyAction2.idle = loadImage("./assets/candidate_images/characters/enemies/scythe_imp/hat_scythe_mini_monste_1/caveling_gingerbread_idle.png");
  commonEnemyAction2.up = loadImage("./assets/candidate_images/characters/enemies/scythe_imp/hat_scythe_mini_monste_1/caveling_gingerbread_move_up.png");
  commonEnemyAction2.down = loadImage("./assets/candidate_images/characters/enemies/scythe_imp/hat_scythe_mini_monste_1/caveling_gingerbread_move.png");
  commonEnemyAction2.side = loadImage("./assets/candidate_images/characters/enemies/scythe_imp/hat_scythe_mini_monste_1/caveling_gingerbread_move_side.png");

  obstacle1 = loadImage("./assets/selected_images/barrier/level_1/tree1.png");
  obstacle2 = loadImage("./assets/selected_images/barrier/level_1/stone3.png");
  obstacle3 = loadImage("./assets/selected_images/barrier/level_2/alienObeliskTall.png");
  obstacle = loadImage("./assets/selected_images/barrier/level_2/ancientGiant.png");
  bombAction = loadImage("./assets/candidate_images/items/weapons/bomb/bomb.png");
  // 添加水泡和火焰效果图片
  waterBubbleImg = loadImage("./assets/candidate_images/effects/attack_effects/bubble.png");
  fireballImg = loadImage("./assets/candidate_images/effects/attack_effects/fireballProjectile_idle.png");
  poisonVortexImg = loadImage("./assets/candidate_images/effects/attack_effects/mummy_vortex_sheet.png");

  // 加载风史莱姆的龙卷风动画
  windTornadoImg = loadImage("./assets/candidate_images/effects/attack_effects/bigFireAnticipation_spawn_white.png");

  //宠物一
  foxMoveBack = loadImage("./assets/selected_images/pets/fox/fox_move_back.png");
  foxMoveFront = loadImage("./assets/selected_images/pets/fox/fox_move_front.png");
  foxMoveLeft = loadImage("./assets/selected_images/pets/fox/fox_move_left.png");
  foxMoveRight = loadImage("./assets/selected_images/pets/fox/fox_move_right.png");

  foxAttackBack = loadImage("./assets/selected_images/pets/fox/fox_attack_back.png");
  foxAttackFront = loadImage("./assets/selected_images/pets/fox/fox_attack_front.png");
  foxAttackLeft = loadImage("./assets/selected_images/pets/fox/fox_attack_left.png");
  foxAttackRight = loadImage("./assets/selected_images/pets/fox/fox_attack_right.png");

  //宠物二
  cowMoveBack = loadImage("./assets/selected_images/pets/cow/cow_move_back.png");
  cowMoveFront = loadImage("./assets/selected_images/pets/cow/cow_move_front.png");
  cowMoveLeft = loadImage("./assets/selected_images/pets/cow/cow_move_left.png");
  cowMoveRight = loadImage("./assets/selected_images/pets/cow/cow_move_right.png");
  cowCover = loadImage("./assets/selected_images/pets/cow/cover.png");


  //宠物三
  fairyMoveBack = loadImage("./assets/selected_images/pets/fairy/fairy_move_back.png");
  fairyMoveFront = loadImage("./assets/selected_images/pets/fairy/fairy_move_front.png");
  fairyMoveLeft = loadImage("./assets/selected_images/pets/fairy/fairy_move_left.png");
  fairyMoveRight = loadImage("./assets/selected_images/pets/fairy/fairy_move_right.png");


  //sound相关
  //UI声音
  buttonsound = loadSound("./assets/candidate_sounds/ui_sound/buttonsound.ogg");
  //playerAttacksound
  arrowsound = loadSound("./assets/candidate_sounds/player_attack_sounds/arrow.ogg");
  gunsound = loadSound("./assets/candidate_sounds/player_attack_sounds/gun1.ogg");
  keyboardsound = loadSound("./assets/candidate_sounds/player_attack_sounds/keyboard.ogg");
  //天气sound
  thundersound = loadSound("./assets/candidate_sounds/player_attack_sounds/thunder.ogg")
  // 加载鸟Boss毒池特效图片 - 更新为新的图片路径和名称
  poisonPoolEffectImg = loadImage("./assets/candidate_images/effects/skill_effects/drip/waterSplashLava_new.png");

  // 加载鸟Boss蛛丝技能特效图片
  webEffectImg = loadImage("./assets/candidate_images/effects/attack_effects/acidProjectile2.png");

  // 加载虫子Boss动画图片
  bugBossSide = loadImage("./assets/candidate_images/characters/enemies/ghost_imp/summonSkeleton_move_side.png");
  bugBossUp = loadImage("./assets/candidate_images/characters/enemies/ghost_imp/summonSkeleton_move_up.png");
  bugBossDown = loadImage("./assets/candidate_images/characters/enemies/ghost_imp/summonSkeleton_move.png");

  // 加载Bug Boss攻击动画
  bugBossAttackDown = loadImage("./assets/candidate_images/characters/enemies/ghost_imp/summonSkeleton_attack.png");
  bugBossAttackUp = loadImage("./assets/candidate_images/characters/enemies/ghost_imp/summonSkeleton_attack_up.png");
  bugBossAttackSide = loadImage("./assets/candidate_images/characters/enemies/ghost_imp/summonSkeleton_attack_side.png");

  // 加载幽冥鬼火图片
  ghostFireImg = loadImage("./assets/candidate_images/effects/skill_effects/drip/flame/blue_fire.png");
  
  // 加载鬼火消失特效
  ghostDeathEffect = loadImage("./assets/candidate_images/effects/death_effects/blood_burst/AmoebaSplat2.png");

  //死亡效果
  deathEffect1 = loadImage("./assets/candidate_images/effects/death_effects/blood_burst/Bloodsplatt.png");
}


function setup() {
  createCanvas(1062, 600);
  volume = 0.5;
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

  arrowsound.setVolume(volume);
  gunsound.setVolume(volume);
  keyboardsound.setVolume(volume);
  thundersound.setVolume(volume);
  buttonsound.setVolume(volume);
  bossMusic1.setVolume(volume);
  bossMusic2.setVolume(volume);
  bossMusic3.setVolume(volume);
  normalMusic12.setVolume(volume);
  normalMusic45.setVolume(volume);
  normalMusic78.setVolume(volume);

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
    case "setting":
      displaySettingPage();
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
  
  enemies.forEach(enemy => {
    if (enemy.isDying) {
      updateDeathEffect(enemy);
    }
  });

  enemies.forEach(enemy => {
    if (enemy.health<=0 && enemy.dead) {
      let index = enemies.indexOf(enemy);
      enemies.splice(index,1);
    }
  });

  // 叠加当前天气效果
  drawWeatherEffects();

  // 在最后渲染BugBoss的雾气效果，确保它在所有其他内容之上
  for (let enemy of enemies) {
    if (enemy instanceof BugBoss && enemy.fogOpacity > 0) {
      enemy.drawFogEffect();
    }
  }

  // 显示当前天气文本
  textSize(16);
  fill(255);
  text("Weather：" + weather, 70, height - 10);

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


