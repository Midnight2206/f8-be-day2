export function errorMiddleware(err, req, res, next) {
  const statusCode = err.status || 500;
  const message = err.message || "Internal Server Error";
  const details = err.details || null;
  const errorCode = err.errorCode || null;

  console.error(err.stack);

  res.status(statusCode).json({
    success: false,
    message,
    errorCode,
    ...(details && { details }),
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
}
