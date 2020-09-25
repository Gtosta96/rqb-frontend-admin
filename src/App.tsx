import "./assets/global.css";

import CssBaseline from "@material-ui/core/CssBaseline";
import { MuiThemeProvider } from "@material-ui/core/styles";
import React from "react";

import { mainTheme } from "./assets/themes/Theme";
import Routes from "./components/Routes";

(window as any).theme = mainTheme; // TODO: REMOVE

function App() {
  return (
    <MuiThemeProvider theme={mainTheme}>
      <CssBaseline />

      <Routes />
    </MuiThemeProvider>
  );
}

export default React.memo(App);
