import MomentUtils from '@date-io/moment';
import { DatePicker as MuiDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import moment from 'moment';
import React from 'react';

import { IDefaultFieldProps, useDefaultFieldEvents } from './useDefaultFieldEvents';

interface IProps extends IDefaultFieldProps {}

function DatePicker(props: IProps) {
  const { form, field, className, label, disabled } = props;
  const { error, errorText, events } = useDefaultFieldEvents(props);

  function onChange(date: any) {
    const isoDate = moment(date).toISOString(true);
    form.setFieldValue(field.name, isoDate);
  }

  return (
    <MuiPickersUtilsProvider libInstance={moment} utils={MomentUtils}>
      <MuiDatePicker
        {...field}
        className={className}
        value={field.value}
        label={label}
        onChange={onChange}
        disabled={disabled}
        disableToolbar={true}
        variant="inline"
        format="MM/DD/YYYY"
        autoOk={true}
      />
    </MuiPickersUtilsProvider>
  );
}

export default React.memo(DatePicker);
