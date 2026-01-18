import express from 'express';
import postRouter from '#routes/posts.route.js';
import commentRouter from '#routes/comments.route.js';
import taskRouter from "#routes/tasks.route.js"
import authRouter from "#routes/auth.route.js"
import conversationRoute from '#routes/conversations.route.js';
import messageRoute from '#routes/messages.route.js';
import userRoute from '#routes/user.route.js';

const router = express.Router();
router.use('/posts', postRouter);
router.use('/comments', commentRouter);
router.use('/auth', authRouter)
router.use('/conversations', conversationRoute)
router.use('/tasks', taskRouter)
router.use('/users', userRoute)
router.use('/conversations/:conversationId/messages', messageRoute)
router.get('/test-success', (_, res) => res.success({message: "Hello World"}))
router.get('/test-error', () => {throw Error("Test exception")})



export default router;