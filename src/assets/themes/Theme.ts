import createMuiTheme from '@material-ui/core/styles/createMuiTheme';

export const mainTheme = createMuiTheme({
  palette: {
    // primary: {
    //   light: EColors.mango,
    //   main: EColors.tealBlue
    // dark: COLORS.brownishGrey
    // contrastText: ""
    // },
    // secondary: {
    //   light: EColors.mango,
    //   main: EColors.tangerine,
    //   dark: EColors.mango
    // contrastText: COLORS.white,
    // },
    // text: {
    // primary: COLORS.darkBlack,
    // secondary: COLORS.brownishGrey
    // },
    // background: {
    //   default: EColors.ice
    // }
  },

  typography: {
    // fontFamily: ["PT Sans", "Helvetica"].join(","),
    // h1: {
    //   fontSize: 22
    // },
    // body1: {
    //   fontSize: 12,
    //   fontFamily: "Helvetica"
    // },
    // body2: {
    //   fontSize: 10
    // }
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
