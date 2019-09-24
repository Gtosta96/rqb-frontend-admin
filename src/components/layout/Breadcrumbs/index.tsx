/* eslint-disable no-nested-ternary */
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Link from '@material-ui/core/Link';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import { Route } from 'react-router';
import { Link as RouterLink } from 'react-router-dom';

import { EPaths, PATHS_LABEL } from '../../../settings/constants';

const useStyles = makeStyles((theme: Theme) => createStyles({}));

export default function RouterBreadcrumbs() {
  const classes = useStyles();

  return (
    <Route>
      {route => {
        const pathnames = route.location.pathname.split("/").filter(pathname => pathname);

        return (
          <Breadcrumbs aria-label="breadcrumb">
            <Link to={EPaths.ROOT} color="inherit" component={RouterLink}>
              RQB
            </Link>

            {pathnames.map((value, index) => {
              const last = index === pathnames.length - 1;
              const to = `/${pathnames.slice(0, index + 1).join("/")}` as EPaths;
              const label = PATHS_LABEL[to];

              if (!label) {
                return;
              }

              return last ? (
                <Typography key={to} color="textPrimary">
                  {label}
                </Typography>
              ) : (
                <Link key={to} to={to} color="inherit" component={RouterLink}>
                  {label}
                </Link>
              );
            })}
          </Breadcrumbs>
        );
      }}
    </Route>
  );
}
