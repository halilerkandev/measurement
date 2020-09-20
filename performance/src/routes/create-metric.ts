import express, { Request, Response } from 'express';
import { body } from 'express-validator';

import { Metric } from '../models/metric';
import { validateRequest } from '../middlewares/validate-request';

const router = express.Router();

router.post(
  '/api/performance/create-metric',
  [
    body('name').isString(),
    body('value').isNumeric(),
    body('delta').isNumeric(),
    body('metricId').isString(),
    body('isFinal').isBoolean(),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { name, value, delta, metricId, isFinal, entry } = req.body;

    const metric = await Metric.create({
      name,
      value,
      delta,
      metricId,
      isFinal,
      entry,
    });

    res.status(201).send(metric);
  }
);

export { router as createMetricRouter };
