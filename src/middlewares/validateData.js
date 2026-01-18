import createHttpError from "http-errors";

export const validateData =
  ({ body, params }) =>
  (req, res, next) => {
    if (body) {
      const result = body.safeParse(req.body);

      if (!result.success) {
        console.error("Body validation error:", result.error.flatten());

        return next(
          createHttpError(
            422,
            result.error.flatten().fieldErrors
          )
        );
      }

      req.body = result.data;
    }

    if (params) {
      const result = params.safeParse(req.params);

      if (!result.success) {
        console.error("Params validation error:", result.error.flatten());

        return next(
          createHttpError(
            422,
            result.error.flatten().fieldErrors
          )
        );
      }

      req.params = result.data;
    }

    next();
  };

export const validateParams = (schema) => (req, res, next) => {
  console.log("Validating params:", req.params);
  const result = schema.safeParse(req.params);

  if (!result.success) {
    const message = result.error.errors
      .map(e => e.message)
      .join(", ");

    return next(
      createHttpError(422, message || "Invalid request params")
    );
  }
  req.params = result.data;
  next();
};
export const validateQuery = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.query);

  if (!result.success) {
    const message = result.error.errors
      .map(e => e.message)
      .join(", ");

    return next(
      createHttpError(422, message || "Invalid request query")
    );
  }
  req.validatedQuery = result.data;

  next();
};
