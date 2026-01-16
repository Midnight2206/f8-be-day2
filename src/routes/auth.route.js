import express from "express";
import { login, register, getCurrentUser, logout} from "#controllers/auth.controller.js";
import { refreshTokenHandler } from "#src/controllers/refreshToken.controller.js";
import { validateData } from "#src/middlewares/validateData.js";
import { loginSchema, registerSchema } from "#src/schemas/auth.schema.js";
import { authentication } from "#src/middlewares/authentication.js";
const router = express.Router();

router.post("/login", validateData(loginSchema), login);
router.post("/logout", authentication, logout);
router.post("/register", validateData(registerSchema), register)
router.post("/refresh-token", refreshTokenHandler)
router.get("/me", authentication, getCurrentUser)

export default router;
