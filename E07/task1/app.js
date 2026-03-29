import "dotenv/config";
import express from "express";
import albumRoutes from "./routes/albums.js";
import connectMongoDB from "./db/mongodb.js";
import authRoutes from "./routes/auth.js";
import errorHandlerMiddleware from "./middleware/errorHandler.js";
import session from "express-session";

const app = express();

app.use(express.json());

app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
    },
  }),
);

const requestLogger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`${timestamp} - ${req.method} ${req.url}`);
  next();
};

app.use(requestLogger);
app.use(express.json());
app.use(express.static("public"));
app.use("/albums", albumRoutes);
app.use("/api/auth", authRoutes);

app.use(errorHandlerMiddleware);

const PORT = 3000;

try {
  await connectMongoDB(process.env.MONGO_URI);
  app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`));
} catch (error) {
  console.log(error);
}
