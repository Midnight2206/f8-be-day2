import { z } from "zod";
import {
  ALL_CONVERSATION_ROLES,
  CONVERSATION_TYPES
} from "#src/constants/conversation.js";

export const getUserConversationsQuerySchema = z.object({
  search: z
    .string()
    .trim()
    .max(255, "Search query is too long")
    .optional()
    .transform((v) => (v === "" ? undefined : v)),

  type: z
    .enum(CONVERSATION_TYPES, {
      errorMap: () => ({ message: "Invalid conversation type" }),
    })
    .optional(),
});

export const addParticipantParamsSchema = z.object({
  conversationId: z.coerce
    .number()
    .int("conversationId must be an integer")
    .positive("conversationId must be a positive number"),
});


export const createConversationBodySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Conversation name is required")
    .max(255, "Conversation name is too long"),

  type: z
    .enum(CONVERSATION_TYPES, {
      errorMap: () => ({ message: "Invalid conversation type" }),
    }),
});

export const addParticipantBodySchema = z.object({
  userId: z.coerce
    .number()
    .int("userId must be an integer")
    .positive("userId must be a positive number"),

  role: z
  .enum(ALL_CONVERSATION_ROLES, {
    errorMap: () => ({ message: "Invalid role" }),
  })
  .optional(),
});
export const changeParticipantRoleBodySchema = z.object({
  userId: z.coerce
    .number()
    .int("userId must be an integer")
    .positive("userId must be a positive number"),

  newRole: z.enum(ALL_CONVERSATION_ROLES, {
    errorMap: () => ({ message: "Invalid role" }),
  }),
});
export const changeParticipantRoleParamsSchema = z.object({
  conversationId: z.coerce
    .number()
    .int("conversationId must be an integer")
    .positive("conversationId must be a positive number"),
});
export const removeParticipantParamsSchema = z.object({
  conversationId: z.coerce
    .number()
    .int("conversationId must be an integer")
    .positive("conversationId must be a positive number"),
  userId: z.coerce
    .number()
    .int("userId must be an integer")
    .positive("userId must be a positive number"),
});
export const leaveConversationParamsSchema = z.object({
  conversationId: z.coerce
    .number()
    .int("conversationId must be an integer")
    .positive("conversationId must be a positive number"),
});