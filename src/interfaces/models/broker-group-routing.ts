export interface IBrokerGroupRoutingResponse {
  bgId: number;
  bgName: string;
  riskIdList: string;
  riskName: string;
}

export interface IBrokerGroupRoutesResponse {
  riskClassName: string;
  routes: Array<{
    riskName: string;
    riskIdList: string;
    brokerGroups: Array<{
      bgId: number;
      bgName: string;
    }>;
  }>;
}

export interface IBrokerGroupRoutesRequest {
  appUserId?: number;
  riskIdList: string;
  targetBgId: number;
}
