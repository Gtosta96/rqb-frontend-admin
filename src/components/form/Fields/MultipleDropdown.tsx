import Checkbox from '@material-ui/core/Checkbox';
import Chip from '@material-ui/core/Chip';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import InputLabel from '@material-ui/core/InputLabel';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { Theme } from '@material-ui/core/styles';
import createStyles from '@material-ui/styles/createStyles';
import makeStyles from '@material-ui/styles/makeStyles';
import React from 'react';

import { IDropdownOption } from '../../../interfaces/fields';
import { IDefaultFieldProps, useDefaultFieldEvents } from './useDefaultFieldEvents';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    chips: {
      display: "flex",
      flexWrap: "wrap"
    },
    chip: {
      marginRight: theme.spacing(1)
    }
  })
);

interface IProps extends IDefaultFieldProps {
  options: IDropdownOption[];
}

function MultipleDropdown(props: IProps) {
  const { className, field, label, options, disabled } = props;
  const { error, errorText, events } = useDefaultFieldEvents(props);
  const classes = useStyles();

  return (
    <FormControl className={className} error={error}>
      <InputLabel htmlFor={field.name}>{label}</InputLabel>
      <Select
        {...field}
        {...events}
        multiple={true}
        renderValue={selected => (
          <div className={classes.chips}>
            {(selected as string[]).map(value => (
              <Chip key={value} label={value} className={classes.chip} />
            ))}
          </div>
        )}
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
              <Checkbox checked={field.value.includes(option.value)} />
              <ListItemText primary={option.label} />
            </MenuItem>
          ))}
      </Select>
      {errorText && <FormHelperText>{errorText}</FormHelperText>}
    </FormControl>
  );
}

export default React.memo(MultipleDropdown);
