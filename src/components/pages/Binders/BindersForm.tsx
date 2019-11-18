import Button from '@material-ui/core/Button';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import SaveIcon from '@material-ui/icons/Save';
import { Field, Form, Formik } from 'formik';
import { get, isEmpty } from 'lodash';
import React from 'react';
import { useObservable } from 'react-use-observable';
import { empty } from 'rxjs';
import { map } from 'rxjs/operators';

import { getInitialValues } from '../../../helpers/form';
import { compose, maxValue, minValue, required } from '../../../helpers/formValidators';
import { IFirmRequest, IFirmResponse } from '../../../interfaces/models/agent-firms';
import { IBinderRequest, IBinderResponse } from '../../../interfaces/models/binders';
import firmsService from '../../../services/agent-firm/firms';
import binderDetailsService from '../../../services/binders/binder-details';
import usersService from '../../../services/users/users';
import { DEFAULT_FIRM_ID } from '../../../settings/constants';
import ChipInput from '../../form/Fields/ChipInput';
import DatePicker from '../../form/Fields/DatePicker';
import Dropdown from '../../form/Fields/Dropdown';
import Input from '../../form/Fields/Input';
import MultipleDropdown from '../../form/Fields/MultipleDropdown';
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
      margin: theme.spacing(0.5, 1, 2, 1),
      width: 450
    },
    controlsContainer: {}
  })
);

interface IProps {
  info?: IBinderResponse;
}

interface IFormValues extends IBinderRequest {}

