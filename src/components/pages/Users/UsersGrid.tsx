import DeviceHub from '@material-ui/icons/DeviceHub';
import Edit from '@material-ui/icons/Edit';
import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';

import { IUserResponse } from '../../../interfaces/models/user';
import { EPaths } from '../../../settings/constants';
import MGrid from '../../shared/MGrid';

interface IProps extends RouteComponentProps {
  users: IUserResponse[] | null;
  editUser: (userInfo: IUserResponse) => void;
}

function UsersGrid(props: IProps) {
  function editUser(user: IUserResponse) {
    props.editUser(user);
  }

  function redirectUser(user: IUserResponse) {
    props.history.push(EPaths.USERS_BROKER_GROUP_ROUTING, { user, breadcrumb: user.shortName });
  }

  return (
    props.users && (
      <MGrid
        actions={[
          {
            icon: () => <Edit color="action" />,
            tooltip: "Edit User",
            onClick: (event, rowData) => editUser(rowData as IUserResponse)
          },
          {
            icon: () => <DeviceHub color="action" />,
            tooltip: "Broker Group Routing",
            onClick: (event, rowData) => redirectUser(rowData as IUserResponse)
          }
        ]}
        columns={[
          { title: "Full Name", field: "fullName" },
          { title: "First Name", field: "firstName" },
          { title: "Last Name", field: "lastName" },
          { title: "Initials", field: "initials" },
          { title: "Short Name", field: "shortName" },
          { title: "Username", field: "username" },
          { title: "Email", field: "email" }
        ]}
        rows={props.users}
      />
    )
  );
}

export default React.memo(withRouter(UsersGrid));
