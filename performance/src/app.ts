import express from 'express';
import 'express-async-errors';
import mongoSanitize from 'express-mongo-sanitize';
import helmet from 'helmet';
import * as xss from 'xss-clean';
import rateLimit from 'express-rate-limit';
import hpp from 'hpp';

import { getMetricsRouter } from './routes/get-metrics';
import { createMetricRouter } from './routes/create-metric';
import { errorHandler } from './middlewares/error-handler';
import { NotFoundError } from './errors/not-found-error';

const app = express();

app.set('trust proxy', true);
app.use(express.json());

app.use(getMetricsRouter);
app.use(createMetricRouter);

app.use(mongoSanitize());
app.use(helmet());
app.use(xss());
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 mins
  max: 100,
});
app.use(limiter);
app.use(hpp());

app.all('*', async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
