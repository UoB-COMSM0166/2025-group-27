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

let selectedPetFrontImage = null;
let petRevealTimer = 0;
let petRevealFrameIndex = 0;
let petRevealFrameCounter = 0;
let petRevealFrameDelay = 10;
let petRevealTotalFrames = 4;
let selectPetsImage;
let petRevealBackground;
let featherBladeSprite;

let levelFogEnabled = false;
let levelFogOpacity = 0;
let levelFogRadius = 150;
let maxLevelFogOpacity = 180;
let fogTransitionSpeed = 5;

let currentFrame1 = 0;
let animationDone = false;
let deathAnimations = [];

const MAX_FEATHERS = 50;

//----------------------preload image-----------------------------
function preload() {
  // page related
  mainMenuPage = loadImage("./assets/selected_images/page/MainMenu.png");
  characterChoose = loadImage("./assets/selected_images/page/characterPage.png");
  guidePage = loadImage("./assets/selected_images/guide/guide.png");
  pausePage = loadImage("./assets/selected_images/page/pause.png");
  skillPage = loadImage("./assets/selected_images/page/skill.png");
  victoryPage = loadImage("./assets/selected_images/page/victory.png");
  gameOverPage = loadImage("./assets/selected_images/page/GameOver.png");
  // maps
  level1map = loadImage("./assets/selected_images/maps/level1.png");
  level2map = loadImage("./assets/selected_images/maps/level2.png");
  level4map = loadImage("./assets/selected_images/maps/level3.png");
  level3map = loadImage("./assets/selected_images/maps/level4.png");
  // story
  story1 = loadImage("./assets/selected_images/story/story1.png");
  story2 = loadImage("./assets/selected_images/story/story2.png");
  story3 = loadImage("./assets/selected_images/story/story3.png");
  story4 = loadImage("./assets/selected_images/story/story4.png");
  story5 = loadImage("./assets/selected_images/story/story5.png");
  victoryStory = loadImage("./assets/selected_images/story/victoryStory.png");
  // display Character
  gunnerpic = loadImage("./assets/selected_images/characters/intro/computerboy_intro.gif");
  archerpic = loadImage("./assets/selected_images/characters/intro/mousegirl_intro.gif");
  knightpic = loadImage("./assets/selected_images/characters/intro/keyboardman_intro.gif");
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
  // BirdBoss bossAction
  bossAction = loadImage("./assets/candidate_images/characters/enemies/birdman/BirdBoss.png");
  featherSprite = loadImage("./assets/candidate_images/characters/enemies/birdman/falling_feather_yellow.png");
  // adjustment

  slimeBossImage = loadImage("./assets/candidate_images/effects/skill_effects/drip/cell_sphere/boss_slime_blue.png");
  slimeBoss2Image = loadImage("./assets/candidate_images/effects/skill_effects/drip/cell_sphere/boss_slime.png");
  //spiderBossAction = loadImage("./assets/images/Characters/Enemies/SpiderBoss/SpiderBoss.png");
  //main menu sound
  mainMenuSound = loadSound("./assets/candidate_sounds/Music/MainMenu.ogg");
  // normal enemies music
  normalMusic12 = loadSound("./assets/candidate_sounds/Music/Sea_Biome_1.ogg");
  normalMusic45 = loadSound("./assets/candidate_sounds/Music/Stone_Biome_2_R1.ogg");
  normalMusic78 = loadSound("./assets/candidate_sounds/Music/Mold_Dungeon_v6.ogg");

  bossMusic1 = loadSound("./assets/candidate_sounds/Music/bossmusic.ogg");
  bossMusic2 = loadSound("./assets/candidate_sounds/Music/Snake_Boss.ogg");
  bossMusic3 = loadSound("./assets/candidate_sounds/Music/Final_Boss_Phase_1.ogg");
  //1~5 enemies
  commonEnemyAction.idle = loadImage("./assets/candidate_images/characters/enemies/birdman_imp/cavelingSkirmisher_idleEmote1.png");
  commonEnemyAction.up = loadImage("./assets/candidate_images/characters/enemies/birdman_imp/cavelingSkirmisher_move_up.png");
  commonEnemyAction.down = loadImage("./assets/candidate_images/characters/enemies/birdman_imp/cavelingSkirmisher_move.png");
  commonEnemyAction.side = loadImage("./assets/candidate_images/characters/enemies/birdman_imp/cavelingSkirmisher_move_side.png");
  //6~10 enemies
  commonEnemyAction1.idle = loadImage("./assets/candidate_images/characters/enemies/whitehaired_imp/infectedCaveling_idle.png");
  commonEnemyAction1.up = loadImage("./assets/candidate_images/characters/enemies/whitehaired_imp/infectedCaveling_move_up.png");
  commonEnemyAction1.down = loadImage("./assets/candidate_images/characters/enemies/whitehaired_imp/infectedCaveling_move.png");
  commonEnemyAction1.side = loadImage("./assets/candidate_images/characters/enemies/whitehaired_imp/infectedCaveling_move_side.png");
  //11~15 enemies
  commonEnemyAction2.idle = loadImage("./assets/candidate_images/characters/enemies/scythe_imp/hat_scythe_mini_monste_1/caveling_gingerbread_idle.png");
  commonEnemyAction2.up = loadImage("./assets/candidate_images/characters/enemies/scythe_imp/hat_scythe_mini_monste_1/caveling_gingerbread_move_up.png");
  commonEnemyAction2.down = loadImage("./assets/candidate_images/characters/enemies/scythe_imp/hat_scythe_mini_monste_1/caveling_gingerbread_move.png");
  commonEnemyAction2.side = loadImage("./assets/candidate_images/characters/enemies/scythe_imp/hat_scythe_mini_monste_1/caveling_gingerbread_move_side.png");

  obstacle1 = loadImage("./assets/selected_images/barrier/level_1/tree1.png");
  obstacle2 = loadImage("./assets/selected_images/barrier/level_1/stone3.png");
  obstacle3 = loadImage("./assets/selected_images/barrier/level_2/alienObeliskTall.png");
  obstacle = loadImage("./assets/selected_images/barrier/level_2/ancientGiant.png");
  obstacleS = loadImage("./assets/selected_images/barrier/level_2/altar.png")
  //11~15 obstacle
  obstacle5 = loadImage("./assets/selected_images/barrier/level_3/volcano.png");
  obstacle7 = loadImage("./assets/selected_images/barrier/level_3/lavaRock.png");
  //16~obstacle
  obstacleV = loadImage("./assets/selected_images/barrier/level_4/campTent.png");
  obstacle9 = loadImage("./assets/selected_images/barrier/level_4/clampingFrame.png");

  bombAction = loadImage("./assets/candidate_images/items/weapons/bomb/bomb.png");
  waterBubbleImg = loadImage("./assets/candidate_images/effects/attack_effects/bubble.png");
  fireballImg = loadImage("./assets/candidate_images/effects/attack_effects/fireballProjectile_idle.png");
  poisonVortexImg = loadImage("./assets/candidate_images/effects/attack_effects/mummy_vortex_sheet.png");

  windTornadoImg = loadImage("./assets/candidate_images/effects/attack_effects/bigFireAnticipation_spawn_white.png");

  //Blaze
  foxMoveBack = loadImage("./assets/selected_images/pets/fox/fox_move_back.png");
  foxMoveFront = loadImage("./assets/selected_images/pets/fox/fox_move_front.png");
  foxMoveLeft = loadImage("./assets/selected_images/pets/fox/fox_move_left.png");
  foxMoveRight = loadImage("./assets/selected_images/pets/fox/fox_move_right.png");
  eggFox = loadImage("./assets/selected_images/pets/eggs/egg_fox.gif");

  foxAttackBack = loadImage("./assets/selected_images/pets/fox/fox_attack_back.png");
  foxAttackFront = loadImage("./assets/selected_images/pets/fox/fox_attack_front.png");
  foxAttackLeft = loadImage("./assets/selected_images/pets/fox/fox_attack_left.png");
  foxAttackRight = loadImage("./assets/selected_images/pets/fox/fox_attack_right.png");

  //Aegis
  cowMoveBack = loadImage("./assets/selected_images/pets/cow/cow_move_back.png");
  cowMoveFront = loadImage("./assets/selected_images/pets/cow/cow_move_front.png");
  cowMoveLeft = loadImage("./assets/selected_images/pets/cow/cow_move_left.png");
  cowMoveRight = loadImage("./assets/selected_images/pets/cow/cow_move_right.png");
  cowCover = loadImage("./assets/selected_images/pets/cow/cover.png");
  eggCow = loadImage("./assets/selected_images/pets/eggs/egg_cow.gif");

  //Aurora
  fairyMoveBack = loadImage("./assets/selected_images/pets/fairy/fairy_move_back.png");
  fairyMoveFront = loadImage("./assets/selected_images/pets/fairy/fairy_move_front.png");
  fairyMoveLeft = loadImage("./assets/selected_images/pets/fairy/fairy_move_left.png");
  fairyMoveRight = loadImage("./assets/selected_images/pets/fairy/fairy_move_right.png");
  eggFairy = loadImage("./assets/selected_images/pets/eggs/egg_fairy.gif");

  //pet selection
  selectPetsImage = loadImage("./assets/selected_images/pets/selectpets.png");
  selectionSound = loadSound("./assets/candidate_sounds/Music/biomeTitle.ogg");
  petRevealBackground = loadImage("./assets/selected_images/poster/background.png");

  //sound related
  //UI sound
  buttonsound = loadSound("./assets/candidate_sounds/ui_sound/buttonsound.ogg");
  //playerAttacksound
  arrowsound = loadSound("./assets/candidate_sounds/player_attack_sounds/arrow.ogg");
  gunsound = loadSound("./assets/candidate_sounds/player_attack_sounds/gun1.ogg");
  keyboardsound = loadSound("./assets/candidate_sounds/player_attack_sounds/keyboard.ogg");
  //weathersound
  thundersound = loadSound("./assets/candidate_sounds/player_attack_sounds/thunder.ogg")
  // poison pool
  poisonPoolEffectImg = loadImage("./assets/candidate_images/effects/skill_effects/drip/waterSplashLava_new.png");

  // web effect
  webEffectImg = loadImage("./assets/candidate_images/effects/attack_effects/acidProjectile2.png");

  // bug boss
  bugBossSide = loadImage("./assets/candidate_images/characters/enemies/ghost_imp/summonSkeleton_move_side.png");
  bugBossUp = loadImage("./assets/candidate_images/characters/enemies/ghost_imp/summonSkeleton_move_up.png");
  bugBossDown = loadImage("./assets/candidate_images/characters/enemies/ghost_imp/summonSkeleton_move.png");

  bugBossAttackDown = loadImage("./assets/candidate_images/characters/enemies/ghost_imp/summonSkeleton_attack.png");
  bugBossAttackUp = loadImage("./assets/candidate_images/characters/enemies/ghost_imp/summonSkeleton_attack_up.png");
  bugBossAttackSide = loadImage("./assets/candidate_images/characters/enemies/ghost_imp/summonSkeleton_attack_side.png");

  // ghost fire
  ghostFireImg = loadImage("./assets/candidate_images/effects/skill_effects/drip/flame/blue_fire.png");
  ghostDeathEffect = loadImage("./assets/candidate_images/effects/death_effects/blood_burst/AmoebaSplat2.png");

  // death effect
  deathEffect1 = loadImage("./assets/candidate_images/effects/death_effects/blood_burst/Bloodsplatt.png");
  featherBladeSprite = loadImage("./assets/candidate_images/characters/enemies/birdman/falling_feather_blue.png");
}


