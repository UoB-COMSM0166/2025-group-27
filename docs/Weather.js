//heat effect
function drawHeatHaze() {
  let allImage;
  let frameWidth, frameHeight;
  let totalFrames = 16;
  allImage = sunpic;
  frameWidth = allImage.width / totalFrames;
  frameHeight = allImage.height;
  // Compute current frame of background animation
  let sx = currentFrame * frameWidth;

  push();
  noStroke();
  // Draw the animated background
  image(allImage, 0, 0, 1062, 600, sx, 0, frameWidth, frameHeight);
  for (let y = 0; y < height; y += 5) {
    let offset = map(noise(y * 0.01, millis() * 0.002), 0, 1, -10, 10);
    fill(255, 200, 200, 30);
    rect(offset, y, width, 5);
  }
  pop();
  if (frameCount % 6 === 0) {
    currentFrame = (currentFrame + 1) % totalFrames;
  }
}

//snow effect
class Snowflake {
  constructor() {
    this.x = random(width);
    this.y = random(-50, -10);
    this.size = random(8, 20);
    this.speed = random(0.5, 1.5);
  }
  // Move the snowflake downwards; reset to top if it falls off
  update() {
    this.y += this.speed;
    if (this.y > height) {
      this.y = random(-50, -10);
      this.x = random(width);
    }
  }
  // Draw the snowflake sprite
  display() {
    noStroke();
    fill(255, 255, 255, 200);
    image(snowflakepic, this.x, this.y, this.size, this.size);
  }
}

let snowflakes = [];
// Initialize a pool of snowflakes
function setupSnow() {
  for (let i = 0; i < 100; i++) {
    snowflakes.push(new Snowflake());
  }
}
// Update and draw all snowflakes each frame
function drawSnow() {
  for (let s of snowflakes) {
    s.update();
    s.display();
  }
}

//lightning effect
let lightningFlash = false;
let lightningTimer = 0;
function updateLightningFlash() {
  if (millis() - lightningTimer > 3000) {
    lightningFlash = true;
    lightningTimer = millis();
    // Turn off flash shortly after
    setTimeout(() => { lightningFlash = false; }, 100);
  }
}
function drawLightningFlash() {
  if (lightningFlash) {
    push();
    fill(255, 255, 255, 200);
    rect(0, 0, width, height);
    image(lightningpic, width / 2, height / 2, 150, 150);
    pop();
  }
}

function drawWeatherEffects() {
  if (gameState === "game") {
    if (weather === "hot") {
      drawHeatHaze();
    } else if (weather === "snowy") {
      drawSnow();
    } else if (weather === "thunderstorm") {
      updateLightningFlash();
      drawLightningFlash();
    }
  }
}

//weather selection function
function updateWeather() {
  let currentTime = millis();
  if (gameState == "game") {
    if (currentTime - lastWeatherChange > 30000) {
      let weatherOptions = ["normal", "hot", "snowy", "thunderstorm"];
      weather = random(weatherOptions);
      lastWeatherChange = currentTime;
      weatherStartTime = currentTime;

      // Initialize lightning chain positions if stormy
      if (weather === "thunderstorm") {
        lightningZone = player.pos.copy();
        lightningChain = [lightningZone];
        lastLightningTime = currentTime;
      }
    }
  }

  // Revert to normal after the duration elapses
  if (weather !== "normal" && currentTime - weatherStartTime > 20000) {
    weather = "normal";
  }
}

function applyWeatherEffects(now) {
  // Hot weather slows fire‐rate, snowy slows movements
  player.fireRate = weather === "hot" ? 18 : 10;
  player.speed = weather === "snowy" ? 3 : 5;
  enemies.forEach((enemy) => {
    enemy.speed = weather === "snowy" ? 1 : random(1, 3);
  });

  if (weather === "thunderstorm") {
    //draw lightning effect
    for (let i = 0; i < lightningChain.length; i++) {
      let alpha = map(i, 0, lightningChain.length - 1, 255, 100);
      fill(255, 255, 0, alpha * 0.4);
      if (i > 0) {
        image(lightningpic, lightningChain[i].x - 30, lightningChain[i].y - 30, 50, 50);
      }
      //attack player
      if (p5.Vector.dist(player.pos, lightningChain[i]) < 50) {
        player.takeDamage(0.2);
      }
      //attack enemy
      for (let j = enemies.length - 1; j >= 0; j--) {
        if (p5.Vector.dist(enemies[j].pos, lightningChain[i]) < 50) {
          enemies[j].health -= 1;
          if (enemies[j].health <= 0) {
            const isBoss = enemies[j] instanceof Boss;
            let expValue = enemies[j].expValue;
            enemies.splice(j, 1);
            if (isBoss) {
              bossDefeated++;
              bossDefeatedCount++;
              score += 10;
              player.gainExp(expValue || 10);
            }
          }
        }
      }

      //create lightning chain
      if (now - lastLightningTime > lightningDelay && lightningChain.length < maxLightningChain) {
        let lastPos = lightningChain[lightningChain.length - 1];
        let direction = p5.Vector.sub(player.pos, lastPos).normalize();
        let distance = random(50, 100);
        let newPos = p5.Vector.add(lastPos, p5.Vector.mult(direction, distance));
        lightningChain.push(newPos);
        lastLightningTime = now;
      }
      // Reset chain occasionally to re‐center on the player
      if (lightningChain.length >= maxLightningChain && now - lastLightningTime > lightningDelay * 2) {
        lightningZone = player.pos.copy();
        lightningChain = [lightningZone];
        lastLightningTime = now;
      }
    }
  }
}
