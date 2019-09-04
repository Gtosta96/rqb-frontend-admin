import React, { useState } from 'react';
import { useObservable } from 'react-use-observable';

import { IUserResponse } from '../../../interfaces/models/user';
import usersService from '../../../services/users/users';
import Feedback from '../../shared/Feedback';
import BrokerGroupRouting from './BrokerGroupRouting';
import DataGrid from './DataGrid';
import DataGridActions from './DataGridActions';

const Users = () => {
  const [usersState] = useObservable(() => {
    usersService.getUsers();
    return usersService.listenState();
  }, []);

  const [userInfo, setUserInfo] = useState<IUserResponse>();
  const [routeUser, setRouteUser] = useState<any>();

  function setUserFn(data?: IUserResponse) {
    setUserInfo(({ ...data } || {}) as IUserResponse);
  }

  function routeUserFn(data?: IUserResponse) {
    setRouteUser(({ ...data } || {}) as IUserResponse);
  }

  function refresh() {
    usersService.getUsers();
  }

  // ----- //

  function loadGrid() {
    if (!usersState) {
      return null;
    }

    return (
      <>
        <Feedback loading={usersState.loading} error={usersState.error}>
          <DataGrid users={usersState.payload} editUser={setUserFn} routeUser={routeUserFn} />
        </Feedback>

        {routeUser && <BrokerGroupRouting userInfo={routeUser} />}
      </>
    );
  }

  return (
    <>
      <DataGridActions userInfo={userInfo} newUser={setUserFn} refresh={refresh} />
      {loadGrid()}
    </>
  );
};

export default React.memo(Users);