function AgentFirmForm(props: IProps) {
  const classes = useStyles();

  const isCreatingBinder = isEmpty(props.info);

  const [binderDetailsState] = useObservable(() => {
    if (props.info && props.info.binderId) {
      return binderDetailsService.getBinderDetails(props.info.binderId);
    }

    return empty();
  }, [props.info]);

  const defaultValues = React.useMemo(
    () => ({
      ...props.info,
      ...(binderDetailsState ? binderDetailsState.binderDetails : {})
    }),
    [props.info, binderDetailsState]
  );

  const [defaultFirmList] = useObservable(() => {
    firmsService.getFirms(false);

    return firmsService.listenState().pipe(
      map(firmsState => firmsState.payload && firmsState.payload.options),
      map(firms => (firms || []).filter(firm => firm.value === DEFAULT_FIRM_ID))
    );
  }, [DEFAULT_FIRM_ID]);

  const [usersList] = useObservable(() => {
    usersService.getUsers(false);

    return usersService.listenState().pipe(
      map(usersState => usersState.payload),
      map(users => (users || []).map(user => ({ value: user.appUserId, label: user.fullName })))
    );
  }, []);

  const currencyList = React.useMemo(
    () =>
      ["AUD", "CAD", "CHF", "EUR", "GBP", "JPY", "SGD", "USD"].map(item => ({
        value: item,
        label: item
      })),
    []
  );

  const periodList = React.useMemo(
    () => [
      {
        value: "effective_date",
        label: "Effective Date"
      },
      {
        value: "effective_month",
        label: "Effective Month"
      }
    ],
    []
  );

  const instalmentsList = React.useMemo(
    () => [{ value: 1, label: "Annual" }, { value: 12, label: "Monthly" }],
    []
  );

  const formFields = React.useMemo(() => {
    return [
      {
        name: "binderId",
        label: "Binder ID",
        component: Input,
        initValue: get(defaultValues, "binderId") || "",
        disabled: true
      },
      {
        name: "binderUiName",
        label: "Binder Name",
        component: Input,
        initValue: get(defaultValues, "binderUiName") || "",
        validate: required
      },
      {
        name: "umr",
        label: "UMR",
        component: Input,
        initValue: get(defaultValues, "umr") || "",
        validate: required
      },
      {
        name: "brokerRef",
        label: "Broker Reference",
        component: Input,
        initValue: get(defaultValues, "brokerRef") || "",
        validate: required
      },
      {
        name: "bindingAuthRef",
        label: "Binding Authority Reference",
        component: Input,
        initValue: get(defaultValues, "bindingAuthRef") || "",
        validate: required
      },
      {
        name: "agreementNum",
        label: "Agreement Number",
        component: Input,
        initValue: get(defaultValues, "agreementNum") || "",
        validate: required
      },
      {
        name: "certNumPrefix",
        label: "Certificate Prefix",
        component: Input,
        initValue: get(defaultValues, "certNumPrefix") || "",
        validate: required
      },
      {
        name: "chPin",
        label: "Coverholder PIN",
        component: Input,
        initValue: get(defaultValues, "chPin") || ""
      },
      {
        name: "brokerInitials",
        label: "Broker Initials",
        component: Input,
        initValue: get(defaultValues, "brokerInitials") || "",
        validate: required
      },
      {
        name: "brokerFirmId",
        label: "Broker Firm",
        component: Dropdown,
        initValue: get(defaultValues, "brokerFirmId") || DEFAULT_FIRM_ID,
        options: defaultFirmList,
        disabled: true
      },
      {
        name: "responsibleBrokerId",
        label: "Responsible Broker",
        component: Dropdown,
        initValue: get(defaultValues, "responsibleBrokerId") || DEFAULT_FIRM_ID,
        options: defaultFirmList,
        disabled: true
      },
      {
        name: "placingBrokerFirmId",
        label: "Placing Broker Firm",
        component: Dropdown,
        initValue: get(defaultValues, "placingBrokerFirmId") || DEFAULT_FIRM_ID,
        options: defaultFirmList,
        disabled: true
      },
      {
        name: "contractManagerId",
        label: "Contract Manager",
        component: Dropdown,
        initValue: get(defaultValues, "contractManagerId") || "",
        options: usersList
      },
      {
        name: "complianceOfficerId",
        label: "Compliance Officer",
        component: Dropdown,
        initValue: get(defaultValues, "complianceOfficerId") || "",
        options: usersList
      },
      {
        name: "inceptionDate",
        label: "Inception Date",
        component: DatePicker,
        initValue: get(defaultValues, "inceptionDate") || new Date(),
        validate: required
      },
      {
        name: "endDate",
        label: "End Date",
        component: DatePicker,
        initValue: get(defaultValues, "endDate") || new Date(),
        validate: required
      },
      {
        name: "yearOfAccount",
        label: "Year Of Account",
        component: Input,
        initValue: get(defaultValues, "yearOfAccount") || "",
        validate: required
      },
      {
        name: "surplusLinesApply",
        label: "Surplus Lines Apply",
        component: Toggle,
        initValue: get(defaultValues, "surplusLinesApply") || false,
        validate: required
      },
      {
        name: "isFatcaRequired",
        label: "Fatca Required",
        component: Toggle,
        initValue: get(defaultValues, "isFatcaRequired") || false,
        validate: required
      },
      {
        name: "subjectToEnglishLaw",
        label: "Subject toEnglish Law",
        component: Toggle,
        initValue: get(defaultValues, "subjectToEnglishLaw") || false,
        validate: required
      },
      {
        name: "isMultiCountry",
        label: "Multi Country",
        component: Toggle,
        initValue: get(defaultValues, "isMultiCountry") || false,
        validate: required
      },
      {
        name: "isMultiCurrency",
        label: "Multi Currency",
        component: Toggle,
        initValue: get(defaultValues, "isMultiCurrency") || false,
        validate: required
      },
      {
        name: "isGrossPremiumRounded",
        label: "Round Gross Premium",
        component: Toggle,
        initValue: get(defaultValues, "isGrossPremiumRounded") || false,
        validate: required
      },
      {
        name: "consumerProdExposure",
        label: "Consumer Product Exposure",
        component: Input,
        initValue: get(defaultValues, "consumerProdExposure") || ""
      },
      {
        name: "totalBaPremiumLimit",
        label: "Binding Authority Premium Income Limit",
        component: Input,
        initValue: get(defaultValues, "totalBaPremiumLimit") || ""
      },
      {
        name: "totalBaPremiumCurrency",
        label: "Binding Authority Premium Currency",
        component: Dropdown,
        initValue: get(defaultValues, "totalBaPremiumCurrency") || "",
        options: currencyList,
        validate: required
      },
      {
        name: "totalChIncomeLimit",
        label: "Coverholder Premium Income Limit",
        component: Input,
        initValue: get(defaultValues, "totalChIncomeLimit") || ""
      },
      {
        name: "totalChIncomeLimitCurrency",
        label: "Coverholder Premium Currency",
        component: Dropdown,
        initValue: get(defaultValues, "totalChIncomeLimitCurrency") || "",
        options: currencyList,
        validate: required
      },
      {
        name: "notifiableLimitPercent",
        label: "Notifiable Limit Percent",
        component: Input,
        initValue: get(defaultValues, "notifiableLimitPercent") || "",
        validate: compose(
          required,
          minValue(0),
          maxValue(100)
        )
      },
      {
        name: "insurancePeriodMonths",
        label: "Normal Insurance Period Months",
        component: Input,
        initValue: get(defaultValues, "insurancePeriodMonths") || "",
        validate: required
      },
      {
        name: "maxInsurancePeriodMonths",
        label: "Max Insurance Period Months",
        component: Input,
        initValue: get(defaultValues, "maxInsurancePeriodMonths") || "",
        validate: required
      },
      {
        name: "maxAdvancedInceptionDays",
        label: "Max Advanced Inception Days",
        component: Input,
        initValue: get(defaultValues, "maxAdvancedInceptionDays") || "",
        validate: required
      },
      {
        name: "terminationNoticeDays",
        label: "Termination Notice Days",
        component: Input,
        initValue: get(defaultValues, "terminationNoticeDays") || "",
        validate: required
      },
      {
        name: "maxChCommissionPercent",
        label: "Max Coverholder Commission Percent",
        component: Input,
        initValue: get(defaultValues, "maxChCommissionPercent") || "",
        validate: compose(
          required,
          minValue(0),
          maxValue(100)
        )
      },
      {
        name: "minEarnedInsuredRate",
        label: "Minimum Earned Rate - Insured",
        component: Input,
        initValue: get(defaultValues, "minEarnedInsuredRate") || "",
        validate: required
      },
      {
        name: "minEarnedUnderwriterRate",
        label: "Minimum Earned Rate - Underwiter",
        component: Input,
        initValue: get(defaultValues, "minEarnedUnderwriterRate") || "",
        validate: required
      },
      {
        name: "percentageForLloyds",
        label: "Percentage For Lloyds",
        component: Input,
        initValue: get(defaultValues, "percentageForLloyds") || "",
        validate: required
      },
      {
        name: "currencyType",
        label: "Currency",
        component: Dropdown,
        initValue: get(defaultValues, "currencyType") || "",
        options: currencyList,
        validate: required
      },
      {
        name: "settlementCurrency",
        label: "Settlement Currency",
        component: Dropdown,
        initValue: get(defaultValues, "settlementCurrency") || "",
        options: currencyList,
        validate: required
      },
      {
        name: "premiumCurrency",
        label: "Premium Currency",
        component: Dropdown,
        initValue: get(defaultValues, "premiumCurrency") || "",
        options: currencyList,
        validate: required
      },
      {
        name: "remittancePeriodModel",
        label: "Remittance Period Model",
        component: Dropdown,
        initValue: get(defaultValues, "remittancePeriodModel") || "",
        options: periodList,
        validate: required
      },
      {
        name: "clientRemittancePeriod",
        label: "Client Remittance Period",
        component: Input,
        initValue: get(defaultValues, "clientRemittancePeriod") || "",
        validate: required
      },
      {
        name: "maxBdxSubmissionPeriodDays",
        label: "Max Bordereau Submission Period Days",
        component: Input,
        initValue: get(defaultValues, "maxBdxSubmissionPeriodDays") || "",
        validate: required
      },
      {
        name: "maxBdxRemittancePeriodDays",
        label: "Max Remittance Period Days",
        component: Input,
        initValue: get(defaultValues, "maxBdxRemittancePeriodDays") || "",
        validate: required
      },
      {
        name: "targetCountries",
        label: "Target Countries",
        component: ChipInput,
        initValue: get(defaultValues, "targetCountries") || [],
        validate: required
      },
      {
        name: "targetCurrencies",
        label: "Target Currencies",
        component: MultipleDropdown,
        initValue: get(defaultValues, "targetCurrencies") || [],
        options: currencyList,
        validate: required
      },
      {
        name: "department",
        label: "Department",
        component: Input,
        initValue: get(defaultValues, "department") || "",
        validate: required
      },
      {
        name: "businessType",
        label: "Business Type",
        component: Input,
        initValue: get(defaultValues, "businessType") || "",
        validate: required
      },
      {
        name: "fcaCode",
        label: "FCA Code",
        component: Input,
        initValue: get(defaultValues, "fcaCode") || "",
        validate: required
      },
      {
        name: "brokerRole",
        label: "Broker Role",
        component: Input,
        initValue: get(defaultValues, "brokerRole") || "",
        validate: required
      },
      {
        name: "technicalContact",
        label: "Technical Contact",
        component: Input,
        initValue: "RQB",
        disabled: true
      },
      {
        name: "riskSharingCommissionRate",
        label: "Risk Sharing Commission Rate",
        component: Input,
        initValue: get(defaultValues, "riskSharingCommissionRate") || "",
        validate: required
      },
      {
        name: "instalments",
        label: "Yearly Premium Instalments",
        component: Dropdown,
        initValue: get(defaultValues, "instalments") || "",
        options: instalmentsList,
        validate: required
      },
      {
        name: "warranties",
        label: "Warranties",
        component: Input,
        initValue: get(defaultValues, "warranties") || ""
      }
    ];
  }, [defaultValues, defaultFirmList, currencyList, periodList, instalmentsList, usersList]);

  const initialValues = React.useMemo(() => getInitialValues(formFields), [formFields]);

  function handleSubmit(values: IFormValues) {
    const payload = values as IFirmRequest;

    if (isCreatingBinder) {
      firmsService.createFirm(payload);
    } else {
      firmsService.updateFirm(payload);
    }
  }

  return (
    <div className={classes.root}>
      <Typography align="center" variant="h4">
        {isCreatingBinder ? "Add" : "Edit"} Binder
      </Typography>

      <Formik
        initialValues={initialValues as any}
        onSubmit={handleSubmit}
        enableReinitialize={true}
      >
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
