import { useState, useEffect } from "react";
import "../styles/PlanetMenu.css";

export default function PlanetMenu({ planetInfoActive, setPlanetInfoActive, setCountPlanetsIsOpen, coins, setCoins, ws, selectedWorld, token, selectedPlanet, setSelectedPlanet, planets, setPlanets }) {
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [notEnoughCoins, setNotEnoughCoins] = useState(false);

  useEffect(() => {
    if (selectedPlanet) {
      setMenuPosition({
        x: selectedPlanet.screenX,
        y: selectedPlanet.screenY
      });
    }
  }, [selectedPlanet]);

  async function buyPlanet() {
    if (!selectedWorld || !token || !selectedPlanet) return;

    const response = await fetch("http://localhost:5000/planet/buy", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        world_id: selectedWorld,
        planet_id: selectedPlanet.id
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.log(data.message);
      return;
    }

    setPlanets(prev =>
      prev.map(planet =>
        planet.id === data.planet_id
          ? { ...planet, isActive: true }
          : planet
      )
    );

    setSelectedPlanet(prev => ({
      ...prev,
      isActive: true
    }));

    setCoins(data.coins);
    setCountPlanetsIsOpen(prev => prev + 1);
  }

  async function upgradeSelectedPlanet() {
    if (!selectedPlanet || !selectedWorld) return;
    const response = await fetch("http://localhost:5000/upgrade/mining", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        world_id: selectedWorld,
        planet_id: selectedPlanet.id
      })
    });
    
    const data = await response.json();

    if (!response.ok) {
      console.log(data.message);
      return;
    }
    
    console.log("DATA: ", data);

    setCoins(data.coins);
    setPlanets(prev =>
      prev.map(planet =>
        planet.id === data.planet_id
          ? {
              ...planet,
              nextUpgradeCost: data.nextUpgradeCost,
              mining_level: data.mining_level
            }
          : planet
      )
    );

    setSelectedPlanet(prev => ({
      ...prev,
      nextUpgradeCost: data.nextUpgradeCost,
      mining_level: data.mining_level
    }));
  }

  useEffect(() => {
    console.log("planets updated:", planets);
  }, [planets]);

  return (
    <div
      className={`planet-menu ${selectedPlanet && !planetInfoActive ? "active" : ""}`}
      style={{
        left: menuPosition.x,
        top: menuPosition.y
      }}
    >
      <div className="planet-menu-inner">
        {selectedPlanet?.isActive
          ? <div className="upgrade-menu">
            <button onClick={upgradeSelectedPlanet}>
              Добыча
            </button>
            <button>
              Шатл
            </button>
            <button onClick={() => setPlanetInfoActive(true)}>
              Инфо
            </button>
            </div>
          : <div className="upgrade-button">
            <button 
            onClick={() => {
              if (coins < selectedPlanet.price) {
                setNotEnoughCoins(true);

                setTimeout(() => {
                  setNotEnoughCoins(false);
                }, 200);

                return;
              }

              buyPlanet();
            }}
            style={{
              color: notEnoughCoins ? "red" : "white"
            }}
              >купить</button>
            </div>
        }
      </div>
    </div>
  )
}