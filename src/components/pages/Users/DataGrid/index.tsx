import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import { createStyles, makeStyles, Theme, withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Edit from '@material-ui/icons/Edit';
import React from 'react';

import { IResponseUser } from '../../../../models/User';

const StyledTableCell = withStyles((theme: Theme) =>
  createStyles({
    head: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white
    },
    body: {
      fontSize: 14
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
    },
    action: {
      width: "50px",
      padding: "16px 14px"
    }
  })
);

interface IProps {
  users: IResponseUser[] | undefined;
  editUser: (userInfo: any) => void;
}

const DataGrid: React.FC<IProps> = (props) => {
  const classes = useStyles();

  function editUser(user: IResponseUser) {
    return () => props.editUser(user);
  }

  return (
    <Paper className={classes.root}>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <StyledTableCell className={classes.action}>&nbsp;</StyledTableCell>
            <StyledTableCell>Full Name</StyledTableCell>
            <StyledTableCell>First Name</StyledTableCell>
            <StyledTableCell>Last Name</StyledTableCell>
            <StyledTableCell>Initials</StyledTableCell>
            <StyledTableCell>Short Name</StyledTableCell>
            <StyledTableCell>Username</StyledTableCell>
            <StyledTableCell>Email</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.users &&
            props.users.map((user) => (
              <StyledTableRow key={user.fullName}>
                <StyledTableCell className={classes.action} align="center">
                  <IconButton aria-label="delete" onClick={editUser(user)}>
                    <Edit />
                  </IconButton>
                </StyledTableCell>
                <StyledTableCell component="th" scope="row">
                  {user.fullName}
                </StyledTableCell>
                <StyledTableCell component="th" scope="row">
                  {user.firstName}
                </StyledTableCell>
                <StyledTableCell component="th" scope="row">
                  {user.lastName}
                </StyledTableCell>
                <StyledTableCell component="th" scope="row">
                  {user.initials}
                </StyledTableCell>
                <StyledTableCell component="th" scope="row">
                  {user.shortName}
                </StyledTableCell>
                <StyledTableCell component="th" scope="row">
                  {user.username}
                </StyledTableCell>
                <StyledTableCell component="th" scope="row">
                  {user.email}
                </StyledTableCell>
              </StyledTableRow>
            ))}
        </TableBody>
      </Table>
    </Paper>
  );
};

export default React.memo(DataGrid);
