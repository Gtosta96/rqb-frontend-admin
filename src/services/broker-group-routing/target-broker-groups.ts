import { BehaviorSubject } from 'rxjs';

import { isEmpty } from '../../helpers/functions';
import { IBrokerGroupRoutesResponse } from '../../interfaces/models/broker-group-routing';
import { API } from '../../settings/constants';
import apiService from '../api';
import uiService from '../ui';

interface ITargetBrokerGroupsState {
  riskClasses: IBrokerGroupRoutesResponse[];
}

class TargetBrokerGroupsService {
  private riskClassesState$ = new BehaviorSubject<ITargetBrokerGroupsState>({
    riskClasses: []
  });

  public getTargetBrokerGroups = (cache: boolean = true) => {
    if (!cache || isEmpty(this.riskClassesState$.getValue().riskClasses)) {
      uiService
        .withUIFeedback(
          apiService.get<{ riskClasses: IBrokerGroupRoutesResponse[] }>(
            `${API.brokerGroup}/broker_groups/routes`
          ),
          {
            withToasty: false
          }
        )
        .subscribe(xhr => {
          this.riskClassesState$.next({
            riskClasses: xhr.response.riskClasses
          });
        });
    }

    return this.riskClassesState$.asObservable();
  };
}

const targetBrokerGroupsService = new TargetBrokerGroupsService();
export default targetBrokerGroupsService;
