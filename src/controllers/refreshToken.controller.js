import createError from "http-errors";
import asyncHandler from "#utils/asyncHandler.js";
import { refreshTokenService } from "#src/services/refreshTokenService.service.js";
export const refreshTokenHandler = asyncHandler(async (req, res) => {
  console.log(req)
  const { refreshToken } = req.body;

  if (!refreshToken) {
    throw createError(401, "Unauthorized");
  }
  const result = await refreshTokenService(refreshToken);

  res.success(result);
});
