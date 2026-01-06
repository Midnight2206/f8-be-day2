import mysqlPool from "../config/database.js";
import createHttpError from "http-errors";
import { customAlphabet } from "nanoid";
import { buildWhere } from "#src/helper/buildWhereSQL.js";
// map row MySQL → JSON camelCase
const mapPost = (row) => ({
  id: row.id.toString(),
  title: row.title,
  content: row.content,
  user: row.user,
  createdAt: row.created_at.toISOString(),
  updatedAt: row.updated_at.toISOString(),
});

export const countPosts = async (filter) => {
  let sql = "SELECT COUNT(*) AS total FROM posts";
  const { where, params } = buildWhere(filter, {
    userId: "user_id",
  });
  sql += where;
  const [rows] = await mysqlPool.query(sql, params);
  return rows[0].total;
};
// Lấy tất cả posts
export const findAllPosts = async ({
  filter,
  limit,
  offset,
  sortBy,
  sortOrder,
}) => {
  const { where, params } = buildWhere(filter, {
    userId: "user_id",
  });
  const orderBy = sortBy
    .map((col, i) => `${col} ${sortOrder[i] || "ASC"}`)
    .join(", ");
  const sql = `
  SELECT *
  FROM posts
  ${where}
  ORDER BY ${orderBy}
  LIMIT ?
  OFFSET ?
`;
  const [rows] = await mysqlPool.query(sql, [...params, limit, offset]);
  return rows.map(mapPost);
};

// Lấy post theo ID
export const findPostById = async (postId) => {
  const [rows] = await mysqlPool.query(
    "SELECT * FROM posts WHERE id = ? LIMIT 1",
    [postId]
  );
  if (rows.length === 0) throw createHttpError(404, "Post not found");
  return mapPost(rows[0]);
};

// Tạo post mới
export const createPost = async ({ title, content, user }) => {
  const nanoidNum = customAlphabet("0123456789", 16);
  const id = BigInt(nanoidNum());

  const now = new Date();
  await mysqlPool.query(
    `INSERT INTO posts (id, title, content, user, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?)`,
    [id, title, content, user, now, now]
  );

  return {
    id: id.toString(),
    title,
    content,
    user,
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
  };
};

// Cập nhật post
export const updatePost = async (postId, { title, content }) => {
  const [result] = await mysqlPool.query(
    `UPDATE posts
       SET title = COALESCE(?, title),
           content = COALESCE(?, content)
       WHERE id = ?`,
    [title, content, postId]
  );

  if (result.affectedRows === 0) throw createHttpError(404, "Post not found");
  return await findPostById(postId);
};

// Xóa post
export const deletePost = async (postId) => {
  const [result] = await mysqlPool.query("DELETE FROM posts WHERE id = ?", [
    postId,
  ]);
  if (result.affectedRows === 0) throw createHttpError(404, "Post not found");
  return { message: "Post deleted successfully" };
};
