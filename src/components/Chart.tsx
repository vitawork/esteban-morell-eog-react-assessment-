import React from 'react';
import { useSelector } from 'react-redux';
import { IState } from '../store';
import Plot from 'react-plotlyjs-ts';
import { Measurement } from '../Features/Metrics/reducer';
import moment from 'moment';

export default () => {
  const { multipleMeasurements } = useSelector((state: IState) => state.metrics);

  const xInfo = (measurements: Measurement[]) =>
    measurements.map(measurement => moment(measurement.at).format('kk:mm:ss'));
  const yInfo = (measurements: Measurement[]) => measurements.map(measurement => measurement.value);

  return multipleMeasurements.length === 0 ? null : (
    <React.Fragment>
      {multipleMeasurements.map(measurements => (
        <Plot
          // className={classes.graph}
          data={[
            {
              x: xInfo(measurements.measurements),
              y: yInfo(measurements.measurements),
              type: 'linear',
              marker: { color: 'gray' },
            },
          ]}
          layout={{
            xaxis: {
              autotick: false,
              dtick: 60,
            },
            margin: {
              l: 20,
              r: 20,
              t: 20,
              b: 20,
            },
          }}
        />
      ))}
    </React.Fragment>
  );
};
