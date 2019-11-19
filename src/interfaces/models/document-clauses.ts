export interface IDocumentClauseResponse {
  clauseId: number;
  reference: string;
  title: string;
  specificToBinderId: number;
  specificToBinder: string;
  specificToState: string;
  specificToStateName: string;
  s3Path: string;
  type: string;
  created: string;
}

export interface IDocumentClauseRequest {
  documentId: number;
  referenceNumber: string;
  title: string;
  fileExtension: string;
  s3Path: string;
  specificToBinderId: number;
  specificToState: string;
}
