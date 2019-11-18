import { isEmpty } from 'lodash';
import { map, switchMap, tap } from 'rxjs/operators';

import { API } from '../../../settings/constants';
import apiService from '../../api';
import State from '../../state';
import uiService from '../../ui';

interface IState {
  current: string;
  riskClasses: {
    [riskClass: string]: any[];
  };
}

class BrokerGroupRoutesRiskListService extends State<IState> {
  constructor() {
    super();

    this.onGetBrokerGroupRoutesRiskList();
  }

  public getBrokerGroupRoutesRiskList = (rawRiskClass: string, force: boolean = true) => {
    const riskClass = encodeURIComponent(rawRiskClass);

    const state = this.getStateValues();
    if (state && state.payload && state.payload.riskClasses[riskClass]) {
      this.setState({
        ...state,
        payload: { ...state.payload, current: riskClass }
      });
    } else {
      this.next({ riskClass }, force);
    }
  };

  private onGetBrokerGroupRoutesRiskList = () => {
    this.onNext()
      .pipe(
        tap(() => this.setLoadingState(true)),
        switchMap(action => {
          return uiService
            .withSnackbarFeedback(
              apiService.get<{ risks?: any[] }>(
                `${API.reference}/references/risk_list/${action.riskClass}`
              )
            )
            .pipe(map(xhr => ({ riskClass: action.riskClass, xhr })));
        })
      )
      .subscribe(res => {
        const state = this.getStateValues();
        this.setState({
          loading: false,
          error: res.xhr.error,
          empty: isEmpty(res.xhr.response.risks),
          payload: {
            current: res.riskClass,
            riskClasses: {
              ...(state.payload ? state.payload.riskClasses : {}),
              [res.riskClass]: res.xhr.response.risks || []
            }
          }
        });
      });
  };
}

const brokerGroupRoutesRiskListService = new BrokerGroupRoutesRiskListService();
export default brokerGroupRoutesRiskListService;
