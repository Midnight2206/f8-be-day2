import express from 'express';
import cors from 'cors';
import { corsOptions } from '#configs/cors.config.js';
import rootRouter from '#routes/index.js';
import {errorMiddleware} from '#middlewares/error.middleware.js';
import {notFoundMiddleware} from '#middlewares/notFound.middleware.js';
const app = express();

// middlewares
app.use(cors(corsOptions));
app.use(express.static('public'));
app.use(express.json());


// routes
app.use('/api', rootRouter);

//404 not found middleware
app.use(notFoundMiddleware);

// error middleware
app.use(errorMiddleware);

export default app;
