import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Link from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";
import React from "react";
import { Link as RouterLink, Route } from "react-router-dom";

import { EPaths, PATHS_LABEL } from "../../../settings/constants";

export default function RouterBreadcrumbs() {
  return (
    <Route>
      {route => {
        const pathnames = route.location.pathname.split("/").filter(pathname => pathname);

        return (
          <Breadcrumbs aria-label="breadcrumb">
            <Link to={EPaths.ROOT} color="inherit" component={RouterLink}>
              HOME
            </Link>

            {pathnames.map((value, index) => {
              const last = index === pathnames.length - 1;
              const to = `/${pathnames.slice(0, index + 1).join("/")}` as EPaths;
              const label = PATHS_LABEL[to];

              if (!label) {
                return null;
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
