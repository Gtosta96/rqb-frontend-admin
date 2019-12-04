import React, { Suspense } from 'react';
import { BrowserRouter as Router, Redirect, Route, RouteComponentProps, Switch } from 'react-router-dom';

import { EPaths } from '../settings/constants';
import Layout from './layout';
import Home from './pages/Home';
import Loading from './shared/Loading';

const Users = React.lazy(() => import("./pages/Users"));
const BrokerGroupRouting = React.lazy(() => import("./pages/Users/BrokerGroupRouting"));

const AgentFirm = React.lazy(() => import("./pages/AgentFirm"));
const AgentCommissions = React.lazy(() => import("./pages/AgentFirm/AgentCommissions"));

const Binders = React.lazy(() => import("./pages/Binders"));
const BinderAuthority = React.lazy(() => import("./pages/Binders/BinderAuthority"));
const BrokerageRate = React.lazy(() => import("./pages/Binders/BrokerageRate"));

const BrokerGroups = React.lazy(() => import("./pages/BrokerGroups"));
const BrokerGroupBinders = React.lazy(() => import("./pages/BrokerGroups/BrokerGroupBinders"));
const BrokerGroupRoutes = React.lazy(() => import("./pages/BrokerGroups/BrokerGroupRoutes"));
const BrokerGroupUsers = React.lazy(() => import("./pages/BrokerGroups/BrokerGroupUsers"));

const DocumentClauses = React.lazy(() => import("./pages/DocumentClauses"));
const DocumentTemplates = React.lazy(() => import("./pages/DocumentTemplates"));
const DocumentSchedules = React.lazy(() => import("./pages/DocumentSchedules"));
const ClientDocuments = React.lazy(() => import("./pages/ClientDocuments"));
const DocumentAttributes = React.lazy(() => import("./pages/DocumentAttributes"));

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

            <Route exact={true} path={EPaths.DOCUMENT_CLAUSES} component={DocumentClauses} />
            <Route exact={true} path={EPaths.DOCUMENT_TEMPLATES} component={DocumentTemplates} />
            <Route exact={true} path={EPaths.DOCUMENT_SCHEDULES} component={DocumentSchedules} />

            <Route exact={true} path={EPaths.CLIENT_DOCUMENTS} component={ClientDocuments} />

            <Route exact={true} path={EPaths.DOCUMENT_ATTRIBUTES} component={DocumentAttributes} />

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
