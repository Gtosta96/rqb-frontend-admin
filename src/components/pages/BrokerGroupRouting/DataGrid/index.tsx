import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Delete from '@material-ui/icons/Delete';
import Edit from '@material-ui/icons/Edit';
import MaterialTable from 'material-table';
import React from 'react';

import { IBrokerGroupRoutingResponse } from '../../../../interfaces/models/broker-group-routing';
import icons from '../../../shared/Grid/icons';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      marginTop: theme.spacing(3)
    }
  })
);

interface IProps {
  routes: IBrokerGroupRoutingResponse[] | null;
  editRoute: (routeInfo: IBrokerGroupRoutingResponse) => void;
  deleteRoute: (routeInfo: IBrokerGroupRoutingResponse) => void;
}

const DataGrid: React.FC<IProps> = props => {
  const classes = useStyles();

  function editRoute(route: IBrokerGroupRoutingResponse) {
    props.editRoute(route);
  }

  function deleteRoute(route: IBrokerGroupRoutingResponse) {
    props.deleteRoute(route);
  }

  return (
    props.routes && (
      <div className={classes.root}>
        <MaterialTable
          title=""
          icons={icons}
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
          data={props.routes}
          options={{
            paging: false
          }}
        />
      </div>
    )
  );
};

export default React.memo(DataGrid);
