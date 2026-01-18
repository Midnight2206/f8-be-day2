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
import { authentication } from "#middlewares/authentication.js";

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
  authentication,
  validateQuery(getUserConversationsQuerySchema),
  getUserConversations
);
router.post(
  "/",
  authentication,
  validateData(createConversationBodySchema),
  createConversation
);
router.post(
  "/:conversationId/participants/",
  authentication,
  validateParams(addParticipantParamsSchema),
  validateData(addParticipantBodySchema),
  addParticipantToConversation
);

router.patch(
  "/:conversationId/participants/:userId/role",
  authentication,
  validateParams(changeParticipantRoleParamsSchema),
  validateData(changeParticipantRoleBodySchema),
  changeParticipantRole
);
router.delete(
  "/:conversationId/participants/:userId",
  authentication,
  validateParams(removeParticipantParamsSchema),
  removeParticipantFromConversation
);
router.delete(
  "/:conversationId/participants/me",
  authentication,
  validateParams(leaveConversationParamsSchema),
  leaveConversation
);
router.post(
  "/:conversationId/read",
  authentication,
  validateParams(markLastMessageParamSchema),
  validateData(markLastMessageBodySchema),
  markLastMessageRead
);
export default router;
