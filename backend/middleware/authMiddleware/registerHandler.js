const pool = require("../../db");

async function registerHandler(req, res, next) {
  const { username, password } = req.body;

  const existingUser = await pool.query(
    "SELECT * FROM users WHERE username = $1",
    [username]
  );

  if (existingUser.rows.length > 0) {
    return res.status(400).json({ message: "Пользователь уже существует" });
  }

  next();
}

module.exports = registerHandler;