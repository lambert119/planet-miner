import { useEffect, useRef } from "react";
import { screenToWorld, worldToScreen, createPlanets, createStars, createSun } from "../engine/world";
import { resizeCanvas } from "../engine/resizeCanvas";
import { drawPlanets } from "../engine/render";
import { setupInput } from "../engine/input";
import { render } from "../engine/render";

export default function useGameEngine(coins, canvasRef, planets, setSelectedPlanet) {
  const starsRef = useRef(null);
  const sunRef = useRef(null);
  const camera = useRef({
    x: 0,
    y: 0,
    zoom: 0.7,
    isDragging: false,
    dragStartX: 0,
    dragStartY: 0,
    startCameraX: 0,
    startCameraY: 0
  });

  useEffect(() => {
    /** @type {HTMLCanvasElement} */
    const canvas = canvasRef.current;
    /** @type {CanvasRenderingContext2D} */
    const ctx = canvas.getContext("2d");

    if (!starsRef.current) {
      starsRef.current = {
        farStars: createStars(1500, "far"),
        midStars: createStars(1000, "mid"),
        nearStars: createStars(400, "near")
      };
    }

    if (!sunRef.current) {
      sunRef.current = createSun(canvas);
    }

    const viewport = {
      width: 0,
      height: 0
    }

    function handleResize() {
      resizeCanvas(canvas, viewport, ctx);
    }

    window.addEventListener("resize", handleResize);

    const cleanupInput = setupInput(canvas, camera.current, viewport, planets, setSelectedPlanet);

    handleResize();
    render(coins, sunRef.current, starsRef.current.farStars, starsRef.current.midStars, starsRef.current.nearStars, planets, ctx, camera.current, viewport)

    return () => {
      cleanupInput();
      window.removeEventListener("resize", handleResize);
    }
  }, [planets]);
}