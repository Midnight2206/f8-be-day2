import createError from "http-errors";

export function notFoundMiddleware(req, res, next) {
  next(createError.NotFound(`Route ${req.originalUrl} not found`));
}
