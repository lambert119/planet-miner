function getResourcesHandler(req, res, next) {
  const {world_id} = req.body;

  const worldId = Number(world_id);

  if (world_id == null || Number.isNaN(worldId) || worldId <= 0) {
    return res.status(400).json({ message: "world_id некорректный или отсуствует" });
  }

  req.worldId = worldId;
  next();
}

module.exports = getResourcesHandler;