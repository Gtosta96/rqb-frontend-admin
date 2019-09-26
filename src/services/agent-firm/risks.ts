import { BehaviorSubject } from 'rxjs';

import { IDropdownOption } from '../../interfaces/fields';
import { IRiskResponse } from '../../interfaces/models/agent-commissions';
import { API } from '../../settings/constants';
import apiService from '../api';
import uiService from '../ui';

interface IState {
  risks: IDropdownOption[];
}

class RisksService {
  private risksState$ = new BehaviorSubject<IState>({
    risks: []
  });

  public getRisks = (cache: boolean = true) => {
    if (!cache || this.risksState$.getValue().risks.length === 0) {
      uiService
        .withUIFeedback(
          apiService.get<{ risks?: IRiskResponse[] }>(`${API.reference}/references/risks`),
          {
            withToasty: false
          }
        )
        .subscribe(xhr => {
          this.risksState$.next({
            risks: (xhr.response.risks || []).map(risk => ({
              value: risk.riskId,
              label: risk.riskCodeSubName
            }))
          });
        });
    }

    return this.risksState$.asObservable();
  };
}

const risksService = new RisksService();
export default risksService;
