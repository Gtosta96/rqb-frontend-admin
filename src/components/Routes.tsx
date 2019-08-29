import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import { EPaths } from '../settings/constants';
import Layout from './layout';
import Dashboard from './pages/Dashboard/Dashboard';
import Users from './pages/Users';
import Err from './shared/Err';

interface IProps {
  authState?: string;
}

const Routes: React.FC<IProps> = (props) => {
  if (!props.authState || props.authState !== "signedIn") {
    return null;
  }

  return (
    <Layout>
      <Router>
        <Switch>
          {/* <Route path={EPaths.ROOT} component={Login} />
        <Route path={EPaths.LOGIN} component={Login} /> */}

          {/* <Route path={EPaths.ROOT} component={Dashboard} /> */}
          <Route path={EPaths.DASHBOARD} component={Dashboard} />

          <Route path={EPaths.ROOT} component={Users} />
          <Route path={EPaths.USERS} component={Users} />

          <Route component={Err} />
        </Switch>
      </Router>
    </Layout>
  );
};

export default React.memo(Routes);
