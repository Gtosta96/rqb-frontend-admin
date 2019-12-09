import Button from '@material-ui/core/Button';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import SaveIcon from '@material-ui/icons/Save';
import { Field, Form, Formik } from 'formik';
import { get, isEmpty } from 'lodash';
import React from 'react';
import { useObservable } from 'react-use-observable';

import { getInitialValues } from '../../../helpers/form';
import { compose, email, required } from '../../../helpers/formValidators';
import { IUserRequest, IUserResponse } from '../../../interfaces/models/user';
import firmsService from '../../../services/agent-firm/firms';
import rolesService from '../../../services/users/roles';
import usersService from '../../../services/users/users';
import DatePicker from '../../form/Fields/DatePicker';
import Dropdown from '../../form/Fields/Dropdown';
import Input from '../../form/Fields/Input';
import Toggle from '../../form/Fields/Toggle';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing(1),
      display: "flex",
      flexDirection: "column",
      flexGrow: 1
    },
    form: {
      display: "flex",
      flexDirection: "column",
      flexGrow: 1
    },
    inputsContainer: {
      display: "flex",
      flexDirection: "column",
      padding: theme.spacing(1, 0),
      flexGrow: 1
    },
    textField: {
      margin: theme.spacing(0.5, 1, 0.5, 1),
      width: 450
    },
    controlsContainer: {}
  })
);

interface IProps {
  info?: IUserResponse;
}

interface IFormValues extends IUserRequest {}

function UsersForm(props: IProps) {
  const classes = useStyles();

  const isCreatingUser = isEmpty(props.info);

  const [firmsState] = useObservable(() => {
    firmsService.getFirms(false);
    return firmsService.listenState();
  }, []);
  const [rolesState] = useObservable(() => rolesService.getRoles(), []);

  const formFields = React.useMemo(
    () => [
      {
        name: "userStatus",
        controlLabel: "User Status",
        label: "Active",
        initValue: get(props.info, "userStatus") || false,
        validate: undefined,
        component: Toggle
      },
      {
        name: "appUserId",
        label: "User ID",
        initValue: get(props.info, "appUserId") || undefined,
        component: Input,
        disabled: true
      },
      {
        name: "fullName",
        label: "Full Name",
        initValue: get(props.info, "fullName") || "",
        validate: required,
        component: Input
      },
      {
        name: "firstName",
        label: "First Name",
        initValue: get(props.info, "firstName") || "",
        validate: required,
        component: Input
      },
      {
        name: "lastName",
        label: "Last Name",
        initValue: get(props.info, "lastName") || "",
        validate: required,
        component: Input
      },
      {
        name: "initials",
        label: "Initials",
        initValue: get(props.info, "initials") || "",
        validate: required,
        component: Input
      },
      {
        name: "shortName",
        label: "Short Name",
        initValue: get(props.info, "shortName") || "",
        validate: required,
        component: Input
      },
      {
        name: "username",
        label: "Username",
        initValue: get(props.info, "username") || "",
        validate: required,
        component: Input
      },
      {
        name: "email",
        label: "Email",
        initValue: get(props.info, "email") || "",
        validate: compose(
          required,
          email
        ),
        component: Input
      },
      {
        name: "firmId",
        label: "Firm",
        initValue: get(props.info, "firm.firmId") || "",
        validate: required,
        component: Dropdown,
        options: firmsState && firmsState.payload && firmsState.payload.options
      },
      {
        name: "telephoneNumber",
        label: "Telephone",
        initValue: get(props.info, "telephoneNumber") || "",
        component: Input
      },
      {
        name: "mobileTelephone",
        label: "Mobile / Cell",
        initValue: get(props.info, "mobileTelephone") || "",
        validate: undefined,
        component: Input
      },
      {
        name: "jobTitle",
        label: "Job Title",
        initValue: get(props.info, "jobTitle") || "",
        validate: undefined,
        component: Input
      },
      {
        name: "roleId",
        label: "RQB Role",
        initValue: get(props.info, "role.roleId") || "",
        validate: required,
        component: Dropdown,
        options: rolesState && rolesState.roles
      },
      {
        name: "onboarded",
        label: "Onboarded",
        initValue: get(props.info, "onboarded") || new Date(),
        validate: required,
        component: DatePicker,
        disabled: true
      }
    ],
    [props.info, firmsState, rolesState]
  );

  const initialValues = React.useMemo(() => getInitialValues(formFields), [formFields]);

  function handleSubmit(values: IFormValues) {
    const payload = values as IUserRequest;

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
            {formFields.map(formField => (
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
}

UsersForm.defaultProps = {
  info: {} as IUserResponse
};

export default React.memo(UsersForm);
