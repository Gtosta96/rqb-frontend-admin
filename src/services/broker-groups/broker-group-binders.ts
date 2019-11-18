import { isEmpty } from 'lodash';
import { Subject } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

import { IBrokerGroupBindersRequest, IBrokerGroupBindersResponse } from '../../interfaces/models/broker-groups';
import { API } from '../../settings/constants';
import apiService, { IResponse } from '../api';
import State from '../state';
import uiService from '../ui';

interface IState {
  brokerGroupBinders: IBrokerGroupBindersResponse[];
}

class BrokerGroupBindersService extends State<IState> {
  private handleBrokerGroupBinder$ = new Subject<IResponse<IBrokerGroupBindersResponse>>();

  constructor() {
    super();

    this.onGetBrokerGroupBinders();
  }

  public getBrokerGroupBinders = (brokerGroupId: number, force: boolean = true) => {
    this.next({ brokerGroupId }, force);
  };

  public listenBrokerGroupBinders = () => {
    return this.handleBrokerGroupBinder$.asObservable();
  };

  public createBrokerGroupBinders = (brokerGroup: IBrokerGroupBindersRequest) => {
    uiService
      .withUIFeedback(
        apiService.post<IBrokerGroupBindersResponse>(
          `${API.brokerGroup}/broker_groups/${brokerGroup.brokerGroupId}/risk_binder`,
          brokerGroup
        )
      )
      .subscribe(response => this.handleBrokerGroupBinder$.next(response));
  };

  public updateBrokerGroupBinders = (brokerGroup: IBrokerGroupBindersRequest) => {
    uiService
      .withUIFeedback(
        apiService.patch<IBrokerGroupBindersResponse>(
          `${API.brokerGroup}/broker_groups/${brokerGroup.brokerGroupId}/risk_binder`,
          brokerGroup
        )
      )
      .subscribe(response => this.handleBrokerGroupBinder$.next(response));
  };

  public deleteBrokerGroupBinder = (
    brokerGroupId: number,
    brokerGroup: IBrokerGroupBindersResponse
  ) => {
    const payload = {
      brokerGroupId,
      binderId: brokerGroup.binderId,
      riskId: brokerGroup.riskId
    };

    uiService
      .withUIFeedback(
        apiService.delete(
          `${API.brokerGroup}/broker_groups/${payload.brokerGroupId}/risk_binder`,
          payload
        )
      )
      .subscribe(response => this.handleBrokerGroupBinder$.next(response));
  };

  private onGetBrokerGroupBinders = () => {
    this.onNext()
      .pipe(
        tap(() => this.setLoadingState(true)),
        switchMap(action =>
          uiService.withSnackbarFeedback(
            apiService.get<{ riskBinders?: IBrokerGroupBindersResponse[] }>(
              `${API.brokerGroup}/broker_groups/${action.brokerGroupId}/risk_binder`
            )
          )
        )
      )
      .subscribe(xhr => {
        this.setState({
          loading: false,
          error: xhr.error,
          empty: isEmpty(xhr.response.riskBinders),
          payload: {
            brokerGroupBinders: xhr.response.riskBinders || []
          }
        });
      });
  };
}

const brokerGroupBindersService = new BrokerGroupBindersService();
export default brokerGroupBindersService;
