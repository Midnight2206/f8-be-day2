import express from "express";
import { login, register, getCurrentUser, logout, changePassword} from "#controllers/auth.controller.js";
import { refreshTokenHandler } from "#src/controllers/refreshToken.controller.js";
import { validateData } from "#src/middlewares/validateData.js";
import { loginSchema, registerSchema, changePasswordSchema } from "#src/schemas/auth.schema.js";
import { authRequired } from "#src/middlewares/authRequired.js";
const router = express.Router();

router.post("/login", validateData(loginSchema), login);
router.post("/logout", authRequired, logout);
router.post("/register", validateData(registerSchema), register)
router.post("/refresh-token", refreshTokenHandler)
router.post("/change-password", authRequired, validateData(changePasswordSchema), changePassword)
router.get("/me", authRequired, getCurrentUser)

export default router;
