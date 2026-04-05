import "dotenv/config";

const PORT = 3000;

const MONGODB_URI = process.env.RUNTIME_ENV === "test" ? process.env.TEST_MONGO_URI : process.env.MONGO_URI;

export { MONGODB_URI, PORT };
