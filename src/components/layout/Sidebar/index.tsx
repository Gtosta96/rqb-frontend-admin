import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import MailIcon from '@material-ui/icons/Mail';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

import { EPaths, PATHS_LABEL } from '../../../settings/constants';
import RouterBreadcrumbs from '../Breadcrumbs';
import Header from '../Header';

const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex"
    },
    appBar: {
      zIndex: theme.zIndex.drawer + 1
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0
    },
    drawerPaper: {
      width: drawerWidth
    },
    main: {
      flexGrow: 1
    },
    toolbar: theme.mixins.toolbar,
    content: {
      padding: theme.spacing(3, 2)
    }
  })
);

function Sidebar(props: any) {
  const classes = useStyles();

  const paths = [
    { path: EPaths.ROOT, label: PATHS_LABEL[EPaths.ROOT] },
    { path: EPaths.USERS, label: PATHS_LABEL[EPaths.USERS] },
    { path: EPaths.AGENT_FIRMS, label: PATHS_LABEL[EPaths.AGENT_FIRMS] },
    { path: EPaths.BINDERS, label: PATHS_LABEL[EPaths.BINDERS] },
    { path: EPaths.BROKER_GROUPS, label: PATHS_LABEL[EPaths.BROKER_GROUPS] },
    { path: EPaths.SURPLUS_LINES, label: PATHS_LABEL[EPaths.SURPLUS_LINES] }
  ];

  return (
    <div className={classes.root}>
      <Header />

      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper
        }}
      >
        <div className={classes.toolbar} />
        <List>
          {paths.map((path, index) => (
            <ListItem key={path.path} button={true} component={RouterLink} to={path.path}>
              <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
              <ListItemText primary={path.label} />
            </ListItem>
          ))}
        </List>
      </Drawer>

      <main className={classes.main}>
        <div className={classes.toolbar} />
        <div className={classes.content}>
          <RouterBreadcrumbs />
          <div>{props.children}</div>
        </div>
      </main>
    </div>
  );
}

export default Sidebar;
