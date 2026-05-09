const express = require("express");
const asyncHandler = require("../middleware/authMiddleware/asyncHandler");
const authMiddleware = require("../middleware/authMiddleware/authMiddleware");
const planetHandler = require("../middleware/planetMiddleware/planetHandler");
const { buyPlanet, getMyPlanets } = require("../controllers/planetController");
const worldHandler = require("../middleware/planetMiddleware/getPlanetHandler");

const router = express.Router();

router.post("/buy", authMiddleware, planetHandler, asyncHandler(buyPlanet));
router.post("/", authMiddleware, worldHandler, asyncHandler(getMyPlanets));

module.exports = router;