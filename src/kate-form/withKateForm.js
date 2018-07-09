import React, { Component } from 'react';
import { connect } from 'react-redux';

import { getSetData, createContent, getValues, setValues } from './index';

const withKateForm = (FormComponent, kateFormPath, subElementsPath = 'elements', kateFormStorePath = 'kate-form') => {
  class withKateFormComponent extends Component {
    constructor(props) {
      super(props);
      const { setData } = props;
      this.content = createContent(this.getData, setData, subElementsPath);
    }
    getData = () => this.props.data;
    getValues = () => getValues(this.props.data, subElementsPath);
    setValues = values => setValues(values, this.props.data, this.props.setData, subElementsPath)
    init = elements => this.props.setData('', elements);
    render() {
      return (
        <FormComponent
          {...this.props}
          kateFormContent={this.content}
          kateFormInit={this.init}
          getValues={this.getValues}
          setValues={this.setValues}
        />
      );
    }
  }
  const mapStateToProps = state => ({
    data: state[kateFormStorePath][kateFormPath],
  });

  return connect(mapStateToProps, {
    setData: getSetData(kateFormPath),
  })(withKateFormComponent);
};

export default withKateForm;
