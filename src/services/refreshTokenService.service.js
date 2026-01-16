import {
  findValidRefreshToken,
  insertRefreshToken,
  resetRefreshToken,
} from "#models/refreshToken.model.js";
import { createRefreshToken } from "#utils/createRefreshToken.js";
import { signToken } from "#utils/jwt.js";

const ACCESS_TOKEN_EXPIRE = Number(process.env.ACCESS_TOKEN_EXPIRE);
const REFRESH_TOKEN_EXPIRE = Number(process.env.REFRESH_TOKEN_EXPIRE);

export const refreshTokenService = async (refreshToken) => {
  if (!ACCESS_TOKEN_EXPIRE || !REFRESH_TOKEN_EXPIRE) {
    throw new Error("Token expire env variables are not set");
  }
  const tokenRecord = await findValidRefreshToken(refreshToken);
  const newRefreshToken = createRefreshToken();
  const now = Date.now();
  const createdAt = new Date(now);
  const expiresAt = new Date(now + REFRESH_TOKEN_EXPIRE);
  await resetRefreshToken(tokenRecord.id, {
    token: newRefreshToken,
    createdAt,
    expiresAt,
  });

  const accessToken = signToken(
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
  const newRefreshToken = createRefreshToken();
  const now = Date.now();
  const createdAt = new Date(now);
  const expiresAt = new Date(now + REFRESH_TOKEN_EXPIRE);
  await insertRefreshToken({
    userId,
    token: newRefreshToken,
    deviceInfo,
    ipAddress,
    createdAt,
    expiresAt,
  });
  return newRefreshToken
};
