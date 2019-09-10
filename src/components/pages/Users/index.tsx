import React, { useState } from 'react';
import { useObservable } from 'react-use-observable';

import { IUserResponse } from '../../../interfaces/models/user';
import usersService from '../../../services/users/users';
import Feedback from '../../shared/Feedback';
import DataGrid from './DataGrid';
import DataGridActions from './DataGridActions';

const Users = () => {
  const [usersState] = useObservable(() => {
    getUsers(false);
    return usersService.listenState();
  }, []);

  const [userInfo, setUserInfo] = useState<IUserResponse>();

  function setUserFn(data?: IUserResponse) {
    setUserInfo(({ ...data } || {}) as IUserResponse);
  }

  function getUsers(force: boolean = true) {
    usersService.getUsers(force);
  }

  // ----- //

  function loadGrid() {
    return (
      usersState && (
        <Feedback loading={usersState.loading} error={usersState.error}>
          <DataGrid users={usersState.payload} editUser={setUserFn} />
        </Feedback>
      )
    );
  }

  return (
    <>
      <DataGridActions userInfo={userInfo} newUser={setUserFn} refresh={getUsers} />
      {loadGrid()}
    </>
  );
};

export default React.memo(Users);
