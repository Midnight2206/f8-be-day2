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
import { authentication } from "#src/middlewares/authentication.js";
const router = express.Router({ mergeParams: true });
router.get(
  "/",
  authentication,
  validateParams(getAllMessagesParamsSchema),
  getAllMessagesInConversation
);
router.post(
  "/",
  authentication,
  validateParams(sendMessageParamsSchema),
  validateData(sendMessageBodySchema),
  sendMessage
);

export default router;
