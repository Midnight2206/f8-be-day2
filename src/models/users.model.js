import { getExecutor} from "#src/helper/dbExecutor.js"
const userMap = (row) => ({
  id: row.id,
  username: row.username,
  email: row.email,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
  emailVerifiedAt: row.email_verified_at,
});
export const findUserById = async ({id, connection}) => {
  const executor = getExecutor(connection);
  const [rows] = await executor(
    `
    SELECT id, username, email, created_at, updated_at, email_verified_at
    FROM users
    WHERE id = ? AND deleted_at IS NULL
    `,
    [id]
  );

  if (!rows.length) return null;

  return userMap(rows[0]);
}
export const findUserByEmail = async ({email, connection}) => {
  const executor = getExecutor(connection);
  const [rows] = await executor(
    `
    SELECT id, username, email, created_at, updated_at, email_verified_at
    FROM users
    WHERE email = ? AND deleted_at IS NULL
    `,
    [email]
  );

  if (!rows.length) return null;

  return userMap(rows[0]);
}