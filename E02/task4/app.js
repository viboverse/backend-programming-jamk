import fs from "fs/promises";
import express from "express";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static("public"));

async function loadAlbums() {
  const data = await fs.readFile("./data/albums.json", "utf8");
  return JSON.parse(data).albums;
}

async function saveAlbum(albums) {
  await fs.writeFile("./data/albums.json", JSON.stringify({ albums }, null, 2));
}

app.get("/albums", async (req, res) => {
  try {
    const albums = await loadAlbums();
    res.json(albums);
  } catch (error) {
    res.status(500).json({ error: "Failed to load albums" });
  }
});

app.get("/albums/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const albums = await loadAlbums();
    const album = albums.find((a) => a.id === +id);

    if (!album) {
      return res.status(404).json({ error: "Album not found" });
    }

    res.json(album);
  } catch (err) {
    res.status(500).json({ error: "Failed to load The album" });
  }
});

app.post("/albums", async (req, res) => {
  try {
    const { artist, title, year, genre, tracks } = req.body;
    const albums = await loadAlbums();

    if (!artist || !title || !year || !genre || !tracks) {
      return res.status(400).json({ error: "All Fields are required" });
    }

    const newAlbum = {
      id: Math.max(...albums.map((u) => u.id)) + 1,
      artist,
      title,
      year,
      genre,
      tracks,
    };

    albums.push(newAlbum);
    await saveAlbum(albums);
    res.status(201).json({ message: "Album Saved", album: newAlbum });
  } catch (erro) {
    res.status(500).json({ error: "Failed to save album" });
  }
});

app.put("/albums/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { artist, title, year, genre, tracks } = req.body;
    const albums = await loadAlbums();

    const albumIdx = albums.findIndex((album) => album.id === +id);

    if (albumIdx === -1) {
      return res.status(404).json({ success: false, message: "Album Not Found!" });
    }

    albums[albumIdx] = {
      ...albums[albumIdx],
      artist,
      title,
      year,
      genre,
      tracks,
      id: +id,
    };

    await saveAlbum(albums);
    res.status(200).json({ data: albums[albumIdx] });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to update album" });
  }
});

app.delete("/albums/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const albums = await loadAlbums();

    const album = albums.find((a) => a.id === +id);

    if (!album) {
      return res.status(404).json({ success: false, message: "Album Not Found!" });
    }

    const newAlbums = albums.filter((album) => album.id !== Number(id));
    albums.splice(0, albums.length, ...newAlbums);
    res.status(204).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to Delete the album!" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
