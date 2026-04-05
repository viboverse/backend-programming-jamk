import { APIError } from "./custom.js";

// A specific error class for 401 Unauthorized errors
class UnauthenticatedError extends APIError {
  constructor(message) {
    super(message, 401);
  }
}

// A specific error class for 404 Not Found errors
class NotFoundError extends APIError {
  constructor(message) {
    super(message, 404);
  }
}

// A specific error class for 400 Bad Request errors
class BadRequestError extends APIError {
  constructor(message) {
    super(message, 400);
  }
}

export { APIError, UnauthenticatedError, NotFoundError, BadRequestError };
