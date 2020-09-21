import express, { Request, Response } from 'express';

import { Metric } from '../models/metric';

const router = express.Router();

router.get(
  '/api/performance/get-metrics',
  async (req: Request, res: Response) => {
    const metrics = await Metric.find();

    res.status(200).send(metrics);
  }
);

export { router as getMetricsRouter };
