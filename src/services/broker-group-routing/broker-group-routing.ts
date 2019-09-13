import { isEmpty } from 'lodash';
import { Subject } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

import { IBrokerGroupRoutesRequest, IBrokerGroupRoutingResponse } from '../../interfaces/models/broker-group-routing';
import { API } from '../../settings/constants';
import apiService, { IResponse } from '../api';
import State from '../state';
import uiService from '../ui';

class BrokerGroupRoutingService extends State<IBrokerGroupRoutingResponse[]> {
  private handleRoute$ = new Subject<IResponse<IBrokerGroupRoutingResponse>>();

  constructor() {
    super();

    this.onGetRoutes();
  }

  public listenRoute = () => {
    return this.handleRoute$.asObservable();
  };

  public createRoute = (route: IBrokerGroupRoutesRequest) => {
    uiService
      .withUIFeedback(
        apiService.post<IBrokerGroupRoutingResponse>(
          `${API.brokerGroup}/broker_groups/routes`,
          route
        )
      )
      .subscribe(response => this.handleRoute$.next(response));
  };

  public updateRoute = (route: IBrokerGroupRoutesRequest) => {
    uiService
      .withUIFeedback(
        apiService.patch<IBrokerGroupRoutingResponse>(
          `${API.brokerGroup}/broker_groups/routes/${route.appUserId}`,
          route
        )
      )
      .subscribe(response => this.handleRoute$.next(response));
  };

  public deleteRoute = (appUserId: number, route: IBrokerGroupRoutingResponse) => {
    const payload: IBrokerGroupRoutesRequest = {
      appUserId: appUserId,
      riskIdList: route.riskIdList,
      targetBgId: route.bgId
    };

    uiService
      .withUIFeedback(
        apiService.delete(`${API.brokerGroup}/broker_groups/routes/${appUserId}`, payload)
      )
      .subscribe(response => this.handleRoute$.next(response));
  };

  public getRoutes = (appUserId: number) => {
    this.next(appUserId, true);
  };

  private onGetRoutes = () => {
    this.onNext()
      .pipe(
        tap(() => this.setLoadingState(true)),
        switchMap(appUserId =>
          uiService.withSnackbarFeedback(
            apiService.get<{ routes?: IBrokerGroupRoutingResponse[] }>(
              `${API.brokerGroup}/broker_groups/routes/${appUserId}`
            )
          )
        )
      )
      .subscribe(xhr => {
        this.setState({
          loading: false,
          error: xhr.error,
          payload: xhr.response.routes || [],
          empty: isEmpty(xhr.response.routes)
        });
      });
  };
}

const brokerGroupRoutingService = new BrokerGroupRoutingService();
export default brokerGroupRoutingService;
