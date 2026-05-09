import { useEffect } from "react"

export default function Statistics({ countPlanetsIsOpen, setCountPlanetsIsOpen, token, coins, setCoins, selectedWorld, activeStatisticsMenu, setActiveStatisticsMenu}) {
  useEffect(() => {
    if (!token || !selectedWorld) return;

    async function loadCoins() {
      try {
        const response = await fetch(`http://localhost:5000/worlds/${selectedWorld}/coins`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`
          }});
  
          const data = await response.json();
  
          if (!response.ok) {
            console.log(data.message);
            return;
          }
  
          setCoins(data.coins);

          console.log(data);
      } catch (err) {
        console.error("Ошибка загрузки coins: ", err);
      }
    }

    async function loadOpenPlanets() {
      const response = await fetch(`http://localhost:5000/worlds/${selectedWorld}/planets`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`
        }});

        const data = await response.json();

        if (!response.ok) {
          console.log(data.message);
          return;
        }

        setCountPlanetsIsOpen(Number(data.count));
    }

    loadOpenPlanets();
    loadCoins();
  }, [token, selectedWorld])
  return (
    <div className="statistics">
      <p>Открыто планет: {countPlanetsIsOpen}</p>
      <p>Монеты: {coins}</p>
      <div className={`statistics-extra ${activeStatisticsMenu ? "active" : ""}`}>
        <p>Самая прибыльная планета:</p>
        <p>Средняя скорость добычи: </p>
        <p>Общая прибыль: </p>
      </div>
      <button onClick={() => setActiveStatisticsMenu(prev => !prev)}>{activeStatisticsMenu ? "Меньше": "Больше"}</button>
    </div>
  )
}