import Delete from '@material-ui/icons/Delete';
import Edit from '@material-ui/icons/Edit';
import React from 'react';

import { booleanToString } from '../../../../helpers/functions';
import { IBrokerGroupBindersResponse } from '../../../../interfaces/models/broker-groups';
import MGrid from '../../../shared/MGrid';

interface IProps {
  title: string;
  brokerGroupBinders: IBrokerGroupBindersResponse[] | null;
  editBgBinder: (info: IBrokerGroupBindersResponse) => void;
  deleteBgBinder: (info: IBrokerGroupBindersResponse) => void;
}

function BrokerGroupBindersGrid(props: IProps) {
  function editBgBinder(route: IBrokerGroupBindersResponse) {
    props.editBgBinder(route);
  }

  function deleteBgBinder(route: IBrokerGroupBindersResponse) {
    props.deleteBgBinder(route);
  }

  return (
    props.brokerGroupBinders && (
      <MGrid
        title={props.title}
        actions={[
          {
            icon: () => <Edit color="action" />,
            tooltip: "Edit Commission",
            onClick: (event, rowData) => editBgBinder(rowData as IBrokerGroupBindersResponse)
          },
          {
            icon: () => <Delete color="action" />,
            tooltip: "Delete Commission",
            onClick: (event, rowData) => deleteBgBinder(rowData as IBrokerGroupBindersResponse)
          }
        ]}
        columns={[
          { title: "Risk", field: "risk" },
          { title: "Binder ID", field: "binderId" },
          { title: "Binder Name", field: "binder" },
          {
            title: "Active",
            field: "isBinderActive",
            render: rowData => booleanToString(rowData, "isBinderActive")
          }
        ]}
        rows={props.brokerGroupBinders}
      />
    )
  );
}

export default React.memo(BrokerGroupBindersGrid);
