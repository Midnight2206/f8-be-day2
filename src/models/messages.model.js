import { getExecutor } from "#src/helper/dbExecutor.js";

export const getAllMessagesInConversation = async ({ conversationId }) => {
  const executor = getExecutor();

  const [rows] = await executor(
    `
    SELECT
      m.id,
      m.conversation_id,
      m.content,
      m.type,
      m.kind,
      m.created_at,
      m.sender_id,
      u.email AS sender_email,
      u.username AS sender_username
    FROM messages m
    LEFT JOIN users u ON u.id = m.sender_id
    WHERE m.conversation_id = ?
      AND m.deleted_at IS NULL
    ORDER BY m.created_at ASC
    `,
    [conversationId]
  );

  return rows || [];
};

export const insertMessage = async ({ conversationId, senderId, content, type = "text", kind = "user", createdAt, connection}) => {
    const executor = getExecutor(connection);
    const [result] = await executor(
        `
        INSERT INTO messages ( conversation_id, sender_id, content, type, kind, created_at)
        VALUES (?, ?, ?, ?, ?, ?)
        `,
        [conversationId, senderId, content, type, kind, createdAt]
    );
    return {
        id: result.insertId,
        conversationId,
        senderId,
        content,
        type,
        kind,
        createdAt
    }
}

export const updateMessage = async ({messageId, content, updatedAt, userId}) => {
    const executor = getExecutor();
    await executor(
        `
        UPDATE messages
        SET content = ?, updated_at = ?
        WHERE id = ? AND sender_id = ?
        AND deleted_at IS NULL
        `,
        [content, updatedAt, messageId, userId]
    );
}
export const deleteMessage = async ({messageId, deletedAt, userId}) => {
    const executor = getExecutor();
    await executor(
        `
        UPDATE messages
        SET deleted_at = ?
        WHERE id = ? AND sender_id = ?
        AND deleted_at IS NULL
        `,
        [deletedAt, messageId, userId]
    );
}