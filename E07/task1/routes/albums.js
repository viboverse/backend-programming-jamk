import express from "express";
import * as albumController from "../controllers/albums.js";
import { requireAuth } from "../middleware/auth.js";
const router = express.Router();

// PUBLIC routes (No middleware)
router.get("/", albumController.getAllAlbums);
router.get("/:id", albumController.getAlbumById);

// PROTECTED routes (Require login)
router.post("/", requireAuth, albumController.createAlbum);
router.put("/:id", requireAuth, albumController.updateAlbum);
router.delete("/:id", requireAuth, albumController.deleteAlbum);

export default router;
