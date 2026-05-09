const pool = require("../db");

async function buyPlanet(req, res) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const worldId = req.worldId;
    const planetId = req.planetId;
    const userId = req.user.id;

    const { rows } = await client.query(
      `SELECT
        w.coins,
        p.price
      FROM worlds w
      JOIN planets p ON p.id = $2
      WHERE w.id = $1 AND w.user_id = $3
      FOR UPDATE`,
      [worldId, planetId, userId]
    );

    if (rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(400).json({ message: "Мир или планета не найдены" })
    }

    const coins = Number(rows[0].coins);
    const price = Number(rows[0].price);

    if (coins < price) {
      await client.query("ROLLBACK");
      return res.status(400).json({ message: "Не хватает монет" });
    }

    const inserted = await client.query(
      `INSERT INTO world_planets (world_id, planet_id)
      VALUES ($1, $2)
      RETURNING planet_id AS id`,
      [worldId, planetId]
    );

    const insertedPlanetUpgrades = await client.query(
      `INSERT INTO world_planets_upgrades
      (world_id, planet_id, mining_level, shuttle_level)
      VALUES($1, $2, 1, 1)`,
      [worldId, planetId]
    )

    const updatedWorld = await client.query(
      `UPDATE worlds
      SET coins = coins - $1
      WHERE id = $2 AND user_id = $3
      RETURNING coins`,
      [price, worldId, userId]
    );

    await client.query("COMMIT");

    res.status(201).json({
      message: "Планета куплена",
      planet_id: inserted.rows[0].id,
      coins: Number(updatedWorld.rows[0].coins)
    })

  } catch(err) {
    await client.query("ROLLBACK");

    if (err.code === "23505") {
      return res.status(400).json({ message: "Планета уже куплена" });
    }
    
    throw err;
  } finally {
    client.release();
  }
}


async function getMyPlanets(req, res) {
  const userId = req.user.id;
  const worldId = req.worldId;

  const { rows } = await pool.query(
    `SELECT 
    wp.planet_id AS planet_id,
    wpu.mining_level AS mining_level,
    p.price AS price
    FROM world_planets wp
    JOIN worlds w ON wp.world_id = w.id
    JOIN world_planets_upgrades wpu ON wp.world_id = wpu.world_id AND wp.planet_id = wpu.planet_id
    JOIN planets p ON wpu.planet_id = p.id
    WHERE w.user_id = $1 AND wp.world_id = $2`,
    [userId, worldId]
  );

  res.json({
    planets: (rows.map(r => ({
      planet_id: r.planet_id,
      mining_level: r.mining_level,
      nextUpgradeCost:
      (Number(r.price) === 0 ? 500 : Number(r.price)) * Number(r.mining_level)
    }))),
  });
}

module.exports = {
  getMyPlanets,
  buyPlanet
};