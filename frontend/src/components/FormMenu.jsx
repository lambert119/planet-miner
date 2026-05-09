import { useState } from "react";
import "../styles/FormMenu.css";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import WorldMenu from "./WorldMenu";


function createStars(count, layer) {
  return Array.from({ length: count }, (_, i) => {
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
      id: `${layer}-${i}`,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: `${size}px`,
      opacity,
    };
  });
}

 const farStars = createStars(500, "far");
 const midStars = createStars(300, "mid");
 const nearStars = createStars(200, "near");

export default function FormMenu({ setUser, token, setToken, isAuthorization, setIsAuthorization, setSelectedWorld, worlds, setWorlds }) {
  const [shift, setShift] = useState(0);
  const [isRegister, setIsRegister] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [formIsActive, setformIsActive] = useState(false);
  const [introFinished, setIntroFinished] = useState(false);
  const [formChangeFinished, setFormChangeFinished] = useState(false);
  const [worldMenuFinished, setWorldMenuFinished] = useState(false);
  const [isWorldMenu, setIsWorldMenu] = useState(false);
  const [isStartGame, setIsStartGame] = useState(false);

  const switchForm = (value) => {
    setWorldMenuFinished(false);
    setFormChangeFinished(false);

    setTimeout(() => {
      setIsRegister(value);
      setZoom(1.5);
      setShift(value ? 5 : -5);
    }, 300);

    setTimeout(() => {
      setFormChangeFinished(true);
    }, 1700);
  }

  const openWorldMenu = (value) => {
    setFormChangeFinished(false);
    setWorldMenuFinished(false);

    setTimeout(() => {
      setIsWorldMenu(value);
      setZoom(2);
      setShift(0);
    }, 300);

    setTimeout(() => {
      setWorldMenuFinished(true);
    }, 1700)
  }

  const startGame = (id) => {
    setWorldMenuFinished(false);
    setFormChangeFinished(false);
    setIsStartGame(true);

    setTimeout(() => {
      setIsWorldMenu(false);
      setZoom(1);
      setShift(0);
    }, 300);

    setTimeout(() => {
      setformIsActive(false);
    }, 400);

    setTimeout(() => {
      setSelectedWorld(id);
    }, 2500);
  }

  

  return (
    <div className={`form ${formIsActive ? "active" : ""}`}>
      <div className={`space ${formIsActive ? "active" : ""}`}>
        <div className="world"
        style={{ transform: `scale(${zoom})`}}>
          <div className="light light-blue"></div>
          <div className="light light-purple"></div>
          <div 
          className="stars-layer far"
          style={{ 
            transform: `translateX(${shift * 10}px) scale(${zoom * 0.8})`
            }}>
            {farStars.map((star) => (
              <span 
                key={star.id}
                className="star"
                style={{
                  left: star.left,
                  top: star.top,
                  width: star.size,
                  height: star.size,
                  opacity: star.opacity,
                }}/>
            ))}
            </div>
            <div 
            className="stars-layer mid"
            style={{ 
              transform: `translateX(${shift * 40}px) scale(${zoom * 1})`
              }}>
              {midStars.map((star) => (
                <span 
                  key={star.id}
                  className="star"
                  style={{
                    left: star.left,
                    top: star.top,
                    width: star.size,
                    height: star.size,
                    opacity: star.opacity,
                  }}/>
              ))}
            </div>
            <div 
            className="stars-layer near"
            style={{ 
              transform: `translateX(${shift * 80}px) scale(${zoom * 1.2})`
              }}>
            {nearStars.map((star) => (
              <span 
                key={star.id}
                className="star"
                style={{
                  left: star.left,
                  top: star.top,
                  width: star.size,
                  height: star.size,
                  opacity: star.opacity,
                }}/>
            ))}
          </div>
          <div className="vignette"></div>
        </div>
      </div>
        <div className="button-container">
          {!formIsActive && !isStartGame && (
            <>
              <button 
              onClick={() => {
                setformIsActive(true);
                setTimeout(() => {
                  setIntroFinished(true);
                }, 4000)
                }}>начать</button>
            </>
          )}

          {isRegister == null && formIsActive === true && introFinished === true && (
            <div className="form-selection">
              <button 
              onClick={() => {
                setIsRegister(true);
                setZoom(1.5);
                setShift(5);
                setFormChangeFinished(false)

                setTimeout(() => {
                  setFormChangeFinished(true);
                }, 1700)
              }}
              onMouseEnter={() => {
                setZoom(1.1);
                setShift(1);
              }}
              onMouseLeave={() => {
                setZoom(1);
                setShift(0);
              }}
              >Регистрация</button>
              <button 
              onClick={() => {
                setIsRegister(false);
                setZoom(1.5);
                setShift(-5);
                setFormChangeFinished(false)

                setTimeout(() => {
                  setFormChangeFinished(true);
                }, 1700)
                }}

              onMouseEnter={() => {
                setZoom(1.1);
                setShift(-1);
              }}
              onMouseLeave={() => {
                setZoom(1);
                setShift(0);
              }}
              >Вход</button>
            </div>
          )}
        </div>
        <div className={`selectedForm ${formChangeFinished && !isAuthorization ? "show" : "hide"}`}>
          {isRegister && !isWorldMenu && <RegisterForm setUser={setUser} setToken={setToken} setIsAuthorization={setIsAuthorization} switchForm={switchForm} openWorldMenu={openWorldMenu}/>}
          {!isRegister && !isWorldMenu &&<LoginForm setUser={setUser} setToken={setToken} setIsAuthorization={setIsAuthorization} switchForm={switchForm} openWorldMenu={openWorldMenu}/>}
        </div>
        <div className={`selectWorldMenu ${worldMenuFinished ? "show" : "hide"}`}>
          {isWorldMenu && isAuthorization && <WorldMenu startGame={startGame} token={token} setSelectedWorld={setSelectedWorld} worlds={worlds} setWorlds={setWorlds}/>}
        </div>
    </div>
  );
}