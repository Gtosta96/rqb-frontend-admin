export const isEmpty = (input: undefined | object | any[]) => {
  if (!input) {
    return true;
  }

  if (Array.isArray(input)) {
    return input.length === 0;
  }

  return Object.keys(input).length === 0;
};
