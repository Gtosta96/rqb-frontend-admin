import { isEmpty } from 'lodash';
import { Subject } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

import { IDropdownOption } from '../../interfaces/fields';
import { IBinderRequest, IBinderResponse } from '../../interfaces/models/binders';
import { API } from '../../settings/constants';
import apiService, { IResponse } from '../api';
import State from '../state';
import uiService from '../ui';

interface IState {
  binders: IBinderResponse[];
  options: IDropdownOption[];
}

class BindersService extends State<IState> {
  private handleBinder$ = new Subject<IResponse<IBinderResponse>>();

  constructor() {
    super();

    this.onGetBinders();
  }

  public getBinders = (force: boolean = true) => {
    this.next(null, force);
  };

  public listenBinders = () => {
    return this.handleBinder$.asObservable();
  };

  public createBinder = (binder: IBinderRequest) => {
    uiService
      .withUIFeedback(apiService.post<IBinderResponse>(`${API.binder}/binders`, binder))
      .subscribe(response => this.handleBinder$.next(response));
  };

  public updateBinder = (binder: IBinderRequest) => {
    uiService
      .withUIFeedback(
        apiService.patch<IBinderResponse>(`${API.binder}/binders/${binder.binderId}`, binder)
      )
      .subscribe(response => this.handleBinder$.next(response));
  };

  private onGetBinders = () => {
    this.onNext()
      .pipe(
        tap(() => this.setLoadingState(true)),
        switchMap(() =>
          uiService.withSnackbarFeedback(
            apiService.get<{ binders?: IBinderResponse[] }>(`${API.binder}/binders`)
          )
        )
      )
      .subscribe(xhr => {
        this.setState({
          loading: false,
          error: xhr.error,
          empty: isEmpty(xhr.response.binders),
          payload: {
            binders: xhr.response.binders || [],
            options: (xhr.response.binders || []).map(binder => ({
              value: binder.binderId,
              label: binder.binderUiName
            }))
          }
        });
      });
  };
}

const bindersService = new BindersService();
export default bindersService;
