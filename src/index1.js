import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import KateClient from 'kate-client';
import KateApp from './KateApp';

import registerServiceWorker from './registerServiceWorker';

import configureStore from './store';


const store = configureStore();

ReactDOM.render(
  <Provider store={store}>
    <KateClient app={KateApp} />
  </Provider>,
  document.getElementById('root'),
);

registerServiceWorker();
