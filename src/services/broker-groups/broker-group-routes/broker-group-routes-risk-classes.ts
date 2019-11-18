import { isEmpty } from 'lodash';
import { BehaviorSubject } from 'rxjs';

import { IBrokerGroupRoutesResponse } from '../../../interfaces/models/broker-groups';
import { API } from '../../../settings/constants';
import apiService from '../../api';
import uiService from '../../ui';

interface IState {
  riskClasses: IBrokerGroupRoutesResponse[];
}

class BrokerGroupRoutesRiskClassesService {
  private riskClassesState$ = new BehaviorSubject<IState>({
    riskClasses: []
  });

  public getBrokerGroupRoutesRiskClasses = (cache: boolean = true) => {
    if (!cache || isEmpty(this.riskClassesState$.getValue().riskClasses)) {
      uiService
        .withUIFeedback(
          apiService.get<{ classes?: IBrokerGroupRoutesResponse[] }>(
            `${API.reference}/references/risk_classes`
          ),
          {
            withToasty: false
          }
        )
        .subscribe(xhr => {
          this.riskClassesState$.next({
            riskClasses: xhr.response.classes || []
          });
        });
    }

    return this.riskClassesState$.asObservable();
  };
}

const brokerGroupRoutesRiskClassesService = new BrokerGroupRoutesRiskClassesService();
export default brokerGroupRoutesRiskClassesService;
