import mongoose from "mongoose";
import dotenv from "dotenv";
import Album from "./models/Album.js";

dotenv.config();

const albums = [
  {
    artist: "The Beatles",
    title: "Abbey Road",
    year: 1969,
    genre: "Rock",
    tracks: 17,
  },
  {
    artist: "Michael Jackson",
    title: "Thriller",
    year: 1982,
    genre: "Pop",
    tracks: 9,
  },
  {
    artist: "Pink Floyd",
    title: "The Dark Side of the Moon",
    year: 1973,
    genre: "Rock",
    tracks: 10,
  },
  {
    artist: "Miles Davis",
    title: "Kind of Blue",
    year: 1959,
    genre: "Jazz",
    tracks: 5,
  },
  {
    artist: "Daft Punk",
    title: "Discovery",
    year: 2001,
    genre: "Electronic",
    tracks: 14,
  },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to DB...");

    await Album.insertMany(albums);
    console.log("5 Albums added successfully!");

    process.exit();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

seedDB();
