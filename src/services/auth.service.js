import { createUser, findUserByEmailOrUsername } from "#src/models/auth.model.js";
import { generateId } from "#utils/generateId.js";
import createError from "http-errors";
import bcrypt from "bcryptjs";


export const checkLoginService = async ({password, identifier}) => {
  const user = await findUserByEmailOrUsername({identifier});
      if (!user) throw createError(401, "Invalid credentials");
  
      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) throw createError(401, "Invalid credentials");
      return user;
  
}
export const registerService = async ({ username, email, password }) => {
  const SALT_ROUNDS = Number(process.env.SALT_ROUNDS) || 10;

  const existedUser = await findUserByEmailOrUsername({identifier:email});
  if (existedUser) {
    throw createError(409, "Email or username already exists");
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
export const getUserService = async ({userId}) => {
      const user = await findUserById({userId});
      if (!user) {
        throw createError(404, "User not found");
      }
      return user;
}
