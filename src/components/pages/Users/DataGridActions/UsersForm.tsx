import Button from '@material-ui/core/Button';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import SaveIcon from '@material-ui/icons/Save';
import { Field, FieldProps, Form, Formik, FormikActions } from 'formik';
import React from 'react';

import { required } from '../../../../helpers/formValidators';
import { isEmpty } from '../../../../helpers/functions';
import { IResponseUser } from '../../../../models/User';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      height: "100%",
      display: "flex",
      flexDirection: "column",
      padding: theme.spacing(1)
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
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      width: 450
    },
    controlsContainer: {}
  })
);

interface IProps {
  userInfo?: IResponseUser;
}

interface IFormValues extends IResponseUser {
  roleName: string;
  firmName: string;
}

const CustomField = ({
  field,
  form,
  className,
  label
}: FieldProps<IFormValues> & {
  className: string;
  label: string;
}) => {
  // @ts-ignore
  const errorText = form.touched[field.name] && form.errors[field.name];

  return (
    <TextField
      {...field}
      margin="normal"
      value={field.value || ""}
      className={className}
      label={label}
      error={!!errorText}
      helperText={errorText}
    />
  );
};

const UsersForm: React.FC<IProps> = (props) => {
  const classes = useStyles();

  function handleSubmit(values: any, actions: FormikActions<any>) {
    console.log({ values, actions });
    console.log("submit");
  }

  return (
    <div className={classes.root}>
      <Typography align="center" variant="h4">
        {isEmpty(props.userInfo) ? "Add" : "Edit"} User
      </Typography>

      <Formik initialValues={props.userInfo} onSubmit={handleSubmit}>
        <Form className={classes.form}>
          <div className={classes.inputsContainer}>
            <Field
              name={"fullName"}
              label="Full Name"
              className={classes.textField}
              component={CustomField}
              validate={required}
            />
            <Field
              name={"firstName"}
              label="First Name"
              className={classes.textField}
              component={CustomField}
              validate={required}
            />
            <Field
              name={"lastName"}
              label="Last Name"
              className={classes.textField}
              component={CustomField}
              validate={required}
            />

            <Field
              name={"initials"}
              label="Initials"
              className={classes.textField}
              component={CustomField}
              validate={required}
            />

            <Field
              name={"shortName"}
              label="Short Name"
              className={classes.textField}
              component={CustomField}
              validate={required}
            />

            <Field
              name={"username"}
              label="Username"
              className={classes.textField}
              component={CustomField}
              validate={required}
            />

            <Field
              name={"email"}
              label="Email"
              className={classes.textField}
              component={CustomField}
              validate={required}
            />

            <Field
              name={"firmName"}
              label="Firm"
              className={classes.textField}
              component={CustomField}
              validate={required}
            />

            <Field
              name={"telephoneNumber"}
              label="Telephone"
              className={classes.textField}
              component={CustomField}
            />

            <Field
              name={"mobileTelephone"}
              label="Mobile / Cell"
              className={classes.textField}
              component={CustomField}
            />

            <Field
              name={"jobTitle"}
              label="Job Title"
              className={classes.textField}
              component={CustomField}
            />

            <Field
              name={"roleName"}
              label="RQB Role"
              className={classes.textField}
              component={CustomField}
              validate={required}
            />
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
};

UsersForm.defaultProps = {
  userInfo: {} as any
};

export default React.memo(UsersForm);
