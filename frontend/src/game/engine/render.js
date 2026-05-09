import { worldToScreen, worldToScreenParallax} from "./world";

export function drawPlanets(coins, planets, ctx, camera, viewport) {
  for (const planet of planets) {
    const screen = worldToScreen(planet.x, planet.y, camera, viewport);

    ctx.beginPath();
    ctx.arc(screen.x, screen.y, planet.radius * camera.zoom, 0, Math.PI * 2);
    ctx.fillStyle = planet.color;

    if (!planet.isActive) {
      ctx.fillStyle = "gray";
    }

    ctx.fill();

    if (planet.isFocus) {
      ctx.beginPath();

      ctx.arc(screen.x, screen.y, planet.radius * camera.zoom, 0, Math.PI * 2);

      ctx.strokeStyle = "white";
      ctx.lineWidth = 3;
  
      ctx.stroke();

      if (!planet.isActive) {
        ctx.font = "16px Arial";
        ctx.fillStyle = (coins >= planet.price ? "green" : "red");
        ctx.textAlign = "center";
  
        ctx.fillText(
          `${planet.price}$`,
          screen.x,
          screen.y
        );
      }

    }
  }
}

export function drawStars(farStars, midStars, nearStars, ctx, camera, viewport) {
    for (const farStar of farStars) {
      const screen = worldToScreenParallax(farStar.x, farStar.y, camera, viewport, 0.0001);

      ctx.globalAlpha = farStar.opacity;

      ctx.beginPath();
      ctx.arc(screen.x, screen.y, farStar.size, 0, Math.PI * 2);
      ctx.fillStyle = "white";
      ctx.fill();

      ctx.globalAlpha = 1;
      ctx.filter = "none";
    }

    for (const midStar of midStars) {
      const screen = worldToScreenParallax(midStar.x, midStar.y, camera, viewport, 0.005);

      ctx.globalAlpha = midStar.opacity;

      ctx.beginPath();
      ctx.arc(screen.x, screen.y, midStar.size, 0, Math.PI * 2);
      ctx.fillStyle = "white";
      ctx.fill();

      ctx.globalAlpha = 1;
      ctx.filter = "none";
    }

    for (const nearStar of nearStars) {
      const screen = worldToScreenParallax(nearStar.x, nearStar.y, camera, viewport, 0.01);
      ctx.globalAlpha = nearStar.opacity;

      ctx.beginPath();
      ctx.arc(screen.x, screen.y, nearStar.size, 0, Math.PI * 2);
      ctx.fillStyle = "white";
      ctx.fill();

      ctx.globalAlpha = 1;
      ctx.filter = "none";
    }
}

export function drawSun(ctx, sun, camera, viewport) {
  const screen = worldToScreenParallax(sun.x, sun.y, camera, viewport, 0.1);
  ctx.globalAlpha = 1;
  ctx.filter = "blur(10px)";

  ctx.beginPath();
  ctx.arc(screen.x, screen.y, sun.size * camera.zoom / 0.7, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(255, 220, 120, 0.9)";
  ctx.fill();

  ctx.filter = "blur(500px)";
  ctx.globalAlpha = 0.25;
  ctx.beginPath();
  ctx.arc(screen.x, screen.y, 400, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(255, 220, 120, 0.45)";
  ctx.fill();

  ctx.globalAlpha = 1;
  ctx.filter = "none";
}

export function render(coins, sun, farStars, midStars, nearStars, planets, ctx, camera, viewport) {
  ctx.clearRect(0, 0, viewport.width, viewport.height);

  drawStars(farStars, midStars, nearStars, ctx, camera, viewport);
  drawSun(ctx, sun, camera, viewport);
  drawPlanets(coins, planets, ctx, camera, viewport, ctx, camera, viewport);

  requestAnimationFrame(() => {
    render(coins, sun, farStars, midStars, nearStars, planets, ctx, camera, viewport);
  });
}
