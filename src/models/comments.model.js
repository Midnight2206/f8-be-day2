import { loadDB, saveDB } from "../../utils/jsonDB.js";
import { nanoid } from "nanoid";
import createHttpError from "http-errors";

export const findCommentsByPostId = async (postId) => {
  const comments = await loadDB("comments");
  return comments.filter((comment) => comment.postId === postId);
};

export const createComment = async ({ postId, author, content }) => {
  if (!author || !content) {
    throw createHttpError(400, "Author and content are required");
  }

  const comments = await loadDB("comments");

  const newComment = {
    id: nanoid(),
    postId,
    author,
    content,
    createdAt: new Date().toISOString(),
  };

  comments.push(newComment);
  await saveDB("comments", comments);

  return newComment;
};

export const updateComment = async (commentId, content) => {
  const comments = await loadDB("comments");

  const index = comments.findIndex((c) => c.id === commentId);
  if (index === -1) {
    throw createHttpError(404, "Comment not found");
  }

  comments[index].content = content;
  comments[index].updatedAt = new Date().toISOString();

  await saveDB("comments", comments);
  return comments[index];
};

export const deleteComment = async (commentId) => {
  const comments = await loadDB("comments");

  const index = comments.findIndex((c) => c.id === commentId);
  if (index === -1) {
    throw createHttpError(404, "Comment not found");
  }

  const deleted = comments.splice(index, 1)[0];
  await saveDB("comments", comments);

  return deleted;
};
