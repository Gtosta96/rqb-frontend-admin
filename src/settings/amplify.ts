import sessionService from '../services/session';
import { AWS } from './constants';

export const configureAmplify = () => {
  sessionService.configure(AWS);
};
