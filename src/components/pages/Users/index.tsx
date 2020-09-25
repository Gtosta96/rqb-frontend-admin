import React, { useState } from "react";
import { useObservable } from "react-use-observable";

import { IUserResponse } from "../../../interfaces/models/user";
import usersService from "../../../services/users/users";
import Feedback from "../../shared/Feedback";
import MGridActions from "../../shared/MGridActions";
import UsersForm from "./UsersForm";
import UsersGrid from "./UsersGrid";

function Users() {
  const [usersState] = useObservable(() => {
    getUsers(false);
    return usersService.listenState();
  }, []);

  const [user, setUser] = useState<IUserResponse>();

  function setUserFn(data?: IUserResponse) {
    setUser(({ ...data } || {}) as IUserResponse);
  }

  function clearUserFn() {
    setUser(undefined);
  }

  function getUsers(force: boolean = true) {
    usersService.getUsers(force);
  }

  console.log({ usersState });

  return (
    <>
      {usersState && (
        <Feedback loading={usersState.loading} error={usersState.error}>
          <MGridActions
            openDrawer={!!user}
            onCloseDrawer={clearUserFn}
            add={setUserFn}
            refresh={getUsers}
            formListener={usersService.listenUser}
            form={<UsersForm info={user} />}
          />
          <UsersGrid users={usersState.payload} editUser={setUserFn} />
        </Feedback>
      )}
    </>
  );
}

export default React.memo(Users);
