import mongoose from "mongoose";
import supertest from "supertest";
import app from "../app.js";
import Album from "../models/Album.js";
import testAlbums from "./data.json";
import { describe, test, beforeEach, afterAll, expect } from "vitest";

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

  test("A new album can be added", async () => {
    const newAlbum = {
      title: "Test Album 3",
      artist: "New Artist",
      year: 2023,
      genre: "Rock",
      tracks: 8,
    };

    await api
      .post("/albums")
      .send(newAlbum)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const response = await api.get("/albums");
    expect(response.body.albums).toHaveLength(testAlbums.length + 1);
  });

  afterAll(() => {
    mongoose.connection.close();
  });
});
