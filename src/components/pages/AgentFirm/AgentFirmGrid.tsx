import Edit from '@material-ui/icons/Edit';
import Timeline from '@material-ui/icons/Timeline';
import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';

import { booleanToString, parseDate } from '../../../helpers/functions';
import { IFirmResponse } from '../../../interfaces/models/agent-firms';
import { EPaths } from '../../../settings/constants';
import MGrid from '../../shared/MGrid';

interface IProps extends RouteComponentProps {
  firms: IFirmResponse[] | null;
  editFirm: (info: IFirmResponse) => void;
}

function AgentFirmGrid(props: IProps) {
  function editFirm(firm: IFirmResponse) {
    props.editFirm(firm);
  }

  function redirect(firm: IFirmResponse) {
    props.history.push(EPaths.AGENT_COMMISSIONS, { firm });
  }

  return (
    props.firms && (
      <MGrid
        actions={[
          {
            icon: () => <Edit color="action" />,
            tooltip: "Edit Firm",
            onClick: (event, rowData) => editFirm(rowData as IFirmResponse)
          },
          rowData => ({
            icon: () => <Timeline color="action" />,
            onClick: () => redirect(rowData as IFirmResponse),
            tooltip: rowData.isAgentFirm ? "Agent Commissions" : undefined,
            disabled: !rowData.isAgentFirm
          })
        ]}
        columns={[
          { title: "Firm Name", field: "firmName" },
          { title: "Legal Name", field: "firmLegalName" },
          { title: "Global Client ID", field: "globalClientId" },
          {
            title: "isActive",
            field: "isActive",
            render: rowData => booleanToString(rowData, "isActive")
          },
          {
            title: "isAgentFirm",
            field: "isAgentFirm",
            render: rowData => booleanToString(rowData, "isAgentFirm")
          },
          {
            title: "Onboarded",
            field: "onboarded",
            render: rowData => parseDate(rowData.onboarded)
          }
        ]}
        rows={props.firms}
      />
    )
  );
}

export default React.memo(withRouter(AgentFirmGrid));
