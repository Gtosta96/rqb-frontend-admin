export interface IBrokerageRateRequest {
  riskId: number;
  risk: string;
  rate: number;
}

export interface IBrokerageRateResponse {
  riskId: number;
  risk: string;
  rate: number;
}
