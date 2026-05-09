require("dotenv").config();
const pool = require("../db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const JWT_SECRET = process.env.JWT_SECRET;

async function login(req, res) {
  const user = req.user;

  const token = jwt.sign(
    {
      id: user.id,
      username: user.username,
      role: user.role 
    },
    JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.json({
    message: "Успешный вход",
    token,
    user: {
      id: user.id,
      username: user.username,
      role: user.role
    }
  });
}

async function register(req, res) {
  
  try {
    const { username, password } = req.body;
    
    const passwordHash = await bcrypt.hash(password, 10);

    const result = await pool.query(
      "INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING id, username, role",
      [username, passwordHash]
    );
    
    const user = result.rows[0];

    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        role: user.role
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Успешная регистрация",
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role
      }
    });

  } catch (err) {
    if (err.code === "23505") {
      return res.status(409).json({ message: "Пользователь уже существует" });
    }
  }
}

module.exports = {
  login,
  register
};