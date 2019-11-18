import Button from '@material-ui/core/Button';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import SaveIcon from '@material-ui/icons/Save';
import { Field, Form, Formik } from 'formik';
import { get, isEmpty } from 'lodash';
import React from 'react';
import { useObservable } from 'react-use-observable';
import { map } from 'rxjs/operators';

import { getInitialValues } from '../../../helpers/form';
import { required } from '../../../helpers/formValidators';
import { IBrokerGroupsRequest, IBrokerGroupsResponse } from '../../../interfaces/models/broker-groups';
import brokerGroupsService from '../../../services/broker-groups/broker-groups';
import usersService from '../../../services/users/users';
import { DEFAULT_FIRM_ID } from '../../../settings/constants';
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
  info: IBrokerGroupsResponse;
}

interface IFormValues extends IBrokerGroupsResponse {}

function BrokerGroupsForm(props: IProps) {
  console.log(props);
  const classes = useStyles();

  const isCreatingBrokerGroup = isEmpty(props.info);

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

  const formFields = React.useMemo(
    () => [
      {
        name: "brokerGroupName",
        label: "Name",
        initValue: get(props.info, "name") || "",
        validate: required,
        component: Input
      },
      {
        name: "brokerGroupOwner",
        label: "Owner",
        initValue: get(props.info, "ownerId") || false,
        validate: required,
        component: Dropdown,
        options: bessoUsers || []
      },
      {
        name: "isAutoPricing",
        label: { active: "True", inactive: "False" },
        controlLabel: "Auto Pricing",
        initValue: get(props.info, "isAutoPricing") || false,
        component: Toggle
      },
      {
        name: "isAutoQuoting",
        label: { active: "True", inactive: "False" },
        controlLabel: "Auto Quoting",
        initValue: get(props.info, "isAutoQuoting") || false,
        component: Toggle
      },
      {
        name: "isManualPricing",
        label: { active: "True", inactive: "False" },
        controlLabel: "Manual Pricing",
        initValue: get(props.info, "isManualPricing") || false,
        component: Toggle
      }
    ],
    [props.info, bessoUsers]
  );

  const initialValues = React.useMemo(() => getInitialValues(formFields), [formFields]);

  function handleSubmit(values: IFormValues) {
    const payload = ({
      ...values,
      brokerGroupId: props.info.brokerGroupId || null
    } as any) as IBrokerGroupsRequest;

    if (isCreatingBrokerGroup) {
      brokerGroupsService.createBrokerGroup(payload);
    } else {
      brokerGroupsService.updateBrokerGroup(payload);
    }
  }

  return (
    <div className={classes.root}>
      <Typography align="center" variant="h4">
        {isCreatingBrokerGroup ? "Add" : "Edit"} Firm
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

BrokerGroupsForm.defaultProps = {
  info: {} as IBrokerGroupsResponse
};

export default React.memo(BrokerGroupsForm);
