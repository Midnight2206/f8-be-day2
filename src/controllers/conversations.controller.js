import {
    createConversationService,
    addParticipantToConversationService,
    changeParticipantRoleService,
    removeParticipantFromConversationService,
    leaveConversationService,
    getUserConversationsService
} from "#src/services/conversation.service.js"
export const getUserConversations = async (req, res, next) => {
    const userId = req.user.id;
    const { search, type } = req.validatedQuery;
    try {
        const conversations = await getUserConversationsService({ userId, search, type });
        res.success(conversations);
    } catch (error) {
        next(error);
    }
}
export const createConversation = async (req, res, next) => {
    const { name, type, participantIds } = req.body;
    const userId = req.user.id;
    try {
        const conversation = await createConversationService(name, type, userId, participantIds);
        res.success(conversation, 201);
    } catch (error) {
        next(error);
    }
}
export const addParticipantToConversation = async (req, res, next) => {
    const { conversationId } = req.params;
    const { role, userId } = req.body;
    const addedBy = req.user.id;
    try {
        await addParticipantToConversationService(
            conversationId,
            userId,
            role,
            addedBy
        );
        res.success({ message: "Participant added successfully" });
    } catch (error) {
        next(error);
    }
}
export const changeParticipantRole = async (req, res, next) => {
    const { conversationId, userId } = req.params;
    const { newRole } = req.body;
    const actorId = req.user.id;
    try {
        await changeParticipantRoleService({
            conversationId,
            targetUserId: userId,
            newRole,
            actorId
        });
        res.success({ message: "Participant role updated successfully" });
    }
    catch (error) {
        next(error);
    }
}
export const removeParticipantFromConversation = async (req, res, next) => {
    const { conversationId, userId } = req.params;
    const removedBy = req.user.id;
    try {
        await removeParticipantFromConversationService(
            conversationId,
            userId,
            removedBy
        );
        res.success({ message: "Participant removed successfully" });
    } catch (error) {
        next(error);
    }
}
export const leaveConversation = async (req, res, next) => {
    const { conversationId } = req.params;
    const userId = req.user.id;
    try {
        await leaveConversationService(conversationId, userId);
        res.success({ message: "Left the conversation successfully" });
    } catch (error) {
        next(error);
    }
}