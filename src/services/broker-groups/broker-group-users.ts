import { isEmpty } from 'lodash';
import { Subject } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

import { IBrokerGroupUsersRequest, IBrokerGroupUsersResponse } from '../../interfaces/models/broker-groups';
import { API } from '../../settings/constants';
import apiService, { IResponse } from '../api';
import State from '../state';
import uiService from '../ui';

interface IState {
  brokerGroupUsers: IBrokerGroupUsersResponse[];
}

class BrokerGroupUsersService extends State<IState> {
  private handleBrokerGroupUser$ = new Subject<IResponse<IBrokerGroupUsersResponse>>();

  constructor() {
    super();

    this.onGetBrokerGroupUsers();
  }

  public getBrokerGroupUsers = (brokerGroupId: number, force: boolean = true) => {
    this.next({ brokerGroupId }, force);
  };

  public listenBrokerGroupUsers = () => {
    return this.handleBrokerGroupUser$.asObservable();
  };

  public createBrokerGroupUser = (brokerGroup: IBrokerGroupUsersRequest) => {
    uiService
      .withUIFeedback(
        apiService.post<IBrokerGroupUsersResponse>(
          `${API.brokerGroup}/broker_groups/${brokerGroup.brokerGroupId}/users`,
          brokerGroup
        )
      )
      .subscribe(response => this.handleBrokerGroupUser$.next(response));
  };

  public updateBrokerGroupUser = (brokerGroup: IBrokerGroupUsersRequest) => {
    uiService
      .withUIFeedback(
        apiService.patch<IBrokerGroupUsersResponse>(
          `${API.brokerGroup}/broker_groups/${brokerGroup.brokerGroupId}/users/${
            brokerGroup.userId
          }`,
          brokerGroup
        )
      )
      .subscribe(response => this.handleBrokerGroupUser$.next(response));
  };

  public deleteBrokerGroupUser = (
    brokerGroupId: number,
    brokerGroup: IBrokerGroupUsersResponse
  ) => {
    const payload = {
      brokerGroupId,
      userId: brokerGroup.appUserId
    };

    uiService
      .withUIFeedback(
        apiService.delete(
          `${API.brokerGroup}/broker_groups/${payload.brokerGroupId}/users/${payload.userId}`,
          payload
        )
      )
      .subscribe(response => this.handleBrokerGroupUser$.next(response));
  };

  private onGetBrokerGroupUsers = () => {
    this.onNext()
      .pipe(
        tap(() => this.setLoadingState(true)),
        switchMap(action =>
          uiService.withSnackbarFeedback(
            apiService.get<{ users?: IBrokerGroupUsersResponse[] }>(
              `${API.brokerGroup}/broker_groups/${action.brokerGroupId}/users`
            )
          )
        )
      )
      .subscribe(xhr => {
        this.setState({
          loading: false,
          error: xhr.error,
          empty: isEmpty(xhr.response.users),
          payload: {
            brokerGroupUsers: xhr.response.users || []
          }
        });
      });
  };
}

const brokerGroupUsersService = new BrokerGroupUsersService();
export default brokerGroupUsersService;
