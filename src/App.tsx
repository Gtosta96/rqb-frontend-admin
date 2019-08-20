import CssBaseline from '@material-ui/core/CssBaseline';
import { createStyles, MuiThemeProvider, Theme, withStyles } from '@material-ui/core/styles';
import React from 'react';

import { mainTheme } from './assets/themes/Theme';
import Login from './components/pages/Login/Login';

(window as any).theme = mainTheme; // TODO: REMOVE

interface IProps {
  classes?: any;
}

const styles = (theme: Theme) => createStyles({});
const App: React.FC<IProps> = () => (
  <MuiThemeProvider theme={mainTheme}>
    <CssBaseline />

    <Login />
  </MuiThemeProvider>
);

export default React.memo(withStyles(styles)(App));
