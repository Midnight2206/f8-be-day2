import { createUser, findUserByEmailOrUsername } from "#src/models/auth.model.js";
import { generateId } from "#utils/generateId.js";
import bcrypt from "bcryptjs";
import createHttpError from "http-errors";

export const registerService = async ({ username, email, password }) => {
  const SALT_ROUNDS = Number(process.env.SALT_ROUNDS) || 10;

  const existedUser = await findUserByEmailOrUsername({identifier:email});
  if (existedUser) {
    throw createHttpError(409, "Email or username already exists");
  }

  const id = generateId();
  const now = new Date();

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  return createUser({
    id,
    username,
    email,
    password: hashedPassword,
    createdAt: now,
    updatedAt: now,
  });
};
