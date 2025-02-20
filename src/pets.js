// --- Pet 类 ---
class Pet {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.radius = 15;
    this.attackRange = 40;      // 增加攻击范围
    this.attackDamage = 15;     // 提高攻击力
    this.speed = 4;             // 增加移动速度
    this.attackCooldown = 0;    // 新增攻击冷却
    this.orbitRadius = 30;      // 新增：绕玩家飞行的半径
    this.angle = 0;             // 新增：飞行角度
  }

  // 修改后的跟随方法（绕玩家飞行）
  follow(player) {
    this.angle += 0.05;
    const targetPos = createVector(
      player.pos.x + cos(this.angle) * this.orbitRadius,
      player.pos.y + sin(this.angle) * this.orbitRadius
    );
    this.pos.lerp(targetPos, 0.1); // 平滑移动
  }

  // 强化后的攻击逻辑
  attack(enemies) {
    this.attackCooldown--;

    // 寻找最近敌人
    let closest = null;
    let record = Infinity;
    for (const enemy of enemies) {
      const d = p5.Vector.dist(this.pos, enemy.pos);
      if (d < record) {
        record = d;
        closest = enemy;
      }
    }

    // 攻击逻辑
    if (closest && record < this.attackRange && this.attackCooldown <= 0) {
      closest.hit(this.attackDamage);
      this.attackCooldown = 30; // 每半秒攻击一次
      showFloatingText("⚔️", this.pos.x, this.pos.y, color(255, 200, 0));
    }
  }

  display() {
    push();
    fill(255, 200, 0);
    noStroke();
    // 添加翅膀动画
    translate(this.pos.x, this.pos.y);
    rotate(frameCount * 0.1);
    triangle(-10, 0, 0, -15, 10, 0);
    triangle(-10, 0, 0, 15, 10, 0);
    pop();
  }
}

// --- Pet2 类 ---
class Pet2 {
  constructor() {
    this.pos = createVector(0, 0);
    this.radius = 15;
    this.shieldCharge = 0;      // 护盾充能进度（0-100）
    this.isShieldActive = false;
    this.shieldDuration = 90;   // 1.5秒=90帧
    this.shieldTimer = 0;
    this.shieldChargeInterval = 15000; // 15秒充能
    this.lastShieldTime = 0;
  }

  follow(player) {
    // 保持在玩家右后方
    const target = p5.Vector.add(player.pos, createVector(30, 20));
    this.pos.lerp(target, 0.1);
  }

  update(player) {
    // 充能逻辑
    if (!this.isShieldActive) {
      if (millis() - this.lastShieldTime > this.shieldChargeInterval) {
        this.activateShield(player);
        this.lastShieldTime = millis();
      }
    }

    // 护盾持续时间
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
    this.shieldTimer = 90; // 1.5秒
    player.invincible = true;
    showFloatingText("🛡️ 无敌护盾激活！", player.pos.x, player.pos.y - 40, color(0, 200, 255));
  }


  activateShield(player) {
    this.isShieldActive = true;
    this.shieldCharge = 0;
    this.shieldTimer = this.shieldDuration;
    player.invincible = true;
    showFloatingText("🛡️ Shield Active!", player.pos.x, player.pos.y - 40, color(0, 200, 255));
  }

  display() {
    // 护盾特效
    if (this.isShieldActive) {
      push();
      fill(0, 200, 255, 50);
      stroke(0, 150, 255);
      ellipse(this.pos.x, this.pos.y, 40);
      pop();
    }

    // 本体显示
    fill(0, 150, 255);
    ellipse(this.pos.x, this.pos.y, this.radius * 2);

    // 充能显示
    if (!this.isShieldActive) {
      push();
      textSize(12);
      fill(255);
      textAlign(CENTER);
      text(`${floor(this.shieldCharge)}%`, this.pos.x, this.pos.y + 25);
      pop();
    }
  }
}