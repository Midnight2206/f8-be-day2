import { getExecutor} from "#src/helper/dbExecutor.js"
const userMap = (user) => {
  if (!user) return null;
  return {
    id: user.id,
    email: user.email,
    username: user.username,
    createdAt: user.created_at,
    updatedAt: user.updated_at,
    emailVerifiedAt: user.email_verified_at,
    password: user.password,
  }
}
export const findUserByEmailOrUsername = async ({identifier}) => {
  const executor = getExecutor();
  const [rows] = await executor(
    "SELECT * FROM users WHERE email = ? OR username = ? LIMIT 1",
    [identifier, identifier]
  );
  return userMap(rows[0]);
}
export const createUser = async ({
  id,
  email,
  username,
  password,
  createdAt,
  updatedAt,
}) => {
  const executor = getExecutor();
  const [result] = await executor(
    `
    INSERT INTO users
      (id, email, username, password, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?)
    `,
    [id, email, username, password, createdAt, updatedAt]
  );
  console.log(result);
  return {
    id,
    email,
    username,
  };
};
export const findUserById = async ({userId}) => {
  const executor = getExecutor();
  const [rows] = await executor(
    `SELECT * FROM users WHERE id = ? LIMIT 1`,
    [userId]
  );
  return userMap(rows[0]);
}