function setup() {
  createCanvas(1062, 600);
  volume = 0.5;
  gameStartTime = millis();
  generateInitialObstacles();
  initButtons();
  setupVictoryButtons();
  gameState = "mainMenu";
  setupSnow();

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
  mainMenuSound.setVolume(volume);

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
    case "petReveal":
      displayPetReveal();
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
    case "story1":
      displayStoryPage1();
      break;
    case "story2":
      displayStoryPage2();
      break;
    case "story3":
      displayStoryPage3();
      break;
    case "story4":
      displayStoryPage4();
      break;
    case "story5":
      displayStoryPage5();
      break;
    case "guide":
      displayGuidePage();
      break;
    case "vStory":
      displayVictoryPage1();
      break;
  }

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
    if (enemy.health <= 0 && enemy.dead) {
      let index = enemies.indexOf(enemy);
      enemies.splice(index, 1);
    }
  });

  drawWeatherEffects();

  for (let enemy of enemies) {
    if (enemy instanceof BugBoss && enemy.fogOpacity > 0) {
      enemy.drawFogEffect();
    }
  }
  if (gameState == "game") {
    //weather text
    textSize(16);
    fill(255);
    text("Weather：" + weather, 70, height - 10);
  }

  drawPlayerStats();
  stroke(255, 0, 0);
  strokeWeight(4);
  noFill();
  rect(0, 0, width, height);
}

