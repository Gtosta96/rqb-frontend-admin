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
import { IDocumentScheduleRequest, IDocumentScheduleResponse } from '../../../interfaces/models/document-schedules';
import bindersService from '../../../services/binders/binders';
import DocumentSchedulesService from '../../../services/document-schedules/document-schedules';
import documentTemplatesService from '../../../services/document-templates/document-templates';
import bgrRiskListService from '../../../services/references/broker-group-routes-risk-list';
import countriesService from '../../../services/references/countries';
import documentClassesService from '../../../services/references/document-classes';
import questionnairesService from '../../../services/references/questionnaires';
import statesService from '../../../services/references/states';
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
  info?: IDocumentScheduleResponse;
}

interface IFormValues extends IDocumentScheduleRequest {
  riskIdListString: string;
  isSubmissionDocString: string;
}

function DocumentSchedulesForm(props: IProps) {
  const classes = useStyles();

  const isCreatingDocumentSchedule = isEmpty(props.info);

  const [binderOptions] = useObservable(() => {
    bindersService.getBinders(false);

    return bindersService.listenState().pipe(
      map(binderState => binderState.payload),
      map(payload => (payload ? payload.options : []))
    );
  }, []);

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

  const [documentClassesOptions] = useObservable(() => {
    return documentClassesService.getDocumentClasses().pipe(map(state => state.documentClasses));
  }, []);

  // const [fileExtensionsOptions] = useObservable(() => {
  //   return fileExtensionsService.getFileExtensions().pipe(map(state => state.fileExtensions));
  // }, []);
  const fileExtensionsOptions = [{ value: "pdf", label: "PDF" }, { value: "docx", label: "DOC" }];

  const affectsOptions = [
    { value: "Submission", label: "Submission" },
    { value: "Endorsement", label: "Endorsement" }
  ];

  const generateOnActionOptions = [
    { value: "price", label: "Price" },
    { value: "quote", label: "Quote" },
    { value: "bind", label: "Bind" },
    { value: "issue", label: "Issue" }
  ];

  const [questionnairesOptions] = useObservable(() => {
    return questionnairesService.getQuestionnaires().pipe(map(state => state.questionnaires));
  }, []);

  const [documentTemplatesOptions] = useObservable(() => {
    documentTemplatesService.getDocumentTemplates();

    return documentTemplatesService.listenState().pipe(
      map(docTemplatesState => docTemplatesState.payload),
      map(docTemplates =>
        (docTemplates || []).map(docTemplate => ({
          value: docTemplate.templateId,
          label: docTemplate.title
        }))
      )
    );
  }, []);

  const [statesOptions] = useObservable(() => {
    return statesService.getStates().pipe(map(state => state.states));
  }, []);

  const [countriesOptions] = useObservable(
    () => countriesService.getCountries().pipe(map(state => state.countries)),
    []
  );

  const formFields = React.useMemo(
    () => [
      {
        name: "binderId",
        label: "Binder",
        initValue: get(props.info, "binderId") || "",
        component: Dropdown,
        disabled: isEmpty(binderOptions),
        options: binderOptions || []
      },
      {
        name: "questionnaireId",
        label: "Questionnaire",
        initValue: get(props.info, "questionnaireId") || "",
        component: Dropdown,
        disabled: isEmpty(questionnairesOptions),
        options: questionnairesOptions || [],
        validate: required
      },
      {
        name: "riskIdListString",
        label: "Applicable Risk(s)",
        initValue: (get(props.info, "riskIdList") || "").toString(),
        component: Dropdown,
        disabled: isEmpty(bgrRiskOptions),
        options: bgrRiskOptions || [],
        validate: required
      },
      {
        name: "documentClass",
        label: "Class",
        initValue: get(props.info, "documentClass") || "",
        component: Dropdown,
        disabled: isEmpty(documentClassesOptions),
        options: documentClassesOptions || []
      },
      {
        name: "documentId",
        label: "Template",
        initValue: get(props.info, "documentId") || "",
        component: Dropdown,
        disabled: isEmpty(documentTemplatesOptions),
        options: documentTemplatesOptions || []
      },
      {
        name: "outputTitle",
        label: "Output Title",
        initValue: get(props.info, "outputTitle") || "",
        component: Input,
        validate: required
      },
      {
        name: "generateOnAction",
        label: "Generate On Action",
        initValue: get(props.info, "generatedOnAction") || "",
        component: Dropdown,
        options: generateOnActionOptions,
        validate: required
      },
      {
        name: "isSubmissionDocString",
        label: "Affects",
        initValue: get(props.info, "affects") || "",
        component: Dropdown,
        options: affectsOptions,
        validate: required
      },
      {
        name: "isCombined",
        label: "Combined Doc",
        initValue: get(props.info, "isCombined") || "",
        component: Toggle
      },
      {
        name: "generateAs",
        label: "Output Format",
        initValue: get(props.info, "generateAs") || "",
        component: Dropdown,
        options: fileExtensionsOptions,
        validate: required
      },
      {
        name: "specificState",
        label: "Specific  State",
        initValue: get(props.info, "specificState") || "",
        component: Dropdown,
        options: statesOptions || [],
        validate: required
      },
      {
        name: "specificCountry",
        label: "Specific Country",
        initValue: get(props.info, "specificCountry") || "",
        component: Dropdown,
        options: countriesOptions || [],
        validate: required
      }
    ],
    [
      props.info,
      binderOptions,

      bgrRiskOptions,

      countriesOptions,
      documentTemplatesOptions,
      questionnairesOptions,
      statesOptions,
      fileExtensionsOptions,
      documentClassesOptions,
      affectsOptions,
      generateOnActionOptions
    ]
  );
  console.log({ formFields, info: props.info });

  const initialValues = React.useMemo(() => getInitialValues(formFields), [formFields]);

  function handleSubmit(values: IFormValues) {
    const payload = {
      ...values,
      documentScheduleId: (props.info && props.info.binderId) || null,
      riskIdList: values.riskIdListString.split(",").map(Number),
      riskIdListString: undefined,
      isSubmissionDoc: "Submission" ? true : false,
      isSubmissionDocString: undefined
    } as IDocumentScheduleRequest;

    if (isCreatingDocumentSchedule) {
      DocumentSchedulesService.createDocumentSchedule(payload);
    } else {
      DocumentSchedulesService.updateDocumentSchedule(payload);
    }
  }

  return (
    <div className={classes.root}>
      <Typography align="center" variant="h4">
        {isCreatingDocumentSchedule ? "Add" : "Edit"} Document Schedule
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

DocumentSchedulesForm.defaultProps = {
  info: {} as IDocumentScheduleResponse
};

export default React.memo(DocumentSchedulesForm);
