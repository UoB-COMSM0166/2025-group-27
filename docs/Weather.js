// Weather.js
// ===== 天气效果 =====
function applyWeatherEffects(now) {
  // 根据天气状态调整玩家和敌人的属性
  player.fireRate = weather === "hot" ? 12 : 10;
  player.speed = weather === "snowy" ? 3 : 5;
  enemies.forEach((enemy) => {
    enemy.speed = weather === "snowy" ? 1 : random(1, 3);
  });
  
  if (weather === "thunderstorm") {
    // 绘制闪电效果
    for (let i = 0; i < lightningChain.length; i++) {
      let alpha = map(i, 0, lightningChain.length - 1, 255, 100);
      fill(255, 255, 0, alpha * 0.4);
      if (i > 0) {
        image(lightningpic,lightningChain[i].x - 30, lightningChain[i].y - 30,50,50);
      }
      // 对玩家造成闪电伤害
      if (p5.Vector.dist(player.pos, lightningChain[i]) < 50) {
        player.takeDamage(0.2);
      }
      // 对敌人造成闪电伤害
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
            }
            score += 10;
            player.gainExp(expValue || 10);
          }
        }
      }
    }
    
    // 生成闪电链：让新段朝向玩家
    if (now - lastLightningTime > lightningDelay && lightningChain.length < maxLightningChain) {
      let lastPos = lightningChain[lightningChain.length - 1];
      let direction = p5.Vector.sub(player.pos, lastPos).normalize();
      let distance = random(50, 100); // 延伸距离
      let newPos = p5.Vector.add(lastPos, p5.Vector.mult(direction, distance));
      lightningChain.push(newPos);
      lastLightningTime = now;
    }
    // 达到最大闪电链长度且时间间隔足够时，以玩家当前位置重置闪电链
    if (lightningChain.length >= maxLightningChain && now - lastLightningTime > lightningDelay * 2) {
      lightningZone = player.pos.copy();
      lightningChain = [lightningZone];
      lastLightningTime = now;
    }
  }
}
