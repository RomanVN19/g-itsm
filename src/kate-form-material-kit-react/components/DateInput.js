import React from 'react';
import Datetime from 'react-datetime';

import CustomInput from 'material-kit-react/dist/components/CustomInput/CustomInput';
import './DateInput.css';

const DateInput = (props) => {
  const {
    inputProps: { onBlur, onFocus, value, onChange, ...restInputProps },
    formControlProps,
    labelText,
    ...restProps
  } = props;
  return (
    <Datetime
      onFocus={onFocus}
      onBlur={onBlur}
      value={value}
      onChange={onChange}
      renderInput={(dateInputProps, open, close) => (
        <CustomInput
          inputProps={{ ...dateInputProps, ...restInputProps }}
          onBlur={close}
          onFocus={open}
          labelText={labelText}
          formControlProps={formControlProps}
        />
      )}
      {...restProps}
    />
  );
};

export default DateInput;
