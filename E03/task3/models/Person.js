import { model, Schema } from "mongoose";

const personSchema = new Schema({
  firstname: String,
  lastname: String,
});

export default model("person", personSchema);
