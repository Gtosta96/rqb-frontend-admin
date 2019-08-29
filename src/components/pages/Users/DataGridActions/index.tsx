import Drawer from '@material-ui/core/Drawer';
import Fab from '@material-ui/core/Fab';
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import RefreshIcon from '@material-ui/icons/Refresh';
import React, { useEffect } from 'react';

import { IUserResponse } from '../../../../interfaces/models/user';
import ConfirmDiscardDialog from './ConfirmDiscardDialog';
import UsersForm from './UsersForm';

const useStyles = makeStyles({
  root: {
    display: "flex",
    justifyContent: "space-evenly",
    width: 150,
    marginLeft: "auto"
  }
});

interface IProps {
  userInfo?: IUserResponse;
  newUser: () => void;
  refresh: () => void;
}

const DataGridActions: React.FC<IProps> = (props) => {
  const classes = useStyles();
  const [drawer, setDrawer] = React.useState(false);
  const [modal, setModal] = React.useState(false);

  useEffect(() => {
    setDrawer(!!props.userInfo);
  }, [props.userInfo]);

  function add() {
    setDrawer(true);
    props.newUser();
  }

  function closeDialog(discard: boolean) {
    setModal(false);
    setDrawer(!discard);
  }

  function closeDrawer(event: React.KeyboardEvent | React.MouseEvent) {
    if (
      event.type === "keydown" &&
      ((event as React.KeyboardEvent).key === "Tab" ||
        (event as React.KeyboardEvent).key === "Shift")
    ) {
      return;
    }

    setModal(true);
  }

  return (
    <div className={classes.root}>
      <Fab color="secondary" onClick={props.refresh}>
        <RefreshIcon />
      </Fab>
      <Fab color="primary" onClick={add}>
        <AddIcon />
      </Fab>

      <Drawer anchor={"right"} open={drawer} onClose={closeDrawer}>
        <UsersForm userInfo={props.userInfo} />
      </Drawer>

      {modal && <ConfirmDiscardDialog open={modal} onClose={closeDialog} />}
    </div>
  );
};

export default React.memo(DataGridActions);
