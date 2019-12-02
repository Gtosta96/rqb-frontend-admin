import { isEmpty } from 'lodash';
import { map, switchMap, tap } from 'rxjs/operators';

import { API } from '../../settings/constants';
import apiService from '../api';
import State from '../state';
import uiService from '../ui';

interface IRisk {
  riskList: number[];
  riskListName: string;
}

interface IState {
  riskList: IRisk[];
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

  public getBrokerGroupRoutesRiskList = (rawRiskClass?: string, force: boolean = true) => {
    const riskClass = rawRiskClass ? encodeURIComponent(rawRiskClass) : "";

    const state = this.getStateValues();
    if (riskClass && state && state.payload && state.payload.riskClasses[riskClass]) {
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
              apiService.get<{ risks?: IRisk[] }>(
                `${API.reference}/references/risk_list/${action.riskClass}`
              )
            )
            .pipe(map(xhr => ({ riskClass: action.riskClass, xhr })));
        })
      )
      .subscribe(res => {
        const state = this.getStateValues();

        const payload = res.riskClass
          ? {
              riskList: (state.payload && state.payload.riskList) || [],
              current: res.riskClass as string,
              riskClasses: {
                ...(state.payload ? state.payload.riskClasses : {}),
                [res.riskClass]: res.xhr.response.risks || []
              }
            }
          : {
              riskList: res.xhr.response.risks || [],
              current: (state.payload && state.payload.current) || "",
              riskClasses: (state.payload && state.payload.riskClasses) || {}
            };

        this.setState({
          loading: false,
          error: res.xhr.error,
          empty: isEmpty(res.xhr.response.risks),
          payload
        });
      });
  };
}

const brokerGroupRoutesRiskListService = new BrokerGroupRoutesRiskListService();
export default brokerGroupRoutesRiskListService;
