import BarChart from '@material-ui/icons/BarChart';
import Edit from '@material-ui/icons/Edit';
import Gavel from '@material-ui/icons/Gavel';
import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';

import { IBinderResponse } from '../../../interfaces/models/binders';
import { EPaths } from '../../../settings/constants';
import MGrid from '../../shared/MGrid';

interface IProps extends RouteComponentProps {
  binders: IBinderResponse[] | null;
  editBinder: (info: IBinderResponse) => void;
}

function AgentFirmGrid(props: IProps) {
  function editBinder(firm: IBinderResponse) {
    props.editBinder(firm);
  }

  function redirect(to: EPaths, binder: IBinderResponse) {
    props.history.push(to, { binder });
  }

  return (
    props.binders && (
      <MGrid
        actions={[
          {
            icon: () => <Edit color="action" />,
            tooltip: "Edit Binder",
            onClick: (event, rowData) => editBinder(rowData as IBinderResponse)
          },
          {
            icon: () => <Gavel color="action" />,
            onClick: (event, rowData) =>
              redirect(EPaths.BINDER_AUTHORITY, rowData as IBinderResponse),
            tooltip: "Binder Authority"
          },
          {
            icon: () => <BarChart color="action" />,
            tooltip: "Brokerage Rate",
            onClick: (event, rowData) => redirect(EPaths.BROKERAGE_RATE, rowData as IBinderResponse)
          }
        ]}
        columns={[
          { title: "Binder ID", field: "binderId" },
          { title: "Binder Name", field: "binderUiName" },
          { title: "UMR", field: "umr" },
          { title: "Inception Date", field: "inceptionDate" },
          { title: "End Date", field: "endDate" },
          { title: "Business Type", field: "businessType" },
          { title: "Premium Currency", field: "premiumCurrency" },
          { title: "Income Limit", field: "totalBaPremiumLimit" }
        ]}
        rows={props.binders}
      />
    )
  );
}

export default React.memo(withRouter(AgentFirmGrid));
