import { getExecutor } from "#src/helper/dbExecutor.js";
import createHttpError from "http-errors";

// Hàm map MySQL row → camelCase JSON
const mapComment = (row) => ({
  id: row.id.toString(),
  postId: row.post_id.toString(),
  author: row.author,
  content: row.content,
  createdAt: row.created_at.toISOString(),
  updatedAt: row.updated_at.toISOString(),
});

// Lấy tất cả comment theo postId
export const findCommentsByPostId = async ({postId}) => {
  const executor = getExecutor();
  const [rows] = await executor(
    "SELECT * FROM comments WHERE post_id = ? ORDER BY created_at ASC",
    [postId]
  );

  return rows.map(mapComment);
};

// Lấy comment theo commentId
export const findCommentById = async ({commentId}) => {
  const executor = getExecutor();
  const [rows] = await executor(
    "SELECT * FROM comments WHERE id = ? LIMIT 1",
    [commentId]
  );

  if (rows.length === 0) throw createHttpError(404, "Comment not found");
  return mapComment(rows[0]);
};

// Tạo comment mới
export const createComment = async ({ postId, author, content }) => {
  const executor = getExecutor();
  const [result] = await executor(
    `INSERT INTO comments (post_id, author, content)
       VALUES (?, ?, ?)`,
    [postId, author, content]
  );

  return {
    id: result.insertId.toString(),
    postId: postId.toString(),
    author,
    content,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

// Cập nhật comment (MySQL tự cập nhật updated_at)
export const updateComment = async ({commentId, content}) => {
  const executor = getExecutor();
  const [result, _] = await executor(
    `UPDATE comments
       SET content = ?
       WHERE id = ?`,
    [content, commentId]
  );

  if (result.affectedRows === 0)
    throw createHttpError(404, "Comment not found");

  return await findCommentById(commentId);
};

// Xóa comment
export const deleteComment = async ({commentId}) => {
  const executor = getExecutor();
  const [result] = await executor(`DELETE FROM comments WHERE id = ?`, [
    commentId,
  ]);

  if (result.affectedRows === 0)
    throw createHttpError(404, "Comment not found");
};
