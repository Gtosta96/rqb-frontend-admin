import Auth from '@aws-amplify/auth';

import { AWS } from './constants';

(window as any).Auth = Auth;

export const getAmplifyConfig = () => {
  Auth.configure(AWS);
  return AWS;
};
