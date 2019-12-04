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
import { IDocumentAttributesRequest, IDocumentAttributesResponse } from '../../../interfaces/models/document-attributes';
import bindersService from '../../../services/binders/binders';
import DocumentAttributesService from '../../../services/document-attributes/document-attributes';
import basicTypesService from '../../../services/references/basic-type';
import documentClassesService from '../../../services/references/document-classes';
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
  info?: IDocumentAttributesResponse;
}

interface IFormValues extends IDocumentAttributesRequest {}

function DocumentAttributesForm(props: IProps) {
  const classes = useStyles();

  const isCreatingDocumentAttribute = isEmpty(props.info);

  const [binderOptions] = useObservable(() => {
    bindersService.getBinders(false);

    return bindersService.listenState().pipe(
      map(binderState => binderState.payload),
      map(payload => (payload ? payload.options : []))
    );
  }, []);

  const [documentClassesOptions] = useObservable(() => {
    return documentClassesService.getDocumentClasses().pipe(map(state => state.documentClasses));
  }, []);

  const [basicTypeOptions] = useObservable(() => {
    return basicTypesService.getBasicTypes().pipe(map(state => state.basicTypes));
  }, []);

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
        name: "documentClass",
        label: "Class",
        initValue: get(props.info, "documentClass") || "",
        component: Dropdown,
        disabled: isEmpty(documentClassesOptions),
        options: documentClassesOptions || [],
        validate: required
      },
      {
        name: "jsonPathName",
        label: "Tag Name",
        initValue: get(props.info, "tagName") || "",
        component: Input,
        validate: required
      },
      {
        name: "formatType",
        label: "Format",
        initValue: get(props.info, "format") || "",
        component: Dropdown,
        disabled: isEmpty(basicTypeOptions),
        options: basicTypeOptions || []
      },
      {
        name: "useCommaSeparator",
        label: "Comma Separator",
        initValue: get(props.info, "commaSeparator") || false,
        component: Toggle
      }
    ],
    [
      props.info,
      isCreatingDocumentAttribute,
      binderOptions,
      documentClassesOptions,
      basicTypeOptions
    ]
  );

  const initialValues = React.useMemo(() => getInitialValues(formFields), [formFields]);

  function handleSubmit(values: IFormValues) {
    const payload = {
      ...values
    } as IDocumentAttributesRequest;

    if (isCreatingDocumentAttribute) {
      DocumentAttributesService.createDocumentAttribute(payload);
    } else {
      DocumentAttributesService.updateDocumentAttribute(payload);
    }
  }

  return (
    <div className={classes.root}>
      <Typography align="center" variant="h4">
        {isCreatingDocumentAttribute ? "Add" : "Edit"} Document Attributes
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

DocumentAttributesForm.defaultProps = {
  info: {} as IDocumentAttributesResponse
};

export default React.memo(DocumentAttributesForm);
