import express from "express";
import authMiddleware from "../middleware/auth.js";

import { getAllAlbums, getAlbumById, createAlbum, updateAlbum, deleteAlbum } from "../controllers/albums.js";

const router = express.Router();

// Public routes, no need token to be viewd
router.get("/", getAllAlbums);
router.get("/:id", getAlbumById);

// PROTECTED routes (Token required to modify)
router.post("/", createAlbum);
router.patch("/:id", authMiddleware, updateAlbum);
router.delete("/:id", authMiddleware, deleteAlbum);

export default router;
