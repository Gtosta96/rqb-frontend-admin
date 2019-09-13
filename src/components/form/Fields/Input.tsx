import TextField from '@material-ui/core/TextField';
import React from 'react';

import { IDefaultFieldProps, useDefaultFieldEvents } from './useDefaultFieldEvents';

interface IProps extends IDefaultFieldProps {}

function Input(props: IProps) {
  const { className, field, label, disabled } = props;
  const { error, errorText, events } = useDefaultFieldEvents(props);

  return (
    <TextField
      {...field}
      {...events}
      className={className}
      label={label}
      error={error}
      helperText={errorText}
      disabled={disabled}
    />
  );
}

Input.defaultProps = {};

export default React.memo(Input);
