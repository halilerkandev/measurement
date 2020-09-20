import express, { Request, Response } from 'express';
import { query } from 'express-validator';

import { Metric } from '../models/metric';
import { validateRequest } from '../middlewares/validate-request';

const router = express.Router();

const createOlderDateFromNow = (min: number) => {
  return new Date(Date.now() - min * 60 * 1000);
};

router.get(
  '/api/performance/get-metrics',
  [
    query('startDate')
      .if(query('startDate').exists())
      .custom((value) => new Date(value).getTime() > 0),
    query('endDate')
      .if(query('endDate').exists())
      .custom((value) => new Date(value).getTime() > 0),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { startDate, endDate } = req.query;

    let metrics = [];

    if (!startDate || !endDate) {
      metrics = await Metric.find({
        createdAt: {
          $gte: createOlderDateFromNow(30),
        },
      });
    } else {
      metrics = await Metric.find({
        createdAt: {
          $gte: new Date(new Date(startDate as string).setHours(0, 0, 0)),
          $lt: new Date(new Date(endDate as string).setHours(23, 59, 59)),
        },
      });
    }

    res.status(200).send(metrics);
  }
);

export { router as getMetricsRouter };
