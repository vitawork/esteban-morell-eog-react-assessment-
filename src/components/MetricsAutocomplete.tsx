import React, { useEffect, useState } from 'react';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import { useDispatch, useSelector } from 'react-redux';
import { IState } from '../store';
import CircularProgress from '@material-ui/core/CircularProgress';
import { actions } from '../Features/Metrics/reducer';
import { useQuery } from 'urql';

const splitByUpperCase = (str: string) =>
  str
    .split(/(?=[A-Z])/)
    .map(s => s.charAt(0).toUpperCase() + s.substr(1))
    .join(' ');

const getMeasurementsQuery = `
query($input: MeasurementQuery) {
  getMeasurements(input: $input) {
    metric
    at
    value
    unit
  }
}
`;

export default () => {
  const dispatch = useDispatch();
  const { metricsNames, selectedMetrics } = useSelector((state: IState) => state.metrics);
  const [measurementsInput, setMeasurementsInput] = useState({
    metricName: '',
    after: Date.now() - 1800000,
    before: Date.now(),
  });

  const [{ data: measurementsData, error }] = useQuery({
    query: getMeasurementsQuery,
    variables: {
      input: measurementsInput,
    },
    pause: measurementsInput.metricName === '',
  });

  useEffect(() => {
    if (measurementsData) {
      const { getMeasurements } = measurementsData;
      if (getMeasurements && getMeasurements.length > 0) {
        const { metric } = getMeasurements[0];
        dispatch(
          actions.addAMeasurements({
            metric,
            measurements: getMeasurements,
            color: '#' + (0x1000000 + Math.random() * 0xffffff).toString(16).substr(1, 6),
          }),
        );
      }
    }
  }, [dispatch, measurementsData]);

  useEffect(() => {
    if (error) {
      dispatch(actions.apiErrorReceived({ error: error.message }));
      return;
    }
  }, [dispatch, error]);

  const handleChange = (newValue: string[]) => {
    //// checking what change
    if (newValue.length === 0) dispatch(actions.setMultipleMeasurements([]));
    else if (newValue.length < selectedMetrics.length) {
      for (let i = 0; i < selectedMetrics.length; i++) {
        if (!newValue.includes(selectedMetrics[i])) {
          dispatch(actions.deleteMeasurements(selectedMetrics[i]));
          break;
        }
      }
    } else if (newValue.length > selectedMetrics.length)
      setMeasurementsInput({
        metricName: newValue[newValue.length - 1],
        after: Date.now() - 1800000,
        before: Date.now(),
      });

    dispatch(actions.selectMetrics(newValue));
  };

  return metricsNames && metricsNames.length > 0 ? (
    <Autocomplete
      multiple
      fullWidth
      id="metricsAutocomplete"
      options={metricsNames}
      getOptionLabel={option => splitByUpperCase(option)}
      filterSelectedOptions
      value={selectedMetrics}
      onChange={(event, newValue) => {
        handleChange(newValue);
      }}
      renderInput={params => <TextField {...params} variant="outlined" label="Select Metrics" />}
    />
  ) : (
    <CircularProgress color="secondary" />
  );
};
