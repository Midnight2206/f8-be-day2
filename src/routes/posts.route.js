import express from 'express';
import { getAllPosts, getPostById, createPostHandler, updatePostById, deletePostById } from '#controllers/posts.controller.js';
import {validateData} from '#middlewares/validateData.middleware.js';
import {createPostSchema, updatePostSchema} from '#schemas/post.schema.js';
import commentRouter from '#routes/comment.routes.js';

const router = express.Router();

router.use('/:postId/comments', commentRouter);
router.get('/:postId', getPostById);
router.get('/', getAllPosts);
router.post('/', validateData(createPostSchema), createPostHandler);
router.put('/:postId', validateData(updatePostSchema), updatePostById);
router.delete('/:postId', deletePostById);



export default router;