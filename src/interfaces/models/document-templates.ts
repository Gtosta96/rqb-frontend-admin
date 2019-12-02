export interface IDocumentTemplateResponse {
  templateId: number;
  specificToBinderId: number;
  specificToBinder: string;
  riskIdList: number[];
  riskListName: string;
  documentClass: string;
  documentUiClass: string;
  title: string;
  s3Path: string;
  type: string;
  created: string;
}

export interface IDocumentTemplateRequest {
  documentId: number;
  title: string;
  fileExtension: string;
  documentClass: string;
  binderId: number;
  s3Path: string;
  riskIdList: number[];
}
