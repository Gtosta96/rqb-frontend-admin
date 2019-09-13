import Badge from '@material-ui/core/Badge';
import IconButton from '@material-ui/core/IconButton';
import MuiMenu from '@material-ui/core/Menu';
import MuiMenuItem from '@material-ui/core/MenuItem';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MailIcon from '@material-ui/icons/Mail';
import NotificationsIcon from '@material-ui/icons/Notifications';
import React from 'react';

interface IProps {
  mobileMoreAnchorEl: any;
  mobileMenuId: any;
  isMobileMenuOpen: any;
  handleMobileMenuClose: any;
  handleProfileMenuOpen: any;
}

function MobileMenu(props: IProps) {
  return (
    <MuiMenu
      anchorEl={props.mobileMoreAnchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={props.mobileMenuId}
      keepMounted={true}
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={props.isMobileMenuOpen}
      onClose={props.handleMobileMenuClose}
    >
      <MuiMenuItem>
        <IconButton aria-label="show 4 new mails" color="inherit">
          <Badge badgeContent={4} color="secondary">
            <MailIcon />
          </Badge>
        </IconButton>
        <p>Messages</p>
      </MuiMenuItem>
      <MuiMenuItem>
        <IconButton aria-label="show 11 new notifications" color="inherit">
          <Badge badgeContent={11} color="secondary">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MuiMenuItem>
      <MuiMenuItem onClick={props.handleProfileMenuOpen}>
        <IconButton
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <p>Profile</p>
      </MuiMenuItem>
    </MuiMenu>
  );
}

export default MobileMenu;
