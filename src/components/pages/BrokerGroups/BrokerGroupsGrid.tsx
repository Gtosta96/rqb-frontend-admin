import DeviceHub from '@material-ui/icons/DeviceHub';
import Edit from '@material-ui/icons/Edit';
import FolderShared from '@material-ui/icons/FolderShared';
import Group from '@material-ui/icons/Group';
import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';

import { booleanToString } from '../../../helpers/functions';
import { IBrokerGroupsResponse } from '../../../interfaces/models/broker-groups';
import { EPaths } from '../../../settings/constants';
import MGrid from '../../shared/MGrid';

interface IProps extends RouteComponentProps {
  brokerGroups: IBrokerGroupsResponse[] | null;
  editBrokerGroup: (info: IBrokerGroupsResponse) => void;
}

function BrokerGroupsGrid(props: IProps) {
  function editBrokerGroup(firm: IBrokerGroupsResponse) {
    props.editBrokerGroup(firm);
  }

  function redirect(path: EPaths, brokerGroup: IBrokerGroupsResponse) {
    props.history.push(path, { brokerGroup });
  }

  return (
    props.brokerGroups && (
      <MGrid
        actions={[
          {
            icon: () => <Edit color="action" />,
            tooltip: "Edit Broker Group",
            onClick: (event, rowData) => editBrokerGroup(rowData as IBrokerGroupsResponse)
          },
          {
            icon: () => <Group color="action" />,
            tooltip: "Broker Group Users",
            onClick: (event, rowData) =>
              redirect(EPaths.BROKER_GROUP_USERS, rowData as IBrokerGroupsResponse)
          },
          {
            icon: () => <FolderShared color="action" />,
            tooltip: "Broker Group Binders",
            onClick: (event, rowData) =>
              redirect(EPaths.BROKER_GROUP_BINDERS, rowData as IBrokerGroupsResponse)
          },
          {
            icon: () => <DeviceHub color="action" />,
            tooltip: "Broker Group Routes",
            onClick: (event, rowData) =>
              redirect(EPaths.BROKER_GROUP_ROUTES, rowData as IBrokerGroupsResponse)
          }
        ]}
        columns={[
          { title: "Broker Group ID", field: "brokerGroupId" },
          { title: "Name", field: "name" },
          { title: "Owner", field: "owner" },
          {
            title: "Auto Pricing",
            field: "isAutoPricing",
            render: rowData => booleanToString(rowData, "isAutoPricing")
          },
          {
            title: "Auto Quoting",
            field: "isAutoQuoting",
            render: rowData => booleanToString(rowData, "isAutoQuoting")
          },
          {
            title: "Pricing Logic",
            field: "isManualPricing",
            render: rowData =>
              booleanToString(rowData, "isManualPricing", "Manual Pricing", "Standard")
          }
        ]}
        rows={props.brokerGroups}
      />
    )
  );
}

export default React.memo(withRouter(BrokerGroupsGrid));
