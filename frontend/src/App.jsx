import { useState } from "react";
import "./App.css";
import FormMenu from "./components/FormMenu";
import WorldMenu from "./components/WorldMenu";
import Game from "./game/Game";
import { useEffect } from "react";

export default function App() {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [isAuthorization, setIsAuthorization] = useState(false);
  const [selectedWorld, setSelectedWorld] = useState(null);
  const [worlds, setWorlds] = useState([]);

  return (
  isAuthorization && selectedWorld !== null
    ? (
        <Game
          setWorlds={setWorlds}
          setIsAuthorization={setIsAuthorization}
          setSelectedWorld={setSelectedWorld}
          user={user}
          setToken={setToken}
          token={token}
          selectedWorld={selectedWorld}
          worlds={worlds}
        />
      )
    : (
        <FormMenu
          setUser={setUser}
          token={token}
          setToken={setToken}
          isAuthorization={isAuthorization}
          setIsAuthorization={setIsAuthorization}
          setSelectedWorld={setSelectedWorld}
          worlds={worlds}
          setWorlds={setWorlds}
        />
      )
);
}