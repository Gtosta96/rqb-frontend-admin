import { isEmpty } from 'lodash';
import { Subject } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

import { IBrokerageRateRequest, IBrokerageRateResponse } from '../../interfaces/models/brokerage-rate';
import { API } from '../../settings/constants';
import apiService, { IResponse } from '../api';
import State from '../state';
import uiService from '../ui';

interface IPayload {
  binderId: number;
}

class BrokerageRatesService extends State<IBrokerageRateResponse[]> {
  private handleBrokerageRates$ = new Subject<IResponse<IBrokerageRateResponse>>();

  constructor() {
    super();

    this.onGetBrokerageRates();
  }

  public getBrokerageRates = (binderId: number, force: boolean = true) => {
    const payload: IPayload = { binderId };
    this.next(payload, force);
  };

  public listenBrokerageRates = () => {
    return this.handleBrokerageRates$.asObservable();
  };

  public createBrokerageRate = (binderId: number, brokerageRate: IBrokerageRateRequest) => {
    uiService
      .withUIFeedback(
        apiService.post<IBrokerageRateResponse>(
          `${API.binder}/binders/${binderId}/brokerage_rates`,
          brokerageRate
        )
      )
      .subscribe(response => this.handleBrokerageRates$.next(response));
  };

  public updateBrokerageRate = (binderId: number, brokerageRate: IBrokerageRateRequest) => {
    uiService
      .withUIFeedback(
        apiService.patch<IBrokerageRateResponse>(
          `${API.binder}/binders/${binderId}/brokerage_rates`,
          brokerageRate
        )
      )
      .subscribe(response => this.handleBrokerageRates$.next(response));
  };

  public deleteBrokerageRate = (binderId: number, brokerageRate: IBrokerageRateRequest) => {
    const payload = {
      binderId,
      riskId: brokerageRate.riskId
    };

    uiService
      .withUIFeedback(
        apiService.delete(`${API.binder}/binders/${binderId}/brokerage_rates`, payload)
      )
      .subscribe(response => this.handleBrokerageRates$.next(response));
  };

  private onGetBrokerageRates = () => {
    this.onNext()
      .pipe(
        tap(() => this.setLoadingState(true)),
        switchMap((action: IPayload) =>
          uiService.withSnackbarFeedback(
            apiService.get<{ brokerageRates?: IBrokerageRateResponse[] }>(
              `${API.binder}/binders/${action.binderId}/brokerage_rates`
            )
          )
        )
      )
      .subscribe(xhr => {
        this.setState({
          loading: false,
          error: xhr.error,
          empty: isEmpty(xhr.response.brokerageRates),
          payload: xhr.response.brokerageRates || []
        });
      });
  };
}

const brokerageRatesService = new BrokerageRatesService();
export default brokerageRatesService;
