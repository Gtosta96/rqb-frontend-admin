export interface IFirmResponse {
  firmId: number;
  firmLegalName: string;
  firmName: string;
  globalClientId: string;
  isActive: boolean;
  isAgentFirm: boolean;
  onboarded: string;
  address: Array<{
    addressId: number;
    line1: string;
    line2: string;
    line3: string;
    townCity: string;
    stateProvinceCounty: string;
    postZipCode: string;
    country: string;
    telephone: string;
    mobile: string;
    fax: string;
    email: string;
  }>;
}

export interface IFirmRequest extends IFirmResponse {}
