import fs from "fs/promises";
import path from "path";

const ALBUMS_FILE = "./data/albums.json";

async function loadAlbums() {
  const data = await fs.readFile(ALBUMS_FILE, "utf8");
  return JSON.parse(data).albums;
}

async function saveAlbum(albums) {
  await fs.writeFile(ALBUMS_FILE, JSON.stringify({ albums }, null, 2));
}

export async function getAllAlbums(req, res) {
  // Implementation here
  try {
    const albums = await loadAlbums();
    res.json(albums);
  } catch (error) {
    res.status(500).json({ error: "Failed To Load Album!" });
  }
}

export async function getAlbumById(req, res) {
  // Implementation here

  try {
    const { id } = req.params;
    const albums = await loadAlbums();
    const album = albums.find((a) => a.id === +id);

    if (!album) {
      return res.status(404).json({ error: "Album not Found!" });
    }
    res.status(200).json(album);
  } catch (error) {
    res.status(500).json({ error: "Failed To Load the Album!" });
  }
}

export async function createAlbum(req, res) {
  // Implementation here
  try {
    const { artist, title, year, genre, tracks } = req.body;
    const albums = await loadAlbums();

    if (!artist || !title || !year || !genre || !tracks) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const maxId = albums && albums.length > 0 ? Math.max(...albums.map((u) => u.id)) : 0;

    const newAlbum = {
      id: maxId + 1,
      artist,
      title,
      year,
      genre,
      tracks,
    };

    albums.push(newAlbum);
    await saveAlbum(albums);
    res.status(201).json({ message: "Album saved", album: newAlbum });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to save album" });
  }
}

export async function updateAlbum(req, res) {
  // Implementation here
  try {
    const { id } = req.params;
    const { artist, title, year, genre, tracks } = req.body;
    const albums = await loadAlbums();

    const albumIdx = albums.findIndex((album) => album.id === +id);

    if (albumIdx === -1) {
      return res.status(404).json({ error: "Album not found" });
    }

    albums[albumIdx] = {
      ...albums[albumIdx],
      artist,
      title,
      year,
      genre,
      tracks,
    };

    await saveAlbum(albums);
    res.json({ message: "Album updated", album: albums[albumIdx] });
  } catch (error) {
    res.status(500).json({ error: "Failed to update album" });
  }
}

export async function deleteAlbum(req, res) {
  // Implementation here
  try {
    const { id } = req.params;
    const albums = await loadAlbums();

    const album = albums.find((a) => a.id === +id);

    if (!album) {
      return res.status(404).json({ error: "Album not found" });
    }

    const newAlbums = albums.filter((album) => album.id !== +id);
    await saveAlbum(newAlbums);
    res.status(204).json({ succes: true, message: `The album with id ${id} is deleted` });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete album" });
  }
}
