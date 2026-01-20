import express from "express";
import {
  validateData,
  validateParams,
  validateQuery,
} from "#middlewares/validateData.js";
import {
  getAllMessagesParamsSchema,
  sendMessageBodySchema,
  sendMessageParamsSchema,
} from "#src/schemas/message.schema.js";
import {
  getAllMessagesInConversation,
  sendMessage,
} from "#src/controllers/messages.controller.js";
import { authRequired } from "#src/middlewares/authRequired.js";
const router = express.Router({ mergeParams: true });
router.get(
  "/",
  authRequired,
  validateParams(getAllMessagesParamsSchema),
  getAllMessagesInConversation
);
router.post(
  "/",
  authRequired,
  validateParams(sendMessageParamsSchema),
  validateData(sendMessageBodySchema),
  sendMessage
);

export default router;
