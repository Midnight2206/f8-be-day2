import express from 'express';
import { getAllTasks, getTaskById, createTaskHandler, updateTaskById, deleteTaskById, toggleCompletedTask } from '#controllers/task.controller.js';
import {validateData} from '#middlewares/validateData.js';
import {createTaskSchema, updateTaskSchema} from '#schemas/task.schema.js';

const router = express.Router();

router.get('/', getAllTasks);
router.get('/:taskId', getTaskById)
router.post('/', validateData(createTaskSchema), createTaskHandler);
router.patch('/:taskId/toggle-completed', toggleCompletedTask)
router.patch('/:taskId', validateData(updateTaskSchema), updateTaskById);
router.delete('/:taskId', deleteTaskById);



export default router;