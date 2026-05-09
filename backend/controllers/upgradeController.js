const pool = require("../db");

async function upgradePlanetMiningLevel(req, res) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const userId = req.user.id;
    const worldId = req.worldId;
    const planetId = req.planetId;

    const { rows} = await client.query(
      `SELECT 
        wpu.mining_level AS mining_level,
        p.price AS price,
        w.coins AS coins
      FROM world_planets_upgrades wpu
      JOIN planets p ON wpu.planet_id = p.id
      JOIN worlds w ON wpu.world_id = w.id
      WHERE wpu.world_id = $1 AND wpu.planet_id = $2 AND w.user_id = $3
      FOR UPDATE`,
      [worldId, planetId, userId]
    );

    if (rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(400).json({ message: "Мир или планета отсутсвуют" });
    }

    const price = Number(rows[0].price);
    const mining_level = Number(rows[0].mining_level);
    const coins = Number(rows[0].coins);

    const upgradeCost = (price === 0 ? 500 : price) * mining_level;

    if (coins < upgradeCost) {
      await client.query("ROLLBACK");
      return res.status(400).json({ message: "Недостаточно монет" });
    }

    const newMiningLevel = mining_level + 1;
    const newCoins = coins - upgradeCost;

    await client.query(
      `UPDATE world_planets_upgrades
      SET mining_level = $1
      WHERE world_id = $2 AND planet_id = $3`,
      [newMiningLevel, worldId, planetId]
    );

    await client.query(
      `UPDATE worlds
      SET coins = $1
      WHERE id = $2 AND user_id = $3`,
      [newCoins, worldId, userId]
    );

    await client.query("COMMIT");

    const nextUpgradeCost = (price === 0 ? 500 : price) * newMiningLevel;

    res.status(200).json({
      message: "Успешное улучшение планеты",
      mining_level: newMiningLevel,
      coins: newCoins,
      planet_id: planetId,
      nextUpgradeCost: nextUpgradeCost
    })
  } catch(err) {
    await client.query("ROLLBACK");
    console.error("Ошибка улучшения планеты:", err);
    return res.status(500).json({ message: "Ошибка сервера" });
  } finally {
    client.release();
  }
}

module.exports = {
  upgradePlanetMiningLevel,
};