function drawPlayerStats() {
  if (!player) {
    return;
  }
  if (gameState == "game") {
    // health bar
    const healthBarWidth = 200;
    const healthBarHeight = 20;
    const healthPercentage = player.health / player.maxHealth;
    fill(255, 0, 0);
    rect(10, 10, healthBarWidth, healthBarHeight);
    fill(0, 255, 0);
    rect(10, 10, healthBarWidth * healthPercentage, healthBarHeight);
    fill(255);
    textSize(12);
    textAlign(CENTER, CENTER);
    text(
      `HP: ${Math.floor(player.health)} / ${player.maxHealth}`,
      10 + healthBarWidth / 2,
      10 + healthBarHeight / 2
    );

    //draw Exp
    const expBarWidth = 200;
    const expBarHeight = 10;
    const expPercentage = player.exp / player.expToNextLevel;
    fill(100);
    rect(10, 40, expBarWidth, expBarHeight);
    fill(0, 0, 255);
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
}

function initPlayer(type) {
  player = new Player(playerAction, 26, 26, type);
  player.needsPetSelection = false;

  gameState = "petSelection";
}

function drawPoisonPools() {
  for (let i = poisonTrails.length - 1; i >= 0; i--) {
    const pool = poisonTrails[i];
    const elapsed = millis() - pool.startTime;

    if (elapsed > pool.duration) {
      poisonTrails.splice(i, 1);
      continue;
    }

    pool.frameCounter++;
    if (pool.frameCounter >= pool.frameDelay) {
      pool.frameCounter = 0;
      pool.frameIndex = (pool.frameIndex + 1) % pool.frameCount;
    }

    const fadeRatio = elapsed / pool.duration;
    const alpha = map(fadeRatio, 0, 1, 1, 0);

    push();

    const pulseSize = sin(frameCount * 0.15) * 12;
    const displayRadius = (pool.radius * 2.5) + pulseSize;

    noFill();
    strokeWeight(5);
    for (let r = 0; r < 5; r++) {
      //flame fade
      let flameColor;
      if (r === 0) flameColor = color(255, 50, 0, alpha * 0.7);
      else if (r === 1) flameColor = color(255, 100, 0, alpha * 0.65);
      else if (r === 2) flameColor = color(255, 150, 0, alpha * 0.6);
      else if (r === 3) flameColor = color(255, 200, 0, alpha * 0.5);
      else flameColor = color(255, 230, 180, alpha * 0.4);

      stroke(flameColor);
      ellipse(pool.pos.x, pool.pos.y, displayRadius * 2 + r * 18);
    }

    if (frameCount % 4 === 0) {
      pool.sparks = pool.sparks || [];

      for (let s = 0; s < random(3, 6); s++) {
        pool.sparks.push({
          x: random(-displayRadius * 0.7, displayRadius * 0.7),
          y: random(-displayRadius * 0.7, displayRadius * 0.7),
          size: random(4, 12),
          speedX: random(-0.8, 0.8),
          speedY: random(-3, -0.8),
          alpha: random(0.7, 1.0),
          color: random() > 0.6 ? color(255, 150, 0) :
            random() > 0.3 ? color(255, 80, 0) :
              color(255, 220, 50)
        });
      }
    }

    // draw spark
    if (pool.sparks) {
      for (let j = pool.sparks.length - 1; j >= 0; j--) {
        const spark = pool.sparks[j];

        spark.x += spark.speedX;
        spark.y += spark.speedY;
        spark.alpha -= 0.015;
        spark.size -= 0.08;

        if (spark.alpha <= 0 || spark.size <= 0) {
          pool.sparks.splice(j, 1);
          continue;
        }

        //draw spark
        fill(red(spark.color), green(spark.color), blue(spark.color), 255 * spark.alpha);
        noStroke();
        ellipse(pool.pos.x + spark.x, pool.pos.y + spark.y, spark.size);

        //spark trails
        if (random() > 0.7) {
          fill(255, 200, 100, 100 * spark.alpha);
          ellipse(pool.pos.x + spark.x, pool.pos.y + spark.y + random(2, 4), spark.size * 0.7);
        }
      }
    }

    if (frameCount % 7 === 0) {
      pool.ripples = pool.ripples || [];
      pool.ripples.push({
        size: 15,
        maxSize: random(pool.radius * 1.0, pool.radius * 2.0),
        alpha: 0.9,
        x: random(-12, 12),
        y: random(-12, 12)
      });
    }

    //draw ripples
    if (pool.ripples) {
      for (let j = pool.ripples.length - 1; j >= 0; j--) {
        const ripple = pool.ripples[j];
        ripple.size += 2.0;
        ripple.alpha -= 0.025;

        if (ripple.size >= ripple.maxSize || ripple.alpha <= 0) {
          pool.ripples.splice(j, 1);
          continue;
        }

        noFill();
        let rippleColor = color(255, 100 + random(0, 155), 0, 255 * ripple.alpha);
        stroke(rippleColor);
        strokeWeight(3);
        ellipse(pool.pos.x + ripple.x, pool.pos.y + ripple.y, ripple.size * 2);
      }
    }

    noStroke();
    for (let c = 0; c < 3; c++) {
      let coreRadius = displayRadius * (0.2 - c * 0.05);
      let coreAlpha = alpha * (0.8 - c * 0.2);

      fill(255, 200 - c * 50, 50, 255 * coreAlpha);
      ellipse(pool.pos.x, pool.pos.y, coreRadius * 2);
    }

    pop();

    //detect if player is in flame
    if (player && dist(pool.pos.x, pool.pos.y, player.pos.x, player.pos.y) < displayRadius + player.radius) {
      if (frameCount % 12 === 0) {
        player.takeDamage(5);
        showFloatingText("Burned!", player.pos.x, player.pos.y - 20, color(255, 100, 0), 18);
      }
    }
  }
}



