export interface IUserRequest {
  appUserId?: number;
  email: string;
  firmId: number;
  roleId: number;
  fullName: string;
  initials: string;
  jobTitle: string;
  lastName: string;
  username: string;
  firstName: string;
  shortName: string;
  userStatus: string;
  mobileTelephone: string;
  telephoneNumber: string;
}

export interface IUserResponse {
  fullName: string;
  firstName: string;
  lastName: string;
  initials: string;
  shortName: string;
  username: string;
  email: string;
  firm: {
    firmId: number;
    agentFirm: string;
  };
  telephoneNumber: string;
  mobileTelephone: string;
  jobTitle: string;
  role: {
    roleId: number;
    roleName: string;
  };
}

export interface IFirmResponse {
  agentFirm: string;
  firmId: number;
  legalName: string;
}

export interface IRoleResponse {
  brokerFirmOnly: string;
  roleId: number;
  roleName: string;
}
