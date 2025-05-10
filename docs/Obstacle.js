class Obstacle {
  constructor(x, y, width, height, isVertical, isSpecial = false) {
    this.isSpecial = isSpecial;
    if (!isSpecial) {
      // Standard obstacle: use provided position and dimensions
      this.pos = createVector(x, y);
      this.width = width;
      this.height = height;
    } else {
      // Special obstacle: always at fixed coordinates, fixed size
      this.pos = createVector(431, 200);
      this.width = 200;
      this.height = 200;
    }
    // Orientation flag (affects which sprite to draw)
    this.isVertical = isVertical;
    // Movement state
    this.moving = false;
    this.targetPos = null;
    this.moveStartTime = 0;
    this.moveStartPos = null;
  }
  // Handle smooth easing movement toward targetPos over 2 seconds
  update() {
    if (this.moving && this.targetPos) {
      let elapsed = millis() - this.moveStartTime;
      const duration = 2000;
      if (elapsed < duration) {
        // Ease in/out quadratic timing
        let progress = elapsed / duration;
        progress =
          progress < 0.5
            ? 2 * progress * progress
            : -1 + (4 - 2 * progress) * progress;
        this.pos.x = lerp(this.moveStartPos.x, this.targetPos.x, progress);
        this.pos.y = lerp(this.moveStartPos.y, this.targetPos.y, progress);
      } else {
        // Movement complete
        this.pos = this.targetPos.copy();
        this.moving = false;
        this.targetPos = null;
      }
    }
  }
  // Begin moving the obstacle to newPos
  moveTo(newPos) {
    this.moving = true;
    this.targetPos = newPos.copy();
    this.moveStartPos = this.pos.copy();
    this.moveStartTime = millis();
  }

  // Draw the obstacle using different sprites depending on wave and orientation
  display() {
    if (this.isSpecial === true) {
      // Always draw the special obstacle sprite
      image(obstacleS, 431, 200, 200, 200);
    } else {
      // Choose sprite based on current wave number
      if (wave <= 5) {
        if (this.isVertical) {
          image(obstacle1, this.pos.x, this.pos.y, this.width, this.height);
        } else {
          image(obstacle2, this.pos.x, this.pos.y, this.width, this.height);
        }
      } else if (wave > 5 && wave <= 10) {
        if (this.isVertical) {
          image(obstacle3, this.pos.x, this.pos.y, this.width, this.height);
        } else {
          image(obstacle, this.pos.x, this.pos.y, this.width, this.height);
        }

      } else if (wave > 10 && wave <= 15) {
        if (this.isVertical) {
          image(obstacle5, this.pos.x - 2, this.pos.y - 2, 100, 100);
        } else {
          image(obstacle7, this.pos.x - 2, this.pos.y - 2, 70, 70);
        }
      } else {
        if (this.isVertical) {
          image(obstacle9, this.pos.x, this.pos.y, 70, 70);
        } else {
          image(obstacleV, this.pos.x, this.pos.y, 100, 50);
        }
      }
    }
  }

  // Axis-aligned bounding-box collision test against another rectangle
  collidesWith(otherPos, otherWidth, otherHeight) {
    return !(
      otherPos.x + otherWidth < this.pos.x ||
      otherPos.x > this.pos.x + this.width ||
      otherPos.y + otherHeight < this.pos.y ||
      otherPos.y > this.pos.y + this.height
    );
  }

  // Collision test against a circle of given center and radius
  collidesWithCircle(position, radius) {
    // Find the closest point on the rectangle to the circle center
    let closestX = constrain(position.x, this.pos.x, this.pos.x + this.width);
    let closestY = constrain(position.y, this.pos.y, this.pos.y + this.height);
    let distanceSquared = sq(position.x - closestX) + sq(position.y - closestY);
    return distanceSquared < sq(radius);
  }
}