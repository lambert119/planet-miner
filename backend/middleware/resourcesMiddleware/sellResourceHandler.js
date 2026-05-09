function sellResourceHandler(req, res, next) {
  const { resource_id, world_id} = req.body;
  const resourceId = Number(resource_id);
  const worldId = Number(world_id);

  if (resource_id == null || world_id == null || !Number.isInteger(resourceId) || !Number.isInteger(worldId) || worldId <= 0 || resourceId <= 0) {
    return res.status(400).json({ message: "resource_id или world_id некорректны или отсутствуют" });
  }

  req.worldId = worldId;
  req.resourceId = resourceId;

  next();
}

module.exports = sellResourceHandler;