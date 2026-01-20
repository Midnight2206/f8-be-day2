import createError from "http-errors";
import { verifyToken } from "#utils/jwt.js";
import { isTokenRevoked } from "#models/revokedToken.model.js";
export const authRequired = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw createError(401, "Unauthorized");
    }

    const token = authHeader.split(" ")[1];
    const payload = verifyToken(token);
    const revoked = await isTokenRevoked(token);
    if (revoked) {
      throw createError(401, "Unauthorized");
    }
    req.user = {
      id: payload.sub,
      token,
      exp: payload.exp,
    };
    next();
  } catch (err) {
    next(err);
  }
};
