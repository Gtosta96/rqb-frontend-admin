import Button from '@material-ui/core/Button';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import SaveIcon from '@material-ui/icons/Save';
import { Field, Form, Formik } from 'formik';
import { get, isEmpty } from 'lodash';
import React from 'react';
import { useObservable } from 'react-use-observable';

import { getInitialValues } from '../../../../helpers/form';
import { required } from '../../../../helpers/formValidators';
import {
  IBrokerGroupBindersRequest,
  IBrokerGroupBindersResponse,
  IBrokerGroupsResponse,
} from '../../../../interfaces/models/broker-groups';
import risksService from '../../../../services/agent-firm/risks';
import bindersService from '../../../../services/binders/binders';
import brokerGroupBindersService from '../../../../services/broker-groups/broker-group-binders';
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
  info?: IBrokerGroupBindersResponse;
}

interface IFormValues extends IBrokerGroupBindersRequest {
  name: string; // only for front-end control
}

function BrokerGroupBindersForm(props: IProps) {
  const classes = useStyles();

  const isCreatingBgBinder = isEmpty(props.info);

  const [risksState] = useObservable(() => risksService.getRisks(), []);

  const [bindersState] = useObservable(() => {
    bindersService.getBinders(false);
    return bindersService.listenState();
  }, []);

  const formFields = React.useMemo(() => {
    return [
      {
        name: "brokerGroupId",
        label: "Firm",
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
        name: "riskId",
        label: "Risk",
        initValue: get(props.info, "riskId") || "",
        validate: required,
        component: Dropdown,
        options: risksState && risksState.risks,
        disabled: !isCreatingBgBinder
      },
      {
        name: "binderId",
        label: "Binder",
        initValue: get(props.info, "binderId") || "",
        validate: required,
        component: Dropdown,
        options: bindersState && bindersState.payload && bindersState.payload.options,
        disabled: !isCreatingBgBinder
      },
      {
        name: "isBinderActive",
        label: "Active",
        initValue: get(props.info, "isBinderActive") || "",
        component: Toggle
      }
    ];
  }, [risksState, bindersState, props.info, props.brokerGroup, isCreatingBgBinder]);

  const initialValues = React.useMemo(() => getInitialValues(formFields), [formFields]);

  function handleSubmit(values: IFormValues) {
    const { name, ...payload } = values;

    if (isCreatingBgBinder) {
      brokerGroupBindersService.createBrokerGroupBinders(payload);
    } else {
      brokerGroupBindersService.updateBrokerGroupBinders(payload);
    }
  }

  if (isEmpty(formFields) || isEmpty(initialValues)) {
    return null;
  }

  return (
    <div className={classes.root}>
      <Typography align="center" variant="h4">
        {isCreatingBgBinder ? "Add" : "Edit"} Broker Group Binder
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

BrokerGroupBindersForm.defaultProps = {
  info: {} as IBrokerGroupBindersResponse
};

export default React.memo(BrokerGroupBindersForm);
