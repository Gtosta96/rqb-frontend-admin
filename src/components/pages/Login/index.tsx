import { SignIn, withAuthenticator, withOAuth } from 'aws-amplify-react';
import React from 'react';

import { configureAmplify } from '../../../settings/amplify';
import Routes from '../../Routes';

configureAmplify();

const OktaLogin = withOAuth(
  class extends SignIn {
    timer: any = undefined;

    componentDidMount() {
      this.handleRedirect();
    }

    componentDidUpdate() {
      this.handleRedirect();
    }

    handleRedirect = () => {
      if (this.props.authState === "signedIn") {
        this.cancelRedirect();
      }

      if (this.props.authState === "signIn" && this.timer === undefined) {
        this.redirect();
      }
    };

    redirect = () => {
      this.timer = setTimeout(() => this.props.OAuthSignIn(), 3000);
    };

    cancelRedirect = () => {
      clearTimeout(this.timer);
      this.timer = undefined;
    };

    render() {
      return <div>loading...</div>;
    }
  }
);

export default React.memo(
  withAuthenticator(Routes, false, [<OktaLogin />], null, {
    container: {
      minHeight: "100vh",
      height: "100vh",
      display: "flex",
      flexDirection: "column"
    }
  })
);
