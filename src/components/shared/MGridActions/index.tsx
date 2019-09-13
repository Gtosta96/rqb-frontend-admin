import Drawer from '@material-ui/core/Drawer';
import Fab from '@material-ui/core/Fab';
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import RefreshIcon from '@material-ui/icons/Refresh';
import React, { useEffect } from 'react';
import { useObservable } from 'react-use-observable';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { IResponse } from '../../../services/api';
import ConfirmDiscardDialog from '../ConfirmDiscardDialog';

const useStyles = makeStyles({
  root: {
    display: "flex",
    justifyContent: "space-evenly",
    width: 150,
    marginLeft: "auto"
  }
});

interface IProps {
  openDrawer: boolean;
  onCloseDrawer?: () => void;
  newUser: () => void;
  refresh: () => void;
  form: React.ReactNode;
  formListener: () => Observable<IResponse<any>>;
}

function MGridActions(props: IProps) {
  const classes = useStyles();
  const [drawer, setDrawer] = React.useState(false);
  const [modal, setModal] = React.useState(false);

  useObservable(
    () =>
      props.formListener().pipe(
        tap(({ error }) => {
          setDrawer(error); // keep modal open if error.

          if (!error) {
            refresh();
            closeDialog(true);
          }
        })
      ),
    []
  );

  useEffect(() => {
    setDrawer(props.openDrawer);
  }, [props.openDrawer]);

  function refresh() {
    props.refresh();
  }

  function add() {
    setDrawer(true);
    props.newUser();
  }

  function closeDialog(discard: boolean) {
    setModal(false);
    setDrawer(!discard);

    if (discard === true && props.onCloseDrawer) {
      props.onCloseDrawer();
    }
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
      <Fab color="secondary" onClick={refresh}>
        <RefreshIcon />
      </Fab>
      <Fab color="primary" onClick={add}>
        <AddIcon />
      </Fab>

      <Drawer anchor={"right"} open={drawer} onClose={closeDrawer}>
        {props.form}
      </Drawer>

      {modal && <ConfirmDiscardDialog open={modal} onClose={closeDialog} />}
    </div>
  );
}

export default React.memo(MGridActions);
