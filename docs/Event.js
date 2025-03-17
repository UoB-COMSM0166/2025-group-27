// ===== 鼠标与键盘事件 =====
function mouseClicked() {
  if (gameState == "story1" && mouseX > buttonX && mouseX < buttonX + buttonW &&
    mouseY > buttonY && mouseY < buttonY + buttonH) {
    gameState = "story2";
  } else if (gameState == "story2" && mouseX > buttonX && mouseX < buttonX + buttonW &&
    mouseY > buttonY && mouseY < buttonY + buttonH) {
    gameState = "story3";
  } else if (gameState == "story3" && mouseX > buttonX && mouseX < buttonX + buttonW &&
    mouseY > buttonY && mouseY < buttonY + buttonH) {
    gameState = "story4";
  } else if (gameState == "story4" && mouseX > buttonX && mouseX < buttonX + buttonW &&
    mouseY > buttonY && mouseY < buttonY + buttonH) {
    gameState = "story5";
  } else if (gameState == "story5" && mouseX > buttonX && mouseX < buttonX + buttonW &&
    mouseY > buttonY && mouseY < buttonY + buttonH) {
    gameState = "menu";
  } else if (gameState == "guide" && mouseX > buttonX && mouseX < buttonX + buttonW &&
    mouseY > buttonY && mouseY < buttonY + buttonH) {
    gameState = "game";
  } else if (gameState == "vStory" && mouseX > buttonX && mouseX < buttonX + buttonW &&
    mouseY > buttonY && mouseY < buttonY + buttonH) {
    gameState = "victory"
  }
}

function mousePressed() {
  if (gameState === "upgrading") {
    for (let i = 0; i < upgradeOptions.length; i++) {
      let x = width / 4 + (i * width) / 4;
      let y = height / 2;
      if (
        mouseX > x - 100 &&
        mouseX < x + 100 &&
        mouseY > y - 50 &&
        mouseY < y + 50
      ) {
        player.applyUpgrade(upgradeOptions[i]);
        choosingUpgrade = false;
        gameState = "game";
        
        // 如果需要生成新的敌人，直接生成，不使用 setTimeout
        if (enemies.length === 0) {
          spawnEnemiesForWave(wave);
        }
        return;
      }
    }
  }

  if (gameState === "victory") {
    for (let button of victoryButtons) {
      if (button.contains(mouseX, mouseY)) {
        button.action();
      }
    }
  }  

  if (gameState === "game") {
    if (pauseButton.contains(mouseX, mouseY)) {
      pauseButton.action();
      return;
    }
  }

  let currentButtons = [];
  if (gameState === "mainMenu") currentButtons = mainMenuButtons;
  else if (gameState === "menu") currentButtons = charSelectButtons;
  else if (gameState === "paused")
    currentButtons = choosingPotion ? potionButtons : pauseButtons;
  for (let btn of currentButtons) {
    if (btn.contains(mouseX, mouseY)) {
      btn.action();
      return;
    }
  }
}

function mouseReleased() {
  // 确保 player 存在且游戏状态正确
  if (player && gameState === "game") {
    if (player.characterType === "archer" && player.autoCharge == false) {
      player.releaseArrow();
    }
  }
}

function keyPressed() {
  if (keyCode === 69 && player.characterType == "knight" && player.spinningSlash == true) { // E键
    console.log("E");
    player.performSpinningSlash();
  }
  if ((gameState === "game" || gameState === "paused") && keyCode === 9) {
    // TAB键
    showAttributes = !showAttributes;
    gameState = showAttributes ? "paused" : "game"; // 切换游戏状态
    return false;
  }
  if (choosingPotion) {
    if (key >= "1" && key <= "3") {
      potionOptions[key - 1].apply();
      choosingPotion = false;
      gameState = "game";
    } else if (key === "0") {
      player.exp = 0;
      choosingPotion = false;
      gameState = "game";
    }
  } else if (gameState === "mainMenu") {
    if ((key === "C" || key === "c") && savedGame) gameState = "game";
    else if (key === "Q" || key === "q") noLoop();
  } else if (gameState === "menu") {
    if (key === "1") initPlayer("gunner");
    if (key === "2") initPlayer("archer");
  } else if (gameState === "paused" && !choosingPotion) {
    if (key === "S" || key === "s") {
      savedGame = true;
      savedGame = {
        player: JSON.stringify({
          ...player,
          bulletTypes: Array.from(player.bulletTypes),
          unlockedUpgrades: Array.from(player.unlockedUpgrades),
          characterType: player.characterType,
          pos: { x: player.pos.x, y: player.pos.y },
        }),
        enemies: JSON.stringify(
          enemies.map((e) => ({
            ...e,
            type: e.constructor.name, // 新增：保存构造函数名称
            pos: { x: e.pos.x, y: e.pos.y },
          }))
        ),
      };
    }
    if (key === "M" || key === "m") gameState = "mainMenu";
    if (key === "P" || key === "p") gameState = "game";
  } else if (key === " ") {
    if (player.attack) player.attack();
  } else if (key === "P" || key === "p") {
    gameState = "paused";
  }
  if (gameState === "gameOver" && (key === "R" || key === "r")) {
    normalEnemiesDefeated = 0;
    bossDefeated = 0;
    gameStartTime = millis();
    showAttributes = false;
    player = null;
    enemies = [];
    bullets = [];
    obstacles = [];
    bossDefeatedCount = 0;
    gameState = "mainMenu";
    generateInitialObstacles();
  }
}