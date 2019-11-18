export interface IBrokerGroupsRequest {
  brokerGroupId: number;
  brokerGroupName: string;
  brokerGroupOwner: number;
  isAutoPricing: boolean;
  isAutoQuoting: boolean;
  isManualPricing: boolean;
}

export interface IBrokerGroupsResponse {
  brokerGroupId: number;
  name: string;
  ownerId: number;
  owner: string;
  isAutoPricing: boolean;
  isAutoQuoting: boolean;
  isManualPricing: boolean;
}

export interface IBrokerGroupBindersRequest {
  brokerGroupId: number;
  riskId: number;
  binderId: number;
  isBinderActive: boolean;
}

export interface IBrokerGroupBindersResponse {
  binderId: number;
  binder: string;
  isBinderActive: boolean;
  risk: string;
  riskId: number;
}

export interface IBrokerGroupUsersRequest {
  brokerGroupId: number;
  userId: number;
  canActionSubmissions: boolean;
}

export interface IBrokerGroupUsersResponse {
  appUserId: number;
  fullName: string;
  canActionSubmissions: boolean;
}

export interface IBrokerGroupRoutesRequest {
  targetBrokerGroupId: number;
  riskClass: string;
  targetRiskList: number[];
  targetRiskName: string;
}

export interface IBrokerGroupRoutesResponse {
  riskClass: string;
  targetRiskList: number[];
  targetRiskName: string;
}
