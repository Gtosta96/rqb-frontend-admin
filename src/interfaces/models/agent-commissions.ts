export interface IAgentCommissionsResponse {
  firmId: number;
  binderId: number;
  binderUiName: string;
  commissionRate: number;
  firmName: string;
  riskCodeSubName: string;
  riskId: number;
}

export interface IAgentCommissionsRequest {
  firmId: number;
  riskId: number;
  binderId: number;
  commissionRate: number;
}

export interface IBinderResponse {
  binderId: number;
  binderUiName: string;
}

export interface IRiskResponse {
  riskId: number;
  riskCodeSubName: string;
}
