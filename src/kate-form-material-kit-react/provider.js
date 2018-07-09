import React from 'react';

import { KateFormProvider } from 'kate-form';

import { connectors } from './connectors';

const OptionsProvider = props => (
  <KateFormProvider connectors={connectors}>
    {props.children}
  </KateFormProvider>
);

export default OptionsProvider;
