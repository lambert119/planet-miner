const pool = require("../../db");

async function planetHandler(req, res, next) {
  const { world_id, planet_id } = req.body;
  const worldId = Number(world_id);
  const planetId = Number(planet_id);

  if (planet_id == null || world_id == null || !Number.isInteger(planetId) || !Number.isInteger(worldId) || planetId <= 0 || worldId <= 0) {
    return res.status(400).json("planet id или world_id некорректный или отсуствует");
  }

  req.planetId = planetId;
  req.worldId = worldId;

  next();
}

module.exports = planetHandler;