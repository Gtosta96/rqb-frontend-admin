export interface IClientDocumentResponse {
  documentClass: string;
  documentUiClass: string;
  riskIdList: number[];
  riskListName: string;
  minDocsRequired: number;
  requiredIf: any;
  orderNum: number;
}

export interface IClientDocumentRequest {
  [x: string]: any;
}
