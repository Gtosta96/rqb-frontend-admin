import React, { useState } from 'react';
import { useObservable } from 'react-use-observable';

import { IUserResponse } from '../../../models/User';
import usersService from '../../../services/users';
import Loading from '../../shared/Loading';
import DataGrid from './DataGrid';
import DataGridActions from './DataGridActions';

const Users = () => {
  const [usersState] = useObservable(() => usersService.getUsers(), []);
  const [userInfo, setUserInfo] = useState<IUserResponse>();

  function setUser(data?: IUserResponse) {
    setUserInfo(({ ...data } || {}) as IUserResponse);
  }

  if (!usersState || !usersState.users || usersState.users.length === 0) {
    return <Loading />;
  }

  return (
    <>
      <DataGridActions userInfo={userInfo} newUser={setUser} />
      <DataGrid users={usersState.users} editUser={setUser} />
    </>
  );
};

export default React.memo(Users);
