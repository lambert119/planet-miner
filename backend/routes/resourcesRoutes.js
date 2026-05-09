const express = require("express");
const asyncHandler = require("../middleware/authMiddleware/asyncHandler");
const authMiddleware = require("../middleware/authMiddleware/authMiddleware");
const { getMyResources, sellResource } = require("../controllers/resourcesController");
const getResourcesHandler = require("../middleware/resourcesMiddleware/getResourceHandler");
const sellResourceHandler = require("../middleware/resourcesMiddleware/sellResourceHandler");

const router = express.Router();

router.post("/", authMiddleware, getResourcesHandler, asyncHandler(getMyResources));
router.put("/", authMiddleware, sellResourceHandler, asyncHandler(sellResource));

module.exports = router;