import React, { useEffect } from 'react';
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
    minHeight: '56px',
    padding: '8px',
    '& .MuiCardContent-root': { padding: '6px 16px!important' },
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

  return (
    <div className={classes.outlinePaper}>
      <Grid container spacing={1}>
        {multipleMeasurements.map((measurements, i) => (
          <Grid item xs={4} key={i}>
            <Card>
              <CardContent>
                <Typography variant="h6">{`${splitByUpperCase(measurements.metric)} ${
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
  );
};
