import createError from "http-errors";
import { findUserByEmailOrUsername, findUserById } from "#models/auth.model.js";
import { createRefreshTokenService } from "#src/services/refreshTokenService.service.js";
import { revokeRefreshTokenService } from "#src/services/logout.service.js";
import { registerService } from "#src/services/register.service.js";
import { signToken } from "#utils/jwt.js";
import bcrypt from "bcryptjs";
const ACCESS_TOKEN_EXPIRE = process.env.ACCESS_TOKEN_EXPIRE

export const login = async (req, res, next) => {
  try {
    const { identifier, password } = req.body; 
    const deviceInfo = req.headers["user-agent"] || null;
    const ipAddress = req.headers["x-forwarded-for"]?.split(",")[0] || req.ip;
    const user = await findUserByEmailOrUsername({identifier});
    if (!user) throw createError(401, "Invalid credentials");

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) throw createError(401, "Invalid credentials");
    const refreshToken = await createRefreshTokenService({userId: user.id,deviceInfo, ipAddress})
    const accessToken = signToken(user.id, ACCESS_TOKEN_EXPIRE);

    res.status(200).json({
      user,
      accessToken,
      refreshToken
    });
  } catch (err) {
    next(err);
  }
};
export const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    const user = await registerService({
      username,
      email,
      password,
    });

    res.status(201).json({
      user,
    });
  } catch (error) {
    next(error);
  }
}
export const getCurrentUser = async (req, res, next) => {
  try {
    const userId = req.user.id;
    if (!userId) {
      throw createError(401, "Unauthorized");
    }
    const user = await findUserById({userId});
    res.status(200).json({
      user
    });
  } catch (error) {
    next(error);
  }
}
export const logout = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const refreshToken = req.body.refreshToken;
    if (!userId || !refreshToken) {
      throw createError(404, "Not found");
    }
    await revokeRefreshTokenService({userId, token: refreshToken});
    res.status(200).json({
      message: "Logged out successfully"
    });
  } catch (error) {
    next(error);
  }
}