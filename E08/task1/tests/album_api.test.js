import mongoose from "mongoose";
import supertest from "supertest";
import app from "../app.js";
import Album from "../models/Album.js";
import testAlbums from "./data.json";
import { describe, test, beforeEach, afterAll } from "vitest";

const api = supertest(app);

describe("Album tests", () => {
  beforeEach(async () => {
    await Album.deleteMany({});
    await Album.create(testAlbums);
  });

  test("albums returned as json", async () => {
    await api
      .get("/albums")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  afterAll(() => {
    mongoose.connection.close();
  });
});
