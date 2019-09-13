export function booleanToString<T>(rowData: T, property: keyof T) {
  return rowData[property] ? "YES" : "NO";
}
