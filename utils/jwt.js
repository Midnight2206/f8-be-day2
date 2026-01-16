import crypto from "crypto";
import createError from "http-errors";

const SECRET_KEY = process.env.SECRET_KEY;
const base64UrlEncode = (str) =>
  Buffer.from(str)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
const base64UrlDecode = (str) =>
  Buffer.from(str.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString();
export const signToken = (userId, expiresIn) => {
  if (!SECRET_KEY) throw new Error("JWT secret key is not defined");

  const now = Math.floor(Date.now() / 1000);
  const exp = now + Number(expiresIn);

  const header = { alg: "HS256", typ: "JWT" };
  const payload = { sub: userId, iat: now, exp };

  const headerEncoded = base64UrlEncode(JSON.stringify(header));
  const payloadEncoded = base64UrlEncode(JSON.stringify(payload));

  const signature = crypto
    .createHmac("sha256", SECRET_KEY)
    .update(`${headerEncoded}.${payloadEncoded}`)
    .digest("base64url");

  return `${headerEncoded}.${payloadEncoded}.${signature}`;
};

export const verifyToken = (token) => {
  if (!SECRET_KEY) throw new Error("JWT secret key is not defined");
  if (!token) throw createError(401, "Unauthorized");

  const parts = token.split(".");
  if (parts.length !== 3) throw createError(401, "Unauthorized");

  const [headerEncoded, payloadEncoded, signature] = parts;

  const header = JSON.parse(base64UrlDecode(headerEncoded));
  if (header.alg !== "HS256") {
    throw createError(401, "Invalid token algorithm");
  }

  const expectedSig = crypto
    .createHmac("sha256", SECRET_KEY)
    .update(`${headerEncoded}.${payloadEncoded}`)
    .digest("base64url");

  if (
    !crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSig)
    )
  ) {
    throw createError(401, "Unauthorized");
  }

  const payload = JSON.parse(base64UrlDecode(payloadEncoded));
  if (!payload.sub) throw createError(401, "Unauthorized");

  const now = Math.floor(Date.now() / 1000);
  if (payload.exp && payload.exp < now) {
    throw createError(401, "Token expired");
  }

  return payload;
};
