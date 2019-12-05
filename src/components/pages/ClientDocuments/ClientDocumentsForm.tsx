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
import { IClientDocumentRequest, IClientDocumentResponse } from '../../../interfaces/models/client-documents';
import ClientDocumentsService from '../../../services/client-documents/client-documents';
import bgrRiskListService from '../../../services/references/broker-group-routes-risk-list';
import documentClassesService from '../../../services/references/document-classes';
import questionnaireFieldNamesService from '../../../services/references/questionnaire-field-names';
import Dropdown from '../../form/Fields/Dropdown';
import Input from '../../form/Fields/Input';

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
  info?: IClientDocumentResponse;
}

interface IFormValues extends IClientDocumentRequest {
  riskIdListString: string;
}

function ClientDocumentsForm(props: IProps) {
  const classes = useStyles();

  const isCreatingClientDocument = isEmpty(props.info);

  const [bgrRiskOptions] = useObservable(() => {
    bgrRiskListService.getBrokerGroupRoutesRiskList(undefined, true);

    return bgrRiskListService.listenState().pipe(
      map(bgrRiskListState => bgrRiskListState.payload),
      map(payload => payload && payload.riskList),
      map(riskLists =>
        (riskLists || []).map(riskList => ({
          value: riskList.riskList.toString(),
          label: riskList.riskListName
        }))
      )
    );
  }, []);

  const [basicTypeOptions] = useObservable(() => {
    return questionnaireFieldNamesService
      .getQuestionnaireFieldNames()
      .pipe(map(state => state.questionnaireFieldNames));
  }, []);

  const [documentClassesOptions] = useObservable(() => {
    return documentClassesService.getDocumentClasses().pipe(map(state => state.documentClasses));
  }, []);

  const formFields = React.useMemo(
    () => [
      {
        name: "documentClass",
        label: "Class",
        initValue: get(props.info, "documentClass") || "",
        component: Dropdown,
        disabled: isEmpty(documentClassesOptions) || !isCreatingClientDocument,
        options: documentClassesOptions || []
      },
      {
        name: "riskIdListString",
        label: "Applicable Risk(s)",
        initValue: (get(props.info, "riskIdList") || "").toString(),
        component: Dropdown,
        disabled: isEmpty(bgrRiskOptions) || !isCreatingClientDocument,
        options: bgrRiskOptions || [],
        validate: required
      },
      {
        name: "minDocsRequired",
        label: "Minimum Document Count",
        initValue: get(props.info, "minDocsRequired") || 0,
        component: Input,
        type: "number",
        validate: required
      },
      {
        name: "requiredIf",
        label: "Required Where",
        initValue: get(props.info, "requiredIf") || "",
        component: Dropdown,
        options: basicTypeOptions || []
      },
      {
        name: "orderNum",
        label: "Menu Order",
        initValue: get(props.info, "orderNum") || "",
        component: Input,
        type: "number",
        validate: required
      }
    ],
    [props.info, isCreatingClientDocument, bgrRiskOptions, documentClassesOptions, basicTypeOptions]
  );

  const initialValues = React.useMemo(() => getInitialValues(formFields), [formFields]);

  function handleSubmit(values: IFormValues) {
    const payload = {
      ...values,
      riskIdList: values.riskIdListString.split(",").map(Number),
      riskIdListString: undefined
    } as IClientDocumentRequest;

    if (isCreatingClientDocument) {
      ClientDocumentsService.createClientDocument(payload);
    } else {
      ClientDocumentsService.updateClientDocument(payload);
    }
  }

  return (
    <div className={classes.root}>
      <Typography align="center" variant="h4">
        {isCreatingClientDocument ? "Add" : "Edit"} Client Document
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

ClientDocumentsForm.defaultProps = {
  info: {} as IClientDocumentResponse
};

export default React.memo(ClientDocumentsForm);
