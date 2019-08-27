import 'date-fns';

import DateFnsUtils from '@date-io/date-fns';
import { DatePicker as MuiDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import { FieldProps } from 'formik';
import React from 'react';

const DatePicker = ({
  field,
  form,
  className,
  label,
  disabled
}: FieldProps & {
  className: string;
  label: string;
  disabled: boolean;
}) => {
  // @ts-ignore
  // const errorText = form.touched[field.name] && form.errors[field.name];

  function onChange(value: any) {
    form.setFieldValue(field.name, value);
  }

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <MuiDatePicker
        {...field}
        className={className}
        value={field.value || new Date()}
        label={label}
        onChange={onChange}
        disabled={disabled}
        disableToolbar={true}
        variant="inline"
        format="MM/dd/yyyy"
      />
    </MuiPickersUtilsProvider>
  );
};

export default React.memo(DatePicker);
