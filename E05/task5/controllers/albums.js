import Album from "../models/Album.js";

export async function getAllAlbums(req, res) {
  const popAlbums = await Album.findByGenre("Pop");
  console.log(popAlbums);

  try {
    const queryObject = {};

    // Task 4
    if(req.query.artist){
     queryObject.artist = { $regex: req.query.artist, $options: "i" };
    }

      if (req.query.title) {
      queryObject.title = { $regex: req.query.title, $options: "i" };
    }

    // Task 5
    if(req.query.startYear || req.query.endYear){
      queryObject.year = {}

      if (req.query.startYear) {
        queryObject.year.$gte = Number(req.query.startYear); 
      if (req.query.endYear) {
        queryObject.year.$lte = Number(req.query.endYear); 
      }
    }
   }

    // Task 2
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
      filters.split(",").forEach((item) => {
        const [field, operator, value] = item.split("-");
        if (options.includes(field)) {
          queryObject[field] = { [operator]: Number(value) };
        }
      });
    }

    // Task 3
    let query = Album.find(queryObject);

    if (req.query.sort) {
      const sortList = req.query.sort.split(",").join(" ");
      query = query.sort(sortList);
    } else {
      query = query.sort("year");
    }

    if (req.query.fields) {
      const fieldsList = req.query.fields.split(",").join(" ");
      query = query.select(fieldsList);
    } else {
      // Optional default: hide __v
      query = query.select("-__v");
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
