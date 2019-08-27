import { FormControl } from '@material-ui/core';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import Switch from '@material-ui/core/Switch';
import { FieldProps } from 'formik';
import React from 'react';

const Toggle = ({
  field,
  form,
  className,
  controlLabel,
  label,
  disabled
}: FieldProps<any> & {
  className: string;
  controlLabel: string;
  label: string;
  disabled: boolean;
}) => {
  return (
    <FormControl component="fieldset" className={className}>
      <FormLabel component="legend">{controlLabel}</FormLabel>
      <FormControlLabel
        label={label}
        control={<Switch {...field} color="primary" checked={!!field.value} disabled={disabled} />}
      />
    </FormControl>
  );
};

export default React.memo(Toggle);
