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
import {
  IBrokerGroupsResponse,
  IBrokerGroupUsersRequest,
  IBrokerGroupUsersResponse,
} from '../../../../interfaces/models/broker-groups';
import brokerGroupUsersService from '../../../../services/broker-groups/broker-group-users';
import usersService from '../../../../services/users/users';
import { DEFAULT_FIRM_ID } from '../../../../settings/constants';
import Dropdown from '../../../form/Fields/Dropdown';
import Input from '../../../form/Fields/Input';
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
  brokerGroup: IBrokerGroupsResponse;
  info?: IBrokerGroupUsersResponse;
}

interface IFormValues extends IBrokerGroupUsersRequest {
  name: string; // only for front-end control
}

function BrokerGroupUsersForm(props: IProps) {
  const classes = useStyles();

  const isCreatingBgUser = isEmpty(props.info);

  const [bessoUsers] = useObservable(() => {
    usersService.getUsers();

    return usersService.listenState().pipe(
      map(usersState => usersState.payload),
      map(users =>
        (users || [])
          .filter(user => user.firm.firmId === DEFAULT_FIRM_ID)
          .map(user => ({
            value: user.appUserId,
            label: user.fullName
          }))
      )
    );
  }, []);

  const formFields = React.useMemo(() => {
    return [
      {
        name: "brokerGroupId",
        label: "Broker Group ID",
        initValue: props.brokerGroup.brokerGroupId || "",
        validate: required,
        component: Input,
        disabled: true
      },
      {
        name: "name",
        label: "Name",
        initValue: props.brokerGroup.name || "",
        validate: required,
        component: Input,
        disabled: true
      },
      {
        name: "userId",
        label: "User",
        initValue: get(props.info, "appUserId") || "",
        validate: required,
        component: Dropdown,
        options: bessoUsers || [],
        disabled: !isCreatingBgUser
      },
      {
        name: "canActionSubmissions",
        label: "Can Action Submissions",
        initValue: get(props.info, "canActionSubmissions") || false,
        component: Toggle
      }
    ];
  }, [props.info, props.brokerGroup, isCreatingBgUser, bessoUsers]);

  const initialValues = React.useMemo(() => getInitialValues(formFields), [formFields]);

  function handleSubmit(values: IFormValues) {
    const { name, ...payload } = values;

    if (isCreatingBgUser) {
      brokerGroupUsersService.createBrokerGroupUser(payload);
    } else {
      brokerGroupUsersService.updateBrokerGroupUser(payload);
    }
  }

  if (isEmpty(formFields) || isEmpty(initialValues)) {
    return null;
  }

  return (
    <div className={classes.root}>
      <Typography align="center" variant="h4">
        {isCreatingBgUser ? "Add" : "Edit"} Broker Group User
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

BrokerGroupUsersForm.defaultProps = {
  info: {} as IBrokerGroupUsersResponse
};

export default React.memo(BrokerGroupUsersForm);
