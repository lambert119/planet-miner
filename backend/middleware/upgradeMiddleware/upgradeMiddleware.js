const pool = require("../../db");

async function upgradeMiddleware(req, res, next) {
  const { world_id, planet_id } = req.body;
  const worldId = Number(world_id);
  const planetId = Number(planet_id);

  if (world_id == null || planet_id == null || !Number.isInteger(worldId) || !Number.isInteger(planetId) || worldId <= 0 || planetId <= 0) {
    return res.status(400).json({ message: "world_id или planet_id некорректны или отсутсвуют" });
  }

  const { rows } = await pool.query(
    `SELECT * FROM world_planets_upgrades
    WHERE world_id = $1 AND planet_id = $2`,
    [worldId, planetId]
  );

  if (rows.length === 0) {
    return res.status(400).json({ message: "world_id или planet_id отсутсвуют в таблице" });
  }

  req.worldId = worldId;
  req.planetId = planetId;
  
  next();
}

module.exports = upgradeMiddleware;