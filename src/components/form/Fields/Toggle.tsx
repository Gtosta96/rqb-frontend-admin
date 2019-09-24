import { FormControl } from '@material-ui/core';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import Switch from '@material-ui/core/Switch';
import React from 'react';

import { IDefaultFieldProps, useDefaultFieldEvents } from './useDefaultFieldEvents';

interface IProps extends Omit<IDefaultFieldProps, "label"> {
  controlLabel: string;
  label: string | { active: string; inactive: string };
}

function Toggle(props: IProps) {
  const { className, controlLabel, label, field, disabled } = props;
  const { error, errorText, events } = useDefaultFieldEvents(props);

  const toggleLabel = React.useMemo(() => {
    if (typeof label === "object") {
      return field.value ? label.active : label.inactive;
    }

    return label;
  }, [field.value, label]);

  return (
    <FormControl component="fieldset" className={className}>
      <FormLabel component="legend">{controlLabel}</FormLabel>
      <FormControlLabel
        label={toggleLabel}
        control={
          <Switch
            {...field}
            {...events}
            color="primary"
            checked={!!field.value}
            disabled={disabled}
          />
        }
      />
    </FormControl>
  );
}

export default React.memo(Toggle);
