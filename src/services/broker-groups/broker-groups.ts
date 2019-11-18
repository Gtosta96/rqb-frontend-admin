import { isEmpty } from 'lodash';
import { Subject } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

import { IBrokerGroupsRequest, IBrokerGroupsResponse } from '../../interfaces/models/broker-groups';
import { API } from '../../settings/constants';
import apiService, { IResponse } from '../api';
import State from '../state';
import uiService from '../ui';

interface IState {
  brokerGroups: IBrokerGroupsResponse[];
}

class BrokerGroupsService extends State<IState> {
  private handleBrokerGroup$ = new Subject<IResponse<IBrokerGroupsResponse>>();

  constructor() {
    super();

    this.onGetBrokerGroups();
  }

  public getBrokerGroups = (force: boolean = true) => {
    this.next(null, force);
  };

  public listenBrokerGroups = () => {
    return this.handleBrokerGroup$.asObservable();
  };

  public createBrokerGroup = (brokerGroup: IBrokerGroupsRequest) => {
    uiService
      .withUIFeedback(
        apiService.post<IBrokerGroupsResponse>(`${API.brokerGroup}/broker_groups`, brokerGroup)
      )
      .subscribe(response => this.handleBrokerGroup$.next(response));
  };

  public updateBrokerGroup = (brokerGroup: IBrokerGroupsRequest) => {
    uiService
      .withUIFeedback(
        apiService.patch<IBrokerGroupsResponse>(
          `${API.brokerGroup}/broker_groups/${brokerGroup.brokerGroupId}`,
          brokerGroup
        )
      )
      .subscribe(response => this.handleBrokerGroup$.next(response));
  };

  private onGetBrokerGroups = () => {
    this.onNext()
      .pipe(
        tap(() => this.setLoadingState(true)),
        switchMap(() =>
          uiService.withSnackbarFeedback(
            apiService.get<{ brokerGroups?: IBrokerGroupsResponse[] }>(
              `${API.brokerGroup}/broker_groups`
            )
          )
        )
      )
      .subscribe(xhr => {
        this.setState({
          loading: false,
          error: xhr.error,
          empty: isEmpty(xhr.response.brokerGroups),
          payload: {
            brokerGroups: xhr.response.brokerGroups || []
          }
        });
      });
  };
}

const brokerGroupsService = new BrokerGroupsService();
export default brokerGroupsService;
