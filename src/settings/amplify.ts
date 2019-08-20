import Amplify from 'aws-amplify';

import { AWS } from './constants';

(window as any).Amplify = Amplify;

export const getAmplifyConfig = () => {
  Amplify.configure(AWS);
  return AWS;
};
