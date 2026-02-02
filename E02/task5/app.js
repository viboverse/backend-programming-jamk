import express from "express";
import albumRoutes from "./routes/albums.js";

const app = express();

app.use(express.json());
app.use("/albums", albumRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
