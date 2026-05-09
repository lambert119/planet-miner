export function screenToWorld(screenX, screenY, camera, viewport) {
  return {
    x: (screenX - viewport.width / 2) / camera.zoom + camera.x,
    y: (screenY - viewport.height / 2) / camera.zoom + camera.y,
  };
}

export function worldToScreen(worldX, worldY, camera, viewport) {
  return {
    x: (worldX - camera.x) * camera.zoom + viewport.width / 2,
    y: (worldY - camera.y) * camera.zoom + viewport.height / 2,
  };
}

export function createPlanets() {
  return [
    { id: 1, x: 0, y: 0, radius: 100, color: "green", price: 0, name: "Земля", resources: "Железо", nextUpgradeCost: 500, mining_level: 0, isActive: false, isFocus: false, isSelected: false },
    { id: 2, x: 500, y: 180, radius: 80, color: "white", price: 500, name: "Луна", resources: "Железо, медь", nextUpgradeCost: 500, mining_level: 0,isActive: false, isFocus: false, isSelected: false },
    { id: 3, x: -100, y: 500, radius: 100, color: "red", price: 8000, name: "Марс", resources: "Железо, медь", nextUpgradeCost: 8000, mining_level: 0, isActive: false, isFocus: false, isSelected: false },
  ];
}

export function worldToScreenParallax(worldX, worldY, camera, viewport, factor) {
  return {
    x: (worldX - camera.x * factor) * camera.zoom + viewport.width / 2,
    y: (worldY - camera.y * factor) * camera.zoom + viewport.height / 2
  }
}

export function createStars(count, layer) {
  return Array.from({ length: count}, (_, i) => {
    let size;
    let opacity;

    if (layer === "far") {
      size = Math.random() * 0.6 + 0.4;
      opacity = Math.random() * 0.25 + 0.15;
    }

    if (layer === "mid") {
      size = Math.random() * 1 + 0.8;
      opacity = Math.random() * 0.35 + 0.35;
    }

    if (layer === "near") {
      size = Math.random() * 1.6 + 1.4;
      opacity = Math.random() * 0.35 + 0.55;
    }

    return {
      id: `${layer} -${i}`,
      x: Math.random() * 18000 - 9000,
      y: Math.random() * 12000 - 6000,
      size,
      opacity
    };
  })
}

export function createSun(canvas) {
  return {
    x: Math.random() * canvas.width - 300,
    y: Math.random() * canvas.height - 300,
    opacity: Math.random() * 0.35 + 0.55,
    size: 100
  }
}