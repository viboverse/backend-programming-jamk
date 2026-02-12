import express from "express";
import * as albumController from "../controllers/albums.js";

const router = express.Router();

const requireDebug = (req, res, next) => {
  const debug = req.query.debug;

  if (!debug || debug !== "true") {
    return res.status(400).json({
      error: "Debug mode required. Add ?debug=true to access this endpoint",
    });
  }

  req.debugMode = true;
  next();
};

router.get("/", albumController.getAllAlbums);
router.get("/:id", albumController.getAlbumById);
router.post("/", albumController.createAlbum);
router.put("/:id", albumController.updateAlbum);

router.delete("/:id", requireDebug, albumController.deleteAlbum);

export default router;
