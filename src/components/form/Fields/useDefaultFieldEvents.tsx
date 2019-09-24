import { FieldProps } from 'formik';
import { get } from 'lodash';

export interface IDefaultFieldProps extends FieldProps {
  className: string;
  label: string;
  disabled: boolean;
}

interface IProps extends FieldProps {
  onChange?: any;
  onBlur?: any;
}

export const useDefaultFieldEvents = (props: IProps) => {
  const errorText =
    get(props.form.touched, props.field.name) && get(props.form.errors, props.field.name);

  // function onChange(event: React.ChangeEvent<{ name?: string | undefined; value: unknown }>) {
  function onChange(event: any) {
    props.field.onChange(event);

    if (props.onChange) {
      props.onChange(event, props.form);
    }
  }

  // function onBlur(event: React.FocusEvent<HTMLDivElement>) {
  function onBlur(event: any) {
    props.field.onBlur(event);

    if (props.onBlur) {
      props.onBlur(event);
    }
  }

  return {
    error: !!errorText,
    errorText,
    events: {
      onChange,
      onBlur
    }
  };
};
