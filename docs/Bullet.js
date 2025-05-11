// --- Base Bullet Class ---
// Handles behavior for player-fired projectiles, including different types like normal, pierce, and bounce.
class Bullet {
  constructor(x, y, vel, type = "normal", bImageUp, bImageDown, bImageLeft, bImageRight, state) {
    this.pos = createVector(x, y);
    this.vel = vel;
    this.radius = 5;
    this.type = type;
    this.damage = 10;
    this.pierceCount = type === "pierce" ? 3 : 0;
    this.bounceCount = 0;
    this.maxBounces = type === "bounce" ? 3 : 0;
    this.shootDirection;
    // Load image and set properties according to direction
    if (state === "Up") {
      this.bImage = bImageDown;
      this.shootDirection = "up";
      this.ImageWidth = 20;
      this.ImageHeight = 40;
      this.bWidth = 30;
      this.bHeight = 100;
    } else if (state === "Down") {
      this.bImage = bImageUp;
      this.shootDirection = "down";
      this.ImageWidth = 20;
      this.ImageHeight = 40;
      this.bWidth = 30;
      this.bHeight = 100;
    } else if (state === "Left") {
      this.bImage = bImageLeft;
      this.shootDirection = "left";
      this.ImageWidth = 40;
      this.ImageHeight = 20;
      this.bWidth = 100;
      this.bHeight = 30;
    } else if (state === "Right") {
      this.bImage = bImageRight;
      this.shootDirection = "right";
      this.ImageWidth = 40;
      this.ImageHeight = 20;
      this.bWidth = 100;
      this.bHeight = 30;
    }

    this.frameIndex = 0;
    this.animationDelay = 10; // Control animation speed
    this.animationCounter = 0;
  }

  // Updates the bullet's state each frame.
  // Moves the bullet, checks for collisions with enemies and obstacles, and handles bullet-specific logic (piercing, bouncing).
  // Returns false if the bullet should be destroyed (e.g., hit an enemy, obstacle, or went off-screen), true otherwise.
  update() {
    this.pos.add(this.vel);

    // Check enemy collision
    for (let i = enemies.length - 1; i >= 0; i--) {
      let enemy = enemies[i];
      if (enemy.attackDetect) {
        if (p5.Vector.dist(this.pos, enemy.pos) < enemy.radius + this.radius) {
          let killed = enemy.hit(this.damage);
          if (killed) {
            enemy.startDeathEffect();
            if (enemy instanceof Boss) {
              bossDefeated++;
              bossDefeatedCount++;
            }
            normalEnemiesDefeated++;
            if (enemy.gainExp == false) {
              player.gainExp(enemy.expValue);
              enemy.gainExp = true;
            }

            if (enemy.dead) {
              enemies.splice(i, 1);
            }
          }
          if (this.type === "pierce") {
            this.pierceCount--;
            if (this.pierceCount <= 0) return false;
          } else if (this.type !== "bounce") {
            return false;
          }
        }
      }
    }

    // detect collision with obstacles
    for (let obs of obstacles) {
      if (obs.collidesWithCircle(this.pos, this.radius)) {
        if (this.type === "bounce") {
          let closestX = constrain(
            this.pos.x,
            obs.pos.x,
            obs.pos.x + obs.width
          );
          let closestY = constrain(
            this.pos.y,
            obs.pos.y,
            obs.pos.y + obs.height
          );

          let normalX = this.pos.x - closestX;
          let normalY = this.pos.y - closestY;

          if (abs(normalX) > abs(normalY)) {
            this.vel.x *= -1;
          } else {
            this.vel.y *= -1;
          }
          this.bounceCount++;
          if (this.bounceCount > this.maxBounces) return false;
          this.pos.add(this.vel);
        } else if (this.type === "pierce") {
          this.pierceCount--;
          if (this.pierceCount <= 0) return false;
        } else {
          return false;
        }
      }
    }

    // Boundary check
    if (
      this.pos.x < 0 ||
      this.pos.x > width ||
      this.pos.y < 0 ||
      this.pos.y > height
    ) {
      if (this.type === "bounce") {
        if (this.pos.x < 0 || this.pos.x > width) {
          this.vel.x *= -1;
          this.pos.x = constrain(this.pos.x, 0, width);
        }
        if (this.pos.y < 0 || this.pos.y > height) {
          this.vel.y *= -1;
          this.pos.y = constrain(this.pos.y, 0, height);
        }
        this.bounceCount++;
        if (this.bounceCount > this.maxBounces) return false;
      } else {
        return false;
      }
    }
    return true;
  }

  // Displays the bullet on the screen.
  // Renders the bullet's image if available, otherwise draws a default ellipse.
  display() {
    push();
    translate(this.pos.x, this.pos.y);

    if (this.bImage && typeof this.bImage !== 'undefined') {
      image(
        this.bImage,
        0, 0,
        this.ImageWidth,
        this.ImageHeight,
        0,
        0,
        this.bImage.width,
        this.bImage.height
      );
    } else {
      fill(255);
      noStroke();
      ellipse(0, 0, this.radius * 2);
    }
    pop();
  }
}

// --- EnemyBullet Class ---
// Basic projectile fired by enemies.
class EnemyBullet {
  // Constructor for the EnemyBullet class.
  // Initializes basic properties like position, velocity, radius, and damage.
  constructor(x, y, vel) {
    this.pos = createVector(x, y);
    this.vel = vel;
    this.radius = 5;
    this.damage = 10;
  }

  // Updates the enemy bullet's state each frame.
  // Moves the bullet and checks for collisions with obstacles or screen boundaries.
  // Returns false if the bullet should be destroyed, true otherwise.
  update() {
    this.pos.add(this.vel);
    for (let obs of obstacles) {
      if (obs.collidesWithCircle(this.pos, this.radius)) return false;
    }
    return !(
      this.pos.x < 0 ||
      this.pos.x > width ||
      this.pos.y < 0 ||
      this.pos.y > height
    );
  }

