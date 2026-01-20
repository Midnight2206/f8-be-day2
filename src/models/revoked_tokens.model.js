import { getExecutor} from "#src/helper/dbExecutor.js"

export const insertRevokedToken = async ({token, expiresAt}) => {
  const executor = getExecutor();
  const [result] = await executor(
    `
    INSERT INTO revoked_tokens
      (token, expired_at)
    VALUES (?, ?)
    `,
    [token, expiresAt]
  );
  return result;
}
export const isTokenRevoked = async (token) => {
  const executor = getExecutor();
  const [rows] = await executor(
    `
    SELECT id FROM revoked_tokens
    WHERE token = ? AND expired_at > NOW()
    `,
    [token]
  );
  return rows.length > 0;
}