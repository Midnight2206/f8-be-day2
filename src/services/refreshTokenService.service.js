import {
  findValidRefreshToken,
  insertRefreshToken,
  resetRefreshToken,
  deleteRefreshToken
} from "#models/refreshToken.model.js";
import { insertRevokedToken, isTokenRevoked } from "#models/revoked_tokens.model.js";
import { createRefreshToken } from "#utils/createRefreshToken.js";
import { signToken } from "#utils/jwt.js";

const ACCESS_TOKEN_EXPIRE = Number(process.env.ACCESS_TOKEN_EXPIRE);
const REFRESH_TOKEN_EXPIRE = Number(process.env.REFRESH_TOKEN_EXPIRE);
export const addTokenToBlackList = async ({token, exp}) => {
  const isRevoked = await isTokenRevoked(token);
  if (isRevoked) {
    throw new Error("Token is already revoked");
  }
  await insertRevokedToken({token, expiresAt: new Date(exp * 1000)});

}
export const revokeRefreshTokenService = async ({userId, token}) => {
  const record = await findValidRefreshToken({ token});
  if  (!record || record.revoked) createError(401, "Unauthorized");
  await deleteRefreshToken({userId, token});
};

export const refreshTokenService = async (refreshToken) => {
  if (!ACCESS_TOKEN_EXPIRE || !REFRESH_TOKEN_EXPIRE) {
    throw new Error("Token expire env variables are not set");
  }
  const tokenRecord = await findValidRefreshToken({token: refreshToken});
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
