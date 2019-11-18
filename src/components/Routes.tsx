import React, { Suspense } from 'react';
import { BrowserRouter as Router, Redirect, Route, RouteComponentProps, Switch } from 'react-router-dom';

import { EPaths } from '../settings/constants';
import Layout from './layout';
import BinderAuthority from './pages/Binders/BinderAuthority';
import BrokerageRate from './pages/Binders/BrokerageRate';
import BrokerGroupBinders from './pages/BrokerGroups/BrokerGroupBinders';
import BrokerGroupRoutes from './pages/BrokerGroups/BrokerGroupRoutes';
import BrokerGroupUsers from './pages/BrokerGroups/BrokerGroupUsers';
import Home from './pages/Home';
import Loading from './shared/Loading';

const Users = React.lazy(() => import("./pages/Users"));
const AgentCommissions = React.lazy(() => import("./pages/AgentFirm/AgentCommissions"));
const AgentFirm = React.lazy(() => import("./pages/AgentFirm"));
const BrokerGroupRouting = React.lazy(() => import("./pages/Users/BrokerGroupRouting"));
const Binders = React.lazy(() => import("./pages/Binders"));
const BrokerGroups = React.lazy(() => import("./pages/BrokerGroups"));

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
              path={EPaths.AGENT_COMMISSIONS}
              render={redirectWithFallback("firm", AgentCommissions, EPaths.AGENT_FIRMS)}
            />

            <Route exact={true} path={EPaths.BINDERS} component={Binders} />
            <Route
              path={EPaths.BINDER_AUTHORITY}
              render={redirectWithFallback("binder", BinderAuthority, EPaths.BINDERS)}
            />
            <Route
              path={EPaths.BROKERAGE_RATE}
              render={redirectWithFallback("binder", BrokerageRate, EPaths.BINDERS)}
            />

            <Route exact={true} path={EPaths.BROKER_GROUPS} component={BrokerGroups} />
            <Route
              path={EPaths.BROKER_GROUP_BINDERS}
              render={redirectWithFallback("brokerGroup", BrokerGroupBinders, EPaths.BROKER_GROUPS)}
            />
            <Route
              path={EPaths.BROKER_GROUP_USERS}
              render={redirectWithFallback("brokerGroup", BrokerGroupUsers, EPaths.BROKER_GROUPS)}
            />
            <Route
              path={EPaths.BROKER_GROUP_ROUTES}
              render={redirectWithFallback("brokerGroup", BrokerGroupRoutes, EPaths.BROKER_GROUPS)}
            />

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
