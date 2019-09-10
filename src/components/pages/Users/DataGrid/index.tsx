import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import DeviceHub from '@material-ui/icons/DeviceHub';
import Edit from '@material-ui/icons/Edit';
import MaterialTable from 'material-table';
import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';

import { IUserResponse } from '../../../../interfaces/models/user';
import { EPaths } from '../../../../settings/constants';
import icons from '../../../shared/Grid/icons';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      marginTop: theme.spacing(3)
    }
  })
);

interface IProps extends RouteComponentProps {
  users: IUserResponse[] | null;
  editUser: (userInfo: IUserResponse) => void;
}

const DataGrid: React.FC<IProps> = props => {
  const classes = useStyles();

  function editUser(user: IUserResponse) {
    props.editUser(user);
  }

  function redirectUser(user: IUserResponse) {
    props.history.push(EPaths.USERS_BROKER_GROUP_ROUTING, { user });
  }

  return (
    props.users && (
      <div className={classes.root}>
        <MaterialTable
          title=""
          icons={icons}
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
          data={props.users}
          options={{
            paging: false
          }}
        />
      </div>
    )
  );
};

export default React.memo(withRouter(DataGrid));
