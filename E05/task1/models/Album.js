import { Schema, model } from "mongoose";

const albumSchema = new Schema({
  artist: {
    type: String,
    required: [true, "Artist name is required"],
    minlength: [3, "Artist name must be at least 3 characters"],
    maxlength: [50, "Artist name cannot exceed 50 characters"],
    trim: true,
  },
  title: {
    type: String,
    required: [true, "Album title is required"],
    minlength: [3, "Album title must be at least 3 characters"],
    maxlength: [50, "Album title cannot exceed 50 characters"],
    trim: true,
  },
  year: {
    type: Number,
    required: [true, "Release year is required"],
    min: [1900, "Release year must be 1900 or later"],
    validate: {
      validator: function (enteredYear) {
        const currYear = new Date().getFullYear();

        if (enteredYear <= currYear) {
          return true;
        }

        return false;
      },
      message: "The Release year can not be in the future!",
    },
  },
  genre: {
    type: String,
    required: [true, "Genre is required"],
    enum: {
      values: ["Rock", "Pop", "Jazz", "Classical", "Hip Hop", "Electronic", "Country", "Blues"],
      message: "{VALUE} is not a valid genre",
    },
  },
  tracks: {
    type: Number,
    required: [true, "Track count is required"],
    min: [1, "Album must have at least 1 track"],
    max: [100, "Album cannot have more than 100 tracks"],
  },
  artistTitle: {
    type: String,
    validate: {
      validator: async function (value) {
        // Build the search query
        const query = {
          artist: this.artist,
          title: this.title,
        };

        // When updating, exclude the current document
        if (this._id) {
          query._id = { $ne: this._id }; // $ne = "not equal"
        }

        // Check if duplicate exists
        const duplicate = await this.model("Album").findOne(query);

        return !duplicate; // Return true if NO duplicate found
      },
      message: "An album with this artist and title already exists",
    },
  },
});

// Pre-validate hook to populate artistTitle
albumSchema.pre("validate", function (next) {
  if (this.artist && this.title) {
    this.artistTitle = `${this.artist}-${this.title}`;
  }
});

albumSchema.virtual("ageInYears").get(function () {
  const currYear = new Date().getFullYear();
  return currYear - this.year;
});

albumSchema.methods.isClassic = function () {
  return this.ageInYears > 25;
};

albumSchema.statics.findByGenre = function (genre) {
  return this.find({ genre: genre });
};

albumSchema.set("toJSON", { virtuals: true });
albumSchema.set("toObject", { virtuals: true });

export default model("Album", albumSchema);
