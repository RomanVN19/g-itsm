 import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import { Router, Route } from 'react-router-dom';
import { createBrowserHistory } from 'history';

import { KateFormProvider } from 'kate-form';
import { connectors, Elements } from 'kate-form-material-kit-react';

import configureStore from './store';
import registerServiceWorker from './registerServiceWorker';

import KateComponent from './kate-component';

import App from './classes/App';
import Form from './classes/Form';


const KateClient = ({ app }) => {
  const history = createBrowserHistory();
  const store = configureStore();

  ReactDOM.render(
    <Provider store={store}>
      <KateFormProvider connectors={connectors}>
        <Router history={history}>
          <Route path={app.path} render={props => <KateComponent app={app} {...props} />} />
        </Router>
      </KateFormProvider>
    </Provider>,
    document.getElementById('root'),
  );

  registerServiceWorker();
};

export default KateClient;
export {
  App,
  Form,
  Elements,
};
