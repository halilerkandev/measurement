import { XYPlot, YAxis, LineSeries, HorizontalGridLines } from 'react-vis';

export const LineChart = ({ data, title }) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div>
        <h2>{title}</h2>
        <XYPlot height={300} width={300}>
          <YAxis title='ms' />
          <HorizontalGridLines />
          <LineSeries data={data} />
        </XYPlot>
      </div>
    </div>
  );
};
