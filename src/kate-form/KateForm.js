import React from 'react';
import { connect } from 'react-redux';

import { getSetData } from './actions';
import { Consumer } from './context';

export const getIn = (obj, path) => {
  const pathArray = Array.isArray(path) ? path : path.split('.');
  if (pathArray[pathArray.length - 1] === '') pathArray.pop();
  let currentData = obj;
  for (let i = 0; i < pathArray.length && currentData; i += 1) {
    currentData = currentData[pathArray[i]];
  }
  return currentData;
};

const KateForm = (props) => {
  const {
    data, connectors,
    path, setData,
    logRerender,
  } = props;
  if (logRerender) console.log('render ', path, data); // eslint-disable-line no-console

  if (!data) {
    console.error(`[kate-form] Error connecting element: data on path ${path} is null`);
    return null;
  }

  if (Array.isArray(data)) {
    // render sub elements
    return (
      <div>
        {
          data.map((element, index) => (
            <ConnectedKateForm
              key={element.id || index}
              path={`${path}.${index}`}
            />))
        }
      </div>
    );
  }
  // render element
  const { type, ...elementProps } = data;
  if (!data.type || !connectors[data.type] || data.hidden) return null;
  const ElementComponent = connectors[data.type];
  return (
    <ElementComponent
      setData={setData}
      path={path}
      {...elementProps}
    />
  );
};

const KateFormWithContext = props => (
  <Consumer>
    {context => (
      <KateForm connectors={context.connectors} logRerender={context.logRerender} {...props} />
    )}
  </Consumer>
);

const mapStateToProps = (state, ownProps) => ({
  data: getIn(state['kate-form'], ownProps.path),
});

const mapDispathToProps = (dispatch, ownProps) => {
  const setData = getSetData(ownProps.path);
  return {
    setData: (path, data) => dispatch(setData(path, data)),
  };
};

const ConnectedKateForm = connect(mapStateToProps, mapDispathToProps)(KateFormWithContext);
export default ConnectedKateForm;
