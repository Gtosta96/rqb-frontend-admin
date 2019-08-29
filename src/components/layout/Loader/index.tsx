import React from 'react';
import { useObservable } from 'react-use-observable';

import uiService from '../../../services/ui';
import Loading from '../../shared/Loading';

const Loader = () => {
  const [open] = useObservable(() => uiService.listenLoader(), []);

  return open ? <Loading fullscreen={true} /> : null;
};

export default React.memo(Loader);
