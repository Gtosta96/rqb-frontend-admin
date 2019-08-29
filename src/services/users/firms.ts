import { BehaviorSubject } from 'rxjs';

import { IDropdownOption } from '../../interfaces/fields';
import { IFirmResponse } from '../../interfaces/models/user';
import { API } from '../../settings/constants';
import apiService from '../api';
import uiService from '../ui';

interface IFirmsState {
  firms: IDropdownOption[];
}

class FirmsService {
  private firmsState$ = new BehaviorSubject<IFirmsState>({
    firms: []
  });

  public getFirms = (cache: boolean = true) => {
    if (!cache || this.firmsState$.getValue().firms.length === 0) {
      uiService
        .withUIFeedback(apiService.get<{ firms: IFirmResponse[] }>(`${API.xpto}/firms`), {
          withToasty: false
        })
        .subscribe((xhr) => {
          this.firmsState$.next({
            firms: xhr.response.firms.map((firm) => ({
              value: firm.firmId,
              label: firm.agentFirm
            }))
          });
        });
    }

    return this.firmsState$.asObservable();
  };
}

const firmsService = new FirmsService();
export default firmsService;
