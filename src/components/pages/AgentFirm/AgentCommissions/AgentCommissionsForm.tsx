import Button from '@material-ui/core/Button';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import SaveIcon from '@material-ui/icons/Save';
import { Field, Form, Formik } from 'formik';
import { get, isEmpty } from 'lodash';
import React from 'react';
import { useObservable } from 'react-use-observable';

import { getInitialValues } from '../../../../helpers/form';
import { compose, maxValue, minValue, required } from '../../../../helpers/formValidators';
import { IAgentCommissionsRequest, IAgentCommissionsResponse } from '../../../../interfaces/models/agent-commissions';
import { IFirmResponse } from '../../../../interfaces/models/agent-firms';
import { IBrokerGroupRoutingResponse } from '../../../../interfaces/models/broker-group-routing';
import agentCommissionsService from '../../../../services/agent-firm/commissions';
import risksService from '../../../../services/agent-firm/risks';
import bindersService from '../../../../services/binders/binders';
import Dropdown from '../../../form/Fields/Dropdown';
import Input from '../../../form/Fields/Input';

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
  firm: IFirmResponse;
  info?: IAgentCommissionsResponse;
}

interface IFormValues extends IAgentCommissionsRequest {
  firmName: string; // only for front-end control
}

function AgentCommissionsForm(props: IProps) {
  const classes = useStyles();

  const isCreatingAgentCommission = isEmpty(props.info);

  const [risksState] = useObservable(() => risksService.getRisks(), []);
  const [bindersState] = useObservable(() => {
    bindersService.getBinders(false);
    return bindersService.listenState();
  }, []);

  const formFields = React.useMemo(() => {
    return [
      {
        name: "firmName",
        label: "Firm",
        initValue: get(props.firm, "firmName") || "",
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
        disabled: !isCreatingAgentCommission
      },
      {
        name: "binderId",
        label: "Binder",
        initValue: get(props.info, "binderId") || "",
        validate: required,
        component: Dropdown,
        options: bindersState && bindersState.payload && bindersState.payload.options,
        disabled: !isCreatingAgentCommission
      },
      {
        name: "commissionRate",
        label: "Commission Rate",
        initValue: get(props.info, "commissionRate") || "",
        validate: compose(
          required,
          minValue(0),
          maxValue(100)
        ),
        component: Input,
        prefix: "%"
      }
    ];
  }, [risksState, bindersState, props.info, props.firm, isCreatingAgentCommission]);

  const initialValues = React.useMemo(() => getInitialValues(formFields), [formFields]);

  function handleSubmit(values: IFormValues) {
    const payload = {
      ...values,
      firmName: undefined,
      firmId: props.firm.firmId,
      commissionRate: Number(values.commissionRate)
    } as IAgentCommissionsRequest;

    if (isCreatingAgentCommission) {
      agentCommissionsService.createAgentCommission(payload);
    } else {
      agentCommissionsService.updateAgentCommission(payload);
    }
  }

  if (isEmpty(formFields) || isEmpty(initialValues)) {
    return null;
  }

  return (
    <div className={classes.root}>
      <Typography align="center" variant="h4">
        {isCreatingAgentCommission ? "Add" : "Edit"} Agent Commission
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

AgentCommissionsForm.defaultProps = {
  info: {} as IBrokerGroupRoutingResponse
};

export default React.memo(AgentCommissionsForm);
