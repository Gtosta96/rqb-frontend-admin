import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Tooltip from '@material-ui/core/Tooltip';
import Delete from '@material-ui/icons/Delete';
import Edit from '@material-ui/icons/Edit';
import React from 'react';

import { IBrokerGroupRoutingResponse } from '../../../../interfaces/models/broker-group-routing';

const useTableRowStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      "&:nth-of-type(odd)": {
        backgroundColor: theme.palette.background.default
      }
    }
  })
);

const useTableCellStyles = makeStyles((theme: Theme) =>
  createStyles({
    head: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white
    },
    body: {
      fontSize: 14
    }
  })
);

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      marginTop: theme.spacing(3)
    },
    table: {
      minWidth: 700
    },
    action: {
      minWidth: "125px",
      maxWidth: "125px",
      width: "125px",
      padding: "16px 14px"
    }
  })
);

interface IProps {
  routes?: IBrokerGroupRoutingResponse[] | null;
  editRoute: (userInfo: IBrokerGroupRoutingResponse) => void;
  deleteRoute: (userInfo: IBrokerGroupRoutingResponse) => void;
}

const DataGrid: React.FC<IProps> = props => {
  const tableCellClasses = useTableCellStyles();
  const tableRowClasses = useTableRowStyles();
  const classes = useStyles();

  function editRoute(route: IBrokerGroupRoutingResponse) {
    return () => props.editRoute(route);
  }

  function deleteRoute(route: IBrokerGroupRoutingResponse) {
    return () => props.deleteRoute(route);
  }

  return (
    <Paper className={classes.root}>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell classes={tableCellClasses} className={classes.action}>
              &nbsp;
            </TableCell>
            <TableCell classes={tableCellClasses}>Risk List</TableCell>
            <TableCell classes={tableCellClasses}>Risk Names</TableCell>
            <TableCell classes={tableCellClasses}>Broker Group ID</TableCell>
            <TableCell classes={tableCellClasses}>Broker Group Name</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.routes &&
            props.routes.map(route => (
              <TableRow key={route.riskName} classes={tableRowClasses}>
                <TableCell classes={tableCellClasses} className={classes.action} align="center">
                  <Tooltip title="Edit Route" placement="top">
                    <IconButton onClick={editRoute(route)}>
                      <Edit />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Delete Route" placement="top">
                    <IconButton onClick={deleteRoute(route)}>
                      <Delete />
                    </IconButton>
                  </Tooltip>
                </TableCell>
                <TableCell classes={tableCellClasses} component="th" scope="row">
                  {route.riskIdList}
                </TableCell>
                <TableCell classes={tableCellClasses} component="th" scope="row">
                  {route.riskName}
                </TableCell>
                <TableCell classes={tableCellClasses} component="th" scope="row">
                  {route.bgId}
                </TableCell>
                <TableCell classes={tableCellClasses} component="th" scope="row">
                  {route.bgName}
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </Paper>
  );
};

export default React.memo(DataGrid);
