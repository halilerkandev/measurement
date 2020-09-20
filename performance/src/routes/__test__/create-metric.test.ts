import request from 'supertest';

import { app } from '../../app';
import { Metric } from '../../models/metric';

it('has a route handler listening to /api/performance/create-metric for post requests', async () => {
  const response = await request(app)
    .post('/api/performance/create-metric')
    .send({
      name: 'TTFB',
      value: 0,
      delta: 0,
      metricId: 'metricId01',
      isFinal: true,
      entry: {},
    });

  expect(response.status).not.toEqual(404);
});

it('returns a 201 on successful creating metric', async () => {
  let metrics = await Metric.find({});
  expect(metrics.length).toEqual(0);

  await request(app)
    .post('/api/performance/create-metric')
    .send({
      name: 'TTFB',
      value: 0,
      delta: 0,
      metricId: 'metricId01',
      isFinal: true,
      entry: {},
    })
    .expect(201);

  metrics = await Metric.find({});
  expect(metrics.length).toEqual(1);
  expect(metrics[0].name).toEqual('TTFB');
});

it('returns a 400 with an invalid name', async () => {
  await request(app)
    .post('/api/performance/create-metric')
    .send({
      name: 0,
      value: 0,
      delta: 0,
      metricId: 'metricId01',
      isFinal: true,
      entry: {},
    })
    .expect(400);
});

it('returns a 400 with an invalid value', async () => {
  await request(app)
    .post('/api/performance/create-metric')
    .send({
      name: 'TTFB',
      value: 'fff',
      delta: 0,
      metricId: 'metricId01',
      isFinal: true,
      entry: {},
    })
    .expect(400);
});

it('returns a 400 with an invalid delta', async () => {
  await request(app)
    .post('/api/performance/create-metric')
    .send({
      name: 'TTFB',
      value: 0,
      delta: 'fff',
      metricId: 'metricId01',
      isFinal: true,
      entry: {},
    })
    .expect(400);
});

it('returns a 400 with an invalid metricId', async () => {
  await request(app)
    .post('/api/performance/create-metric')
    .send({
      name: 'TTFB',
      value: 0,
      delta: 0,
      metricId: 0,
      isFinal: true,
      entry: {},
    })
    .expect(400);
});

it('returns a 400 with an invalid isFinal', async () => {
  await request(app)
    .post('/api/performance/create-metric')
    .send({
      name: 'TTFB',
      value: 0,
      delta: 0,
      metricId: 'metricId01',
      isFinal: 'aaa',
      entry: {},
    })
    .expect(400);
});
