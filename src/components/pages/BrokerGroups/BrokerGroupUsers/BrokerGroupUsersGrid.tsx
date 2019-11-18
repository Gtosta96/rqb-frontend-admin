import Delete from '@material-ui/icons/Delete';
import Edit from '@material-ui/icons/Edit';
import React from 'react';

import { booleanToString } from '../../../../helpers/functions';
import { IBrokerGroupUsersResponse } from '../../../../interfaces/models/broker-groups';
import MGrid from '../../../shared/MGrid';

interface IProps {
  title: string;
  brokerGroupUsers: IBrokerGroupUsersResponse[] | null;
  editBgUser: (info: IBrokerGroupUsersResponse) => void;
  deleteBgUser: (info: IBrokerGroupUsersResponse) => void;
}

function BrokerGroupUsersGrid(props: IProps) {
  function editBgUser(route: IBrokerGroupUsersResponse) {
    props.editBgUser(route);
  }

  function deleteBgUser(route: IBrokerGroupUsersResponse) {
    props.deleteBgUser(route);
  }

  return (
    props.brokerGroupUsers && (
      <MGrid
        title={props.title}
        actions={[
          {
            icon: () => <Edit color="action" />,
            tooltip: "Edit Commission",
            onClick: (event, rowData) => editBgUser(rowData as IBrokerGroupUsersResponse)
          },
          {
            icon: () => <Delete color="action" />,
            tooltip: "Delete Commission",
            onClick: (event, rowData) => deleteBgUser(rowData as IBrokerGroupUsersResponse)
          }
        ]}
        columns={[
          { title: "User", field: "fullName" },
          {
            title: "Can Action Submissions",
            field: "canActionSubmissions",
            render: rowData => booleanToString(rowData, "canActionSubmissions")
          }
        ]}
        rows={props.brokerGroupUsers}
      />
    )
  );
}

export default React.memo(BrokerGroupUsersGrid);
