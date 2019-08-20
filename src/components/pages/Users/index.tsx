import Paper from '@material-ui/core/Paper';
import { createStyles, makeStyles, Theme, withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Edit from '@material-ui/icons/Edit';
import React from 'react';
import { useObservable } from 'react-use-observable';

import usersService from '../../../services/users';

const StyledTableCell = withStyles((theme: Theme) =>
  createStyles({
    head: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
      width: (props: { action?: boolean }) => (props.action ? "50px" : undefined)
    },
    body: {
      fontSize: 14,
      width: (props: { action?: boolean }) => (props.action ? "50px" : undefined)
    }
  })
)(TableCell);

const StyledTableRow = withStyles((theme: Theme) =>
  createStyles({
    root: {
      "&:nth-of-type(odd)": {
        backgroundColor: theme.palette.background.default
      }
    }
  })
)(TableRow);

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
      marginTop: theme.spacing(3),
      overflowX: "auto"
    },
    table: {
      minWidth: 700
    }
  })
);

function Users() {
  const classes = useStyles();
  const [users] = useObservable(() => usersService.getUsers(), []);

  return (
    <Paper className={classes.root}>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <StyledTableCell action={true} />
            <StyledTableCell>Full Name</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users &&
            users.map((user) => (
              <StyledTableRow key={user.fullName}>
                <StyledTableCell action={true} align="center">
                  <Edit />
                </StyledTableCell>
                <StyledTableCell component="th" scope="row">
                  {user.fullName}
                </StyledTableCell>
              </StyledTableRow>
            ))}
        </TableBody>
      </Table>
    </Paper>
  );
}

export default Users;
