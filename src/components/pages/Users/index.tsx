import React, { useState } from 'react';
import { useObservable } from 'react-use-observable';

import { IResponseUser } from '../../../models/User';
import usersService from '../../../services/users';
import Loading from '../../shared/Loading';
import DataGrid from './DataGrid';
import DataGridActions from './DataGridActions';

const Users = () => {
  const [users] = useObservable(() => usersService.getUsers(), []);
  const [userInfo, setUserInfo] = useState<IResponseUser>();

  function setUser(data?: IResponseUser) {
    setUserInfo(({ ...data } || {}) as IResponseUser);
  }

  if (!users || users.length === 0) {
    return <Loading />;
  }

  return (
    <>
      <DataGridActions userInfo={userInfo} newUser={setUser} />
      <DataGrid users={users} editUser={setUser} />
    </>
  );
};

export default React.memo(Users);
