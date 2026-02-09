import Album from "../models/Album.js";

export async function getAllAlbums(req, res) {
  // Implementation here
  try {
    const albums = await Album.find({}).exec();
    res.json(albums);
  } catch (error) {
    res.status(500).json({ error: "Failed To Load Album!" });
  }
}

export async function getAlbumById(req, res) {
  // Implementation here

  try {
    const { id } = req.params;
    const album = await Album.findById(id).exec();

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

    if (!artist || !title || !year || !genre || !tracks) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newAlbum = await Album.create({
      artist,
      title,
      year,
      genre,
      tracks,
    });

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

    const updatedAlbum = await Album.findByIdAndUpdate(id, {
      artist,
      title,
      year,
      genre,
      tracks,
    }).exec();

    if (!updatedAlbum) {
      return res.status(404).json({ error: "Album not found" });
    }
    res.json({ message: "Album updated", album: updatedAlbum });
  } catch (error) {
    res.status(500).json({ error: "Failed to update album" });
  }
}

export async function deleteAlbum(req, res) {
  // Implementation here
  try {
    const { id } = req.params;

    const deletedAlbum = await Album.findByIdAndDelete(id).exec();

    if (!deletedAlbum) {
      return res.status(404).json({ error: "Album not found" });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Failed to delete album" });
  }
}
