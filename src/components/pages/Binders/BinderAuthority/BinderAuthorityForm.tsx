import Button from '@material-ui/core/Button';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import SaveIcon from '@material-ui/icons/Save';
import { Field, Form, Formik } from 'formik';
import { get, isEmpty } from 'lodash';
import React from 'react';
import { useObservable } from 'react-use-observable';
import { map } from 'rxjs/operators';

import { getInitialValues } from '../../../../helpers/form';
import { required } from '../../../../helpers/formValidators';
import { IBinderAuthorityRequest, IBinderAuthorityResponse } from '../../../../interfaces/models/binder-authority';
import binderAuthorityService from '../../../../services/binders/binder-authority';
import usersService from '../../../../services/users/users';
import Dropdown from '../../../form/Fields/Dropdown';
import Toggle from '../../../form/Fields/Toggle';

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
  binderId: number;
  info?: IBinderAuthorityResponse;
}

interface IFormValues extends IBinderAuthorityRequest {}

function BinderAuthorityForm(props: IProps) {
  const classes = useStyles();

  const isCreatingBinderAuthority = isEmpty(props.info);

  const [usersList] = useObservable(() => {
    usersService.getUsers(false);
    return usersService.listenState().pipe(
      map(usersState => usersState.payload),
      map(users =>
        (users || []).map(user => ({
          value: user.appUserId,
          label: user.fullName
        }))
      )
    );
  }, []);

  const formFields = React.useMemo(() => {
    return [
      {
        name: "appUserId",
        label: "User",
        initValue: get(props.info, "appUserId") || "",
        validate: required,
        disabled: !isCreatingBinderAuthority,
        component: Dropdown,
        options: usersList
      },
      {
        name: "authorisedToBind",
        label: "Authorised to Bind",
        initValue: get(props.info, "authorisedToBind") || false,

        component: Toggle,
        options: []
      },
      {
        name: "authorisedToIssue",
        label: "Authorised to Issue",
        initValue: get(props.info, "authorisedToIssue") || false,

        component: Toggle,
        options: []
      }
    ];
  }, [usersList, isCreatingBinderAuthority, props.info]);

  const initialValues = React.useMemo(() => getInitialValues(formFields), [formFields]);

  function handleSubmit(values: IFormValues) {
    const payload = {
      ...values,
      binderId: props.binderId
    } as IBinderAuthorityRequest;

    if (isCreatingBinderAuthority) {
      binderAuthorityService.createBinderAuthority(props.binderId, payload);
    } else {
      binderAuthorityService.updateBinderAuthority(props.binderId, payload);
    }
  }

  return (
    <div className={classes.root}>
      <Typography align="center" variant="h4">
        {isCreatingBinderAuthority ? "Add" : "Edit"} Binder Authority
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

BinderAuthorityForm.defaultProps = {
  info: {} as IBinderAuthorityResponse
};

export default React.memo(BinderAuthorityForm);
