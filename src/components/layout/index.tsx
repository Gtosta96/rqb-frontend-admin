import React from 'react';

import Sidebar from '../layout/Sidebar';
import Loader from './Loader';
import CustomizedSnackbars from './Snackbar';

const Layout = (props: any) => {
  return (
    <>
      <Sidebar>{props.children}</Sidebar>
      <Loader />
      <CustomizedSnackbars />
    </>
  );
};

export default Layout;
