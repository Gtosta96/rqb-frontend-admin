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

class Menu extends React.Component<IProps> {
  state = {
    email: ""
  };

  componentDidMount() {
    sessionService.userData().then(credentials => this.setEmail(credentials.email));
  }

  setEmail = (email: string) => {
    this.setState({ email });
  };

  signOut = () => {
    sessionService.signOut();
  };

  render() {
    const { props, state } = this;

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
          <Typography variant="caption">{state.email}</Typography>
        </MuiMenuItem>
        <MuiMenuItem onClick={this.signOut}>Sign Out</MuiMenuItem>
      </MuiMenu>
    );
  }
}

export default Menu;
