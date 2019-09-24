import Delete from '@material-ui/icons/Delete';
import Edit from '@material-ui/icons/Edit';
import React from 'react';

import { IBrokerGroupRoutingResponse } from '../../../interfaces/models/broker-group-routing';
import MGrid from '../../shared/MGrid';

interface IProps {
  title: string;
  routes: IBrokerGroupRoutingResponse[] | null;
  editRoute: (info: IBrokerGroupRoutingResponse) => void;
  deleteRoute: (info: IBrokerGroupRoutingResponse) => void;
}

function BrokerGroupRoutingGrid(props: IProps) {
  function editRoute(route: IBrokerGroupRoutingResponse) {
    props.editRoute(route);
  }

  function deleteRoute(route: IBrokerGroupRoutingResponse) {
    props.deleteRoute(route);
  }

  return (
    props.routes && (
      <MGrid
        title={props.title}
        actions={[
          {
            icon: () => <Edit color="action" />,
            tooltip: "Edit Route",
            onClick: (event, rowData) => editRoute(rowData as IBrokerGroupRoutingResponse)
          },
          {
            icon: () => <Delete color="action" />,
            tooltip: "Delete Route",
            onClick: (event, rowData) => deleteRoute(rowData as IBrokerGroupRoutingResponse)
          }
        ]}
        columns={[
          { title: "Risk List", field: "riskIdList" },
          { title: "Risk Names", field: "riskName" },
          { title: "Broker Group ID", field: "bgId" },
          { title: "Broker Group Name", field: "bgName" }
        ]}
        rows={props.routes}
      />
    )
  );
}

export default React.memo(BrokerGroupRoutingGrid);
