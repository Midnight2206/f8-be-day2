import express from 'express';
import postRouter from '#routes/posts.route.js';
import commentRouter from '#routes/comments.routes.js';

const router = express.Router();
router.use('/posts', postRouter);
router.use('/comments', commentRouter);


export default router;