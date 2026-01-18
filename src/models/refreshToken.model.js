import { getExecutor } from "#src/helper/dbExecutor.js";
import createError from "http-errors";

export const findValidRefreshToken = async ({token}) => {
  const executor = getExecutor();
  const [rows] = await executor(
    `
    SELECT *
    FROM refresh_tokens
    WHERE token = ?
      AND revoked = FALSE
      AND expires_at > ?
    LIMIT 1
    `,
    [token, new Date()]
  );

  if (!rows.length) {
    throw createError(401, "Unauthorized");
  }

  return rows[0];
};

export const revokeRefreshToken = async (id) => {
  const executor = getExecutor();
  await executor(
    `UPDATE refresh_tokens SET revoked = TRUE WHERE id = ?`,
    [id]
  );
};

export const insertRefreshToken = async ({
  userId,
  token,
  deviceInfo,
  ipAddress,
  createdAt,
  expiresAt,
}) => {
  const executor = getExecutor();
  await executor(
    `
    INSERT INTO refresh_tokens
      (user_id, token, device_info, ip_address, created_at, expires_at)
    VALUES (?, ?, ?, ?, ?, ?)
    `,
    [userId, token, deviceInfo, ipAddress, createdAt, expiresAt]
  );
};
export const resetRefreshToken = async (tokenId, {token, createdAt, expiresAt}) => {
  const executor = getExecutor();
  const [result] = await executor(
    `UPDATE refresh_tokens
    SET token = ?, created_at = ?, expires_at = ?
    WHERE id = ? AND revoked = FALSE AND expires_at > NOW();
    `,
    [token, createdAt, expiresAt, tokenId]
  )
  if (result.affectedRows === 0) {
    throw createError(401, "Unauthorized");
  }
}
export const deleteRefreshToken = async ({userId, token}) => {
  const executor = getExecutor();
  await executor(
    `UPDATE refresh_tokens
     SET revoked = 1
     WHERE user_id = ? AND token = ?`,
    [userId, token]
  );
}
