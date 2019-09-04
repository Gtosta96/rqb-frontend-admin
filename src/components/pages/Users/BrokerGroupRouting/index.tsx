import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import React from 'react';

import { IUserResponse } from '../../../../interfaces/models/user';
import RouterBreadcrumbs from './Breadcrumbs';
import DataGrid from './DataGrid';

const useStyles = makeStyles((theme: Theme) => createStyles({}));

interface IProps {
  userInfo?: IUserResponse;
}

const BrokerGroupRouting: React.FC<IProps> = (props) => {
  const classes = useStyles();

  function handleClose() {
    console.log("close...");
  }

  return (
    <Dialog open={true} fullWidth={true} maxWidth={"xl"} aria-labelledby="max-width-dialog-title">
      <DialogTitle id="max-width-dialog-title">Broker Group Routing</DialogTitle>
      <DialogContent>
        {/* <DialogContentText>
          You can set my maximum width and whether to adapt or not.
        </DialogContentText> */}
        <RouterBreadcrumbs />
        <DataGrid />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default React.memo(BrokerGroupRouting);
