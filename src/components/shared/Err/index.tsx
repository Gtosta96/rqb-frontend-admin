import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import classnames from 'classnames';
import React from 'react';

import { ReactComponent as ErrSVG } from './undraw_page_not_found.svg';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      height: "100%",
      width: "100%",
      maxWidth: "500px",
      margin: "0 auto"
    }
  })
);

function Loading() {
  const classes = useStyles();

  return (
    <div className={classnames(classes.root)}>
      <ErrSVG />
    </div>
  );
}

export default React.memo(Loading);
