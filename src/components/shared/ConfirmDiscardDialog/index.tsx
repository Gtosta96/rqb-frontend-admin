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

  title?: string | React.ReactNode;
  content?: string | React.ReactNode;
  yesButton?: string;
  noButton?: string;
}

function ConfirmDiscardDialog(props: IProps) {
  function close(discard: boolean) {
    return () => props.onClose(discard);
  }

  return (
    <Dialog open={props.open} onClose={close(false)}>
      <DialogTitle>{props.title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{props.content}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={close(true)} color="primary">
          {props.yesButton}
        </Button>
        <Button onClick={close(false)} color="primary">
          {props.noButton}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

ConfirmDiscardDialog.defaultProps = {
  title: "Heads Up!",
  content: "Are you sure you want to discard your changes?",
  yesButton: "YES",
  noButton: "NO"
};

export default React.memo(ConfirmDiscardDialog);
