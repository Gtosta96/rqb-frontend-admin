export function booleanToString<T>(
  rowData: T,
  property: keyof T,
  trueMsg = "YES",
  falseMsg = "NO"
) {
  return rowData[property] ? trueMsg : falseMsg;
}
