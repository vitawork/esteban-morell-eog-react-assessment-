import React, { useEffect, useState } from 'react';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import CardContent from '@material-ui/core/CardContent';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { useDispatch, useSelector } from 'react-redux';
import { IState } from '../store';
import { useSubscription } from 'urql';
import { actions } from '../Features/Metrics/reducer';

const useStyles = makeStyles({
  outlinePaper: {
    border: '1px solid rgb(0 0 0 / 24%)',
    borderRadius: '4px',
    width: '100%',
    padding: '8px',
    '& .MuiCardContent-root': { padding: '6px 16px!important' },
  },
  showTrue: {
    opacity: '1',
    transition: 'height 0.3s, opacity 0.1s 0.3s linear',
    height: '91.2px',
  },
  showFalse: {
    opacity: '0',
    transition: 'height 0.3s 0.1s, opacity 0.1s linear',
    height: '0px',
  },
});

const splitByUpperCase = (str: string) =>
  str
    .split(/(?=[A-Z])/)
    .map(s => s.charAt(0).toUpperCase() + s.substr(1))
    .join(' ');

const newMeasurementSubscription = `
subscription newMeasurement{
  newMeasurement{
    metric
    at
    value
    unit
  }
}
`;

export default () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [showMetrics, setShowMetrics]: any[] = useState([]);
  const { multipleMeasurements } = useSelector((state: IState) => state.metrics);

  const [{ data: subscriptionData, error }] = useSubscription({
    query: newMeasurementSubscription,
    pause: multipleMeasurements.length === 0,
  });

  useEffect(() => {
    if (subscriptionData) {
      const { newMeasurement } = subscriptionData;
      dispatch(actions.updateMeasurements(newMeasurement));
    }
  }, [dispatch, subscriptionData]);

  useEffect(() => {
    if (error) {
      dispatch(actions.apiErrorReceived({ error: error.message }));
      return;
    }
  }, [dispatch, error]);

  useEffect(() => {
    if (multipleMeasurements.length > showMetrics.length) {
      for (let i = 0; i < multipleMeasurements.length; i++) {
        const measurements = multipleMeasurements[i];

        if (!showMetrics.includes(measurements.metric)) {
          const timer = setTimeout(() => {
            setShowMetrics([...showMetrics, measurements.metric]);
          }, 100);

          return () => {
            clearTimeout(timer);
          };
        }
      }
    } else if (multipleMeasurements.length < showMetrics.length) {
      for (let i = 0; i < showMetrics.length; i++) {
        let found = false;
        for (let j = 0; j < multipleMeasurements.length; j++) {
          if (multipleMeasurements[j].metric === showMetrics[i]) {
            found = true;
            break;
          }
        }
        if (!found) {
          const timer = setTimeout(() => {
            let newShowMetrics = [...showMetrics];
            newShowMetrics.splice(i, 1);

            setShowMetrics(newShowMetrics);
          }, 100);

          return () => {
            clearTimeout(timer);
          };
        }
      }
    }
  }, [multipleMeasurements, showMetrics]);

  return multipleMeasurements.length > 0 ? (
    <div className={classes.outlinePaper}>
      <Grid container spacing={1}>
        {multipleMeasurements.map((measurements, i) => (
          <Grid
            item
            xs={6}
            key={i}
            className={showMetrics.includes(measurements.metric) ? classes.showTrue : classes.showFalse}
          >
            <Card>
              <CardContent>
                <Typography variant="subtitle1">{`${splitByUpperCase(measurements.metric)} ${
                  measurements.measurements.length > 0 &&
                  measurements.measurements[measurements.measurements.length - 1]
                    ? '(' + measurements.measurements[measurements.measurements.length - 1].unit + ')'
                    : ''
                }`}</Typography>
                <Typography variant="h4" style={{ color: measurements.color }}>
                  {measurements.measurements.length > 0
                    ? measurements.measurements[measurements.measurements.length - 1].value
                    : 'Not Available'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  ) : null;
};
