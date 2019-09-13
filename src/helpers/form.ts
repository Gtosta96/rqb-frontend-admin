import { set } from 'lodash';

export const getInitialValues = (fields: Array<{ name: string; initValue: any }>) =>
  fields.reduce((prev, cur) => set(prev, cur.name, cur.initValue), {} as { [key: string]: string });
