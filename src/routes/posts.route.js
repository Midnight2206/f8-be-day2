import express from 'express';
import { getAllPosts, getPostById, createPostHandler, updatePostById, deletePostById } from '#controllers/post.controller.js';
import {validateData} from '#middlewares/validateData.js';
import {createPostSchema, updatePostSchema} from '#schemas/post.schema.js';
import commentsRouter from '#routes/comments.route.js';

const router = express.Router();

router.use('/:postId/comments', commentsRouter);
router.get('/:postId', getPostById);
router.get('/', getAllPosts);
router.post('/', validateData(createPostSchema), createPostHandler);
router.put('/:postId', validateData(updatePostSchema), updatePostById);
router.delete('/:postId', deletePostById);



export default router;