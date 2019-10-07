import Delete from '@material-ui/icons/Delete';
import Edit from '@material-ui/icons/Edit';
import React from 'react';

import { IBrokerageRateResponse } from '../../../../interfaces/models/brokerage-rate';
import MGrid from '../../../shared/MGrid';

interface IProps {
  title: string;
  brokerageRates: IBrokerageRateResponse[] | null;
  editRate: (info: IBrokerageRateResponse) => void;
  deleteRate: (info: IBrokerageRateResponse) => void;
}

function BrokerageRateGrid(props: IProps) {
  function editRate(route: IBrokerageRateResponse) {
    props.editRate(route);
  }

  function deleteRoute(route: IBrokerageRateResponse) {
    props.deleteRate(route);
  }

  return (
    props.brokerageRates && (
      <MGrid
        title={props.title}
        actions={[
          {
            icon: () => <Edit color="action" />,
            tooltip: "Edit Route",
            onClick: (event, rowData) => editRate(rowData as IBrokerageRateResponse)
          },
          {
            icon: () => <Delete color="action" />,
            tooltip: "Delete Route",
            onClick: (event, rowData) => deleteRoute(rowData as IBrokerageRateResponse)
          }
        ]}
        columns={[
          { title: "Risk Id", field: "riskId" },
          { title: "Risk", field: "risk" },
          { title: "Rate", field: "rate" }
        ]}
        rows={props.brokerageRates}
      />
    )
  );
}

export default React.memo(BrokerageRateGrid);
