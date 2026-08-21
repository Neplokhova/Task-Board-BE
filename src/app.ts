import express from 'express';
import routes from './routes/index.js';
import { errorMiddleware } from './middleware/error.middleware.js';
import { notFoundMiddleware } from './middleware/not-found.middlewsre.js';
import cors from 'cors';

const app = express();

app.use(
  cors({
    origin: ['http://localhost:5173',
    'https://fe-board-card.vercel.app',],
  }),
);

app.use(express.json());
app.use('/', routes);
app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;
