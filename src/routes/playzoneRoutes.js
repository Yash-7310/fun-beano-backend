import express from "express";
import {
  addPlayzoneFeatures,
  addPlayzoneLocation,
  getAllPlayzones,
  getAllPlayzoneFeatures,
  getAllPlayzoneLocation,
  getAllPlayzonesByOwnerId,
  addPlayzone,
} from "../controllers/playzoneController.js";

const router = express.Router();

router.get("/", getAllPlayzones);
router.post("/", getAllPlayzonesByOwnerId);
router.get("/features", getAllPlayzoneFeatures);
router.get("/locations", getAllPlayzoneLocation);

router.post("/add-playzone", addPlayzone);
router.post("/add-feature", addPlayzoneFeatures);
router.post("/add-location", addPlayzoneLocation);

export default router;
