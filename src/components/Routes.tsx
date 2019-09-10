import React from 'react';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';

import { EPaths } from '../settings/constants';
import Layout from './layout';
import BrokerGroupRouting from './pages/BrokerGroupRouting';
import Users from './pages/Users';
import Err from './shared/Err';

interface IProps {
  authState?: string;
}

const Routes: React.FC<IProps> = props => {
  if (!props.authState || props.authState !== "signedIn") {
    return null;
  }

  return (
    <Router>
      <Layout>
        <Switch>
          <Route exact={true} path={EPaths.ROOT} component={Users} />

          <Route exact={true} path={EPaths.USERS} component={Users} />

          <Route
            path={`${EPaths.USERS_BROKER_GROUP_ROUTING}`}
            render={props => {
              return props.location.state && props.location.state.user ? (
                <BrokerGroupRouting {...props} />
              ) : (
                <Redirect to={EPaths.USERS} />
              );
            }}
          />

          <Route component={Err} />
        </Switch>
      </Layout>
    </Router>
  );
};

export default React.memo(Routes);
