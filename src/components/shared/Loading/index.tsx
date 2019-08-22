import CircularProgress from '@material-ui/core/CircularProgress';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import classnames from 'classnames';
import React from 'react';

interface IProps {
  fullscreen?: boolean;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      height: "100%",
      width: "100%",
      "&.-fullscreen": {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh"
      }
    },
    progress: {
      margin: theme.spacing(2)
    }
  })
);
const Loading: React.FC<IProps> = (props) => {
  const classes = useStyles();

  return (
    <div className={classnames(classes.root, { "-fullscreen": props.fullscreen })}>
      <CircularProgress className={classes.progress} />
    </div>
  );
};

export default React.memo(Loading);
