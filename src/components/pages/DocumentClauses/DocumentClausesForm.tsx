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
import { IDocumentClauseRequest, IDocumentClauseResponse } from '../../../interfaces/models/document-clauses';
import bindersService from '../../../services/binders/binders';
import DocumentClausesService from '../../../services/document-clauses/document-clauses';
import fileExtensionsService from '../../../services/document-clauses/file-extensions';
import statesService from '../../../services/document-clauses/states';
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
  info?: IDocumentClauseResponse;
}

interface IFormValues extends IDocumentClauseRequest {}

function DocumentClausesForm(props: IProps) {
  const classes = useStyles();

  const isCreatingDocumentClause = isEmpty(props.info);

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

  const [statesOptions] = useObservable(() => {
    return statesService.getStates().pipe(map(state => state.states));
  }, []);

  const formFields = React.useMemo(
    () => [
      {
        name: "referenceNumber",
        label: "Reference",
        initValue: get(props.info, "reference") || "",
        component: Input,
        disabled: !isCreatingDocumentClause
      },
      {
        name: "title",
        label: "Title",
        initValue: get(props.info, "title") || "",
        component: Input,
        validate: required,
        disabled: !isCreatingDocumentClause
      },
      {
        name: "specificToBinderId",
        label: "Specific To Binder",
        initValue: get(props.info, "specificToBinderId") || "",
        component: Dropdown,
        disabled: isEmpty(binderOptions),
        options: binderOptions || []
      },
      {
        name: "specificToState",
        label: "Specific To State",
        initValue: get(props.info, "specificToState") || "",
        component: Dropdown,
        options: statesOptions || []
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
    [props.info, binderOptions, fileExtensionsOptions, statesOptions, isCreatingDocumentClause]
  );

  const initialValues = React.useMemo(() => getInitialValues(formFields), [formFields]);

  function handleSubmit(values: IFormValues) {
    const payload = {
      ...values,
      documentId: (props.info && props.info.clauseId) || null
    } as IDocumentClauseRequest;

    if (isCreatingDocumentClause) {
      DocumentClausesService.createDocumentClause(payload);
    } else {
      DocumentClausesService.updateDocumentClause(payload);
    }
  }

  return (
    <div className={classes.root}>
      <Typography align="center" variant="h4">
        {isCreatingDocumentClause ? "Add" : "Edit"} DocumentClause
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

DocumentClausesForm.defaultProps = {
  info: {} as IDocumentClauseResponse
};

export default React.memo(DocumentClausesForm);
