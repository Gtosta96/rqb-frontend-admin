import React, { useState } from 'react';
import { useObservable } from 'react-use-observable';

import { IUserResponse } from '../../../interfaces/models/user';
import usersService from '../../../services/users/users';
import Err from '../../shared/Err';
import Loading from '../../shared/Loading';
import DataGrid from './DataGrid';
import DataGridActions from './DataGridActions';

const Users = () => {
  const [usersState] = useObservable(() => {
    usersService.getUsers();
    return usersService.listenState();
  }, []);
  const [userInfo, setUserInfo] = useState<IUserResponse>();

  function setUser(data?: IUserResponse) {
    setUserInfo(({ ...data } || {}) as IUserResponse);
  }

  function refresh() {
    usersService.getUsers();
  }

  // ----- //

  function loadGrid() {
    if (!usersState) {
      return null;
    }

    if (usersState.loading) {
      return <Loading />;
    }

    if (usersState.error) {
      return <Err />;
    }

    return <DataGrid users={usersState.payload} editUser={setUser} />;
  }

  return (
    <>
      <DataGridActions userInfo={userInfo} newUser={setUser} refresh={refresh} />
      {loadGrid()}
    </>
  );
};

export default React.memo(Users);
