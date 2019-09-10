import { FieldProps } from 'formik';

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
  const errorText = props.form.touched[props.field.name] && props.form.errors[props.field.name];

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
