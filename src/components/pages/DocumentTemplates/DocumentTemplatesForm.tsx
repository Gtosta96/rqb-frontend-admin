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
import { IDocumentTemplateRequest, IDocumentTemplateResponse } from '../../../interfaces/models/document-templates';
import bindersService from '../../../services/binders/binders';
import DocumentTemplatesService from '../../../services/document-templates/document-templates';
import bgrRiskListService from '../../../services/references/broker-group-routes-risk-list';
import documentClassesService from '../../../services/references/document-classes';
import fileExtensionsService from '../../../services/references/file-extensions';
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
  info?: IDocumentTemplateResponse;
}

interface IFormValues extends IDocumentTemplateRequest {
  riskIdListString: string;
}

function DocumentTemplatesForm(props: IProps) {
  const classes = useStyles();

  const isCreatingDocumentTemplate = isEmpty(props.info);

  const [binderOptions] = useObservable(() => {
    bindersService.getBinders(false);

    return bindersService.listenState().pipe(
      map(binderState => binderState.payload),
      map(payload => (payload ? payload.options : []))
    );
  }, []);

  const [fileExtensionsOptions] = useObservable(() => {
    return fileExtensionsService.getFileExtensions().pipe(map(state => state.fileExtensions));
  }, []);

  const [documentClassesOptions] = useObservable(() => {
    return documentClassesService.getDocumentClasses().pipe(map(state => state.documentClasses));
  }, []);

  const [bgrRiskLists] = useObservable(() => {
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

  const formFields = React.useMemo(
    () => [
      {
        name: "binderId",
        label: "Binder",
        initValue: get(props.info, "specificToBinderId") || "",
        component: Dropdown,
        disabled: isEmpty(binderOptions),
        options: binderOptions || []
      },
      {
        name: "riskIdListString",
        label: "Applicable Risk(s)",
        initValue: (get(props.info, "riskIdList") || "").toString(),
        component: Dropdown,
        disabled: isEmpty(bgrRiskLists),
        options: bgrRiskLists || [],
        validate: required
      },
      {
        name: "documentClass",
        label: "Class",
        initValue: get(props.info, "documentClass") || "",
        component: Dropdown,
        disabled: isEmpty(documentClassesOptions),
        options: documentClassesOptions || [],
        validate: required
      },
      {
        name: "title",
        label: "Title",
        initValue: get(props.info, "title") || "",
        component: Input,
        validate: required
      },
      {
        name: "s3Path",
        label: "S3 Path",
        initValue: get(props.info, "s3Path") || "",
        component: Input,
        validate: required
      },
      {
        name: "fileExtension",
        label: "Type",
        initValue: get(props.info, "type") || "",
        component: Dropdown,
        options: fileExtensionsOptions || [],
        validate: required
      }
    ],
    [
      props.info,
      binderOptions,
      fileExtensionsOptions,
      documentClassesOptions,
      bgrRiskLists,
      isCreatingDocumentTemplate
    ]
  );

  const initialValues = React.useMemo(() => getInitialValues(formFields), [formFields]);

  function handleSubmit(values: IFormValues) {
    const payload = {
      ...values,
      documentId: (props.info && props.info.templateId) || null,
      riskIdList: values.riskIdListString.split(",").map(Number),
      riskIdListString: undefined
    } as IDocumentTemplateRequest;

    if (isCreatingDocumentTemplate) {
      DocumentTemplatesService.createDocumentTemplate(payload);
    } else {
      DocumentTemplatesService.updateDocumentTemplate(payload);
    }
  }

  return (
    <div className={classes.root}>
      <Typography align="center" variant="h4">
        {isCreatingDocumentTemplate ? "Add" : "Edit"} Document Template
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

DocumentTemplatesForm.defaultProps = {
  info: {} as IDocumentTemplateResponse
};

export default React.memo(DocumentTemplatesForm);
