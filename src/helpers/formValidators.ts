export const required = (value: string) => {
  return value ? undefined : "This field is required";
};

export const email = (value: string) =>
  value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)
    ? "This field must have a valid email address"
    : undefined;

export const minLength = (min: number) => (value: string) =>
  value && value.length < min ? `This field must have ${min} characters or more` : undefined;
