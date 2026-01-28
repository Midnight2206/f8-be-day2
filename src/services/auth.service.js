import {
  createUser,
  findUserByEmailOrUsername,
  changePassword,
} from "#src/models/auth.model.js";
import { findUserById } from "#src/models/auth.model.js";
import { generateId } from "#utils/generateId.js";
import createError from "http-errors";
import bcrypt from "bcryptjs";
import { enqueue } from "../../queue/memory.queue.js";

export const checkLoginService = async ({ password, identifier }) => {
  const user = await findUserByEmailOrUsername({ identifier });
  if (!user) throw createError(401, "Invalid credentials");

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) throw createError(401, "Invalid credentials");
  return user;
};
export const registerService = async ({ username, email, password }) => {
  const SALT_ROUNDS = Number(process.env.SALT_ROUNDS) || 10;

  const existedUser = await findUserByEmailOrUsername({ identifier: email });
  if (existedUser) {
    throw createError(409, "Email or username already exists");
  }

  const id = generateId();
  const now = new Date();

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  const user = await createUser({
    id,
    username,
    email,
    password: hashedPassword,
    createdAt: now,
    updatedAt: now,
  });
  await enqueue(
    "sendVerificationEmail",
    {
      userId: user.id,
      email: user.email,
    },
    {
      maxAttempts: 5,
    }
  );
  return user;
};
export const getUserService = async ({ userId }) => {
  const user = await findUserById({ userId });
  if (!user) {
    throw createError(404, "User not found");
  }
  return user;
};
export const changePasswordService = async ({
  userId,
  password,
  newPassword,
}) => {
  const SALT_ROUNDS = Number(process.env.SALT_ROUNDS) || 10;
  const user = await findUserById({ userId });
  if (!user) throw createError(404, "User not found");
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw createError(401, "Old password is incorrect");
  }
  const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);
  const success = await changePassword({ userId, password: hashedPassword });
  await enqueue(
    "sendPasswordChangedEmail",
    {
      email: user.email,
    },
    {
      maxAttempts: 5,
    }
  );
  return success;
};
