import express from 'express';
import { getComments, addComment, updateCommentById, deleteCommentById } from '#controllers/comments.controller.js';
import { validateData } from '#middlewares/validateData.middleware.js';
import { createCommentSchema, updateCommentSchema } from '#schemas/comment.schema.js';
const router = express.Router(
    {mergeParams: true}
);

router.get('/', getComments);
router.post('/', validateData(createCommentSchema), addComment);
router.patch('/:commentId', validateData(updateCommentSchema), updateCommentById);
router.delete('/:commentId', deleteCommentById);

export default router;