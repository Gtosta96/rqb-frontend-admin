import React from 'react';

import Frame from './Frame';
import Loader from './Loader';
import CustomizedSnackbars from './Snackbar';

const Layout = (props: any) => {
  return (
    <>
      <Frame>{props.children}</Frame>
      <Loader />
      <CustomizedSnackbars />
    </>
  );
};

export default Layout;
