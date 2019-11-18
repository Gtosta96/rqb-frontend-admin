import { Auth, Hub } from 'aws-amplify';
import { withOAuth } from 'aws-amplify-react';
import React from 'react';

import { configureAmplify } from '../../../settings/amplify';
import Routes from '../../Routes';

configureAmplify();

class App extends React.Component<any, any> {
  timeout: any = null;

  constructor(props: any) {
    super(props);

    this.state = {
      authState: "loading"
    };

    Hub.listen("auth", data => {
      switch (data.payload.event) {
        case "signIn":
          clearTimeout(this.timeout);
          this.setState({ authState: "signedIn" });
          break;
        case "signIn_failure":
          this.setState({ authState: "signIn" });
          break;
        default:
          break;
      }
    });
  }

  componentDidMount() {
    setTimeout(() => this.checkUser(), 1500);
  }

  checkUser = () => {
    Auth.currentAuthenticatedUser()
      .then(() => {
        console.log("signedIn");
        clearTimeout(this.timeout);
        this.setState({ authState: "signedIn" });
      })
      .catch(() => {
        this.setState({ authState: "signIn" });
      });
  };

  redirect() {
    this.timeout = setTimeout(() => this.props.OAuthSignIn(), 3000);
  }

  render() {
    const { authState } = this.state;

    console.log(authState);

    return (
      <div className="App">
        {authState === "loading" || (authState === "signIn" && <div>loading...</div>)}
        {authState === "signIn" && this.redirect()}
        {authState === "signedIn" && <Routes />}
      </div>
    );
  }
}

export default withOAuth(App);
