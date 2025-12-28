import mysqlPool from "#configs/mysql.config.js";
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
export const findCommentsByPostId = async (postId) => {
  try {
    const [rows] = await mysqlPool.query(
      "SELECT * FROM comments WHERE post_id = ? ORDER BY created_at ASC",
      [postId]
    );

    return rows.map(mapComment);
  } catch (error) {
    console.error("Error fetching comments by post ID:", error);
    throw createHttpError(500, "Internal Server Error");
  }
};

// Lấy comment theo commentId
export const findCommentById = async (commentId) => {
  try {
    const [rows] = await mysqlPool.query(
      "SELECT * FROM comments WHERE id = ? LIMIT 1",
      [commentId]
    );

    if (rows.length === 0) throw createHttpError(404, "Comment not found");
    return mapComment(rows[0]);
  } catch (error) {
    console.error("Error fetching comment by ID:", error);
    throw createHttpError(500, "Internal Server Error");
  }
};

// Tạo comment mới
export const createComment = async ({ postId, author, content }) => {
  try {
    const [result] = await mysqlPool.query(
      `INSERT INTO comments (post_id, author, content)
       VALUES (?, ?, ?)`,
      [postId, author, content]
    );

    // Trả về comment mới dưới dạng camelCase
    return {
      id: result.insertId.toString(),
      postId: postId.toString(),
      author,
      content,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Error creating comment:", error);
    throw createHttpError(500, "Internal Server Error");
  }
};

// Cập nhật comment (MySQL tự cập nhật updated_at)
export const updateComment = async (commentId, content) => {
  try {
    const [result, _] = await mysqlPool.query(
      `UPDATE comments
       SET content = ?
       WHERE id = ?`,
      [content, commentId]
    );

    if (result.affectedRows === 0)
      throw createHttpError(404, "Comment not found");

    return await findCommentById(commentId);
  } catch (error) {
    console.error("Error updating comment:", error);
    throw createHttpError(500, "Internal Server Error");
  }
};

// Xóa comment
export const deleteComment = async (commentId) => {
  try {
    const [result] = await mysqlPool.query(
      `DELETE FROM comments WHERE id = ?`,
      [commentId]
    );

    if (result.affectedRows === 0)
      throw createHttpError(404, "Comment not found");
  } catch (error) {
    console.error("Error deleting comment:", error);
    throw createHttpError(500, "Internal Server Error");
  }
};
