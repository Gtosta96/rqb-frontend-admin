import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Edit from '@material-ui/icons/Edit';
import React from 'react';

import { IUserResponse } from '../../../../../interfaces/models/user';

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
      width: "50px",
      padding: "16px 14px"
    }
  })
);

interface IProps {
  users?: IUserResponse[] | null;
  editUser?: (userInfo: IUserResponse) => void;
  routeUser?: (userInfo: any) => void;
}

const DataGrid: React.FC<IProps> = (props) => {
  const tableCellClasses = useTableCellStyles();
  const tableRowClasses = useTableRowStyles();
  const classes = useStyles();

  function editUser(user: IUserResponse) {
    // return () => props.editUser(user);
    return () => {};
  }

  return (
    <Paper className={classes.root}>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell classes={tableCellClasses} className={classes.action}>
              &nbsp;
            </TableCell>
            <TableCell classes={tableCellClasses}>Full Name</TableCell>
            <TableCell classes={tableCellClasses}>First Name</TableCell>
            <TableCell classes={tableCellClasses}>Last Name</TableCell>
            <TableCell classes={tableCellClasses}>Initials</TableCell>
            <TableCell classes={tableCellClasses}>Short Name</TableCell>
            <TableCell classes={tableCellClasses}>Username</TableCell>
            <TableCell classes={tableCellClasses}>Email</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow key={"xpto"} classes={tableRowClasses}>
            <TableCell classes={tableCellClasses} className={classes.action} align="center">
              <IconButton aria-label="delete" onClick={editUser({} as any)}>
                <Edit />
              </IconButton>
            </TableCell>
            <TableCell classes={tableCellClasses} component="th" scope="row">
              fullName
            </TableCell>
            <TableCell classes={tableCellClasses} component="th" scope="row">
              firstName
            </TableCell>
            <TableCell classes={tableCellClasses} component="th" scope="row">
              lastName
            </TableCell>
            <TableCell classes={tableCellClasses} component="th" scope="row">
              initials
            </TableCell>
            <TableCell classes={tableCellClasses} component="th" scope="row">
              shortName
            </TableCell>
            <TableCell classes={tableCellClasses} component="th" scope="row">
              username
            </TableCell>
            <TableCell classes={tableCellClasses} component="th" scope="row">
              email
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Paper>
  );
};

export default React.memo(DataGrid);
