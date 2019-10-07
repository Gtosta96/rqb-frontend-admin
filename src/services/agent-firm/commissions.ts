import { isEmpty } from 'lodash';
import { Subject } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

import { IAgentCommissionsRequest, IAgentCommissionsResponse } from '../../interfaces/models/agent-commissions';
import { API } from '../../settings/constants';
import apiService, { IResponse } from '../api';
import State from '../state';
import uiService from '../ui';

interface IPayload {
  firmId: number;
}

class AgentCommissionsService extends State<IAgentCommissionsResponse[]> {
  private handleAgentCommissions$ = new Subject<IResponse<IAgentCommissionsResponse>>();

  constructor() {
    super();

    this.onGetAgentCommissions();
  }

  public getAgentCommissions = (firmId: number, force: boolean = true) => {
    const payload: IPayload = { firmId };
    this.next(payload, force);
  };

  public listenAgentCommissions = () => {
    return this.handleAgentCommissions$.asObservable();
  };

  public createAgentCommission = (commission: IAgentCommissionsRequest) => {
    uiService
      .withUIFeedback(
        apiService.put<IAgentCommissionsResponse>(
          `${API.firm}/firms/${commission.firmId}/agent_commissions`,
          commission
        )
      )
      .subscribe(response => this.handleAgentCommissions$.next(response));
  };

  public updateAgentCommission = (commission: IAgentCommissionsRequest) => {
    const { firmId, ...payload } = commission;

    uiService
      .withUIFeedback(
        apiService.patch<IAgentCommissionsResponse>(
          `${API.firm}/firms/${firmId}/agent_commissions`,
          payload
        )
      )
      .subscribe(response => this.handleAgentCommissions$.next(response));
  };

  public deleteAgentCommission = (firmId: number, commission: IAgentCommissionsResponse) => {
    const payload = {
      riskId: commission.riskId,
      binderId: commission.binderId
    };

    uiService
      .withUIFeedback(apiService.delete(`${API.firm}/firms/${firmId}/agent_commissions`, payload))
      .subscribe(response => this.handleAgentCommissions$.next(response));
  };

  private onGetAgentCommissions = () => {
    this.onNext()
      .pipe(
        tap(() => this.setLoadingState(true)),
        switchMap((action: IPayload) =>
          uiService.withSnackbarFeedback(
            apiService.get<{ agentCommissions?: IAgentCommissionsResponse[] }>(
              `${API.firm}/firms/${action.firmId}/agent_commissions`
            )
          )
        )
      )
      .subscribe(xhr => {
        this.setState({
          loading: false,
          error: xhr.error,
          empty: isEmpty(xhr.response.agentCommissions),
          payload: xhr.response.agentCommissions || []
        });
      });
  };
}

const agentCommissionsService = new AgentCommissionsService();
export default agentCommissionsService;
