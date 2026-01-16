import createError from "http-errors";
import asyncHandler from "#utils/asyncHandler.js";
import { refreshTokenService } from "#src/services/refreshTokenService.service.js";
export const refreshTokenHandler = asyncHandler(async (req, res) => {
  const { refresh_token } = req.body;

  if (!refresh_token) {
    throw createError(401, "Unauthorized");
  }
  const result = await refreshTokenService(refresh_token);

  res.success(result);
});
