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
let weather = "normal";
let lastWeatherChange = 0;
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

// ===== 战力评价系统 =====
const combatRating = {
  player: 0,
  enemies: 0,
  lastCheck: 0,
  checkInterval: 1000,
  calculatePlayerRating() {
    return Math.floor(
      player.health * 0.5 +
        player.attackPower * 10 +
        player.fireRate * 15 +
        player.speed * 20 +
        player.defense * 25 +
        player.level * 30 +
        (player.bulletType !== "normal" ? 50 : 0) +
        player.passiveSkills.length * 40
    );
  },
  calculateEnemiesRating() {
    return enemies.reduce((total, enemy) => {
      let baseRating = enemy.health * 0.3 + enemy.damage * 8 + enemy.speed * 15;
      if (enemy.type === "ranged") baseRating *= 1.5;
      if (enemy.type === "exploding") baseRating *= 1.3;
      if (enemy.type === "boss") baseRating *= 2;
      if (enemy.isElite) baseRating *= 1.5;
      return total + baseRating;
    }, 0);
  },
  update() {
    if (millis() - this.lastCheck > this.checkInterval) {
      this.player = this.calculatePlayerRating();
      this.enemies = this.calculateEnemiesRating();
      this.lastCheck = millis();
    }
  },
  getDifficultyMultiplier() {
    let ratio = this.player / Math.max(this.enemies, 1);
    if (ratio > 3) return 1.5;
    if (ratio > 2) return 1.2;
    if (ratio < 0.5) return 0.8;
    return 1;
  },
};

// ===== p5.js 核心函数 =====
function setup() {
  createCanvas(800, 600);
  gameStartTime = millis();
  generateInitialObstacles();
  initButtons();
  gameState = "mainMenu";
}

function draw() {
  background(51);
  if (gameState === "mainMenu") {
    displayMainMenu();
  } else if (gameState === "menu") {
    displayCharacterSelection();
  } else if (gameState === "game") {
    handleGameplay(millis());
  } else if (gameState === "paused") {
    if (showAttributes) {
      displayAttributes();
    } else {
      displayPauseMenu();
    }
  } else if (gameState === "upgrading") {
    drawUpgradeScreen();
  } else if (gameState === "gameOver") {
    displayGameOverScreen();
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
}