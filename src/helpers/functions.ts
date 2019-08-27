export const isEmpty = (input: undefined | object | any[]) => {
  if (!input) {
    return true;
  }

  if (Array.isArray(input)) {
    return input.length === 0;
  }

  return Object.keys(input).length === 0;
};

export const get = (property: string, object: any, defaultValue?: any) => {
  const splitProperty = property.split(".");
  const result = splitProperty.reduce((prev, each) => prev[each] || defaultValue, object);

  return result;
};
