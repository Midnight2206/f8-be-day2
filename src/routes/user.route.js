import express from "express";
import {searchUserByEmail} from "#controllers/user.controller.js";
import { validateQuery } from "#src/middlewares/validateData.js";
import { searchUserByEmailQuerySchema } from "#src/schemas/user.schema.js";
const router = express.Router();

router.get("/search", validateQuery(searchUserByEmailQuerySchema), searchUserByEmail);

export default router;
