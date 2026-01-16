import { getExecutor } from "#src/helper/dbExecutor.js";
import createHttpError from "http-errors";

// Map MySQL row → JSON (camelCase)
const mapTask = (row) => ({
  id: row.id.toString(),
  title: row.title,
  level: row.level,
  color: row.color,
  completed: Boolean(row.completed),
  createdAt: row.created_at?.toISOString(),
  updatedAt: row.updated_at?.toISOString(),
});

/**
 * Lấy tất cả tasks
 */
export const findAllTasks = async () => {
  const executor = getExecutor();
  const [rows] = await executor(
    "SELECT * FROM tasks ORDER BY created_at DESC"
  );
  return rows.map(mapTask);
};

/**
 * Lấy task theo ID
 */
export const findTaskById = async ({taskId}) => {
  const executor = getExecutor();
  const [rows] = await executor(
    "SELECT * FROM tasks WHERE id = ? LIMIT 1",
    [taskId]
  );

  if (rows.length === 0) {
    throw createHttpError(404, "Task not found");
  }

  return mapTask(rows[0]);
};

/**
 * Tạo task mới
 */
export const createTask = async ({ title, level = "normal", color = "blue" }) => {
  const now = new Date();
  const executor = getExecutor();
  const [result] = await executor(
    `
    INSERT INTO tasks (title, level, color, completed, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?)
    `,
    [title, level, color, false, now, now]
  );

  return {
    id: result.insertId.toString(),
    title,
    level,
    color,
    completed: false,
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
  };
};

/**
 * Cập nhật task
 */
export const updateTask = async (
  {taskId, title, level, color, completed}
) => {
  const executor = getExecutor();
  const [result] = await executor(
    `
    UPDATE tasks
    SET
      title = COALESCE(?, title),
      level = COALESCE(?, level),
      color = COALESCE(?, color),
      completed = COALESCE(?, completed),
      updated_at = NOW()
    WHERE id = ?
    `,
    [title, level, color, completed, taskId]
  );

  if (result.affectedRows === 0) {
    throw createHttpError(404, "Task not found");
  }

  return findTaskById(taskId);
};

/**
 * Toggle completed
 */
export const toggleCompleted = async (taskId) => {
  const executor = getExecutor();
  const [result] = await executor(
    `
    UPDATE tasks
    SET completed = NOT completed,
        updated_at = NOW()
    WHERE id = ?
    `,
    [taskId]
  );

  if (result.affectedRows === 0) {
    throw createHttpError(404, "Task not found");
  }

  return findTaskById(taskId);
};

/**
 * Xóa task
 */
export const deleteTask = async ({taskId}) => {
  const executor = getExecutor();
  const [result] = await executor(
    "DELETE FROM tasks WHERE id = ?",
    [taskId]
  );

  if (result.affectedRows === 0) {
    throw createHttpError(404, "Task not found");
  }

  return { message: "Task deleted successfully" };
};
