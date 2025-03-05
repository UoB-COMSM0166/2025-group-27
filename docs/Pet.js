// === 宠物基类 ===
class BasePet {
  constructor() {
    this.pos = createVector(0, 0);
    this.radius = 15;
  }

  follow(player) { }
  update(player) { }
  display() { }
}

// 宠物一
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
    this.idleImage = foxMoveFront;
    this.attackImage = foxAttackFront;
    this.currentImage = this.idleImage;
    this.frameIndex = 0;
    this.totalFrames = 4;
    this.frameDelay = 10;
    this.frameCounter = 0;
    this.isAttacking = false;

    this.attackCooldown = 0;
    this.isAttacking = false;
    this.attackTimer = 0;
  }

  follow(player) {
    this.angle += 0.05;
    const targetPos = createVector(
      player.pos.x + cos(this.angle) * this.orbitRadius,
      player.pos.y + sin(this.angle) * this.orbitRadius
    );
    this.pos.lerp(targetPos, 0.1);

    if (player.vel.x > 0) {
      this.currentImage = foxMoveRight;
    } else if (player.vel.x < 0) {
      this.currentImage = foxMoveLeft;
    } else if (player.vel.y > 0) {
      this.currentImage = foxMoveFront;
    } else if (player.vel.y < 0) {
      this.currentImage = foxMoveBack;
    }
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
      this.isAttacking = true;
      this.attackTimer = 10;

      if (player.vel.x > 0) {
        this.currentImage = foxAttackRight;
      } else if (player.vel.x < 0) {
        this.currentImage = foxAttackLeft;
      } else if (player.vel.y > 0) {
        this.currentImage = foxAttackFront;
      } else if (player.vel.y < 0) {
        this.currentImage = foxAttackBack;
      }
      showFloatingText("⚔️", this.pos.x, this.pos.y, color(255, 200, 0));
    }
  }

  display() {
    this.frameCounter++;
    if (this.frameCounter >= this.frameDelay) {
      this.frameCounter = 0;
      this.frameIndex = (this.frameIndex + 1) % this.totalFrames;
    }

    // 如果不是攻击状态，才根据玩家移动方向更新图片
    if (!this.isAttacking) {
      if (player.vel.x > 0) {
        this.currentImage = foxMoveRight;
      } else if (player.vel.x < 0) {
        this.currentImage = foxMoveLeft;
      } else if (player.vel.y > 0) {
        this.currentImage = foxMoveFront;
      } else if (player.vel.y < 0) {
        this.currentImage = foxMoveBack;
      }
    }

    // 绘制当前图片（无论是攻击还是跟随状态）
    if (this.currentImage) {
      let sx = this.frameIndex * (this.currentImage.width / this.totalFrames);
      push();
      imageMode(CENTER);
      image(
        this.currentImage,
        this.pos.x,
        this.pos.y,
        35,
        35,
        sx,
        0,
        this.currentImage.width / this.totalFrames,
        this.currentImage.height
      );
      pop();
    }

    if (this.attackTimer > 0) {
      this.attackTimer--;
    } else {
      this.isAttacking = false;
    }
  }


  update(player) {
    // 如果正在攻击，则不要更新跟随状态（或分开处理）
    if (!this.isAttacking) {
      this.follow(player);
    }
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
    showFloatingText("护盾激活!", player.pos.x, player.pos.y - 40, color(0, 200, 255));
  }

  deactivateShield(player) {
    this.isShieldActive = false;
    player.invincible = false;
    showFloatingText("护盾消失", player.pos.x, player.pos.y - 40, color(100));
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

// === 治疗型宠物：生命天使 ===
class HealerPet extends BasePet {
  constructor() {
    super();
    this.healAmount = 0.4; // 每秒回复量
    this.healTick = 0; // 计时器
    this.healInterval = 60; // 每60帧（约1秒）治疗一次
    // 视觉效果相关
    this.angle = 0;
    this.orbitRadius = 30; // 环绕半径
  }

  follow(player) {
    // 让宠物以圆形轨迹环绕玩家
    this.angle += 0.02;
    const orbitX = player.pos.x + cos(this.angle) * this.orbitRadius;
    const orbitY = player.pos.y + sin(this.angle) * this.orbitRadius;
    this.pos = createVector(orbitX, orbitY);
  }

  update(player) {
    this.follow(player);

    // 治疗计时
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
    // 绘制治疗光环效果
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

// 修改showPetSelectionScreen函数中的判断条件
function showPetSelectionScreen() {
  background(0, 150);

  fill(255);
  textSize(32);
  textAlign(CENTER, CENTER);
  text("选择你的战斗伙伴！", width / 2, height / 4);

  // 绘制三个宠物选项
  fill(200);
  rect(width / 4 - 100, height / 2 - 80, 200, 120, 10);
  rect(width / 2 - 100, height / 2 - 80, 200, 120, 10);
  rect(width * 3 / 4 - 100, height / 2 - 80, 200, 120, 10);

  fill(255);
  textSize(20);
  text("烈焰战狼", width / 4, height / 2 - 40);
  text("钢铁巨龟", width / 2, height / 2 - 40);
  text("生命天使", width * 3 / 4, height / 2 - 40);

  textSize(14);
  text("自动攻击最近敌人\n+15 攻击伤害", width / 4, height / 2);
  text("定期提供护盾\n+150 最大生命值", width / 2, height / 2);
  text("持续回复生命值\n每秒恢复0.4生命", width * 3 / 4, height / 2);

  // 检测鼠标点击
  if (mouseIsPressed) {
    if (mouseX > width / 4 - 100 && mouseX < width / 4 + 100 &&
      mouseY > height / 2 - 80 && mouseY < height / 2 + 40) {
      // 选择烈焰战狼
      player.pet = new AttackPet(player.pos.x, player.pos.y); // 确保使用正确的类
      gameState = "game";
    } else if (mouseX > width / 2 - 100 && mouseX < width / 2 + 100 &&
      mouseY > height / 2 - 80 && mouseY < height / 2 + 40) {
      // 选择钢铁巨龟
      player.pet = new DefensePet(); // 确保使用正确的类
      gameState = "game";
    } else if (mouseX > width * 3 / 4 - 100 && mouseX < width * 3 / 4 + 100 &&
      mouseY > height / 2 - 80 && mouseY < height / 2 + 40) {
      // 选择生命天使
      player.pet = new HealerPet(); // 确保使用正确的类
      gameState = "game";
    }
  }
}

function finishPetSelection() {
  player.needsPetSelection = false;
  wave++;
  spawnEnemiesForWave(wave);
  gameState = "game";
}




