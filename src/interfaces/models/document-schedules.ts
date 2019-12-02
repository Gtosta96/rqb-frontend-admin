export interface IDocumentScheduleResponse {
  affects: string;
  binder: string;
  binderId: number;
  docTemplate: string;
  documentClass: string;
  documentId: number;
  documentScheduleId: number;
  documentUiClass: string;
  generateAs: string;
  generatedOnAction: string;
  isCombined: boolean;
  isSubmissionDoc: boolean;
  outputTitle: string;
  questionnaire: string;
  questionnaireId: number;
  riskIdList: number[];
  riskListName: string;
  specificCountry: string;
  specificCountryName: string;
  specificState: string;
  specificStateName: string;
}

export interface IDocumentScheduleRequest {
  documentScheduleId: number;
  binderId: number;
  questionnaireId: number;
  riskIdList: number[];
  documentClass: string;
  generateOnAction: string;
  isCombined: boolean;
  isSubmissionDoc: boolean;
  specificState: string;
  specificCountry: string;
  documentId: number;
  outputTitle: string;
  generateAs: string;
}
