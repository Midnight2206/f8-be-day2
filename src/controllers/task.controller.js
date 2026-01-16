import asyncHandler from "../../utils/asyncHandler.js";
import {
  findAllTasks,
  findTaskById,
  createTask,
  updateTask,
  deleteTask,
  toggleCompleted
} from "#models/task.model.js";

// GET /api/tasks
export const getAllTasks = asyncHandler(async (req, res) => {
  const tasks = await findAllTasks();

  res.success(tasks)
});

// GET /api/tasks/:taskId
export const getTaskById = asyncHandler(async (req, res) => {
  const { taskId } = req.params;
  const task = await findTaskById({taskId});

  res.success(task)
});

// POST /api/tasks
export const createTaskHandler = asyncHandler(async (req, res) => {
  const { title, level, color } = req.body;

  const newTask = await createTask({ title, level, color });

  res.success(newTask, 201)
});

// PATCH /api/tasks/:taskId
export const updateTaskById = asyncHandler(async (req, res) => {
  const { taskId } = req.params;
  const updatedTask = await updateTask({taskId, ...req.body});

  res.success(updatedTask)
});
// PATCH /api/tasks/:taskId/toggle-completed
export const toggleCompletedTask = asyncHandler(async (req, res) => {
  const { taskId } = req.params;
  const updatedTask = await toggleCompleted({taskId});

  res.success(updatedTask)
});

// DELETE /api/tasks/:taskId
export const deleteTaskById = asyncHandler(async (req, res) => {
  const { taskId } = req.params;
  await deleteTask({taskId});

  res.success(null, 204)
});
