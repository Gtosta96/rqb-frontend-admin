import MUIChipInput from 'material-ui-chip-input';
import React from 'react';

import { IDefaultFieldProps, useDefaultFieldEvents } from './useDefaultFieldEvents';

export interface IProps extends IDefaultFieldProps {}

function ChipInput(props: IProps) {
  const { className, field, label, disabled, form } = props;
  const { error, errorText, events } = useDefaultFieldEvents(props);

  function onAdd(value: string) {
    const updt = [...field.value, value];
    form.setFieldValue(field.name, updt);
  }

  function onDelete(value: string) {
    const updt = field.value.filter((item: string) => item !== value);
    form.setFieldValue(field.name, updt);
  }

  return (
    <MUIChipInput
      {...field}
      {...events}
      defaultValue={field.value}
      onAdd={onAdd}
      onDelete={onDelete}
      className={className}
      label={label}
      error={error}
      helperText={errorText}
      disabled={disabled}
      InputProps={{ name: field.name }}
    />
  );
}

ChipInput.defaultProps = {};

export default React.memo(ChipInput);
