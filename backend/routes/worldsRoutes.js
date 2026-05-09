const express = require("express");
const asyncHandler = require("../middleware/authMiddleware/asyncHandler");
const { getMyWorlds, createWorld, deleteWorld, getMyCoins, getCountPlanets } = require("../controllers/worldsController");
const worldHandler = require("../middleware/worldsMiddleware/worldHandler");
const authMiddleware = require("../middleware/authMiddleware/authMiddleware");
const getPlanetHandler = require("../middleware/planetMiddleware/getPlanetHandler");

const router = express.Router();

router.get("/", authMiddleware, asyncHandler(getMyWorlds));
router.post("/", authMiddleware, worldHandler, asyncHandler(createWorld));
router.delete("/", authMiddleware, asyncHandler(deleteWorld));
router.get("/:id/coins", authMiddleware, asyncHandler(getMyCoins));
router.get("/:id/planets", authMiddleware, asyncHandler(getCountPlanets));

module.exports = router;