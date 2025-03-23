// --- Obstacle 类 ---
class Obstacle {
  constructor(x, y, width, height, isVertical, isSpecial = false) {
    this.isSpecial = isSpecial;
    if(!isSpecial){
    this.pos = createVector(x, y);
    this.width = width;
    this.height = height;
  } else {
    this.pos = createVector(431,200);
    this.width = 200;
    this.height = 200;
  }
    this.isVertical = isVertical;
    this.moving = false;
    this.targetPos = null;
    this.moveStartTime = 0;
    this.moveStartPos = null;
  }

  update() {
    if (this.moving && this.targetPos) {
      let elapsed = millis() - this.moveStartTime;
      const duration = 2000;
      if (elapsed < duration) {
        let progress = elapsed / duration;
        progress =
          progress < 0.5
            ? 2 * progress * progress
            : -1 + (4 - 2 * progress) * progress;
        this.pos.x = lerp(this.moveStartPos.x, this.targetPos.x, progress);
        this.pos.y = lerp(this.moveStartPos.y, this.targetPos.y, progress);
      } else {
        this.pos = this.targetPos.copy();
        this.moving = false;
        this.targetPos = null;
      }
    }
  }

  moveTo(newPos) {
    this.moving = true;
    this.targetPos = newPos.copy();
    this.moveStartPos = this.pos.copy();
    this.moveStartTime = millis();
  }

  display() {
    if(this.isSpecial === true){
      image(obstacleS, 431, 200, 200, 200);
    } else {
    if(wave <= 5){
    if(this.isVertical){
      image(obstacle1, this.pos.x, this.pos.y, this.width, this.height);
    } else{
      image(obstacle2, this.pos.x, this.pos.y, this.width, this.height);
    }
    } else if(wave>5 && wave<=10){
      if(this.isVertical){
        image(obstacle3, this.pos.x, this.pos.y, this.width, this.height);
      } else{
        image(obstacle, this.pos.x, this.pos.y, this.width, this.height);
      }
      
    } else if(wave>10 && wave<=15){
      if(this.isVertical){
        image(obstacle5, this.pos.x, this.pos.y, 100, 100);
        } else {
        image(obstacle7, this.pos.x, this.pos.y, 70, 70);
        }
    } else {
      if(this.isVertical){
        image(obstacle9, this.pos.x, this.pos.y, 70, 70);
        } else {
        image(obstacleV, this.pos.x, this.pos.y, 100, 50);
        }
    }
  }
  }

  collidesWith(otherPos, otherWidth, otherHeight) {
    return !(
      otherPos.x + otherWidth < this.pos.x ||    // 其他矩形的右边界在当前矩形左侧
      otherPos.x > this.pos.x + this.width ||    // 其他矩形的左边界在当前矩形右侧
      otherPos.y + otherHeight < this.pos.y ||   // 其他矩形的下边界在当前矩形上侧
      otherPos.y > this.pos.y + this.height      // 其他矩形的上边界在当前矩形下侧
    );
  }

  collidesWithCircle(position, radius) {
    let closestX = constrain(position.x, this.pos.x, this.pos.x + this.width);
    let closestY = constrain(position.y, this.pos.y, this.pos.y + this.height);
    let distanceSquared = sq(position.x - closestX) + sq(position.y - closestY);
    return distanceSquared < sq(radius);
  }
}