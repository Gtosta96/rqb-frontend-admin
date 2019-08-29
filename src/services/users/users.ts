import { BehaviorSubject, of } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

import { IUserRequest, IUserResponse } from '../../interfaces/models/user';
import { API } from '../../settings/constants';
import apiService from '../api';
import uiService from '../ui';

interface IUsersState {
  users: IUserResponse[];
  loading: boolean;
  error: boolean;
}

class UsersService {
  private usersState$ = new BehaviorSubject<IUsersState>({
    users: [],
    loading: false,
    error: false
  });

  public getUsers = (cache: boolean = true) => {
    if (!cache || this.usersState$.getValue().users.length === 0) {
      of(true)
        .pipe(
          tap(() =>
            this.usersState$.next({
              ...this.usersState$.getValue(),
              loading: true
            })
          ),
          switchMap(() =>
            uiService.withSnackbarFeedback(
              apiService.get<{ users: IUserResponse[] }>(`${API.user}/users`)
            )
          )
        )
        .subscribe((xhr) => {
          this.usersState$.next({
            ...this.usersState$.getValue(),
            loading: false,
            error: xhr.error,
            users: xhr.response.users || []
          });
        });
    }

    return this.usersState$.asObservable();
  };

  public createUser = (user: IUserRequest) => {
    uiService.withUIFeedback(apiService.post<IUserRequest>(`${API.user}/users`, user)).subscribe();
  };

  public updateUser = (user: IUserRequest) => {
    uiService
      .withUIFeedback(apiService.put<IUserRequest>(`${API.user}/users/${user.appUserId}`, user))
      .subscribe();
  };
}

const usersService = new UsersService();
export default usersService;
