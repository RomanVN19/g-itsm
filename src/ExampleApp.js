import React, { Component } from 'react';
import { connect } from 'react-redux';
import { KateForm, connectors, Elements, getSetData, setConnectors } from 'kate-form';

import './App.css';


class App extends Component {
  componentWillMount() {
    const data = [
      {
        type: Elements.INPUT,
        id: 'id1',
        value: 'default value',
      },
      [{
        type: Elements.INPUT,
        id: 'id2',
        value: '',
      }],
      {
        type: Elements.FORM,
        id: 'subform',
        data: [
          {
            type: Elements.LABEL,
            id: 'labelId',
            title: 'Subform label',
          },
          {
            type: Elements.INPUT,
            id: 'inputId',
            value: 'sub input value',
          },
          {
            type: Elements.INPUT,
            id: 'inputId2',
            value: 'Subform label',
            onChange: this.setSubformLabel,
          },
        ],
      },
      {
        type: Elements.BUTTON,
        id: '4',
        title: 'Test click',
        onClick: this.testClick,
      },
    ];
    this.props.setData('', data);
    this.props.setConnectors(connectors);
  }
  setSubformLabel = (label) => {
    const { setData } = this.props;
    setData('2.data.0.title', label);
  }
  testClick = () => {
    const { data, setData } = this.props;
    console.log('Full data = ', data);
    setData('1.0.value', 'value set by id');
  }
  render() {
    return (
      <div className="App">
        <KateForm path="form" />
      </div>
    );
  }
}

export default connect(state => ({ data: state['kate-form'] }), {
  setData: getSetData('form'),
  setConnectors,
})(App);
