import React, { Suspense } from 'react';
import { BrowserRouter as Router, Redirect, Route, RouteComponentProps, Switch } from 'react-router-dom';

import { EPaths } from '../settings/constants';
import Layout from './layout';
import Home from './pages/Home';
import Loading from './shared/Loading';

// import Users from './pages/Users';
// import AgentCommissions from './pages/AgentCommissions';
// import AgentFirm from './pages/AgentFirm';
// import BrokerGroupRouting from './pages/BrokerGroupRouting';
// import Err from './shared/Err';

const Users = React.lazy(() => import("./pages/Users"));
const AgentCommissions = React.lazy(() => import("./pages/AgentCommissions"));
const AgentFirm = React.lazy(() => import("./pages/AgentFirm"));
const BrokerGroupRouting = React.lazy(() => import("./pages/BrokerGroupRouting"));
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

            <Route
              path={`${EPaths.USERS_BROKER_GROUP_ROUTING}`}
              render={redirectWithFallback("user", BrokerGroupRouting, EPaths.USERS)}
            />

            <Route exact={true} path={EPaths.AGENT_FIRMS} component={AgentFirm} />
            <Route
              path={`${EPaths.AGENT_COMMISSIONS}`}
              render={redirectWithFallback("firm", AgentCommissions, EPaths.AGENT_FIRMS)}
            />

            <Route component={Err} />
          </Switch>
        </Layout>
      </Suspense>
    </Router>
  );
}

function redirectWithFallback(item: string, Component: React.ElementType, fallback: EPaths) {
  return function(props: RouteComponentProps<any, any, any>) {
    return props.location.state && props.location.state[item] ? (
      <Component {...props} />
    ) : (
      <Redirect to={fallback} />
    );
  };
}

export default React.memo(Routes);
