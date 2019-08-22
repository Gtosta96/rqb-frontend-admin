// @ts-ignore
import Auth from '@aws-amplify/auth';
import MuiMenu from '@material-ui/core/Menu';
import MuiMenuItem from '@material-ui/core/MenuItem';
import React from 'react';

interface IProps {
  anchorEl: any;
  menuId: any;
  isMenuOpen: any;
  handleMenuClose: any;
}

const Menu: React.FC<IProps> = (props) => {
  function signOut() {
    Auth.signOut();
  }

  return (
    <MuiMenu
      anchorEl={props.anchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={props.menuId}
      keepMounted={true}
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={props.isMenuOpen}
      onClose={props.handleMenuClose}
    >
      <MuiMenuItem onClick={props.handleMenuClose}>Profile</MuiMenuItem>
      <MuiMenuItem onClick={props.handleMenuClose}>My account</MuiMenuItem>
      <MuiMenuItem onClick={signOut}>Sign Out</MuiMenuItem>
    </MuiMenu>
  );
};

export default Menu;
