import { getExecutor} from "#src/helper/dbExecutor.js"
const conversationMap = (row) => ({
  id: row.id,
  name: row.name,
  type: row.type,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
  lastMessageId: row.last_message_id || null,
});


export const findConversationsByUserId = async ({
  userId,
  search = null,
  type = null,
}) => {
  const executor = getExecutor();

  const [rows] = await executor(
    `
    SELECT
      c.id,
      c.name,
      c.type,
      c.created_at,
      c.updated_at,
      c.last_message_id
    FROM conversations c
    JOIN conversation_participants cp
      ON cp.conversation_id = c.id
    WHERE cp.user_id = ?
      AND cp.left_at IS NULL
      AND (
        ? IS NULL
        OR c.name LIKE CONCAT('%', ?, '%')
      )
      AND (
        ? IS NULL
        OR c.type = ?
      )
    `,
    [
      userId,
      search,
      search,
      type,
      type,
    ]
  );

  return rows.map(conversationMap);
};
export const findConversationById = async ({id, connection}) => {
  const executor = getExecutor(connection);
  const [rows] = await executor(
    `
    SELECT id, name, type, created_at, updated_at
    FROM conversations
    WHERE id = ?
    `,
    [id]
  );

  if (!rows.length) return null;

  return conversationMap(rows[0]);
};

export const createConversation = async ({name, type, connection}) => {
  const executor = getExecutor(connection);
  const now = new Date();
  const [result] = await executor(
    `
    INSERT INTO conversations (name, type, created_at, updated_at)
    VALUES (?, ?, ?, ?)
    `,
    [name, type, now, now]
  );
  return conversationMap({
    id: result.insertId,
    name,
    type,
    created_at: now,
    updated_at: now
  })
}