import createError from "http-errors";
import {
  findValidRefreshToken,
  insertRefreshToken,
  resetRefreshToken,
  revokeRefreshToken,
  revokeAllRefreshTokensByUserId,
} from "#models/refreshToken.model.js";

import {
  insertRevokedToken,
  isTokenRevoked,
} from "#models/revokedToken.model.js";

import { createRefreshToken } from "#utils/createRefreshToken.js";
import { signAccessToken } from "#utils/jwt.js";

const ACCESS_TOKEN_EXPIRE = Number(process.env.JWT_ACCESS_EXPIRES);
const REFRESH_TOKEN_EXPIRE = Number(process.env.REFRESH_TOKEN_EXPIRE);

export const addTokenToBlackList = async ({ token, exp }) => {
  const revoked = await isTokenRevoked(token);
  if (revoked) return;

  await insertRevokedToken({
    token,
    expiresAt: new Date(exp * 1000),
  });
};

/**
 * Revoke ONE refresh token (logout current device)
 */
export const revokeRefreshTokenService = async ({ userId, token }) => {
  const record = await findValidRefreshToken({ token });
  if (!record || record.user_id !== userId) {
    throw createError(401, "Unauthorized");
  }

  const success = await revokeRefreshToken({ id: record.id });
  if (!success) {
    throw createError(401, "Unauthorized");
  }

  return true;
};


export const refreshTokenService = async (refreshToken) => {
  if (!ACCESS_TOKEN_EXPIRE || !REFRESH_TOKEN_EXPIRE) {
    throw new Error("Token expire env variables are not set");
  }

  const tokenRecord = await findValidRefreshToken({ token: refreshToken });
  if (!tokenRecord) {
    throw createError(401, "Unauthorized");
  }

  const newRefreshToken = createRefreshToken();
  const now = Date.now();

  const rotated = await resetRefreshToken(tokenRecord.id, {
    token: newRefreshToken,
    createdAt: new Date(now),
    expiresAt: new Date(now + REFRESH_TOKEN_EXPIRE),
  });

  if (!rotated) {
    await revokeAllRefreshTokensByUserId({
      userId: tokenRecord.user_id,
    });
    throw createError(401, "Refresh token reuse detected");
  }

  const accessToken = signAccessToken(
    { id: tokenRecord.user_id },
    ACCESS_TOKEN_EXPIRE
  );

  return {
    accessToken,
    refreshToken: newRefreshToken,
  };
};

export const createRefreshTokenService = async ({
  userId,
  deviceInfo,
  ipAddress,
}) => {
  if (!ACCESS_TOKEN_EXPIRE || !REFRESH_TOKEN_EXPIRE) {
    throw new Error("Token expire env variables are not set");
  }

  const refreshToken = createRefreshToken();
  const now = Date.now();

  await insertRefreshToken({
    userId,
    token: refreshToken,
    deviceInfo,
    ipAddress,
    createdAt: new Date(now),
    expiresAt: new Date(now + REFRESH_TOKEN_EXPIRE),
  });

  return refreshToken;
};

export const revokeAllRefreshTokensService = async ({ userId }) => {
  if (!userId) {
    throw createError(400, "userId is required");
  }

  await revokeAllRefreshTokensByUserId({ userId });
  return true;
};
