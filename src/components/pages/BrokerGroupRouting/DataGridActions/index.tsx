import Drawer from '@material-ui/core/Drawer';
import Fab from '@material-ui/core/Fab';
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import RefreshIcon from '@material-ui/icons/Refresh';
import React, { useEffect } from 'react';
import { useObservable } from 'react-use-observable';
import { tap } from 'rxjs/operators';

import { IBrokerGroupRoutingResponse } from '../../../../interfaces/models/broker-group-routing';
import brokerGroupRoutingService from '../../../../services/broker-group-routing/broker-group-routing';
import ConfirmDiscardDialog from '../../../shared/ConfirmDiscardDialog';
import BrokerGroupRoutingForm from './BrokerGroupRoutingForm';

const useStyles = makeStyles({
  root: {
    display: "flex",
    justifyContent: "space-evenly",
    width: 150,
    marginLeft: "auto"
  }
});

interface IProps {
  appUserId: number;
  routeInfo?: IBrokerGroupRoutingResponse;
  newRoute: () => void;
  refresh: () => void;
}

const DataGridActions: React.FC<IProps> = props => {
  const classes = useStyles();
  const [drawer, setDrawer] = React.useState(false);
  const [modal, setModal] = React.useState(false);

  useObservable(
    () =>
      brokerGroupRoutingService.listenRoute().pipe(
        tap(({ error }) => {
          setDrawer(error); // keep modal open if error.

          if (!error) {
            props.refresh();
          }
        })
      ),
    []
  );

  useEffect(() => {
    setDrawer(!!props.routeInfo);
  }, [props.routeInfo]);

  function add() {
    setDrawer(true);
    props.newRoute();
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
        <BrokerGroupRoutingForm appUserId={props.appUserId} routeInfo={props.routeInfo} />
      </Drawer>

      {modal && <ConfirmDiscardDialog open={modal} onClose={closeDialog} />}
    </div>
  );
};

export default React.memo(DataGridActions);
