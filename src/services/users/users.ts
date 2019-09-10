import { Subject } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

import { isEmpty } from '../../helpers/functions';
import { IUserRequest, IUserResponse } from '../../interfaces/models/user';
import { API } from '../../settings/constants';
import apiService, { IResponse } from '../api';
import State from '../state';
import uiService from '../ui';

class UsersService extends State<IUserResponse[]> {
  private handleUser$ = new Subject<IResponse<IUserResponse>>();

  constructor() {
    super();

    this.onGetUsers();
  }

  public getUsers = (force: boolean) => {
    this.next(null, force);
  };

  public listenUser = () => {
    return this.handleUser$.asObservable();
  };

  public createUser = (user: IUserRequest) => {
    uiService
      .withUIFeedback(apiService.post<IUserResponse>(`${API.user}/users`, user))
      .subscribe(response => this.handleUser$.next(response));
  };

  public updateUser = (user: IUserRequest) => {
    uiService
      .withUIFeedback(apiService.put<IUserResponse>(`${API.user}/users/${user.appUserId}`, user))
      .subscribe(response => this.handleUser$.next(response));
  };

  private onGetUsers = () => {
    this.onNext()
      .pipe(
        tap(() => this.setLoadingState(true)),
        switchMap(() =>
          uiService.withSnackbarFeedback(
            apiService.get<{ users: IUserResponse[] }>(`${API.user}/users`)
          )
        )
      )
      .subscribe(xhr => {
        this.setState({
          loading: false,
          error: xhr.error,
          payload: xhr.response.users || [],
          empty: isEmpty(xhr.response.users)
        });
      });
  };
}

const usersService = new UsersService();
export default usersService;
