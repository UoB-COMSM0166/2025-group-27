// --- EnemyBullet 类 ---
class EnemyBullet {
  constructor(x, y, vel) {
    this.pos = createVector(x, y);
    this.vel = vel;
    this.radius = 5;
    this.damage = 10;
  }

  update() {
    this.pos.add(this.vel);
    for (let obs of obstacles) {
      if (obs.collidesWith(this.pos, this.radius)) return false;
    }
    return !(
      this.pos.x < 0 ||
      this.pos.x > width ||
      this.pos.y < 0 ||
      this.pos.y > height
    );
  }

  display() {
    fill(200, 100, 255);
    noStroke();
    ellipse(this.pos.x, this.pos.y, this.radius * 2);
  }
}

// --- WebProjectile 类 ---
class WebProjectile extends EnemyBullet {
  constructor(x, y, vel) {
    super(x, y, vel);
    this.radius = 10;
  }

  display() {
    fill(200, 200, 200, 150);
    ellipse(this.pos.x, this.pos.y, this.radius * 2);
  }
}
