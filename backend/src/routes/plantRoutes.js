const express = require("express");
const controller = require("../controllers/plantController");

const router = express.Router();

router.get("/", controller.getPlants);
router.post("/", controller.createPlant);
router.get("/:id", controller.getPlant);
router.put("/:id", controller.updatePlant);
router.delete("/:id", controller.deletePlant);
router.post("/:id/water", controller.waterPlant);
router.put("/:id/care", controller.saveCareInstructions);
router.get("/:id/history", controller.getHistory);

module.exports = router;
