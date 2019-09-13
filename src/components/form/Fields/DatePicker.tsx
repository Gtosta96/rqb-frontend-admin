import 'date-fns';

import DateFnsUtils from '@date-io/date-fns';
import { DatePicker as MuiDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import React from 'react';

import { IDefaultFieldProps, useDefaultFieldEvents } from './useDefaultFieldEvents';

interface IProps extends IDefaultFieldProps {}

function DatePicker(props: IProps) {
  const { form, field, className, label, disabled } = props;
  const { error, errorText, events } = useDefaultFieldEvents(props);

  function onChange(value: any) {
    form.setFieldValue(field.name, value);
  }

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <MuiDatePicker
        {...field}
        className={className}
        value={field.value}
        label={label}
        onChange={onChange}
        disabled={disabled}
        disableToolbar={true}
        variant="inline"
        format="MM/dd/yyyy"
      />
    </MuiPickersUtilsProvider>
  );
}

export default React.memo(DatePicker);
