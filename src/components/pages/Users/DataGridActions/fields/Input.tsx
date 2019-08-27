import TextField from '@material-ui/core/TextField';
import { FieldProps } from 'formik';
import React from 'react';

const Input = ({
  field,
  form,
  className,
  label,
  type,
  disabled
}: FieldProps<any> & {
  className: string;
  label: string;
  type: "text" | "hidden";
  disabled: boolean;
}) => {
  // @ts-ignore
  const errorText = form.touched[field.name] && form.errors[field.name];

  if (type === "hidden") {
    return <input {...field} type={type} />;
  }

  return (
    <TextField
      {...field}
      className={className}
      type={type}
      label={label}
      error={!!errorText}
      helperText={errorText}
      disabled={disabled}
    />
  );
};

Input.defaultProps = {
  type: "text",
  readonly: false
};

export default React.memo(Input);
