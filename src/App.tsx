import React from 'react';
import createStore from './store';
import { Provider as ReduxProvider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import 'react-toastify/dist/ReactToastify.css';
import Header from './components/Header';
import Wrapper from './components/Wrapper';
import Metrics from './Features/Metrics/Metrics';
import { Provider as UrqlProvider, Client, defaultExchanges, subscriptionExchange } from 'urql';
import { SubscriptionClient } from 'subscriptions-transport-ws';

// const client = createClient({
//   url: 'https://react.eogresources.com/graphql',
// });

const subscriptionClient = new SubscriptionClient('ws://react.eogresources.com/graphql', { reconnect: true });

const client = new Client({
  url: 'https://react.eogresources.com/graphql',
  exchanges: [
    ...defaultExchanges,
    subscriptionExchange({
      forwardSubscription(operation) {
        return subscriptionClient.request(operation);
      },
    }),
  ],
});

const store = createStore();
const theme = createMuiTheme({
  palette: {
    primary: {
      main: 'rgb(39,49,66)',
    },
    secondary: {
      main: 'rgb(197,208,222)',
    },
    background: {
      default: 'rgb(226,231,238)',
    },
  },
});

const App = () => (
  <MuiThemeProvider theme={theme}>
    <CssBaseline />
    <UrqlProvider value={client}>
      <ReduxProvider store={store}>
        <Wrapper>
          <Header />
          <Metrics />
          <ToastContainer />
        </Wrapper>
      </ReduxProvider>
    </UrqlProvider>
  </MuiThemeProvider>
);

export default App;