  // Displays the enemy bullet on the screen.
  // Renders it as a simple colored ellipse.
  display() {
    fill(200, 100, 255);
    noStroke();
    ellipse(this.pos.x, this.pos.y, this.radius * 2);
  }
}

// --- WebProjectile Class ---
// Represents a specialized enemy projectile that creates a web effect.
// Extends EnemyBullet and adds animation for the web.
class WebProjectile extends EnemyBullet {
  // Constructor for the WebProjectile class.
  // Initializes web-specific properties like radius and animation parameters.
  constructor(x, y, vel) {
    super(x, y, vel);
    this.radius = 10;

    // Animation properties
    this.frameIndex = 0;
    this.frameCount = 6; // acidProjectile2 image has 6 frames
    this.frameDelay = 6;
    this.frameCounter = 0;
  }

  // Updates the web projectile's state each frame.
  // Moves the projectile and progresses its animation.
  // Returns false if the bullet should be destroyed (e.g., went off-screen), true otherwise.
  update() {
    this.pos.add(this.vel);

    this.frameCounter++;
    if (this.frameCounter >= this.frameDelay) {
      this.frameCounter = 0;
      this.frameIndex = (this.frameIndex + 1) % this.frameCount;
    }

    return !(this.pos.x < 0 || this.pos.x > width || this.pos.y < 0 || this.pos.y > height);
  }

  // Displays the web projectile on the screen.
  // Renders the animated web image if available, with rotation based on velocity.
  // Falls back to a simple ellipse if the image is not loaded.
  display() {
    if (typeof webEffectImg !== 'undefined' && webEffectImg) {
      try {
        push();
        imageMode(CENTER);

        let frameWidth = webEffectImg.width / this.frameCount;
        let frameHeight = webEffectImg.height;

        drawingContext.imageSmoothingEnabled = false;

        let displaySize = this.radius * 2.5;

        let angle = this.vel.heading() + HALF_PI;
        translate(this.pos.x, this.pos.y);
        rotate(angle);

        image(
          webEffectImg,
          0,
          0,
          displaySize,
          displaySize * 1.2,
          this.frameIndex * frameWidth,
          0,
          frameWidth,
          frameHeight
        );

        drawingContext.imageSmoothingEnabled = true;
        pop();
      } catch (e) {
        fill(200, 200, 200, 150);
        ellipse(this.pos.x, this.pos.y, this.radius * 2);
      }
    } else {
      fill(200, 200, 200, 150);
      ellipse(this.pos.x, this.pos.y, this.radius * 2);
    }
  }
}

// --- GhostFire Class ---
// Represents a homing projectile fired by enemies, which seeks the player.
// Includes animation and particle effects on collision.
class GhostFire {
  // Constructor for the GhostFire class.
  // Initializes properties for homing behavior, damage, animation, and visual effects.
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.maxSpeed = 2.5;
    this.maxForce = 0.15;
    this.radius = 15;
    this.damage = 20;
    this.isActive = true;

    this.frameIndex = 0;
    this.totalFrames = 5;
    this.frameDelay = 8;
    this.frameCounter = 0;

    this.glowRadius = 30;
    this.glowAlpha = 150;
  }

  // Calculates the steering force to apply to the projectile to seek a target.
  // Takes a target vector (usually the player's position) and returns a steering vector.
  seek(target) {
    let desired = p5.Vector.sub(target, this.pos);
    desired.normalize();
    desired.mult(this.maxSpeed);

    let steer = p5.Vector.sub(desired, this.vel);
    steer.limit(this.maxForce);
    return steer;
  }

  // Updates the ghost fire's state each frame.
  // Handles animation, applies seeking behavior, updates position, and checks for collisions.
  // Damages the player on collision or creates particle effects if it hits an obstacle.
  update() {
    this.frameCounter++;
    if (this.frameCounter >= this.frameDelay) {
      this.frameCounter = 0;
      this.frameIndex = (this.frameIndex + 1) % this.totalFrames;
    }

    let steer = this.seek(player.pos);
    this.acc.add(steer);

    this.vel.add(this.acc);
    this.vel.limit(this.maxSpeed);
    this.pos.add(this.vel);
    this.acc.mult(0);

    let d = dist(this.pos.x, this.pos.y, player.pos.x, player.pos.y);
    if (d < this.radius + player.radius) {
      player.takeDamage(this.damage);
      showFloatingText("-" + this.damage, player.pos.x, player.pos.y - 20, color(255, 100, 100));
      this.isActive = false;
    }

    for (let obs of obstacles) {
      if (obs.collidesWith(this.pos, this.radius * 2, this.radius * 2)) {
        this.isActive = false;
        for (let i = 0; i < 8; i++) {
          let angle = random(TWO_PI);
          let speed = random(2, 5);
          let velocity = p5.Vector.fromAngle(angle).mult(speed);
          particles.push(new Particle(this.pos.x, this.pos.y, velocity, color(255, 150, 0)));
        }
        break;
      }
    }
  }

  // Displays the ghost fire on the screen.
  // Renders the animated ghost fire image.
  display() {
    push();
    imageMode(CENTER);
    let frameWidth = ghostFireImg.width / this.totalFrames;
    let frameHeight = ghostFireImg.height;
    image(
      ghostFireImg,
      this.pos.x,
      this.pos.y,
      this.radius * 2.5,
      this.radius * 2.5,
      this.frameIndex * frameWidth,
      0,
      frameWidth,
      frameHeight
    );
    pop();
  }
}


