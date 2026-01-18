import mysqlPool from "#configs/database.js";
import createHttpError from "http-errors";
import {
  updateLastMessageRead,
  findParticipantByUserAndConversation,
} from "#src/models/conversation_participants.model.js";
import {
  getAllMessagesInConversation,
  insertMessage,
} from "#src/models/messages.model.js";
import { findConversationById } from "#src/models/conversations.model.js";
export const markLastMessageReadService = async ({
  userId,
  conversationId,
  lastMessageId,
}) => {
  await updateLastMessageRead({ userId, conversationId, lastMessageId });
};
export const getAllMessagesInConversationService = async ({
  conversationId,
  userId,
}) => {
  const conversation = await findConversationById({ id: conversationId });
  if (!conversation) throw createHttpError(404, "Conversation not found");
  const participant = await findParticipantByUserAndConversation({
    userId,
    conversationId,
  });
  if (!participant)
    throw createHttpError(
      403,
      "You are not a participant of this conversation"
    );
  return await getAllMessagesInConversation({ conversationId });
};
export const sendMessageService = async ({
  conversationId,
  senderId,
  content,
  type,
  kind,
}) => {
  const connection = await mysqlPool.getConnection();
  try {
    await connection.beginTransaction();
    const now = new Date();
    const conversation = await findConversationById({
      id: conversationId,
      connection,
    });
    if (!conversation) throw createHttpError(404, "Conversation not found");
    const participant = await findParticipantByUserAndConversation({
      userId: senderId,
      conversationId,
      connection,
    });
    if (!participant)
      throw createHttpError(
        403,
        "You are not a participant of this conversation"
      );
    const message = await insertMessage({
      conversationId,
      senderId,
      content,
      type,
      kind,
      createdAt: now,
      connection,
    });
    await connection.commit();
    return message;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};
