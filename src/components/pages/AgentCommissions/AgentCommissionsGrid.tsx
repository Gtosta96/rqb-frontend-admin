import Delete from '@material-ui/icons/Delete';
import Edit from '@material-ui/icons/Edit';
import React from 'react';

import { IAgentCommissionsResponse } from '../../../interfaces/models/agent-commissions';
import MGrid from '../../shared/MGrid';

interface IProps {
  title: string;
  commissions: IAgentCommissionsResponse[] | null;
  editCommission: (info: IAgentCommissionsResponse) => void;
  deleteCommission: (info: IAgentCommissionsResponse) => void;
}

function AgentCommissionsGrid(props: IProps) {
  function editCommission(route: IAgentCommissionsResponse) {
    props.editCommission(route);
  }

  function deleteCommission(route: IAgentCommissionsResponse) {
    props.deleteCommission(route);
  }

  return (
    props.commissions && (
      <MGrid
        title={props.title}
        actions={[
          {
            icon: () => <Edit color="action" />,
            tooltip: "Edit Commission",
            onClick: (event, rowData) => editCommission(rowData as IAgentCommissionsResponse)
          },
          {
            icon: () => <Delete color="action" />,
            tooltip: "Delete Commission",
            onClick: (event, rowData) => deleteCommission(rowData as IAgentCommissionsResponse)
          }
        ]}
        columns={[
          { title: "Firm", field: "firmName" },
          { title: "Risk", field: "riskCodeSubName" },
          { title: "Binder", field: "binderUiName" },
          {
            title: "Commission Rate",
            field: "commissionRate",
            render: rowData => `${rowData["commissionRate"]} %`
          }
        ]}
        rows={props.commissions}
      />
    )
  );
}

export default React.memo(AgentCommissionsGrid);
