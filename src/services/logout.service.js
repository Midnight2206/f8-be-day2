import { deleteRefreshToken } from "#src/models/refreshToken.model.js";
export const revokeRefreshTokenService = async ({userId, token}) => {
  await deleteRefreshToken({userId, token});
};