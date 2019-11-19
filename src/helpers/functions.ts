export function booleanToString<T>(
  rowData: T,
  property: keyof T,
  trueMsg = "YES",
  falseMsg = "NO"
) {
  return rowData[property] ? trueMsg : falseMsg;
}

export function parseDate(date: string) {
  return date.substr(0, date.indexOf(" 00:00:00"));
}
