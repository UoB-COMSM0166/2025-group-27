// ===== 天气效果 =====
function applyWeatherEffects(now) {
  player.fireRate = weather === "hot" ? 12 : 10;
  player.speed = weather === "snowy" ? 3 : 5;
  enemies.forEach((enemy) => {
    enemy.speed = weather === "snowy" ? 1 : random(1, 3);
  });
  if (weather === "thunderstorm") {
    for (let i = 0; i < lightningChain.length; i++) {
      let alpha = map(i, 0, lightningChain.length - 1, 255, 100);
      fill(255, 255, 0, alpha * 0.4);
      ellipse(lightningChain[i].x, lightningChain[i].y, 100);
      if (i > 0) {
        stroke(255, 255, 0, alpha);
        strokeWeight(2);
        drawLightning(
          lightningChain[i - 1].x,
          lightningChain[i - 1].y,
          lightningChain[i].x,
          lightningChain[i].y
        );
        noStroke();
      }
      if (p5.Vector.dist(player.pos, lightningChain[i]) < 50) {
        player.takeDamage(0.2);
      }
      for (let j = enemies.length - 1; j >= 0; j--) {
        if (p5.Vector.dist(enemies[j].pos, lightningChain[i]) < 50) {
          enemies[j].health -= 1;
          if (enemies[j].health <= 0) {
            const isBoss = enemies[j] instanceof Boss;
            enemies.splice(j, 1);
            if (isBoss) {
              bossDefeated++;
              bossDefeatedCount++;
            }
            score += 10;
            player.gainExp(enemies[j] ? enemies[j].expValue : 10);
          }
        }
      }
    }
    if (
      now - lastLightningTime > lightningDelay &&
      lightningChain.length < maxLightningChain
    ) {
      let lastPos = lightningChain[lightningChain.length - 1];
      let angle = random(TWO_PI);
      let distance = random(100, 200);
      let newX = constrain(lastPos.x + cos(angle) * distance, 50, width - 50);
      let newY = constrain(lastPos.y + sin(angle) * distance, 50, height - 50);
      lightningChain.push(createVector(newX, newY));
      lastLightningTime = now;
    }
    if (
      lightningChain.length >= maxLightningChain &&
      now - lastLightningTime > lightningDelay * 2
    ) {
      lightningZone = createVector(random(width), random(height));
      lightningChain = [lightningZone];
      lastLightningTime = now;
    }
  }
}

function drawLightning(x1, y1, x2, y2) {
  let midX = (x1 + x2) / 2;
  let midY = (y1 + y2) / 2;
  let offset = random(-30, 30);
  beginShape();
  vertex(x1, y1);
  vertex(midX + offset, midY + offset);
  vertex(x2, y2);
  endShape();
}