// src/utils/jwt.js
import jwt from "jsonwebtoken";
import createError from "http-errors";

/* ================= ACCESS TOKEN ================= */

export const signAccessToken = (userId) => {
  if (!process.env.JWT_ACCESS_SECRET) {
    throw new Error("JWT_ACCESS_SECRET not defined");
  }

  return jwt.sign(
    {
      sub: userId,
      type: "access",
    },
    process.env.JWT_ACCESS_SECRET,
    {
      expiresIn: Number(process.env.JWT_ACCESS_EXPIRES),
    }
  );
};

export const verifyAccessToken = (token) => {
  try {
    const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    if (payload.type !== "access") {
      throw createError(401, "Invalid access token");
    }

    return payload;
  } catch (err) {
    throw createError(401, err.message || "Unauthorized");
  }
};

/* ================= VERIFY EMAIL TOKEN ================= */

export const signMailToken = ({ userId, email }) => {
  if (!process.env.JWT_EMAIL_SECRET) {
    throw new Error("JWT_EMAIL_SECRET not defined");
  }

  return jwt.sign(
    {
      sub: userId,
      email,
      type: "verify_email",
    },
    process.env.JWT_EMAIL_SECRET,
    {
      expiresIn: Number(process.env.JWT_EMAIL_EXPIRES), // 2h
    }
  );
};

export const verifyMailToken = (token) => {
  try {
    const payload = jwt.verify(
      token,
      process.env.JWT_EMAIL_SECRET
    );

    if (payload.type !== "verify_email") {
      throw createError(401, "Invalid verify email token");
    }

    return payload;
  } catch (err) {
    throw createError(401, err.message || "Invalid or expired token");
  }
};
