export function isEmpty(input: any | any[] | boolean | null | undefined): boolean {
  if (!input || input === null) {
    return true;
  }

  if (Array.isArray(input)) {
    return input.length === 0;
  }

  return Object.keys(input).length === 0;
}

export function get(property: string, object: any, defaultValue?: any) {
  const splitProperty = property.split(".");
  const result = splitProperty.reduce((prev, each) => prev[each] || defaultValue, object);

  return result;
}
