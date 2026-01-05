import express from 'express';
import cors from 'cors';
import { corsOptions } from '#configs/cors.config.js';
import rootRouter from '#routes/index.js';
import {errorMiddleware} from '#middlewares/exceptionHandler.js';
import {notFoundMiddleware} from '#middlewares/notFoundHandler.js';
import { responseFormat } from '#middlewares/responseFormat.js';
import {apiRateLimiter} from "#middlewares/rateLimiter.js"
const app = express();
app.set("trust proxy", true);
// middlewares
app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));
app.use(responseFormat)
app.use(express.static('public'));
app.use(express.json());


// routes
app.use('/api', apiRateLimiter, rootRouter);

//404 not found middleware
app.use(notFoundMiddleware);

// error middleware
app.use(errorMiddleware);

export default app;
