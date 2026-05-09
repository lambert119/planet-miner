import { useState, useEffect, useRef } from "react";
import "./styles/Game.css";
import Statistics from "./ui/Statistics";
import OptionsButton from "./ui/OptionsButton";
import OptionsMenu from "./ui/OptionsMenu";
import Inventory from "./ui/Inventory";
import PlanetInfo from "./ui/PlanetInfo";
import { createPlanets } from "./engine/world";
import useGameEngine from "./hooks/useGameEngine";
import PlanetMenu from "./ui/PlanetMenu";


export default function Game({ setIsAuthorization, setSelectedWorld, user, token, setToken, selectedWorld, worlds, setWorlds}) {
  const [activeStatisticsMenu, setActiveStatisticsMenu] = useState(false);
  const [optionsActive, setOptionsActive] = useState(false);
  const [inventoryActive, setInventoryActive] = useState(false);
  const [planetInfoActive, setPlanetInfoActive] = useState(false);
  const [selectedPlanet, setSelectedPlanet] = useState(null);
  const [resources, setResources] = useState([]);
  const [coins, setCoins] = useState(null);
  const canvasRef = useRef(null);
  const [planets, setPlanets] = useState(() => createPlanets());
  const [countPlanetsIsOpen, setCountPlanetsIsOpen] = useState(0);
  const ws = useRef(null);

  useEffect(() => {
    if (!token || !selectedWorld) return;

    async function loadPlanets() {
      try {
        const response = await fetch("http://localhost:5000/planet/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({
            world_id: selectedWorld
          })
        });
  
        const data = await response.json();
  
        if (!response.ok) {
          console.log(data.message);
          return;
        }

        console.log("Загруженные планеты", data);
  
        const activePlanets = data.planets ?? [];
  
        setPlanets(prev =>
          prev.map(planet => {
            const dbPlanet = activePlanets.find(
              p => p.planet_id === planet.id
            );

            return {
              ...planet,
              isActive: Boolean(dbPlanet),
              mining_level: dbPlanet?.mining_level ?? planet.mining_level,
              nextUpgradeCost: dbPlanet?.nextUpgradeCost ?? planet.nextUpgradeCost
            };
          })
        );
      } catch (err) {
        console.error("Ошибка загрузки planets: ", err);
      }
    }

    function webSocketConnection() {
      ws.current = new WebSocket(`ws://localhost:5000?token=${token}`);

      ws.current.onopen = () => {
        console.log("Websocket connected");
        ws.current.send(JSON.stringify({
          event: "connection",
          world_id: selectedWorld,
        }));
      }

      ws.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          switch (data.event) {
            case 'resources_update':
              setResources(data.resources);
              break;
          }
        } catch (err) {
          console.error("Ошибка парсинга WS: ", err);
        }
      }

      ws.current.onclose = (event) => {
        console.log(`Ws closed: ${event.code}, ${event.reason}`);
      }
    }

    webSocketConnection();
    loadPlanets();

    return () => {
      if (ws.current && ws.current.readyState === WebSocket.OPEN) {
        ws.current.close();
      }
    }
  }, [token, selectedWorld])

  useGameEngine(coins, canvasRef, planets, setSelectedPlanet);

  return (
    <div className="game">
      {!optionsActive && (
        <>
          <Statistics countPlanetsIsOpen={countPlanetsIsOpen} setCountPlanetsIsOpen={setCountPlanetsIsOpen} token={token} selectedWorld={selectedWorld} coins={coins} setCoins={setCoins} setActiveStatisticsMenu={setActiveStatisticsMenu} activeStatisticsMenu={activeStatisticsMenu}/>
          <OptionsButton setSelectedPlanet={setSelectedPlanet} setOptionsActive={setOptionsActive} setInventoryActive={setInventoryActive}/>
          <Inventory setSelectedPlanet={setSelectedPlanet} setCoins={setCoins} token={token} selectedWorld={selectedWorld} inventoryActive={inventoryActive} setInventoryActive={setInventoryActive} resources={resources} setResources={setResources}/>
        </>
      )}
      <OptionsMenu setWorlds={setWorlds} user={user} setIsAuthorization={setIsAuthorization} setToken={setToken} token={token} selectedWorld={selectedWorld} setSelectedWorld={setSelectedWorld} worlds={worlds} setOptionsActive={setOptionsActive} optionsActive={optionsActive}/>
      <PlanetMenu planetInfoActive={planetInfoActive} setPlanetInfoActive={setPlanetInfoActive} setCountPlanetsIsOpen={setCountPlanetsIsOpen} coins={coins} setCoins={setCoins} ws={ws} selectedWorld={selectedWorld} token={token} selectedPlanet={selectedPlanet} setSelectedPlanet={setSelectedPlanet} planets={planets} setPlanets={setPlanets}/>
      <PlanetInfo planetInfoActive={planetInfoActive} setPlanetInfoActive={setPlanetInfoActive} selectedPlanet={selectedPlanet}/>
      <canvas 
        ref={canvasRef}
        style={{
          width: "100vw",
          height: "100vh",
          display: "block"
        }}
        />
    </div>
  )
}
