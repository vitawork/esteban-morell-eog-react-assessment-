import React from 'react';
import { useSelector } from 'react-redux';
import { IState } from '../store';
import Plot from 'react-plotlyjs-ts';
import { Measurement, MultipleMeasurements } from '../Features/Metrics/reducer';
import moment from 'moment';

const splitByUpperCase = (str: string) =>
  str
    .split(/(?=[A-Z])/)
    .map(s => s.charAt(0).toUpperCase() + s.substr(1))
    .join(' ');

export default () => {
  const { multipleMeasurements } = useSelector((state: IState) => state.metrics);

  const xInfo = (measurements: Measurement[]) =>
    measurements.map(measurement => moment(measurement.at).format('kk:mm:ss'));
  const yInfo = (measurements: Measurement[]) => measurements.map(measurement => measurement.value);
  const getUnit = (multipleMeasurements: MultipleMeasurements) => {
    let title: any = [];
    multipleMeasurements.forEach(m => {
      if (
        m.measurements.length > 0 &&
        m.measurements[m.measurements.length - 1] &&
        m.measurements[m.measurements.length - 1].unit &&
        !title.includes(m.measurements[m.measurements.length - 1].unit)
      ) {
        title.push(m.measurements[m.measurements.length - 1].unit);
      }
    });

    return title.join(' - ');
  };

  return multipleMeasurements.length === 0 ? (
    <img
      className="eogIcon"
      src="https://digital.hbs.edu/platform-rctom/wp-content/uploads/sites/4/2015/12/eogLogoPrint.gif"
      alt="Eog Icon"
    />
  ) : (
    <Plot
      data={multipleMeasurements.map(measurements => ({
        x: xInfo(measurements.measurements),
        y: yInfo(measurements.measurements),
        type: 'linear',
        marker: { color: measurements.color },
        name: `${splitByUpperCase(measurements.metric)} ${
          measurements.measurements.length > 0 && measurements.measurements[measurements.measurements.length - 1]
            ? '(' + measurements.measurements[measurements.measurements.length - 1].unit + ')'
            : ''
        }`,
      }))}
      layout={{
        uirevision: 'true',
        xaxis: { autorange: true, dtick: 230, title: 'Time' },
        yaxis: { autorange: true, title: getUnit(multipleMeasurements) },
        showlegend: true,
        legend: { orientation: 'h', x: 0, y: 1.3 },
      }}
    />
  );
};
