export type IBinderAuthorityRequest = any;

export interface IBinderAuthorityResponse {
  appUserId: number;
  authorisedToBind: boolean;
  authorisedToIssue: boolean;
  fullName: string;
}
