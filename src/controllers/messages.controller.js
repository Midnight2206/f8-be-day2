import {
  markLastMessageReadService,
  getAllMessagesInConversationService,
  sendMessageService
} from "#src/services/messages.service.js";
export const markLastMessageRead = async (req, res) => {
  const userId = req.user.id;
  const { conversationId } = req.params;

  await markLastMessageReadService({ userId, conversationId });
  res.success(null, 204);
};
export const getAllMessagesInConversation = async (req, res) => {
  const { conversationId } = req.params;
  const userId = req.user.id;
  const messages = await getAllMessagesInConversationService({
    conversationId,
    userId,
  });
  res.success(messages);
};
export const sendMessage = async (req, res) => {
  const { conversationId } = req.params;
  const senderId = req.user.id;
  const { content, type } = req.body;

  const message = await sendMessageService({
    conversationId,
    senderId,
    content,
    type,
  });
  res.success(message, 201);
};
