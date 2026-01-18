import { z } from "zod";

export const getAllMessagesParamsSchema = z.object({
    conversationId: z.coerce
      .number()
      .int("conversationId must be an integer")
      .positive("conversationId must be a positive number"),
});
export const sendMessageBodySchema = z.object({
    content: z.string()
      .min(1, "Content must be at least 1 character long")
      .max(1000, "Content must be at most 1000 characters long"),
    type: z.enum(["text", "media", "file"]).default("text"),
})
.refine(
    data => {
      if (data.type === "text") return true;
      return /^https?:\/\//.test(data.content);
    },
    {
      message: "Content must be a valid URL for media/file message",
      path: ["content"],
    });
export const sendMessageParamsSchema = z.object({
    conversationId: z.coerce
      .number()
      .int("conversationId must be an integer")
      .positive("conversationId must be a positive number"),
});