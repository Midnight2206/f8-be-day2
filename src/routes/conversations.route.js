import { Router } from "express";

import {
  createConversation,
  addParticipantToConversation,
  changeParticipantRole,
  removeParticipantFromConversation,
  leaveConversation,
  getUserConversations,
} from "#controllers/conversations.controller.js";
import { markLastMessageRead } from "#controllers/messages.controller.js";

import {
  validateData,
  validateParams,
  validateQuery,
} from "#middlewares/validateData.js";
import { authRequired } from "#middlewares/authRequired.js";

import {
  createConversationBodySchema,
  addParticipantBodySchema,
  addParticipantParamsSchema,
  changeParticipantRoleParamsSchema,
  changeParticipantRoleBodySchema,
  removeParticipantParamsSchema,
  leaveConversationParamsSchema,
  getUserConversationsQuerySchema,
  markLastMessageBodySchema,
  markLastMessageParamSchema,
} from "#schemas/conversation.schema.js";

const router = Router();
router.get(
  "/me",
  authRequired,
  validateQuery(getUserConversationsQuerySchema),
  getUserConversations
);
router.post(
  "/",
  authRequired,
  validateData(createConversationBodySchema),
  createConversation
);
router.post(
  "/:conversationId/participants/",
  authRequired,
  validateParams(addParticipantParamsSchema),
  validateData(addParticipantBodySchema),
  addParticipantToConversation
);

router.patch(
  "/:conversationId/participants/:userId/role",
  authRequired,
  validateParams(changeParticipantRoleParamsSchema),
  validateData(changeParticipantRoleBodySchema),
  changeParticipantRole
);
router.delete(
  "/:conversationId/participants/:userId",
  authRequired,
  validateParams(removeParticipantParamsSchema),
  removeParticipantFromConversation
);
router.delete(
  "/:conversationId/participants/me",
  authRequired,
  validateParams(leaveConversationParamsSchema),
  leaveConversation
);
router.post(
  "/:conversationId/read",
  authRequired,
  validateParams(markLastMessageParamSchema),
  validateData(markLastMessageBodySchema),
  markLastMessageRead
);
export default router;
