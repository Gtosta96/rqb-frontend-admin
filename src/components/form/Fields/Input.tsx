import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import React from 'react';

import { IDefaultFieldProps, useDefaultFieldEvents } from './useDefaultFieldEvents';

export interface IProps extends IDefaultFieldProps {
  prefix?: string | undefined;
}

function Input(props: IProps) {
  const { className, field, label, disabled, prefix } = props;
  const { error, errorText, events } = useDefaultFieldEvents(props);

  const inputProps = prefix
    ? { startAdornment: <InputAdornment position="start">{prefix}</InputAdornment> }
    : undefined;

  return (
    <TextField
      {...field}
      {...events}
      className={className}
      label={label}
      error={error}
      helperText={errorText}
      disabled={disabled}
      InputProps={inputProps}
    />
  );
}

Input.defaultProps = {};

export default React.memo(Input);
