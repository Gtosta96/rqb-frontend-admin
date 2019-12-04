export interface IDocumentAttributesResponse {
  binderId: number;
  binder: string;
  documentClass: string;
  documentUiClass: string;
  tagName: string;
  format: string;
  commaSeparator: boolean;
}

export interface IDocumentAttributesRequest {
  binderId: number;
  documentClass: string;
  jsonPathName: string;
  formatType: string;
  useCommaSeparator: boolean;
}
