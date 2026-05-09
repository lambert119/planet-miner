import { screenToWorld, worldToScreen } from "./world";

export function setupInput(canvas, camera, viewport, planets, setSelectedPlanet) {

  function handleClick(event) {
    const rect = canvas.getBoundingClientRect();

    const screenX = event.clientX - rect.left;
    const screenY = event.clientY - rect.top;

    const world = screenToWorld(screenX, screenY, camera, viewport);

    let clickedPlanet = null;

    for (const planet of planets) {
      planet.isSelected = false;

      const dx = world.x - planet.x;
      const dy = world.y - planet.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance <= planet.radius) {
        clickedPlanet = planet;
      }
    }

    if (clickedPlanet) {
      const screen = worldToScreen(
        clickedPlanet.x,
        clickedPlanet.y,
        camera,
        viewport
      );


      clickedPlanet.isSelected = true;

      setSelectedPlanet({
        ...clickedPlanet,
        screenX: screen.x,
        screenY: screen.y - (clickedPlanet.radius + 30) * camera.zoom
      });
    } else {
      setSelectedPlanet(null);
    }
  }

  function updateSelectedPlanetMenu() {
    const selectedPlanet = planets.find(planet => planet.isSelected);

    if (!selectedPlanet) return;

    const screen = worldToScreen(
      selectedPlanet.x,
      selectedPlanet.y,
      camera,
      viewport
    );


    setSelectedPlanet({
      ...selectedPlanet,
      screenX: screen.x,
      screenY: screen.y - (selectedPlanet.radius + 30) * camera.zoom
    });
  }

    function handleMouseUp() {
      camera.isDragging = false;
    }

    function handleMouseDown(event) {
      camera.isDragging = true;

      camera.dragStartX = event.clientX;
      camera.dragStartY = event.clientY;

      camera.startCameraX = camera.x;
      camera.startCameraY = camera.y;
    }

    function handleMouseMove(event) {
      if (camera.isDragging) {
        const currentMouseX = event.clientX;
        const currentMouseY = event.clientY;

        const dx = currentMouseX - camera.dragStartX;
        const dy = currentMouseY - camera.dragStartY;

        camera.x = camera.startCameraX - dx / camera.zoom;
        camera.y = camera.startCameraY - dy / camera.zoom;

        updateSelectedPlanetMenu();
      }
      
      if (!camera.isDragging) {
      const rect = canvas.getBoundingClientRect();

      const screenX = event.clientX - rect.left;
      const screenY = event.clientY - rect.top;

      const world = screenToWorld(screenX, screenY, camera, viewport);

      for (const planet of planets) {
        planet.isFocus = false;
        const dx = world.x - planet.x;
        const dy = world.y - planet.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance <= planet.radius) {
          planet.isFocus = true;
        }
      }
      }
    }

    function handleWheel(event) {
      event.preventDefault();

      const rect = canvas.getBoundingClientRect();

      const screenX = event.clientX - rect.left;
      const screenY = event.clientY - rect.top;

      const beforeZoomWorld = screenToWorld(screenX, screenY, camera, viewport);

      if (event.deltaY < 0) {
        camera.zoom += 0.1;
      } else {
        camera.zoom -= 0.1;
      }

      camera.zoom = Math.max(0.2, Math.min(camera.zoom, 1.5));

      const afterZoomWorld = screenToWorld(screenX, screenY, camera, viewport);

      camera.x += beforeZoomWorld.x - afterZoomWorld.x;
      camera.y += beforeZoomWorld.y - afterZoomWorld.y;
      updateSelectedPlanetMenu();
    }

    canvas.addEventListener("click", handleClick);
    canvas.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      canvas.removeEventListener("click", handleClick);
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      canvas.removeEventListener("wheel", handleWheel);
    }
}