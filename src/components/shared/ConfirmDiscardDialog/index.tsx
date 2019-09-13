import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import React from 'react';

interface IProps {
  open: boolean;
  onClose: (keepOpen: boolean) => void;
}

function ConfirmDiscardDialog(props: IProps) {
  function close(discard: boolean) {
    return () => props.onClose(discard);
  }

  return (
    <Dialog open={props.open} onClose={close(true)}>
      <DialogTitle>Heads Up!</DialogTitle>
      <DialogContent>
        <DialogContentText>Are you sure you want to discard your changes?</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={close(true)} color="primary">
          Discard
        </Button>
        <Button onClick={close(false)} color="primary" autoFocus={true}>
          Continue
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default React.memo(ConfirmDiscardDialog);
