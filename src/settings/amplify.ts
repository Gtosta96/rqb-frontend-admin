import sessionService from '../services/session';
import { AWS } from './constants';

export const getAmplifyConfig = () => {
  sessionService.configure(AWS);
  return AWS;
};
