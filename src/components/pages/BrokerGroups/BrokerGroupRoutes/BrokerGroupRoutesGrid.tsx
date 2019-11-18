import Delete from '@material-ui/icons/Delete';
import React from 'react';

import { IBrokerGroupRoutesResponse } from '../../../../interfaces/models/broker-groups';
import MGrid from '../../../shared/MGrid';

interface IProps {
  title: string;
  brokerGroupRoutes: IBrokerGroupRoutesResponse[] | null;
  deleteBgRoute: (info: IBrokerGroupRoutesResponse) => void;
}

function BrokerGroupRoutesGrid(props: IProps) {
  function deleteBgRoute(route: IBrokerGroupRoutesResponse) {
    props.deleteBgRoute(route);
  }

  return (
    props.brokerGroupRoutes && (
      <MGrid
        title={props.title}
        actions={[
          {
            icon: () => <Delete color="action" />,
            tooltip: "Delete Commission",
            onClick: (event, rowData) => deleteBgRoute(rowData as IBrokerGroupRoutesResponse)
          }
        ]}
        columns={[
          { title: "Risk Class", field: "riskClass" },
          { title: "Risk Name(s)", field: "targetRiskName" }
        ]}
        rows={props.brokerGroupRoutes}
      />
    )
  );
}

export default React.memo(BrokerGroupRoutesGrid);
