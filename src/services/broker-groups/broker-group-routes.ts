import { isEmpty } from 'lodash';
import { Subject } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

import { IBrokerGroupRoutesRequest, IBrokerGroupRoutesResponse } from '../../interfaces/models/broker-groups';
import { API } from '../../settings/constants';
import apiService, { IResponse } from '../api';
import State from '../state';
import uiService from '../ui';

interface IState {
  brokerGroupRoutes: IBrokerGroupRoutesResponse[];
}

class BrokerGroupRoutesService extends State<IState> {
  private handleBrokerGroupRoute$ = new Subject<IResponse<IBrokerGroupRoutesResponse>>();

  constructor() {
    super();

    this.onGetBrokerGroupRoutes();
  }

  public getBrokerGroupRoutes = (brokerGroupId: number, force: boolean = true) => {
    this.next({ brokerGroupId }, force);
  };

  public listenBrokerGroupRoutes = () => {
    return this.handleBrokerGroupRoute$.asObservable();
  };

  public createBrokerGroupRoute = (brokerGroup: IBrokerGroupRoutesRequest) => {
    uiService
      .withUIFeedback(
        apiService.post<IBrokerGroupRoutesResponse>(
          `${API.brokerGroup}/broker_groups/${brokerGroup.targetBrokerGroupId}/routes`,
          brokerGroup
        )
      )
      .subscribe(response => this.handleBrokerGroupRoute$.next(response));
  };

  public deleteBrokerGroupRoute = (
    targetBrokerGroupId: number,
    brokerGroup: IBrokerGroupRoutesRequest
  ) => {
    const payload = {
      targetBrokerGroupId,
      targetRiskList: brokerGroup.targetRiskList
    };

    uiService
      .withUIFeedback(
        apiService.delete(`${API.brokerGroup}/broker_groups/${targetBrokerGroupId}/routes`, payload)
      )
      .subscribe(response => this.handleBrokerGroupRoute$.next(response));
  };

  private onGetBrokerGroupRoutes = () => {
    this.onNext()
      .pipe(
        tap(() => this.setLoadingState(true)),
        switchMap(action =>
          uiService.withSnackbarFeedback(
            apiService.get<{ riskClasses?: IBrokerGroupRoutesResponse[] }>(
              `${API.brokerGroup}/broker_groups/${action.brokerGroupId}/routes`
            )
          )
        )
      )
      .subscribe(xhr => {
        this.setState({
          loading: false,
          error: xhr.error,
          empty: isEmpty(xhr.response.riskClasses),
          payload: {
            brokerGroupRoutes: xhr.response.riskClasses || []
          }
        });
      });
  };
}

const brokerGroupRoutesService = new BrokerGroupRoutesService();
export default brokerGroupRoutesService;
