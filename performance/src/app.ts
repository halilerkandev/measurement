import express from 'express';
import 'express-async-errors';

import { getMetricsRouter } from './routes/get-metrics';
import { createMetricRouter } from './routes/create-metric';
import { errorHandler } from './middlewares/error-handler';
import { NotFoundError } from './errors/not-found-error';

const app = express();

app.set('trust proxy', true);
app.use(express.json());

app.use(getMetricsRouter);
app.use(createMetricRouter);

app.all('*', async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
