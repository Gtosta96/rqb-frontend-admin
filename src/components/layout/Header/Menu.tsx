import { Typography } from '@material-ui/core';
import MuiMenu from '@material-ui/core/Menu';
import MuiMenuItem from '@material-ui/core/MenuItem';
import React, { useEffect, useState } from 'react';

import sessionService from '../../../services/session';

interface IProps {
  anchorEl: any;
  menuId: any;
  isMenuOpen: any;
  handleMenuClose: any;
}

function Menu(props: IProps) {
  const [email, setEmail] = useState("");

  useEffect(() => {
    sessionService.userData().then(credentials => setEmail(credentials.email));
  }, []);

  function signOut() {
    sessionService.signOut();
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
      <MuiMenuItem>
        <Typography variant="caption">{email}</Typography>
      </MuiMenuItem>
      <MuiMenuItem onClick={signOut}>Sign Out</MuiMenuItem>
    </MuiMenu>
  );
}

export default Menu;
