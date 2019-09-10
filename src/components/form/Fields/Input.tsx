import TextField from '@material-ui/core/TextField';
import React from 'react';

import { IDefaultFieldProps, useDefaultFieldEvents } from './useDefaultFieldEvents';

interface IProps extends IDefaultFieldProps {
  type: "text" | "hidden";
}

const Input: React.FC<IProps> = props => {
  const { className, field, label, type, disabled } = props;
  const { error, errorText, events } = useDefaultFieldEvents(props);

  if (type === "hidden") {
    return <input {...field} type={type} disabled={disabled} />;
  }

  return (
    <TextField
      {...field}
      {...events}
      className={className}
      type={type}
      label={label}
      error={error}
      helperText={errorText}
      disabled={disabled}
    />
  );
};

Input.defaultProps = {
  type: "text"
};

export default React.memo(Input);
