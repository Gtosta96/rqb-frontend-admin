import React from 'react';

import Sidebar from '../layout/Sidebar';

const Layout = (props: any) => {
  return <Sidebar>{props.children}</Sidebar>;
};

export default Layout;
