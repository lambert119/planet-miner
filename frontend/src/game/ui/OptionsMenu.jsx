import { useState, useEffect } from "react";
import "../styles/OptionsMenu.css";

export default function OptionsMenu({ user, setIsAuthorization, setToken, token, selectedWorld, setSelectedWorld, setWorlds, worlds, setOptionsActive, optionsActive }) {
  const [menuState, setMenuState] = useState("change-world");
  const [creatingWorld, setCreatingWorld] = useState(false);
  const [newWorldName, setNewWorldName] = useState("");

  useEffect(() => {
      async function loadWorlds() {
        const response = await fetch("http://localhost:5000/worlds/", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
  
        const data = await response.json();
        console.log(data);
  
        if (!response.ok) {
          console.log(data.message);
          return;
        }
  
        setWorlds(data);
        console.log("worlds" ,worlds);
      }
  
      if (token) {
        loadWorlds();
      }
    }, [token])
  
    async function deleteWorld(worldId) {
      const response = await fetch("http://localhost:5000/worlds/", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          id: worldId
        })
      });
  
      const data = await response.json();
      console.log(data);
  
      if (!response.ok) {
        console.log(data.message);
        return;
      }
  
      const id = data.id;

      if (selectedWorld === Number(id)) {
        setSelectedWorld(null);
        setIsAuthorization(false);
        setToken(null);
      }
  
      setWorlds(prev => prev.filter(world => world.id !== id));
    }
  
  
    async function createWorld() {
      if (newWorldName === "") return;
      const response = await fetch("http://localhost:5000/worlds/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          name: newWorldName
        })
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        console.log(data.message);
        return;
      }
  
      const newWorld = data.world;
      setWorlds(prev => [newWorld, ...prev]);
      setCreatingWorld(false);
    }

  return (
    <div className={`options-menu ${optionsActive ? "active" : ""}`}>
      <div className="options-navigation">
        <button onClick={() => setMenuState("change-world")}>Сменить мир</button>
        <button onClick={() => setMenuState("help")}>Помощь</button>
        <button onClick={() => setMenuState("profile")}>Профиль</button>
        <button className="close-button">
          <svg 
          width="24" height="24" viewBox="0 0 24 24" fill="none"
          onClick={() => setOptionsActive(false)}>
            <path
              d="M6 6L18 18M18 6L6 18"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>
        {creatingWorld ? 
        <div className="create-world-menu-options-menu">
          <div className="input-wrapper">
            <input
            type="text"
            placeholder=" "
            onChange={(e) => setNewWorldName(e.target.value)}/>
            <label>Название мира</label>
          </div>
            <button
            className={newWorldName === "" ? "" : "active"} 
            onClick={() => {
              createWorld();
              if (newWorldName !== "") {
                setCreatingWorld(false)
              }}}>Создать</button>
        </div>
      :
        <div className="menu">
          {menuState === "change-world" && 
          <div className="change-menu-wrapper">
            {worlds.map( (world) => (
              <div 
              className="change-world-item" 
              key={world.id}
              onClick={() => setSelectedWorld(world.id)}>
                <button className="change-world-item-wrapper">
                  <h1>{world.name}</h1>
                  <p>Монеты: {world.coins}</p>
                  <p>{new Date(world.created_at).toLocaleDateString()}</p>
                </button>
                <button
                className="delete-world-button"
                onClick={() => deleteWorld(world.id)}>Удалить</button>
              </div>
            ))}

          </div>
            }
          {menuState === "help" && <div></div>}
          {menuState === "profile" && 
          <div className="exit-button">
            <button onClick={() => {
              setToken(null);
              setIsAuthorization(false);
              setSelectedWorld(null);
            }}>
              выйти
            </button>
          </div>}
        </div>
      
      }      
            <div className="change-world-create-world-button">
              <button onClick={() => setCreatingWorld(!creatingWorld)}>
                {creatingWorld ? "Назад" : "Создать мир"}
              </button>
            </div>
    </div>
  )
}