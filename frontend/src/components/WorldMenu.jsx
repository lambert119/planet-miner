
import { useState, useEffect } from "react";
import "../styles/WorldMenu.css";

export default function WorldMenu({ startGame, setSelectedWorld, setWorlds, worlds, token}) {
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

    setWorlds(prev => prev.filter(world => world.id !== id));
  }


  async function createWorld() {
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

  function selectWorld(id) {
    startGame(id);
  }

  return (
    <div className="world-menu">
      <div className="world-menu-wrapper">
        <h1>{creatingWorld ? "Создание мира" : "Выберите мир"}</h1>

        {creatingWorld 
        ?
        <div className="create-world-menu">
          <div className="input-wrapper">
            <input 
              type="text"
              placeholder=" "
              onChange={(e) => setNewWorldName(e.target.value)}
              required/>
            <label>Название мира</label>
          </div>

            {newWorldName !== "" && 
            <button onClick={createWorld}>Создать мир</button>
            }

        </div>

        :
        <div className="worlds-array">
          {worlds.map((world, i) => (
            <div 
              className="world-item" 
              key={world.id}
              style={{ animationDelay: `${i * 0.1}s`}}
            >
              <button 
              className="item-container"
              onClick={() => selectWorld(world.id)}>
                <h2>{world.name}</h2>
                <div className="item-wrapper">
                  <p>{world.coins}</p>
                  <p>{new Date(world.created_at).toLocaleDateString()}</p>
                </div>
              </button>
              <button className="delete-world-button" onClick={() => deleteWorld(world.id)}>Удалить</button>
            </div>

          )
          )}
        </div>
        }
        <button className="create-world-button" onClick={() => setCreatingWorld(!creatingWorld)}>{creatingWorld ? "Выбор мира" : "Создать мир"}</button>
      </div>
    </div>
  )
}