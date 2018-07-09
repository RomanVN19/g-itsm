import React from 'react';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import withStyles from '@material-ui/core/styles/withStyles';

import basicsStyle from 'material-kit-react/dist/assets/jss/material-kit-react/views/componentsSections/basicsStyle';

const CustomSwitch = (props) => {
  const { value, title, classes, ...rest } = props;
  return (
    <FormControlLabel
      control={
        <Switch
          checked={value}
          value="switch"
          classes={{
            switchBase: classes.switchBase,
            checked: classes.switchChecked,
            icon: classes.switchIcon,
            iconChecked: classes.switchIconChecked,
            bar: classes.switchBar,
          }}
          {...rest}
        />
      }
      label={title}
      className={classes.formControl}
    />
  );
};

export default withStyles(basicsStyle)(CustomSwitch);
