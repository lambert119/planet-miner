const pool = require("../db");

async function getMyResources(req, res) {
  const userId = req.user.id;
  const worldId = req.worldId;

  const { rows } = await pool.query(
    `SELECT 
      wr.resource_id,
      r.name AS name,
      wr.amount,
      r.price
    FROM world_resources wr
    JOIN worlds w ON wr.world_id = w.id
    JOIN resources r ON wr.resource_id = r.id
    WHERE w.user_id = $1 
    AND w.id = $2`,
    [userId, worldId]
  );

  res.json(rows);
}

async function sellResource(req, res) {
  const worldId = req.worldId;
  const resourceId = req.resourceId;
  const userId = req.user.id;

  const { rows } = await pool.query(
    `WITH sold AS (
      SELECT 
        COALESCE(SUM(r.price * wr.amount), 0) AS coins
      FROM world_resources wr
      JOIN resources r ON wr.resource_id = r.id
      JOIN worlds w ON wr.world_id = w.id
      WHERE wr.world_id = $2
      AND wr.resource_id = $1
      AND w.user_id = $3
    ),

    reset AS (
      UPDATE world_resources wr
      SET amount = 0
      FROM worlds w
      WHERE wr.world_id = w.id
      AND wr.world_id = $2
      AND wr.resource_id = $1
      AND w.user_id = $3
    ),

    update_coins AS (
      UPDATE worlds
      SET coins = coins + (SELECT coins FROM sold)
      WHERE id = $2
      AND user_id = $3
      RETURNING coins
    )

    SELECT coins FROM update_coins;`,
    [resourceId, worldId, userId]
  );

  if (rows.length === 0) {
    return res.status(400).json({ message: "Мир не найден" });
  }

  res.json({
    message: "Успешная продажа",
    coins: Number(rows[0].coins)
  })
}



module.exports = {
  getMyResources,
  sellResource
};