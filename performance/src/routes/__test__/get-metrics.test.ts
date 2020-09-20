import request from 'supertest';

import { app } from '../../app';
import { IMetricInput } from '../../models/metric';

const validMetrics: IMetricInput[] = [
  {
    name: 'TTFB',
    value: 0,
    delta: 0,
    metricId: 'metricId01',
    isFinal: true,
  },
  {
    name: 'FCP',
    value: 0,
    delta: 0,
    metricId: 'metricId02',
    isFinal: true,
  },
];

const createMetric = (metric: IMetricInput) => {
  return request(app).post('/api/performance/create-metric').send(metric);
};

it('can fetch a list of metrics', async () => {
  for (const m of validMetrics) {
    await createMetric(m);
  }

  const response = await request(app)
    .get('/api/performance/get-metrics')
    .send()
    .expect(200);

  expect(response.body.length).toEqual(2);
});
