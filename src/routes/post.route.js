import express from 'express';
import { getAllPosts, getPostById, createPost, updatePostById, deletePostById } from '#controllers/post.controller.js';
import {validateData} from '#middlewares/validateData.middleware.js';
import {createPostSchema, updatePostSchema} from '#schemas/post.schema.js';
import commentRouter from './comment.route.js';

const router = express.Router();

router.use('/:postId/comments', commentRouter);
router.get('/:postId', getPostById);
router.get('/', getAllPosts);
router.post('/', validateData(createPostSchema), createPost);
router.put('/:postId', validateData(updatePostSchema), updatePostById);
router.delete('/:postId', deletePostById);



export default router;