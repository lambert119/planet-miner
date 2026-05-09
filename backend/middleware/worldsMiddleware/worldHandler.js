function worldHandler(req, res, next) {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Имя пустое" });
  }

  if (typeof name !== "string") {
    return res.status(400).json({ message: "Имя должно быть строкой" });
  }

  const trimmedName = name.trim();

  if (trimmedName === "") {
    return res.status(400).json({ message: "Имя пустое" });
  }

  req.body.name = trimmedName;

  next();
}

module.exports = worldHandler;