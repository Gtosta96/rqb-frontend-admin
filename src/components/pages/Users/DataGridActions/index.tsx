import Drawer from '@material-ui/core/Drawer';
import Fab from '@material-ui/core/Fab';
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import React, { useEffect } from 'react';

import { IResponseUser } from '../../../../models/User';
import UsersForm from './UsersForm';

const useStyles = makeStyles({
  drawer: {}
});

interface IProps {
  newUser: () => void;
  userInfo?: IResponseUser;
}

const DataGridActions: React.FC<IProps> = (props) => {
  const classes = useStyles();

  const [state, setState] = React.useState({
    open: false
  });

  useEffect(() => {
    setState({ open: !!props.userInfo });
  }, [props.userInfo]);

  function toggleDrawer(open: boolean) {
    return (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }

      setState({ open });
    };
  }

  function add() {
    toggleDrawer(true);
    props.newUser();
  }

  return (
    <div>
      <Fab color="primary" aria-label="add" onClick={add}>
        <AddIcon />
      </Fab>

      <Drawer anchor={"right"} open={state.open} onClose={toggleDrawer(false)}>
        <UsersForm userInfo={props.userInfo} />
      </Drawer>
    </div>
  );
};

export default React.memo(DataGridActions);
