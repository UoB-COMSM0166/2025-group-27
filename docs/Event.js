//---------------event related to mouseClick------------------
function mouseClicked() {
  if (gameState == "story1" && mouseX > buttonX && mouseX < buttonX + buttonW &&
    mouseY > buttonY && mouseY < buttonY + buttonH) {
      buttonsound.play();
    gameState = "story2";
  } else if (gameState == "story2" && mouseX > buttonX && mouseX < buttonX + buttonW &&
    mouseY > buttonY && mouseY < buttonY + buttonH) {
      buttonsound.play();
    gameState = "story3";
  } else if (gameState == "story3" && mouseX > buttonX && mouseX < buttonX + buttonW &&
    mouseY > buttonY && mouseY < buttonY + buttonH) {
      buttonsound.play();
    gameState = "story4";
  } else if (gameState == "story4" && mouseX > buttonX && mouseX < buttonX + buttonW &&
    mouseY > buttonY && mouseY < buttonY + buttonH) {
      buttonsound.play();
    gameState = "story5";
  } else if (gameState == "story5" && mouseX > buttonX && mouseX < buttonX + buttonW &&
    mouseY > buttonY && mouseY < buttonY + buttonH) {
      buttonsound.play();
    gameState = "menu";
  } else if (gameState == "guide" && mouseX > buttonX && mouseX < buttonX + buttonW &&
    mouseY > buttonY && mouseY < buttonY + buttonH) {
      buttonsound.play();
    gameState = "game";
  } else if (gameState == "vStory" && mouseX > buttonX && mouseX < buttonX + buttonW &&
    mouseY > buttonY && mouseY < buttonY + buttonH) {
      buttonsound.play();
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
        mouseY < y + 150
      ) {
        player.applyUpgrade(upgradeOptions[i]);
        choosingUpgrade = false;
        gameState = "game";
        
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
  if (player && gameState === "game") {
    if (player.characterType === "archer" && player.autoCharge == false) {
      player.releaseArrow();
    }
  }
}

function keyPressed() {
  if (keyCode === 69 && player.characterType == "knight" && player.spinningSlash == true) { //E
    player.performSpinningSlash();
  }
  if ((gameState === "game" || gameState === "paused") && keyCode === 9) {
    // TAB
    showAttributes = !showAttributes;
    gameState = showAttributes ? "paused" : "game"; // switch game state
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
    if (key === "Q" || key === "q") noLoop();
  } else if (gameState === "menu") {
    if (key === "1") initPlayer("gunner");
    if (key === "2") initPlayer("archer");
  } else if (gameState === "paused" && !choosingPotion) {
    if (key === "M" || key === "m") {
      gameState = "mainMenu";
      normalMusic12.stop();
      normalMusic45.stop();
      normalMusic78.stop();
      bossMusic1.stop();
      bossMusic2.stop();
      bossMusic3.stop();
    }
    if (key === "P" || key === "p") gameState = "game";
    if (key === "I" || key === "i") {
      player.isInvincible = !player.isInvincible;
      showFloatingText(player.isInvincible ? "Invincible mode open!" : "Invincible mode close!", 
                        width / 2, height / 2 - 100, 
                        player.isInvincible ? color(255, 215, 0) : color(255, 100, 100), 24);
      
      for (let btn of pauseButtons) {
        if (btn.label.includes("Invincible mode")) {
          btn.label = player.isInvincible ? "close Invincible mode (I)" : "Invincible mode (I)";
          break;
        }
      }
    }
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