import { createMuiTheme } from '@material-ui/core';

import { primaryColor } from 'kate-form-creative-tim/variables/styles';

import customInputStyle from 'kate-form-creative-tim/variables/styles/customInputStyle';

const materialTheme = createMuiTheme({
  overrides: {
    MuiPickersToolbar: {
      toolbar: {
        backgroundColor: primaryColor,
      },
    },
    MuiPickersCalendarHeader: {
      switchHeader: {
        // backgroundColor: lightBlue.A200,
        // color: 'white',
      },
    },
    MuiPickersDay: {
      day: {
        color: primaryColor,
      },
      selected: {
        backgroundColor: primaryColor,
      },
      current: {
        color: primaryColor,
      },
    },
    MuiPickersModal: {
      dialogAction: {
        color: primaryColor,
      },
    },
    MuiPickersYear: {
      selected: {
        color: primaryColor,
      },
    },
    MuiInputLabel: {
      root: customInputStyle.labelRoot,
    },
    MuiFormLabel: {
      root: {
        '&$focused': {
          color: customInputStyle.labelRoot.color,
        },
      },
    },
  },
});

export default materialTheme;
