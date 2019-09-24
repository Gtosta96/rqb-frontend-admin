import Button from '@material-ui/core/Button';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import SaveIcon from '@material-ui/icons/Save';
import { Field, Form, Formik, FormikProps } from 'formik';
import { get, isEmpty } from 'lodash';
import React from 'react';
import { useObservable } from 'react-use-observable';

import { getInitialValues } from '../../../helpers/form';
import { required } from '../../../helpers/formValidators';
import { IBrokerGroupRoutesRequest, IBrokerGroupRoutingResponse } from '../../../interfaces/models/broker-group-routing';
import brokerGroupRoutingService from '../../../services/broker-group-routing/broker-group-routing';
import targetBrokerGroupsService from '../../../services/broker-group-routing/target-broker-groups';
import Dropdown from '../../form/Fields/Dropdown';
import RadioButtonsGroup from '../../form/Fields/RadioButtonsGroup';

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
  appUserId: number;
  info?: IBrokerGroupRoutingResponse;
}

interface IFormValues extends IBrokerGroupRoutesRequest {
  riskClass: string; // only for front-end control
}

function BrokerGroupRoutingForm(props: IProps) {
  const classes = useStyles();

  const [formValues, setFormValues] = React.useState<IFormValues>();
  const isCreatingRoute = isEmpty(props.info);

  const [targetBrokerGroups] = useObservable(
    () => targetBrokerGroupsService.getTargetBrokerGroups(),
    []
  );

  const formFields = React.useMemo(() => {
    if (!targetBrokerGroups || isEmpty(targetBrokerGroups.riskClasses)) {
      return [];
    }

    return [
      {
        name: "riskClass",
        label: "Risk Class",
        initValue:
          get(props.info, "riskClassName") || targetBrokerGroups.riskClasses[0].riskClassName,
        validate: required,
        component: Dropdown,
        disabled: !isCreatingRoute,
        onChange: (e: any, form: FormikProps<any>) => {
          form.setFieldValue("riskIdList", "");
          form.setFieldValue("targetBgId", "");
        },
        options: targetBrokerGroups.riskClasses.map(riskClass => ({
          value: riskClass.riskClassName,
          label: riskClass.riskClassName
        }))
      },
      {
        name: "riskIdList",
        label: "Target Risks",
        initValue: get(props.info, "riskIdList") || "",
        validate: required,
        component: RadioButtonsGroup,
        disabled: !isCreatingRoute,
        onChange: (e: any, form: FormikProps<any>) => {
          form.setFieldValue("targetBgId", "");
        },
        options: (() => {
          const riskClassName = formValues && formValues.riskClass;
          const riskClass = targetBrokerGroups.riskClasses.find(
            riskClass => riskClass.riskClassName === riskClassName
          );

          return riskClass
            ? riskClass.routes.map(route => ({
                value: route.riskIdList,
                label: route.riskName
              }))
            : [];
        })()
      },
      {
        name: "targetBgId",
        label: "Target Broker Group",
        initValue: get(props.info, "bgId") || "",
        validate: required,
        component: Dropdown,
        options: (() => {
          const riskClassName = formValues && formValues.riskClass;
          const riskClass = targetBrokerGroups.riskClasses.find(
            riskClass => riskClass.riskClassName === riskClassName
          );

          const riskIdList = formValues && formValues.riskIdList;
          const route =
            riskClass && riskClass.routes.find(route => route.riskIdList === riskIdList);

          return route
            ? route.brokerGroups.map(brokerGroup => ({
                value: brokerGroup.bgId,
                label: brokerGroup.bgName
              }))
            : [];
        })()
      }
    ];
  }, [targetBrokerGroups, formValues, props.info, isCreatingRoute]);

  const initialValues = React.useMemo(() => getInitialValues(formFields), [formFields]);

  function handleSubmit(values: IFormValues) {
    const payload = {
      ...values,
      appUserId: props.appUserId,
      riskClass: undefined
    } as IBrokerGroupRoutesRequest;

    if (isCreatingRoute) {
      brokerGroupRoutingService.createRoute(payload);
    } else {
      brokerGroupRoutingService.updateRoute(payload);
    }
  }

  if (isEmpty(formFields) || isEmpty(initialValues)) {
    return null;
  }

  return (
    <div className={classes.root}>
      <Typography align="center" variant="h4">
        {isCreatingRoute ? "Add" : "Edit"} Route
      </Typography>

      <Formik
        initialValues={initialValues as any}
        onSubmit={handleSubmit}
        render={formProps => {
          setFormValues(formProps.values);

          return (
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
          );
        }}
      />
    </div>
  );
}

BrokerGroupRoutingForm.defaultProps = {
  info: {} as IBrokerGroupRoutingResponse
};

export default React.memo(BrokerGroupRoutingForm);
