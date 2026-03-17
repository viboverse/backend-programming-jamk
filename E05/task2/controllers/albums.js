import Album from "../models/Album.js";

export async function getAllAlbums(req, res) {
  // Implementation here

  //Schema methods and virtuals test
  const popAlbums = await Album.findByGenre("Pop");
  console.log(popAlbums);

  try {
    const queryObject = {};

    if (req.query.numericFilters) {
      const operatorMap = {
        ">": "$gt",
        ">=": "$gte",
        "=": "$eq",
        "<": "$lt",
        "<=": "$lte",
      };
      const regEx = /\b(>|>=|=|<|<=)\b/g;
      let filters = req.query.numericFilters.replace(regEx, (match) => `-${operatorMap[match]}-`);
      const options = ["year"];
      // Splitting the numeric filters into individual items (there can be multiple comma separated filters)
      filters.split(",").forEach((item) => {
        // Destructuring each numeric filter from the array by splitting on the '-'
        const [field, operator, value] = item.split("-");
        if (options.includes(field)) {
          // Add numeric filters to queryObject, if field is included in options array, atm the only option is price as it is the only numeric value in the data
          queryObject[field] = { [operator]: Number(value) };
        }
      });
    }

    let query = Album.find(queryObject);
    if (req.query.sort) {
      const sortList = req.query.sort.split(",").join(" ");
      query = query.sort(sortList);
    } else {
      query = query.sort("year");
    }
    const albums = await query;
    res.status(200).json(albums);
  } catch (error) {
    res.status(500).json({ error: "Failed To Load Album!" });
    console.error(error);
  }
}

export async function getAlbumById(req, res) {
  // Implementation here

  try {
    const { id } = req.params;
    const album = await Album.findById(id).exec();

    //Schema methods and virtuals test
    if (album.isClassic()) {
      console.log("The album is claaassiic");
    }

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
    if (error.name === "ValidationError") {
      // This reaches inside the Master object to grab your specific message
      const firstError = Object.values(error.errors)[0].message;
      return res.status(400).json({ error: firstError });
    }
    res.status(500).json({ error: "Internal Server Error" });
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
