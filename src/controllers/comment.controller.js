import asyncHandler from "../../utils/asyncHandler.js";
import {
  findCommentsByPostId,
  createComment,
  updateComment,
  deleteComment,
} from "#src/models/comment.model.js";

export const getComments = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const comments = await findCommentsByPostId(postId);

  res.json({
    success: true,
    message: "Comments retrieved successfully",
    data: comments,
  });
});

export const addComment = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const { author, content } = req.body;

  const newComment = await createComment({
    postId,
    author,
    content,
  });

  res.status(201).json({
    success: true,
    message: "Comment added successfully",
    data: newComment,
  });
});

export const updateCommentById = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const { content } = req.body;

  const updated = await updateComment(commentId, content);

  res.json({
    success: true,
    message: "Comment updated successfully",
    data: updated,
  });
});

export const deleteCommentById = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  const deleted = await deleteComment(commentId);

  res.json({
    success: true,
    message: "Comment deleted successfully",
    data: deleted,
  });
});
