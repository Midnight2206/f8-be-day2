import createError from "http-errors";
import { createRefreshTokenService, revokeRefreshTokenService, addTokenToBlackList } from "#src/services/refreshTokenService.service.js";
import { registerService, checkLoginService, getUserService } from "#src/services/auth.service.js";
import { signToken } from "#utils/jwt.js";
const ACCESS_TOKEN_EXPIRE = process.env.ACCESS_TOKEN_EXPIRE

export const login = async (req, res, next) => {
  try {
    const { identifier, password } = req.body; 
    const deviceInfo = req.headers["user-agent"] || null;
    const ipAddress = req.headers["x-forwarded-for"]?.split(",")[0] || req.ip;
    const user = await checkLoginService({identifier, password});
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

    res.success(user, 201);
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
    const user = await getUserService({userId});
    res.success(user);
  } catch (error) {
    next(error);
  }
}
export const logout = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const token = req.user.token;
    const exp = req.user.exp
    
    // const refreshToken = req.body.refreshToken;
    // if (!userId || !refreshToken) {
    //   throw createError(401, "Unauthorized");
    // }
    // await revokeRefreshTokenService({userId, token: refreshToken});
    // res.status(200).json({
    //   message: "Logged out successfully"
    // });
    if(!userId || !token) {
      throw createError(401, "Unauthorized");
    }
    await addTokenToBlackList({token, exp});
    res.success({message: "Logged out successfully"});
  } catch (error) {
    next(error);
  }
}