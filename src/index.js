import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { Loading } from './components/molecules';
import reportWebVitals from './reportWebVitals';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';
import { Store } from './modules/stores/Store';
import './helpers/utils/FontAwesomeIcon'; // font awesome library

import * as Sentry from '@sentry/react';
import { Integrations } from '@sentry/tracing';

if (process.env.REACT_APP_PROJECT === 'PROD') {
  Sentry.init({
    dsn: 'https://5ca7cc71f2ff4dc3b62a13f12f174d99@o951209.ingest.sentry.io/5900701',
    integrations: [new Integrations.BrowserTracing()],

    // We recommend adjusting this value in production, or using tracesSampler
    // for finer control
    tracesSampleRate: 1.0,
  });
}

ReactDOM.render(
  <Provider store={Store}>
    <PersistGate loading={<Loading />} persistor={Store.__persistor}>
      <App />
    </PersistGate>
  </Provider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
