import { getExecutor } from "#src/helper/dbExecutor.js";
export const insertConversationParticipant = async ({
  conversationId,
  userId,
  role,
  addedBy,
  connection,
}) => {
  const now = new Date();
  if (role === "owner") addedBy = null;
  const executor = getExecutor(connection);
  await executor(
    `
    INSERT INTO conversation_participants (conversation_id, user_id, role, added_by, joined_at)
    VALUES (?, ?, ?, ?, ?)
    `,
    [conversationId, userId, role, addedBy, now]
  );
};
export const insertParticipants = async (
  participants,
  connection
) => {
  if (!participants || !participants.length) return;

  const values = participants.map((p) => [
    p.conversationId,
    p.userId,
    p.role,
    p.joinedAt,
    p.addBy,
  ]);

  const [result] = await connection.query(
    `
    INSERT INTO conversation_participants
      (conversation_id, user_id, role, joined_at, added_by)
    VALUES ?
    `,
    [values]
  );

  return result;
};

export const findParticipantByUserAndConversation = async ({
  userId,
  conversationId,
  connection,
}) => {
  const executor = getExecutor(connection);
  const [rows] = await executor(
    `
    SELECT * FROM conversation_participants
    WHERE user_id = ? AND conversation_id = ? AND left_at IS NULL
    `,
    [userId, conversationId]
  );
  return rows[0] || null;
};
export const findParticipantsForUpdate = async ({
  conversationId,
  userIds,
  connection,
}) => {
  const executor = connection
    ? connection.execute.bind(connection)
    : mysqlPool.execute.bind(mysqlPool);

  const placeholders = userIds.map(() => "?").join(",");

  const [rows] = await executor(
    `
    SELECT user_id, role
    FROM conversation_participants
    WHERE conversation_id = ?
      AND user_id IN (${placeholders})
      AND left_at IS NULL
    FOR UPDATE
    `,
    [conversationId, ...userIds]
  );

  return rows;
};

export const updateConversationParticipantRole = async ({
  conversationId,
  userId,
  newRole,
  connection,
}) => {
  const executor = getExecutor(connection);
  await executor(
    `
    UPDATE conversation_participants
    SET role = ?
    WHERE conversation_id = ? AND user_id = ? AND left_at IS NULL
    `,
    [newRole, conversationId, userId]
  );
};
export const softDeleteParticipant = async ({
  conversationId,
  userId,
  leftBy,
  leftAt,
  connection,
}) => {
  await connection.execute(
    `
    UPDATE conversation_participants
    SET left_at = ?,
        left_by = ?
    WHERE conversation_id = ?
      AND user_id = ?
      AND left_at IS NULL
    `,
    [leftAt, leftBy, conversationId, userId]
  );
};
export const updateLastMessageRead = async ({
  conversationId,
  userId,
  lastMessageId,
  }) => {
    const executor = getExecutor();
    await executor(
      `
      UPDATE conversation_participants
      SET last_message_read = ?
      WHERE conversation_id = ? AND user_id = ? AND left_at IS NULL
      `,
      [lastMessageId, conversationId, userId]
    );
  } 