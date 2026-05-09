export function resizeCanvas(canvas, viewport, ctx) {
  const rect = canvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;

  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;

  viewport.width = rect.width;
  viewport.height = rect.height;

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}