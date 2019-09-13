import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import classnames from 'classnames';
import React from 'react';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      height: "100%",
      width: "100%",
      "&.-fullscreen": {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh"
      }
    },
    progress: {
      margin: theme.spacing(2),
      "&.-fullscreen": {
        color: "#fff"
      }
    }
  })
);

interface IProps {
  fullscreen?: boolean;
}
function Loading(props: IProps) {
  const classes = useStyles();
  const { fullscreen } = props;

  const fullscreenCls = { "-fullscreen": fullscreen };

  return (
    <>
      <Backdrop open={!!fullscreen} style={{ zIndex: 9998 }} />
      <div style={{ zIndex: 9999 }} className={classnames(classes.root, fullscreenCls)}>
        <CircularProgress className={classnames(classes.progress, fullscreenCls)} />
      </div>
    </>
  );
}

Loading.defaultProps = {
  fullscreen: false
};

export default React.memo(Loading);
