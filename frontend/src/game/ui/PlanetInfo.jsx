import { useState } from "react";
import "../styles/PlanetInfo.css";

export default function PlanetInfo({planetInfoActive, setPlanetInfoActive, selectedPlanet}) {
  const [planetPreviewActive, setPlanetPreviewActive] = useState(false);
  return (
    <div className={`planet-info ${planetInfoActive && selectedPlanet ? "active" : ""}`}>
      <div className="planet-info-container">
        <div className="planet-info-close-button">
        <button onClick={() => {
          setPlanetInfoActive(prev => !prev);
          setPlanetPreviewActive(false)}}>
          <svg 
            width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M6 6L18 18M18 6L6 18"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
        </button>
        </div>
        <div className="planet-info-wrapper">
          <button 
          className={`planet-preview ${planetPreviewActive ? "active" : ""}`}
          onClick={() => setPlanetPreviewActive(prev => !prev)}
          >
            <p>{selectedPlanet?.name}</p>
            <span 
            className="selected-planet"
            style={{ backgroundColor: selectedPlanet?.color }}
            ></span>
            <div className={`planet-preview-over ${planetPreviewActive ? "active" : ""}`}>
              <p>Радиус: {selectedPlanet?.radius}</p>
              <h2>Цена: {selectedPlanet?.price}</h2>
            </div>
          </button>
          <div className={`planet-stats ${planetPreviewActive ? "active" : ""}`}>
            <h1>Уровень добычи: {selectedPlanet?.mining_level}</h1>
            <h3>Стоимость следующего улучшения: ${selectedPlanet?.nextUpgradeCost}</h3>
            <h3>Ресурсы планеты: {selectedPlanet?.resources}</h3>
          </div>
        </div>
      </div>
    </div>
  );
}