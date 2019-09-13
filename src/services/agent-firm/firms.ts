import { isEmpty } from 'lodash';
import { Subject } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

import { IDropdownOption } from '../../interfaces/fields';
import { IFirmRequest, IFirmResponse } from '../../interfaces/models/agent-firms';
import { API } from '../../settings/constants';
import apiService, { IResponse } from '../api';
import State from '../state';
import uiService from '../ui';

interface IState {
  firms: IFirmResponse[];
  options: IDropdownOption[];
}

class FirmsService extends State<IState> {
  private handleFirm$ = new Subject<IResponse<IFirmResponse>>();

  constructor() {
    super();

    this.onGetFirms();
  }

  public getFirms = (force: boolean = true) => {
    this.next(null, force);
  };

  public listenFirms = () => {
    return this.handleFirm$.asObservable();
  };

  public createFirm = (firm: IFirmRequest) => {
    uiService
      .withUIFeedback(apiService.post<IFirmResponse>(`${API.xpto}/firms`, firm))
      .subscribe(response => this.handleFirm$.next(response));
  };

  public updateFirm = (firm: IFirmRequest) => {
    uiService
      .withUIFeedback(apiService.patch<IFirmResponse>(`${API.xpto}/firms/${firm.firmId}`, firm))
      .subscribe(response => this.handleFirm$.next(response));
  };

  private onGetFirms = () => {
    this.onNext()
      .pipe(
        tap(() => this.setLoadingState(true)),
        switchMap(() =>
          uiService.withSnackbarFeedback(
            apiService.get<{ firms?: IFirmResponse[] }>(`${API.xpto}/firms`)
          )
        )
      )
      .subscribe(xhr => {
        this.setState({
          loading: false,
          error: xhr.error,
          payload: {
            firms: xhr.response.firms || [],
            options: (xhr.response.firms || []).map(firm => ({
              value: firm.firmId,
              label: firm.firmName
            }))
          },
          empty: isEmpty(xhr.response.firms)
        });
      });
  };
}

const firmsService = new FirmsService();
export default firmsService;
