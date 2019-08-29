import Button from '@material-ui/core/Button';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import SaveIcon from '@material-ui/icons/Save';
import { Field, Form, Formik } from 'formik';
import React from 'react';
import { useObservable } from 'react-use-observable';

import { compose, email, required } from '../../../../helpers/formValidators';
import { get, isEmpty } from '../../../../helpers/functions';
import { IUserRequest, IUserResponse } from '../../../../interfaces/models/user';
import firmsService from '../../../../services/users/firms';
import rolesService from '../../../../services/users/roles';
import usersService from '../../../../services/users/users';
import DatePicker from './Fields/DatePicker';
import Dropdown from './Fields/Dropdown';
import Input from './Fields/Input';
import Toggle from './Fields/Toggle';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing(1),
      display: "flex",
      flexDirection: "column",
      height: "100%"
    },
    form: {
      display: "flex",
      flexDirection: "column",
      flexGrow: 1
    },
    inputsContainer: {
      display: "flex",
      flexDirection: "column",
      height: "100%",
      padding: theme.spacing(1, 0)
    },
    textField: {
      margin: theme.spacing(0.5, 1, 0.5, 1),
      width: 450
    },
    controlsContainer: {}
  })
);

interface IProps {
  userInfo?: IUserResponse;
}

interface IFormValues extends IUserResponse {
  appUserId: number;
  roleName: string;
  firmName: string;
}

const UsersForm: React.FC<IProps> = (props) => {
  const classes = useStyles();

  const isCreatingUser = isEmpty(props.userInfo);

  const [firmsState] = useObservable(() => firmsService.getFirms(), []);
  const [rolesState] = useObservable(() => rolesService.getRoles(), []);

  const formFields = React.useMemo(
    () => [
      {
        name: "userStatus",
        controlLabel: "User Status",
        label: "Active",
        initialValue: get("userStatus", props.userInfo, false),
        validate: undefined,
        component: Toggle
      },
      {
        name: "fullName",
        label: "Full Name",
        initialValue: get("fullName", props.userInfo, ""),
        validate: required,
        component: Input
      },
      {
        name: "firstName",
        label: "First Name",
        initialValue: get("firstName", props.userInfo, ""),
        validate: required,
        component: Input
      },
      {
        name: "lastName",
        label: "Last Name",
        initialValue: get("lastName", props.userInfo, ""),
        validate: required,
        component: Input
      },
      {
        name: "initials",
        label: "Initials",
        initialValue: get("initials", props.userInfo, ""),
        validate: required,
        component: Input
      },
      {
        name: "shortName",
        label: "Short Name",
        initialValue: get("shortName", props.userInfo, ""),
        validate: required,
        component: Input
      },
      {
        name: "username",
        label: "Username",
        initialValue: get("username", props.userInfo, ""),
        validate: required,
        component: Input
      },
      {
        name: "email",
        label: "Email",
        initialValue: get("email", props.userInfo, ""),
        validate: compose(
          required,
          email
        ),
        component: Input
      },
      {
        name: "firmId",
        label: "Firm",
        initialValue: get("firm.firmId", props.userInfo, ""),
        validate: required,
        component: Dropdown,
        options: firmsState && firmsState.firms
      },
      {
        name: "telephoneNumber",
        label: "Telephone",
        initialValue: get("telephoneNumber", props.userInfo, ""),
        validate: required,
        component: Input
      },
      {
        name: "mobileTelephone",
        label: "Mobile / Cell",
        initialValue: get("mobileTelephone", props.userInfo, ""),
        validate: undefined,
        component: Input
      },
      {
        name: "jobTitle",
        label: "Job Title",
        initialValue: get("jobTitle", props.userInfo, ""),
        validate: undefined,
        component: Input
      },
      {
        name: "roleId",
        label: "RQB Role",
        initialValue: get("role.roleId", props.userInfo, ""),
        validate: required,
        component: Dropdown,
        options: rolesState && rolesState.roles
      },
      {
        name: "onboarded",
        label: "Onboarded",
        initialValue: get("onboarded", props.userInfo, new Date()),
        validate: required,
        component: DatePicker,
        disabled: !isCreatingUser
      },
      {
        name: "appUserId",
        label: "User ID",
        initialValue: get("appUserId", props.userInfo, undefined),
        component: Input,
        type: isCreatingUser ? "hidden" : "text",
        disabled: !isCreatingUser
      }
    ],
    [props.userInfo, firmsState, rolesState, isCreatingUser]
  );

  const initialValues = React.useMemo(
    () =>
      formFields.reduce(
        (prev, cur) => {
          prev[cur.name] = cur.initialValue;
          return prev;
        },
        {} as { [key: string]: string }
      ),
    [formFields]
  );

  function handleSubmit(values: IFormValues) {
    const payload = (values as unknown) as IUserRequest;

    if (isCreatingUser) {
      usersService.createUser(payload);
    } else {
      usersService.updateUser(payload);
    }
  }

  return (
    <div className={classes.root}>
      <Typography align="center" variant="h4">
        {isCreatingUser ? "Add" : "Edit"} User
      </Typography>

      <Formik initialValues={initialValues as any} onSubmit={handleSubmit}>
        <Form className={classes.form}>
          <div className={classes.inputsContainer}>
            {formFields.map((formField) => (
              <Field key={formField.name} className={classes.textField} {...formField} />
            ))}
          </div>

          <div className={classes.controlsContainer}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="medium"
              fullWidth={true}
            >
              <SaveIcon />
              Save
            </Button>
          </div>
        </Form>
      </Formik>
    </div>
  );
};

UsersForm.defaultProps = {
  userInfo: {} as IUserResponse
};

export default React.memo(UsersForm);
