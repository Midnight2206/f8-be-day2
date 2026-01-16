import createError from "http-errors";
import { verifyToken } from "#utils/jwt.js";
export const authentication = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw createError(401, "Unauthorized");
    }

    const token = authHeader.split(" ")[1];
    const payload = verifyToken(token);

    req.user = {id: payload.sub};
    next();
  } catch (err) {
    next(err);
  }
};
