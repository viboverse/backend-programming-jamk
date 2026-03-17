import "dotenv/config";
import express from "express";
import albumRoutes from "./routes/albums.js";
import connectMongoDB from "./db/mongodb.js";

const app = express();

const requestLogger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`${timestamp} - ${req.method} ${req.url}`);
  next();
};

app.use(requestLogger);
app.use(express.json());
app.use(express.static("public"));
app.use("/albums", albumRoutes);

const PORT = 3000;

try {
  await connectMongoDB(process.env.MONGO_URI);
  app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`));
} catch (error) {
  console.log(error);
}
