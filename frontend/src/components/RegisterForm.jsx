import { useState } from "react";
import "../styles/Form.css";

export default function RegisterForm({ setUser, setToken, setIsAuthorization, switchForm, openWorldMenu }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  async function register() {
    const response = await fetch("http://localhost:5000/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username,
        password
      })
    });

    const data = await response.json();
    console.log(data);
    
    if (!response.ok) {
      console.log(data.message);
      return;
    }

    setUser(data.user);
    setToken(data.token);
    setIsAuthorization(true);
    openWorldMenu(true);
    
  }
  return (
    <div className="lr-form">
      <div className="form-container">
        <div className="switchMenu-register">
          <button
          className="switch-button" 
          onClick={() => switchForm(false)}
          >
            Логин
          </button>
          <h1>Регистрация</h1>
        </div>
        <div className="input-container">
          <div className="input-group">
            <input 
            type="text"
            placeholder=" "
            onChange={(e) => setUsername(e.target.value)}
            required />
            <label>Логин</label>
          </div>
          <div className="input-group">
            <input 
            type="text"
            placeholder=" "
            onChange={(e) => setPassword(e.target.value)}
            required />
            <label>пароль</label>
          </div>
        </div>
        <div className="button-wrapper">
          {username !== "" && password !== "" && (
            <>
              <button onClick={register}className="lr-button">Зарегестрироваться</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}