const pool = require("../../db");
const bcrypt = require("bcrypt");

async function loginHandler(req, res, next) {
  const { username, password } = req.body;

  const result = await pool.query(
    "SELECT id, username, password_hash, role FROM users WHERE username = $1",
    [username]
  );

  if (result.rows.length === 0) {
    return res.status(400).json({ message: "Неверный логин или пароль" });
  }

  const user = result.rows[0];

  const isMatch = await bcrypt.compare(password, user.password_hash);

  if (!isMatch) {
    return res.status(400).json({ message: "Неверный логин или пароль" });
  }

  req.user = user;

  next();
}

module.exports = loginHandler;