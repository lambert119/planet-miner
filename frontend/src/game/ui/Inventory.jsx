import { useEffect } from "react";
import "../styles/Inventory.css";

export default function Inventory({ token, setSelectedPlanet, setCoins, selectedWorld, inventoryActive, setInventoryActive, resources, setResources }) {

  async function sellResource(resource_id) {
    const response = await fetch("http://localhost:5000/resources/", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        world_id: selectedWorld,
        resource_id: resource_id
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.log(data.message);
      return;      
    }
    setCoins(data.coins);
  }

  return (
    <div className="inventory-container">
      <div className={`inventory ${inventoryActive ? "active" : ""}`}>
        <div className="inventory-header">
          <h2>Название</h2>
          <p>количество</p>
          <button onClick={() => setInventoryActive(false)}>
            <svg 
            width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M6 6L18 18M18 6L6 18"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
        <div className="inventory-wrapper">
          {resources.length === 0 ? (
            <p>Ресурсов пока нет</p>
          ) : (
            resources.map((item, i) => (
              <div className="item" key={item.resource_id}>
                <h2>{item.name}</h2>
                <p>{item.amount}</p>
                <button onClick={() => sellResource(item.resource_id)}>Продать</button>
              </div>
            ))
          )}
        </div>
      </div>
      <div className={`inventory-button ${inventoryActive ? "hidden" : ""}`}>
        <button onClick={() => {
          setInventoryActive(true);
          setSelectedPlanet(null);}}>
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <rect x="7" y="9" width="18" height="16" rx="3" stroke="currentColor" strokeWidth="2"/>
            <path d="M11 9V7C11 5.89543 11.8954 5 13 5H19C20.1046 5 21 5.89543 21 7V9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <path d="M7 14H25" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <path d="M13 18H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
      </div>
    </div>
  )
}