import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import FindInPage from '@material-ui/icons/FindInPage';
import FolderIcon from '@material-ui/icons/Folder';
import GroupIcon from '@material-ui/icons/Group';
import GroupWorkIcon from '@material-ui/icons/GroupWork';
import PersonIcon from '@material-ui/icons/Person';
import classnames from 'classnames';
import React, { Fragment } from 'react';
import { Link as RouterLink, RouteComponentProps, withRouter } from 'react-router-dom';

import { EPaths, PATHS_LABEL } from '../../../settings/constants';

// import HomeIcon from '@material-ui/icons/Home';
interface IProps extends RouteComponentProps {
  open: boolean;
  drawerOptions: {
    width: number;
    animationClass: string;
  };
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    drawer: {
      width: (props: IProps) => props.drawerOptions.width,
      flexShrink: 0,
      marginLeft: 0
    },
    drawerPaper: {
      width: (props: IProps) => props.drawerOptions.width,
      marginLeft: 0
    },
    shift: {
      marginLeft: (props: IProps) => -props.drawerOptions.width
    },
    toolbar: theme.mixins.toolbar
  })
);
function Sidebar(props: IProps) {
  const classes = useStyles(props);

  const paths = [
    // { path: EPaths.ROOT, label: PATHS_LABEL[EPaths.ROOT], icon: HomeIcon },
    { path: EPaths.USERS, label: PATHS_LABEL[EPaths.USERS], icon: GroupIcon },
    { path: EPaths.AGENT_FIRMS, label: PATHS_LABEL[EPaths.AGENT_FIRMS], icon: PersonIcon },
    { path: EPaths.BINDERS, label: PATHS_LABEL[EPaths.BINDERS], icon: FolderIcon },
    {
      path: EPaths.BROKER_GROUPS,
      label: PATHS_LABEL[EPaths.BROKER_GROUPS],
      icon: GroupWorkIcon,
      divider: true
    },
    {
      path: EPaths.DOCUMENT_CLAUSES,
      label: PATHS_LABEL[EPaths.DOCUMENT_CLAUSES],
      icon: FindInPage
    },
    {
      path: EPaths.DOCUMENT_TEMPLATES,
      label: PATHS_LABEL[EPaths.DOCUMENT_TEMPLATES],
      icon: FindInPage
    },
    {
      path: EPaths.DOCUMENT_SCHEDULES,
      label: PATHS_LABEL[EPaths.DOCUMENT_SCHEDULES],
      icon: FindInPage
    },

    {
      path: EPaths.CLIENT_DOCUMENTS,
      label: PATHS_LABEL[EPaths.CLIENT_DOCUMENTS],
      icon: FindInPage
    },
    {
      path: EPaths.DOCUMENT_ATTRIBUTES,
      label: PATHS_LABEL[EPaths.DOCUMENT_ATTRIBUTES],
      icon: FindInPage
    }
    // { path: EPaths.SURPLUS_LINES, label: PATHS_LABEL[EPaths.SURPLUS_LINES], icon: null }
  ];

  return (
    <Drawer
      open={props.open}
      className={classnames(classes.drawer, props.drawerOptions.animationClass, {
        [classes.shift]: !props.open
      })}
      variant="permanent"
      anchor="left"
      classes={{
        paper: classnames(classes.drawerPaper, props.drawerOptions.animationClass, {
          [classes.shift]: !props.open
        })
      }}
    >
      <div className={classes.toolbar} />
      <List>
        {paths.map(path => (
          <Fragment key={path.path}>
            <ListItem
              button={true}
              component={RouterLink}
              to={path.path}
              tabIndex={props.open ? undefined : -1}
              selected={path.path === props.location.pathname}
            >
              <ListItemIcon>{<path.icon />}</ListItemIcon>
              <ListItemText primary={path.label} />
            </ListItem>

            {path.divider && <Divider />}
          </Fragment>
        ))}
      </List>
    </Drawer>
  );
}

export default React.memo(withRouter(Sidebar));
