import { Authenticator, Greetings } from 'aws-amplify-react';
import React from 'react';

import { getAmplifyConfig } from '../../../settings/amplify';
import Routes from '../../Routes';

const Login = () => {
  return (
    <Authenticator
      amplifyConfig={getAmplifyConfig()}
      theme={{
        container: {
          minHeight: "100vh",
          height: "100vh",
          display: "flex",
          flexDirection: "column"
        }
      }}
      hide={[Greetings]}
    >
      <Routes />
    </Authenticator>
  );
};

export default React.memo(Login);
