class Feather {
  constructor(x, y, sprite) {
    this.pos = createVector(x, y);
    this.vel = createVector(random(-1, 1), random(2, 2.5));
    this.angle = random(TWO_PI);
    this.rotationSpeed = random(-0.05, 0.05);
    this.sprite = sprite;
    this.alpha = 255;
    this.size = random(18, 20);
    
    this.waveAmplitude = random(0.2, 0.5);
    this.waveFrequency = 0.03;
    this.time = random(TWO_PI);
    
    this.trail = [];
    this.maxTrailLength = 2;
  }

  update() {
    this.time += 0.08;
    this.vel.x += sin(this.time * this.waveFrequency) * this.waveAmplitude * 0.1;
    
    this.pos.add(this.vel);
    this.angle += this.rotationSpeed;
    this.alpha -= 1.2;
    
    if (this.alpha > 100) {
      this.trail.push({
        pos: this.pos.copy(),
        alpha: this.alpha * 0.2
      });
      
      if (this.trail.length > this.maxTrailLength) {
        this.trail.shift();
      }
    }
    
    this.vel.mult(0.99);

    return this.alpha > 0;
  }

  display() {
    if (this.alpha > 100) {
      this.trail.forEach((point, index) => {
        let trailAlpha = point.alpha * (index / this.maxTrailLength) * 0.15;
        push();
        translate(point.pos.x, point.pos.y);
        rotate(this.angle);
        tint(255, 255, 255, trailAlpha);
        image(this.sprite, -this.size/3, -this.size/3, this.size/2, this.size/2);
        noTint();
        pop();
      });
    }

    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.angle);
    tint(255, 255, 255, this.alpha);
    image(this.sprite, -this.size/2, -this.size/2, this.size, this.size);
    noTint();
    pop();
  }
}
