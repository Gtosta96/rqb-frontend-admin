export interface IResponseUser {
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
