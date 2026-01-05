import createHttpError from "http-errors";

export const validateData = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    const message = result?.error?.errors?.map(e => e.message).join(", ");
    return next(createHttpError(422, message || "Invalid request data"));
  }
  req.body = result.data;
  next();
};
