type IValidatorFunction = (value: string) => string | undefined;

export const compose = (...validators: IValidatorFunction[]) => (value: string) => {
  for (let i = 0; i < validators.length; i++) {
    const validator = validators[i];
    const result = validator(value);

    if (result) {
      return result;
    }
  }
};

export const required = (value: string) => {
  // it should allow 0
  return value !== null && value !== undefined && value !== ""
    ? undefined
    : "This field is required";
};

export const email = (value: string) =>
  value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)
    ? "This field must have a valid email address"
    : undefined;

export const minLength = (min: number) => (value: string) =>
  value && value.length < min ? `This field must have ${min} characters or more` : undefined;

export const maxLength = (max: number) => (value: string) =>
  value && value.length > max ? `This field must have ${max} characters or less` : undefined;

export const minValue = (min: number) => (value: string) =>
  value && Number(value) < min ? `This field must be greater than ${min}` : undefined;

export const maxValue = (max: number) => (value: string) =>
  value && Number(value) > max ? `This field must be less than ${max}` : undefined;
