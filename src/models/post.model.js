import mysqlPool from "../configs/mysql.config.js";
import createHttpError from "http-errors";
import { customAlphabet } from "nanoid";

// map row MySQL → JSON camelCase
const mapPost = (row) => ({
  id: row.id.toString(),
  title: row.title,
  content: row.content,
  user: row.user,
  createdAt: row.created_at.toISOString(),
  updatedAt: row.updated_at.toISOString(),
});

// Lấy tất cả posts
export const findAllPosts = async () => {
  try {
    const [rows] = await mysqlPool.query("SELECT * FROM posts ORDER BY created_at DESC");
    return rows.map(mapPost);
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw createHttpError(500, "Internal Server Error");
  }
};

// Lấy post theo ID
export const findPostById = async (postId) => {
  try {
    const [rows] = await mysqlPool.query("SELECT * FROM posts WHERE id = ? LIMIT 1", [postId]);
    if (rows.length === 0) throw createHttpError(404, "Post not found");
    return mapPost(rows[0]);
  } catch (error) {
    if (!error.status) {
      console.error("Error fetching post by ID:", error);
      throw createHttpError(500, "Internal Server Error");
    }
    throw error;
  }
};

// Tạo post mới
export const createPost = async ({ title, content, user }) => {
  const nanoidNum = customAlphabet("0123456789", 16);
  const id = BigInt(nanoidNum());

  try {
    await mysqlPool.query(
      `INSERT INTO posts (id, title, content, user)
       VALUES (?, ?, ?, ?)`,
      [id, title, content, user]
    );

    return {
      id: id.toString(),
      title,
      content,
      user,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Error creating post:", error);
    throw createHttpError(500, "Internal Server Error");
  }
};

// Cập nhật post
export const updatePost = async (postId, { title, content }) => {
  try {
    const [result] = await mysqlPool.query(
      `UPDATE posts
       SET title = COALESCE(?, title),
           content = COALESCE(?, content)
       WHERE id = ?`,
      [title, content, postId]
    );

    if (result.affectedRows === 0) throw createHttpError(404, "Post not found");
    return await findPostById(postId); // trả về bản ghi cập nhật
  } catch (error) {
    if (!error.status) {
      console.error("Error updating post:", error);
      throw createHttpError(500, "Internal Server Error");
    }
    throw error;
  }
};

// Xóa post
export const deletePost = async (postId) => {
  try {
    const [result] = await mysqlPool.query("DELETE FROM posts WHERE id = ?", [postId]);
    if (result.affectedRows === 0) throw createHttpError(404, "Post not found");
    return { message: "Post deleted successfully" };
  } catch (error) {
    if (!error.status) {
      console.error("Error deleting post:", error);
      throw createHttpError(500, "Internal Server Error");
    }
    throw error;
  }
};
