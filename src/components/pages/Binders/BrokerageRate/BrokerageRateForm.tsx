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
import { IBrokerageRateRequest, IBrokerageRateResponse } from '../../../../interfaces/models/brokerage-rate';
import brokerageRatesService from '../../../../services/binders/brokerage-rates';
import risksService from '../../../../services/references/risks';
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
  info?: IBrokerageRateResponse;
}

interface IFormValues extends IBrokerageRateRequest {}

function BrokerageRateForm(props: IProps) {
  const classes = useStyles();

  const isCreatingRoute = isEmpty(props.info);

  const [risksState] = useObservable(() => risksService.getRisks(false), []);

  const formFields = React.useMemo(() => {
    return [
      {
        name: "riskId",
        label: "Risk",
        initValue: get(props.info, "riskId") || "",
        validate: required,
        component: Dropdown,
        options: risksState && risksState.risks
      },
      {
        name: "rate",
        label: "Authorised to Issue",
        initValue: get(props.info, "rate") || "",
        component: Toggle
      }
    ];
  }, [props.info, risksState]);

  const initialValues = React.useMemo(() => getInitialValues(formFields), [formFields]);

  function handleSubmit(payload: IFormValues) {
    if (isCreatingRoute) {
      brokerageRatesService.createBrokerageRate(props.binderId, payload);
    } else {
      brokerageRatesService.updateBrokerageRate(props.binderId, payload);
    }
  }

  return (
    <div className={classes.root}>
      <Typography align="center" variant="h4">
        {isCreatingRoute ? "Add" : "Edit"} Brokerage Rate
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

BrokerageRateForm.defaultProps = {
  info: {} as IBrokerageRateResponse
};

export default React.memo(BrokerageRateForm);
