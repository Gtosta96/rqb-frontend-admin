export const getInitialValues = (fields: Array<{ name: string; initValue: any }>) =>
  fields.reduce(
    (prev, cur) => {
      prev[cur.name] = cur.initValue;
      return prev;
    },
    {} as { [key: string]: string }
  );
