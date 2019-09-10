import { amber, green } from '@material-ui/core/colors';
import IconButton from '@material-ui/core/IconButton';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import { makeStyles, Theme } from '@material-ui/core/styles';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CloseIcon from '@material-ui/icons/Close';
import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';
import WarningIcon from '@material-ui/icons/Warning';
import classnames from 'classnames';
import React, { SyntheticEvent } from 'react';
import { useObservable } from 'react-use-observable';
import { tap } from 'rxjs/operators';

import { ISnackbarIcons, ISnackbarPayload, ISnackbarVariants } from '../../../interfaces/ui';
import uiService from '../../../services/ui';

const variantIcon: ISnackbarIcons = {
  success: CheckCircleIcon,
  warning: WarningIcon,
  error: ErrorIcon,
  info: InfoIcon
};

const useStyles1 = makeStyles((theme: Theme) => ({
  success: {
    backgroundColor: green[600]
  },
  error: {
    backgroundColor: theme.palette.error.dark
  },
  info: {
    backgroundColor: theme.palette.primary.main
  },
  warning: {
    backgroundColor: amber[700]
  },
  icon: {
    fontSize: 20
  },
  iconVariant: {
    opacity: 0.9,
    marginRight: theme.spacing(1)
  },
  message: {
    display: "flex",
    alignItems: "center"
  }
}));

export interface IProps {
  className?: string;
  message?: string;
  onClose?: () => void;
  variant: ISnackbarVariants;
}

const MySnackbarContentWrapper: React.FC<IProps> = props => {
  const classes = useStyles1();
  const { className, message, onClose, variant, ...other } = props;
  const Icon = variantIcon[variant];

  return (
    <SnackbarContent
      className={classnames(classes[variant], className)}
      aria-describedby="client-snackbar"
      message={
        <span id="client-snackbar" className={classes.message}>
          <Icon className={classnames(classes.icon, classes.iconVariant)} />
          {message}
        </span>
      }
      action={[
        <IconButton key="close" aria-label="close" color="inherit" onClick={onClose}>
          <CloseIcon className={classes.icon} />
        </IconButton>
      ]}
      {...other}
    />
  );
};

const CustomizedSnackbars: React.FC = () => {
  const [open, setOpen] = React.useState<boolean>(false);
  const [payload, setPayload] = React.useState<ISnackbarPayload>();

  useObservable(
    () =>
      uiService.listenSnackbar().pipe(
        tap((payload: ISnackbarPayload) => {
          setOpen(true);
          setPayload(payload);
        })
      ),
    []
  );

  function handleClose(event?: SyntheticEvent, reason?: string) {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  }

  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={handleClose}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right"
      }}
    >
      {payload && (
        <MySnackbarContentWrapper
          onClose={handleClose}
          variant={payload.variant}
          message={payload.message}
        />
      )}
    </Snackbar>
  );
};

export default CustomizedSnackbars;
