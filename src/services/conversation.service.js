import { createConversation, findConversationsByUserId } from "#models/conversations.model.js";
import {
  insertConversationParticipant,
  findParticipantByUserAndConversation,
  updateConversationParticipantRole,
  findParticipantsForUpdate,
  softDeleteParticipant
} from "#models/conversation_participants.model.js";
import mysqlPool from "#configs/database.js";
import {
  ALL_CONVERSATION_ROLES,
  CONVERSATION_ROLES,
  ADD_PARTICIPANT_PERMISSION,
} from "#src/constants/conversation.js";
import createHttpError from "http-errors";

export const createConversationService = async (name, type, userId) => {
  const connection = await mysqlPool.getConnection();
  try {
    await connection.beginTransaction();
    const conversation = await createConversation({ name, type, connection });
    await insertConversationParticipant({
      conversationId: conversation.id,
      userId,
      role: CONVERSATION_ROLES.OWNER,
      addedBy: null,
      connection,
    });
    await connection.commit();
    return conversation;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};
export const addParticipantToConversationService = async (
  conversationId,
  userId,
  role,
  addedBy
) => {
  if (!ALL_CONVERSATION_ROLES.includes(role)) {
    throw createHttpError(400, "Invalid role");
  }
  if (addedBy === userId) {
    throw createHttpError(400, "You cannot add yourself");
  }
  const connection = await mysqlPool.getConnection();

  try {
    await connection.beginTransaction();

    const actor = await findParticipantByUserAndConversation({
      userId: addedBy,
      conversationId,
      connection,
    });

    if (!actor) {
      throw createHttpError(
        403,
        "You are not a participant of this conversation"
      );
    }

    const allowedRoles = ADD_PARTICIPANT_PERMISSION[actor.role] || [];
    if (!allowedRoles.includes(role)) {
      throw createHttpError(
        403,
        "You do not have permission to add participants"
      );
    }

    const target = await findParticipantByUserAndConversation({
      userId,
      conversationId,
      connection,
    });

    if (target) {
      throw createHttpError(
        409,
        "User is already a participant of this conversation"
      );
    }

    await insertConversationParticipant({
      conversationId,
      userId,
      role,
      addedBy,
      connection,
    });

    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};
export const changeParticipantRoleService = async ({
  actorId,
  conversationId,
  targetUserId,
  newRole,
}) => {
  if (!ALL_CONVERSATION_ROLES.includes(newRole)) {
    throw createHttpError(422, "Invalid role");
  }

  if (newRole === CONVERSATION_ROLES.OWNER) {
    throw createHttpError(400, "Cannot assign owner role");
  }
  const connection = await mysqlPool.getConnection();

  try {
    await connection.beginTransaction();

    const rows = await findParticipantsForUpdate({
      conversationId,
      userIds: [actorId, targetUserId],
      connection,
    });

    const actor = rows.find(r => r.user_id === actorId);
    const target = rows.find(r => r.user_id === targetUserId);

    if (!actor) {
      throw createHttpError(403, "You are not a participant");
    }

    if (actor.role !== CONVERSATION_ROLES.OWNER) {
      throw createHttpError(403, "Only owner can change roles");
    }

    if (!target) {
      throw createHttpError(404, "Target participant not found");
    }

    if (target.role === CONVERSATION_ROLES.OWNER) {
      throw createHttpError(400, "Cannot change owner role");
    }
    if (target.role === newRole) {
      throw createHttpError(422, "Role is already set");
    }
    await updateConversationParticipantRole({
      conversationId,
      userId: targetUserId,
      newRole,
      connection,
    });

    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};
export const removeParticipantFromConversationService = async (
  conversationId,
  userId,
  removedBy
) => {
  const connection = await mysqlPool.getConnection();
  try {
    if (userId === removedBy) {
      throw createHttpError(400, "You cannot remove yourself");
    }
    await connection.beginTransaction();

    const participant = await findParticipantsForUpdate({
      userId,
      conversationId,
      connection,
    });
    
    if (!participant) {
      throw createHttpError(
        404,
        "Participant not found in this conversation"
      );
    }
    const actor = await findParticipantByUserAndConversation({
      userId: removedBy,
      conversationId,
      connection,
    });
    
    if (!actor) {
      throw createHttpError(
        403,
        "You are not a participant of this conversation"
      );
    }
    if (actor.role !== CONVERSATION_ROLES.OWNER) {
      throw createHttpError(
        403,
        "Only owner can remove participants from the conversation"
      );
    }
    const leftBy = removedBy;
    const leftAt = new Date();
    await softDeleteParticipant({
      conversationId,
      userId,
      leftBy,
      leftAt,
      connection,
    });
    
    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}
export const leaveConversationService = async (conversationId, userId) => {
  const connection = await mysqlPool.getConnection();
  try {
    await connection.beginTransaction();

    const participant = await findParticipantByUserAndConversation({
      userId,
      conversationId,
      connection,
    });

    if (!participant) {
      throw createHttpError(404, "You are not a participant of this conversation");
    }
    
    if (participant.role === CONVERSATION_ROLES.OWNER) {
      throw createHttpError(400, "Owner cannot leave the conversation");
    }
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}
export const getUserConversationsService = async ({ userId, search, type}) => {
  const conversations = await findConversationsByUserId({ userId, search, type });
  return conversations;
}