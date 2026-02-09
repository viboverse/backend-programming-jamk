import { model, Schema } from "mongoose";

const albumSchema = new Schema({
  artist: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  genre: {
    type: String,
    required: true,
  },
  tracks: {
    type: Number,
    required: true,
  },
});

export default model("Album", albumSchema);
