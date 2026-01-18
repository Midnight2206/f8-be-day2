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
  participantIds: z
  .array(
    z.coerce
      .number({
        invalid_type_error: "participantId must be a number",
      })
      .int("participantId must be an integer")
      .min(1, "participantId must be >= 1")
  )
  .min(1, "participantIds must contain at least one user")
  .optional(),

});

export const addParticipantBodySchema = z.object({
  userId: z.coerce
    .number()
    .int("userId must be an integer")
    .positive("userId must be a positive number"),

  role: z
    .enum(["member", "admin", "owner"], {
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
export const markLastMessageParamSchema = z.object({
    conversationId: z.coerce
      .number()
      .int("conversationId must be an integer")
      .positive("conversationId must be a positive number"),
  });
export const markLastMessageBodySchema = z.object({
    lastMessageId: z.coerce
      .number()
      .int("lastMessageId must be an integer")
      .positive("lastMessageId must be a positive number"),
  });