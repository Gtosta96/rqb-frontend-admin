import Button from '@material-ui/core/Button';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import SaveIcon from '@material-ui/icons/Save';
import { Field, Form, Formik, FormikProps } from 'formik';
import { get, isEmpty, isEqual } from 'lodash';
import React, { useEffect } from 'react';
import { useObservable } from 'react-use-observable';
import { map } from 'rxjs/operators';

import { getInitialValues } from '../../../../helpers/form';
import { required } from '../../../../helpers/formValidators';
import {
  IBrokerGroupRoutesRequest,
  IBrokerGroupRoutesResponse,
  IBrokerGroupsResponse,
} from '../../../../interfaces/models/broker-groups';
import brokerGroupRoutesService from '../../../../services/broker-groups/broker-group-routes';
import bgrRiskClassesService from '../../../../services/references/broker-group-routes-risk-classes';
import bgrRiskListService from '../../../../services/references/broker-group-routes-risk-list';
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
  brokerGroup: IBrokerGroupsResponse;
  info?: IBrokerGroupRoutesResponse;
}

interface IFormValues extends IBrokerGroupRoutesRequest {
  name: string; // only for front-end control
  riskList: number[]; // only for front-end control
}

function BrokerGroupRoutesForm(props: IProps) {
  const classes = useStyles();

  const [bgrRiskClasses] = useObservable(() => {
    return bgrRiskClassesService.getBrokerGroupRoutesRiskClasses().pipe(
      map(bgrRiskClassesState => bgrRiskClassesState.riskClasses),
      map(riskClasses =>
        (riskClasses || []).map(riskClass => ({
          value: riskClass,
          label: riskClass
        }))
      )
    );
  }, []);

  const [bgrRiskLists] = useObservable(() => {
    return bgrRiskListService.listenState().pipe(
      map(bgrRiskListState => bgrRiskListState.payload),
      map(payload => payload && payload.riskClasses[payload.current]),
      map(riskLists =>
        (riskLists || []).map(riskList => ({
          value: riskList.riskList,
          label: riskList.riskListName
        }))
      )
    );
  }, []);

  useEffect(() => {
    if (props.info && props.info.riskClass) {
      getBrokerGroupRoutesRiskList(props.info.riskClass);
    }
  }, [props.info]);

  function getBrokerGroupRoutesRiskList(value: string) {
    bgrRiskListService.getBrokerGroupRoutesRiskList(value, true);
  }

  const formFields = React.useMemo(() => {
    return [
      {
        name: "targetBrokerGroupId",
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
        name: "riskClass",
        label: "Risk Class",
        initValue: get(props.info, "riskClass") || "",
        validate: required,
        component: Dropdown,
        options: bgrRiskClasses || [],
        disabled: isEmpty(bgrRiskClasses),
        onChange: (e: any, form: FormikProps<any>) => {
          form.setFieldValue("targetRiskList", "");
          getBrokerGroupRoutesRiskList(e.target.value);
        }
      },
      {
        name: "riskList",
        label: "Risk List",
        initValue: get(props.info, "targetRiskList") || "",
        validate: required,
        component: Dropdown,
        options: bgrRiskLists,
        disabled: isEmpty(bgrRiskLists)
      }
    ];
  }, [props.info, props.brokerGroup, bgrRiskClasses, bgrRiskLists]);

  const initialValues = React.useMemo(() => getInitialValues(formFields), [formFields]);

  function handleSubmit(values: IFormValues) {
    const { name, riskList, ...payload } = values;

    const risk = (bgrRiskLists || []).find(bgrRiskList => isEqual(bgrRiskList.value, riskList));
    if (risk) {
      payload.targetRiskName = risk.label;
      payload.targetRiskList = risk.value;
    }

    brokerGroupRoutesService.createBrokerGroupRoute(payload);
  }

  if (isEmpty(formFields) || isEmpty(initialValues)) {
    return null;
  }

  return (
    <div className={classes.root}>
      <Typography align="center" variant="h4">
        Add Broker Group Route
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

BrokerGroupRoutesForm.defaultProps = {
  info: {} as IBrokerGroupRoutesResponse
};

export default React.memo(BrokerGroupRoutesForm);
