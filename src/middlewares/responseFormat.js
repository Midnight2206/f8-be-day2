export const responseFormat = (req, res, next) => {
  res.success = (data, status = 200) => {
    return res.status(status).json({
      status: "success",
      data,
    });
  };

  res.error = (status, message, err = null) => {
    return res.status(status).json({
      status: "error",
      message,
      errorCode: err?.errorCode || null,
      details: err?.details || null,
      ...(process.env.NODE_ENV === "development" && err?.stack
        ? { stack: err.stack }
        : {}),
    });
  };

  next();
};
