// === 宠物基类 ===
class BasePet {
  constructor() {
    this.pos = createVector(0, 0);
    this.radius = 15;
  }

  follow(player) {}
  update(player) {}
  display() {}
}

// === 攻击型宠物：烈焰战狼 ===
class AttackPet extends BasePet {
  constructor(x, y) {
    super();
    this.pos = createVector(x, y);
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

  update(player) {
    this.follow(player);
    this.attack(enemies);
  }
}

// === 防御型宠物：钢铁巨龟 ===
class DefensePet extends BasePet {
  constructor() {
    super();
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
    this.follow(player);

    if (!this.isShieldActive) {
      if (millis() - this.lastShieldTime > this.shieldChargeInterval) {
        this.activateShield(player);
        this.lastShieldTime = millis();
      }
    }

    if (this.isShieldActive) {
      this.shieldTimer--;
      if (this.shieldTimer <= 0) {
        this.deactivateShield(player);
      }
    }
  }

  activateShield(player) {
    this.isShieldActive = true;
    this.shieldTimer = this.shieldDuration;
    player.invincible = true;
    showFloatingText("护盾激活!", player.pos.x, player.pos.y-40, color(0, 200, 255));
  }

  deactivateShield(player) {
    this.isShieldActive = false;
    player.invincible = false;
    showFloatingText("护盾消失", player.pos.x, player.pos.y-40, color(100));
  }

  display() {
    // 显示护盾效果
    if (this.isShieldActive) {
      push();
      fill(0, 200, 255, 50);
      stroke(0, 150, 255);
      ellipse(this.pos.x, this.pos.y, 40);
      pop();
    }
    
    // 显示宠物本体
    fill(0, 150, 255);
    ellipse(this.pos.x, this.pos.y, this.radius * 2);
    
    // 显示充能进度
    if (!this.isShieldActive) {
      push();
      textSize(12);
      fill(255);
      textAlign(CENTER);
      text(
        `${floor((millis() - this.lastShieldTime) / this.shieldChargeInterval * 100)}%`,
        this.pos.x,
        this.pos.y + 25
      );
      pop();
    }
  }
}

// === 宠物选择界面 ===
function showPetSelectionScreen() {
  background(0, 150);
  
  fill(255);
  textSize(32);
  textAlign(CENTER, CENTER);
  text("选择你的战斗伙伴！", width / 2, height / 4);

  // 绘制两个宠物选项
  fill(200);
  rect(width / 2 - 220, height / 2 - 80, 200, 120, 10);
  rect(width / 2 + 20, height / 2 - 80, 200, 120, 10);
  
  fill(255);
  textSize(20);
  text("烈焰战狼", width / 2 - 120, height / 2 - 40);
  text("钢铁巨龟", width / 2 + 120, height / 2 - 40);
  
  textSize(14);
  text("自动攻击最近敌人\n+15 攻击伤害", width / 2 - 120, height / 2);
  text("每15秒生成护盾\n1.5秒无敌时间", width / 2 + 120, height / 2);

  // 只有在第5波Boss战后才显示宠物选择界面
  if (wave === 5) {
    if (mouseIsPressed) {
      // 攻击型宠物区域
      if (mouseX > width / 2 - 220 && mouseX < width / 2 - 20 &&
          mouseY > height / 2 - 80 && mouseY < height / 2 + 40) {
        player.pet = new AttackPet(player.pos.x, player.pos.y);
        // 例如：增加一些攻击属性
        player.attackDamage += 15;
        finishPetSelection(); // 选择完后直接进入下一关
      }
      // 防御型宠物区域
      else if (mouseX > width / 2 + 20 && mouseX < width / 2 + 220 &&
               mouseY > height / 2 - 80 && mouseY < height / 2 + 40) {
        player.pet = new DefensePet();
        player.maxHealth += 150;
        player.health += 150;
        finishPetSelection();
      }
    }
  }
}

function finishPetSelection() {
  // 选择完宠物后递增波数并生成下一波敌人
  wave++;
  spawnEnemiesForWave(wave);
  gameState = "game";
}
