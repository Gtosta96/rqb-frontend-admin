import React, { Suspense } from "react";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  RouteComponentProps,
  Switch
} from "react-router-dom";

import { EPaths } from "../settings/constants";
import Layout from "./layout";
import Home from "./pages/Home";
import Loading from "./shared/Loading";

const Users = React.lazy(() => import("./pages/Users"));

const Err = React.lazy(() => import("./shared/Err"));

function Routes() {
  return (
    <Router>
      <Suspense fallback={<Loading fullscreen={true} />}>
        <Layout>
          <Switch>
            <Redirect exact={true} from={EPaths.LOGIN} to={EPaths.ROOT} />
            <Redirect exact={true} from={EPaths.LOGOUT} to={EPaths.ROOT} />

            <Route exact={true} path={EPaths.ROOT} component={Home} />

            <Route exact={true} path={EPaths.USERS} component={Users} />

            <Route component={Err} />
          </Switch>
        </Layout>
      </Suspense>
    </Router>
  );
}

function redirectWithFallback(item: string, Component: React.ElementType, fallback: EPaths) {
  return (props: RouteComponentProps<any, any, any>) => {
    return props.location.state && props.location.state[item] ? (
      <Component {...props} />
    ) : (
      <Redirect to={fallback} />
    );
  };
}

export default React.memo(Routes);
