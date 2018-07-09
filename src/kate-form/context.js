import React from 'react';
import { connectors as defaultConnectors } from './connectors';

const { Provider, Consumer } = React.createContext({
  connectors: defaultConnectors,
  logRerender: false,
});

const KateFormProvider = ({ connectors, logRerender, children }) => (
  <Provider value={{ connectors, logRerender }}>
    {children}
  </Provider>
);

export {
  KateFormProvider,
  Consumer,
};
