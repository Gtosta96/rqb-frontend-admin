import AppBar from "@material-ui/core/AppBar";
import Badge from "@material-ui/core/Badge";
import Chip from "@material-ui/core/Chip";
import IconButton from "@material-ui/core/IconButton";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import AccountCircle from "@material-ui/icons/AccountCircle";
import MailIcon from "@material-ui/icons/Mail";
import MenuIcon from "@material-ui/icons/Menu";
import NotificationsIcon from "@material-ui/icons/Notifications";
import classnames from "classnames";
import React from "react";

import { appEnvironment } from "../../../settings/constants";
import Menu from "./Menu";

interface IProps {
  onClickSidebarButton: () => void;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    grow: {
      flexGrow: 1
    },
    appBar: {
      zIndex: theme.zIndex.drawer + 1
    },
    menuButton: {
      marginRight: theme.spacing(2)
    },
    title: {
      display: "block"
    },
    environment: {
      padding: theme.spacing(1),
      margin: theme.spacing(0, 1),
      textTransform: "uppercase",
      borderColor: "#fff",
      color: "#fff"
    },
    dev: { backgroundColor: "#4F9024" },
    uat: { backgroundColor: "#C2BE4A" },
    prod: { backgroundColor: "#BD4949" },
    sectionDesktop: {
      display: "flex"
    }
  })
);

function Header(props: IProps) {
  const classes = useStyles();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const isMenuOpen = Boolean(anchorEl);

  function handleProfileMenuOpen(event: React.MouseEvent<HTMLElement>) {
    setAnchorEl(event.currentTarget);
  }

  function handleMenuClose() {
    setAnchorEl(null);
  }

  const menuId = "header-menu";

  return (
    <>
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            onClick={props.onClickSidebarButton}
          >
            <MenuIcon />
          </IconButton>
          <Typography className={classes.title} variant="h6" noWrap={true}>
            Administration
            <Chip
              className={classnames(classes.environment, classes[appEnvironment])}
              label={appEnvironment}
              variant="outlined"
            />
          </Typography>
          <div className={classes.grow} />
          <div className={classes.sectionDesktop}>
            <IconButton aria-label="show 4 new mails" color="inherit">
              <Badge badgeContent={4} color="secondary">
                <MailIcon />
              </Badge>
            </IconButton>
            <IconButton aria-label="show 17 new notifications" color="inherit">
              <Badge badgeContent={17} color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <IconButton
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>

      <Menu
        anchorEl={anchorEl}
        menuId={menuId}
        isMenuOpen={isMenuOpen}
        handleMenuClose={handleMenuClose}
      />
    </>
  );
}
export default Header;
