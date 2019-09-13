import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import React from 'react';

import { IDropdownOption } from '../../../interfaces/fields';
import { IDefaultFieldProps, useDefaultFieldEvents } from './useDefaultFieldEvents';

interface IProps extends IDefaultFieldProps {
  options: IDropdownOption[];
}

function Dropdown(props: IProps) {
  const { className, field, label, options, disabled } = props;
  const { error, errorText, events } = useDefaultFieldEvents(props);

  return (
    <FormControl className={className}>
      <InputLabel htmlFor={field.name}>{label}</InputLabel>
      <Select
        {...field}
        {...events}
        error={error}
        disabled={disabled}
        inputProps={{
          id: field.name,
          name: field.name
        }}
      >
        {options &&
          options.map(option => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
      </Select>
      {errorText && <FormHelperText>{errorText}</FormHelperText>}
    </FormControl>
  );
}

export default React.memo(Dropdown);
