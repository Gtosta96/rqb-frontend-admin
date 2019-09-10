import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import React from 'react';

import { IDropdownOption } from '../../../interfaces/fields';
import { IDefaultFieldProps, useDefaultFieldEvents } from './useDefaultFieldEvents';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex"
    },
    formControl: {
      margin: theme.spacing(3)
    },
    group: {
      margin: theme.spacing(1, 0)
    }
  })
);

interface IProps extends IDefaultFieldProps {
  options: IDropdownOption[];
}

function RadioButtonsGroup(props: IProps) {
  const classes = useStyles();

  const { field, label, options, disabled } = props;
  const { error, errorText, events } = useDefaultFieldEvents(props);

  return (
    <div className={classes.root}>
      <FormControl component="fieldset" className={classes.formControl}>
        <FormLabel component="legend">{label}</FormLabel>
        <RadioGroup {...field} {...events} className={classes.group}>
          {options.map(option => (
            <FormControlLabel
              key={option.value}
              value={option.value}
              label={option.label}
              control={<Radio />}
              disabled={disabled}
            />
          ))}
        </RadioGroup>
      </FormControl>
    </div>
  );
}

export default React.memo(RadioButtonsGroup);
