import React from 'react';

import uiService from '../../../services/ui';
import Loading from '../../shared/Loading';

const Loader = () => {
  const [open, setOpen] = React.useState(false);
  React.useEffect(() => {
    uiService.listenLoader().subscribe((boolean) => {
      setOpen(boolean);
    });
  });

  return open ? <Loading fullscreen={true} /> : null;
};

export default React.memo(Loader);
