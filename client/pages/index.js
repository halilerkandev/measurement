import { useEffect } from 'react';
import PerformanceMetrics from 'metric-analizer';

import buildClient from '../api/build-client';
import { useMetrics, metricsActionTypes } from '../contexts';
import { LineChart } from '../components';
import { postFunc } from '../utils';

const perfMetrics = new PerformanceMetrics(
  postFunc,
  '/api/performance/create-metric'
);

const IndexPage = (props) => {
  const [{ metrics }, dispatch] = useMetrics();

  const handleMetrics = () => {
    return new Promise((resolve, reject) => {
      dispatch({
        type: metricsActionTypes.SET_METRICS_FROM_PROPS,
        payload: props.metrics,
      });
      resolve();
    });
  };

  const filteredMetrics = (name) => {
    return metrics
      .filter((metric) => metric.name === name)
      .map((m) => ({ x: new Date(m.createdAt).getTime(), y: m.value }))
      .sort((a, b) => a.x - b.x);
  };

  useEffect(() => {
    handleMetrics().then(() => {
      perfMetrics.getTTFB((val) =>
        dispatch({
          type: metricsActionTypes.SET_CURRENT_METRIC,
          payload: { createdAt: new Date(Date.now()).toISOString(), ...val },
        })
      );

      perfMetrics.getDL((val) =>
        dispatch({
          type: metricsActionTypes.SET_CURRENT_METRIC,
          payload: { createdAt: new Date(Date.now()).toISOString(), ...val },
        })
      );

      perfMetrics.getFCP((val) =>
        dispatch({
          type: metricsActionTypes.SET_CURRENT_METRIC,
          payload: { createdAt: new Date(Date.now()).toISOString(), ...val },
        })
      );

      perfMetrics.getWL((val) =>
        dispatch({
          type: metricsActionTypes.SET_CURRENT_METRIC,
          payload: { createdAt: new Date(Date.now()).toISOString(), ...val },
        })
      );
    });
  }, []);

  return (
    <>
      <LineChart title='TTFB' data={filteredMetrics('TTFB')} />
      <LineChart title='FCP' data={filteredMetrics('FCP')} />
      <LineChart title='Dom Load' data={filteredMetrics('DL')} />
      <LineChart title='Window Load' data={filteredMetrics('WL')} />
    </>
  );
};

export async function getServerSideProps(context) {
  const client = buildClient(context);
  const { data } = await client.get('/api/performance/get-metrics');

  return {
    props: {
      metrics: data,
    },
  };
}

export default IndexPage;
