import { isEmpty } from 'lodash';
import { Subject } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

import { IBinderAuthorityResponse } from '../../interfaces/models/binder-authority';
import { IBinderRequest } from '../../interfaces/models/binders';
import { API } from '../../settings/constants';
import apiService, { IResponse } from '../api';
import State from '../state';
import uiService from '../ui';

interface IPayload {
  binderId: number;
}

class BinderAuthorityService extends State<IBinderAuthorityResponse[]> {
  private handleBinderAuthorities$ = new Subject<IResponse<IBinderAuthorityResponse>>();

  constructor() {
    super();

    this.onGetBinderAuthorities();
  }

  public getBinderAuthorities = (binderId: number, force: boolean = true) => {
    const payload: IPayload = { binderId };
    this.next(payload, force);
  };

  public listenBinderAuthorities = () => {
    return this.handleBinderAuthorities$.asObservable();
  };

  public createBinderAuthority = (binderId: number, binder: IBinderRequest) => {
    uiService
      .withUIFeedback(
        apiService.post<IBinderAuthorityResponse>(
          `${API.binder}/binders/${binderId}/authorised_persons`,
          binder
        )
      )
      .subscribe(response => this.handleBinderAuthorities$.next(response));
  };

  public updateBinderAuthority = (binderId: number, binder: IBinderRequest) => {
    uiService
      .withUIFeedback(
        apiService.patch<IBinderAuthorityResponse>(
          `${API.binder}/binders/${binderId}/authorised_persons`,
          binder
        )
      )
      .subscribe(response => this.handleBinderAuthorities$.next(response));
  };

  public deleteBinderAuthority = (binderId: number, binder: IBinderRequest) => {
    const payload = {
      binderId,
      appUserId: binder.appUserId
    };

    uiService
      .withUIFeedback(
        apiService.delete(`${API.binder}/binders/${binderId}/authorised_persons`, payload)
      )
      .subscribe(response => this.handleBinderAuthorities$.next(response));
  };

  private onGetBinderAuthorities = () => {
    this.onNext()
      .pipe(
        tap(() => this.setLoadingState(true)),
        switchMap((action: IPayload) =>
          uiService.withSnackbarFeedback(
            apiService.get<{ persons?: IBinderAuthorityResponse[] }>(
              `${API.binder}/binders/${action.binderId}/authorised_persons`
            )
          )
        )
      )
      .subscribe(xhr => {
        this.setState({
          loading: false,
          error: xhr.error,
          empty: isEmpty(xhr.response.persons),
          payload: xhr.response.persons || []
        });
      });
  };
}

const binderAuthorityService = new BinderAuthorityService();
export default binderAuthorityService;
