import Edit from '@material-ui/icons/Edit';
import React from 'react';

import { booleanToString } from '../../../helpers/functions';
import { IFirmResponse } from '../../../interfaces/models/agent-firms';
import MGrid from '../../shared/MGrid';

interface IProps {
  firms: IFirmResponse[] | null;
  editFirm: (info: IFirmResponse) => void;
}

function AgentFirmGrid(props: IProps) {
  function editFirm(user: IFirmResponse) {
    props.editFirm(user);
  }

  return (
    props.firms && (
      <MGrid
        actions={[
          {
            icon: () => <Edit color="action" />,
            tooltip: "Edit Firm",
            onClick: (event, rowData) => editFirm(rowData as IFirmResponse)
          }
        ]}
        columns={[
          { title: "Firm Name", field: "firmName" },
          { title: "Legal Name", field: "firmLegalName" },
          { title: "globalClientId", field: "globalClientId" },
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
            render: rowData => rowData.onboarded.substr(0, rowData.onboarded.indexOf(" 00:00:00"))
          }
        ]}
        rows={props.firms}
      />
    )
  );
}

export default React.memo(AgentFirmGrid);
