export function errorMiddleware(err, req, res, next) {
  console.error(err.stack || err);
  res.error(
    err.status || 500,
    err.message || "Internal Server Error",
    err
  );
}
