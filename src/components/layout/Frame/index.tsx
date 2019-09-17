import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import classnames from 'classnames';
import React from 'react';

import RouterBreadcrumbs from '../Breadcrumbs';
import Header from '../Header';
import Sidebar from '../Sidebar';

const drawerOptions = {
  width: 240,
  animation: (theme: Theme) =>
    theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
};
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex"
    },
    main: {
      flexGrow: 1,
      padding: theme.spacing(3),
      marginLeft: 0
    },
    toolbar: theme.mixins.toolbar,
    content: {
      padding: theme.spacing(3, 2)
    },
    animation: {
      transition: drawerOptions.animation(theme)
    }
  })
);
function Frame(props: any) {
  const classes = useStyles();

  const [sidebar, setSidebar] = React.useState<boolean>(true);

  function toggleSidebar() {
    setSidebar(!sidebar);
  }

  return (
    <div className={classes.root}>
      <Header onClickSidebarButton={toggleSidebar} />
      <Sidebar
        open={sidebar}
        drawerOptions={{ width: drawerOptions.width, animationClass: classes.animation }}
      />

      <main className={classnames(classes.main, classes.animation)}>
        <div className={classes.toolbar} />
        <div className={classes.content}>
          <RouterBreadcrumbs />
          <div>{props.children}</div>
        </div>
      </main>
    </div>
  );
}

export default Frame;
