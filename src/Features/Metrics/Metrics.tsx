import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { actions } from './reducer';
import { useQuery } from 'urql';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { makeStyles } from '@material-ui/core/styles';
import MetricsAutocomplete from '../../components/MetricsAutocomplete';
import Grid from '@material-ui/core/Grid';
import Cards from '../../components/Cards';
import Chart from '../../components/Chart';

const useStyles = makeStyles({
  card: {
    margin: '10px',
    height: 'Calc(100% - 84px)',
  },
  cardsPaper: { width: '100%', height: '100%' },
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
    <Card className={classes.card}>
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={5}>
            <MetricsAutocomplete />
          </Grid>

          <Grid item xs={7}>
            <Cards />
          </Grid>

          <Grid item xs={12}>
            <Chart />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};
