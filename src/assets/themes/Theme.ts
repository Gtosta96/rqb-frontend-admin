import createMuiTheme from '@material-ui/core/styles/createMuiTheme';

import EColors from './Colors';

export const mainTheme = createMuiTheme({
  palette: {
    type: "light",
    primary: {
      main: EColors.darkSlateBlue
    },
    secondary: {
      main: EColors.ochre
    }
  },

  typography: {
    fontFamily: ["Lato", "Helvetica"].join(",")
  },
  overrides: {
    MuiTypography: {
      paragraph: {
        "&strong": {
          fontWeight: "bolder"
        }
      }
    }
  }
});
