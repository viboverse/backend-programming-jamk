import { APIError } from "../errors/custom.js";

const errorHandlerMiddleware = (err, req, res, next) => {
  // If the error is one of our custom APIErrors, use its status code
  if (err instanceof APIError) {
    return res.status(err.statusCode).json({ error: err.message });
  }

  // If it's a Mongoose validation error (Task 1 handling)
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((val) => val.message);
    return res.status(400).json({ error: messages.join(", ") });
  }

  // If it's a Mongoose duplicate key error (Task 2 fallback)
  if (err.code === 11000) {
    return res.status(400).json({ error: "Duplicate value entered" });
  }

  // If it's something else we didn't expect, send a generic 500 error
  console.log(err); // Good for debugging
  return res.status(500).json({ error: "Something went wrong, please try again" });
};

export default errorHandlerMiddleware;
