import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { actions } from './reducer';
import { useQuery } from 'urql';
import Card from '@material-ui/core/Card';
import { makeStyles } from '@material-ui/core/styles';
import MetricsAutocomplete from '../../components/MetricsAutocomplete';
import Grid from '@material-ui/core/Grid';
import Cards from '../../components/Cards';
import Chart from '../../components/Chart';

const useStyles = makeStyles({
  main: {
    overflowY: 'auto',
    height: 'Calc(100% - 64px)',
  },
  card: {
    margin: '10px',
    minHeight: 'Calc(100% - 20px)',
    display: 'flex',
  },
  cardsPaper: { width: '100%', height: '100%' },
  leftContainer: {
    minWidth: '30%',
    maxWidth: '350px',
    padding: '16px',
    backgroundColor: 'aliceblue',
    display: 'block',
  },
  chartContainer: {
    flexGrow: 1,
    padding: '16px',
    '& .js-plotly-plot': {
      position: 'relative',
      top: '50%',
      transform: 'translate(0, -50%)',
    },
    '& .eogIcon': {
      position: 'relative',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%  , -50%)',
    },
  },
});

const metricsQuery = `
query {
  getMetrics
}
`;

export default () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  //// fetching all dinamic metrics we will have
  const [{ data: dataGetMetrics, error }] = useQuery({
    query: metricsQuery,
  });

  useEffect(() => {
    if (!dataGetMetrics) return;
    const { getMetrics } = dataGetMetrics;
    dispatch(actions.initializeMetrics(getMetrics));
  }, [dispatch, dataGetMetrics]);

  useEffect(() => {
    if (error) {
      dispatch(actions.apiErrorReceived({ error: error.message }));
      return;
    }
  }, [dispatch, error]);

  return (
    <div className={classes.main}>
      <Card className={classes.card}>
        <Grid container spacing={2} className={classes.leftContainer}>
          <Grid item xs={12}>
            <MetricsAutocomplete />
          </Grid>
          <Grid item xs={12}>
            <Cards />
          </Grid>
        </Grid>
        <div className={classes.chartContainer}>
          <Chart />
        </div>
      </Card>
    </div>
  );
};
