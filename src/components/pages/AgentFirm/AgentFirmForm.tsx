import Button from '@material-ui/core/Button';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import SaveIcon from '@material-ui/icons/Save';
import { Field, Form, Formik } from 'formik';
import { get, isEmpty } from 'lodash';
import React from 'react';
import { useObservable } from 'react-use-observable';

import { getInitialValues } from '../../../helpers/form';
import { compose, maxLength, minLength, required } from '../../../helpers/formValidators';
import { IFirmRequest, IFirmResponse } from '../../../interfaces/models/agent-firms';
import countriesService from '../../../services/agent-firm/countries';
import firmsService from '../../../services/agent-firm/firms';
import Dropdown from '../../form/Fields/Dropdown';
import Input from '../../form/Fields/Input';
import Toggle from '../../form/Fields/Toggle';

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
  info?: IFirmResponse;
}

interface IFormValues extends IFirmRequest {}

function AgentFirmForm(props: IProps) {
  const classes = useStyles();

  const isCreatingFirm = isEmpty(props.info);

  const [countriesState] = useObservable(() => countriesService.getCountries(), []);

  const formFields = React.useMemo(
    () => [
      {
        name: "isActive",
        controlLabel: "Firm Active",
        label: "Active",
        initValue: get(props.info, "isActive") || false,
        validate: undefined,
        component: Toggle
      },
      {
        name: "isAgentFirm",
        controlLabel: "Agent Firm",
        label: "Active",
        initValue: get(props.info, "isAgentFirm") || false,
        validate: undefined,
        component: Toggle
      },
      {
        name: "firmId",
        label: "Firm ID",
        initValue: get(props.info, "firmId") || "",
        component: Input,
        disabled: true
      },
      {
        name: "firmName",
        label: "Firm Name",
        initValue: get(props.info, "firmName") || "",
        validate: required,
        component: Input
      },
      {
        name: "firmLegalName",
        label: "Legal Name",
        initValue: get(props.info, "firmLegalName") || "",
        validate: required,
        component: Input
      },
      {
        name: "globalClientId",
        label: "Global ID",
        initValue: get(props.info, "globalClientId") || "",
        validate: compose(
          required,
          minLength(5),
          maxLength(5)
        ),
        component: Input
      },
      {
        name: "address.line1",
        label: "AddressLine 1",
        initValue: get(props.info, "address.line1") || "",
        validate: required,
        component: Input
      },
      {
        name: "address.line2",
        label: "AddressLine 2",
        initValue: get(props.info, "address.line2") || "",
        component: Input
      },
      {
        name: "address.line3",
        label: "AddressLine 3",
        initValue: get(props.info, "address.line3") || "",
        component: Input
      },
      {
        name: "address.townCity",
        label: "Town / City Name",
        initValue: get(props.info, "address.townCity") || "",
        validate: required,
        component: Input
      },
      {
        name: "address.stateProvinceCounty",
        label: "State / Province / County Name",
        initValue: get(props.info, "address.stateProvinceCounty") || "",
        validate: required,
        component: Input
      },
      {
        name: "address.postZipCode",
        label: "Post Zip Code",
        initValue: get(props.info, "address.postZipCode") || "",
        validate: required,
        component: Input
      },
      {
        name: "address.country",
        label: "Country",
        initValue: get(props.info, "address.country") || "",
        validate: required,
        component: Dropdown,
        options: countriesState && countriesState.countries
      },
      {
        name: "address.telephone",
        label: "Telephone",
        initValue: get(props.info, "address.telephone") || "",
        component: Input
      },
      {
        name: "address.fax",
        label: "Fax",
        initValue: get(props.info, "address.fax") || "",
        component: Input
      },
      {
        name: "onboarded",
        label: "Onboarded",
        initValue: get(props.info, "onboarded") || "",
        component: Input,
        disabled: true
      }
    ],
    [props.info, countriesState]
  );

  const initialValues = React.useMemo(() => getInitialValues(formFields), [formFields]);

  function handleSubmit(values: IFormValues) {
    const payload = values as IFirmRequest;

    if (isCreatingFirm) {
      firmsService.createFirm(payload);
    } else {
      firmsService.updateFirm(payload);
    }
  }

  return (
    <div className={classes.root}>
      <Typography align="center" variant="h4">
        {isCreatingFirm ? "Add" : "Edit"} Firm
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

AgentFirmForm.defaultProps = {
  info: {} as IFirmResponse
};

export default React.memo(AgentFirmForm);
