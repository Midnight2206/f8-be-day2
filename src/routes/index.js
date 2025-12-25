import express from 'express';
import postRouter from '#routes/post.route.js';
import commentRouter from '#routes/comment.route.js';

const router = express.Router();
router.use('/posts', postRouter);
router.use('/comments', commentRouter);


export default router;