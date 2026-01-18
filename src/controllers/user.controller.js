import asyncHandler from "#utils/asyncHandler.js";
import { searchUsersByEmailService } from "#src/services/user.service.js";
export const searchUserByEmail = asyncHandler(async (req, res) => {
  const email = req.validatedQuery.q;
  const users = await searchUsersByEmailService(email);

  res.success(users);
});