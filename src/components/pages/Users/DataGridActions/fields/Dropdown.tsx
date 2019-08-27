import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { FieldProps } from 'formik';
import React from 'react';

const Dropdown = ({
  field,
  form,
  className,
  label,
  options
}: FieldProps & {
  className: string;
  label: string;
  options: Array<{ value: string | number; label: string }>;
}) => {
  // @ts-ignore
  const errorText = form.touched[field.name] && form.errors[field.name];

  return (
    <FormControl className={className}>
      <InputLabel htmlFor={field.name}>{label}</InputLabel>
      <Select
        {...field}
        error={!!errorText}
        inputProps={{
          name: field.name,
          id: field.name
        }}
      >
        {options &&
          options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
      </Select>
      {errorText && <FormHelperText>{errorText}</FormHelperText>}
    </FormControl>
  );
};

export default React.memo(Dropdown);
