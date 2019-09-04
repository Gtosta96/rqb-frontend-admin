import React from 'react';

import Err from '../Err';
import Loading from '../Loading';

interface IProps {
  loading: boolean;
  error: boolean;
  children: React.ReactNode;
}

const Feedback: React.FC<IProps> = (props) => {
  if (props.loading) {
    return <Loading />;
  }

  if (props.error) {
    return <Err />;
  }

  return <>{props.children}</>;
};

export default React.memo(Feedback);
