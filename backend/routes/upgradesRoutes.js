const express = require("express");
const authMiddleware = require("../middleware/authMiddleware/authMiddleware");
const asyncHandler = require("../middleware/authMiddleware/asyncHandler");
const { upgradePlanetMiningLevel } = require("../controllers/upgradeController");
const upgradeMiddleware = require("../middleware/upgradeMiddleware/upgradeMiddleware");

const router = express.Router();

router.put("/mining", authMiddleware, asyncHandler(upgradeMiddleware), asyncHandler(upgradePlanetMiningLevel));

module.exports = router;