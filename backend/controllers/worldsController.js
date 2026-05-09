const pool = require("../db");

async function getMyWorlds(req, res) {
  const userId = req.user.id;

  const { rows } =  await pool.query(
    `SELECT 
      id, 
      name, 
      coins, 
      created_at 
    FROM worlds 
    WHERE user_id = $1
    ORDER BY created_at DESC`,
    [userId]
  );

  res.status(200).json(rows);
}

async function createWorld(req, res) {
  const userId =  req.user.id;
  const { name } = req.body;

  const { rows } = await pool.query(
    `INSERT INTO worlds 
    (user_id, name) 
    VALUES ($1, $2)
    RETURNING id, name, coins, created_at`,
    [userId, name]
  );

  res.status(201).json({ 
    message: "Мир создан",
    world: rows[0]
  })
}

async function deleteWorld(req, res) {
  const userId = req.user.id;
  const { id } = req.body;

  const { rows } = await pool.query(
    `DELETE FROM worlds
    WHERE id = $1 AND
    user_id = $2
    RETURNING id`,
    [id, userId]
  );

  if (rows.length === 0) {
    return res.status(404).json({ message: "Мир не найден" });
  }

  res.json({
    message: "Мир удалён",
    id: rows[0].id
  });
}

async function getMyCoins(req, res) {
  const userId = req.user.id;
  const worldId = Number(req.params.id);

  if (worldId <= 0 || !Number.isInteger(worldId)) {
    return res.status(404).json({ message: "world_id некорректный или отсутствует" });
  }

  const { rows } = await pool.query(
    `SELECT coins
    FROM worlds
    WHERE user_id = $1 AND id = $2`,
    [userId, worldId]
  );

  if (rows.length === 0) {
    return res.status(400).json({ message: "Мир не найден" });
  }

  res.json({
    coins: rows[0].coins
  })
}

async function getCountPlanets(req, res) {
  const worldId = Number(req.params.id);
  const userId = req.user.id;

  if (worldId <= 0 || !Number.isInteger(worldId)) {
    return res.status(400).json({ message: "world_id некорректный или отсутствует" });
  }

  const { rows } = await pool.query(
    `SELECT count(*) AS count
    FROM world_planets
    JOIN worlds ON world_planets.world_id = worlds.id
    WHERE world_planets.world_id = $1 AND worlds.user_id = $2`,
    [worldId, userId]
  );

  res.json({
    count: rows[0].count
  })
}

module.exports = {
  getMyWorlds,
  createWorld,
  deleteWorld,
  getMyCoins,
  getCountPlanets
};