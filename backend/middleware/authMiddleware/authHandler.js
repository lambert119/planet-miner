function authHandler(req, res, next) {
  const { username, password } = req.body;

  if (username == null || password == null) {
    return res.status(400).json({ message: "Поля не должны быть пустыми" });
  }

  if (typeof username !== "string" || typeof password !== "string") {
    return res.status(400).json({ message: "Поля должны быть строками" });
  }

  const trimmedUsername = username.trim();
  const trimmedPassword = password.trim();

  if (trimmedUsername === "" || trimmedPassword === "") {
    return res.status(400).json({ message: "Поля не должны быть пустыми" });
  }

  req.body.username = trimmedUsername;
  req.body.password = trimmedPassword;

  next();
}

module.exports = authHandler;