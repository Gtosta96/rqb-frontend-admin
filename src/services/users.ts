import { BehaviorSubject, of } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';

import { IFirmResponse, IRoleResponse, IUserRequest, IUserResponse } from '../models/User';
import { API } from '../settings/constants';
import apiService from './api';
import uiService from './ui';

interface IUsersState {
  users: IUserResponse[];
  loading: boolean;
  firms: {
    firms: Array<{ value: number; label: string }>;
    loading: boolean;
  };
  roles: {
    roles: Array<{ value: number; label: string }>;
    loading: boolean;
  };
}

class UsersService {
  private usersState$ = new BehaviorSubject<IUsersState>({
    users: [],
    loading: false,
    firms: {
      firms: [],
      loading: false
    },
    roles: {
      roles: [],
      loading: false
    }
  });

  public getUsers = (cache: boolean = true) => {
    if (!cache || this.usersState$.getValue().users.length === 0) {
      apiService.get<{ users: IUserResponse[] }>(`${API.user}/users`).subscribe((xhr) => {
        this.usersState$.next({
          ...this.usersState$.getValue(),
          users: xhr.response.users
        });
      });
    }

    return this.usersState$.asObservable();
  };

  public createUser = (user: IUserRequest) => {
    of(true)
      .pipe(
        tap(() => uiService.startLoader()),
        switchMap(() => apiService.post<IUserRequest>(`${API.user}/users`, user))
      )
      .subscribe((response) => {
        uiService.stopLoader();

        if (!response.message) {
          return;
        }

        if (response.error) {
          uiService.enqueueMessage({ variant: "error", message: response.message });
        } else {
          uiService.enqueueMessage({ variant: "success", message: response.message });
        }
      });
  };

  public updateUser = (user: IUserRequest) => {
    of(true)
      .pipe(
        tap(() => uiService.startLoader()),
        switchMap(() => apiService.put<IUserRequest>(`${API.user}/users/${user.appUserId}`, user))
      )
      .subscribe((response) => {
        uiService.stopLoader();

        if (!response.message) {
          return;
        }

        if (response.error) {
          uiService.enqueueMessage({ variant: "error", message: response.message });
        } else {
          uiService.enqueueMessage({ variant: "success", message: response.message });
        }
      });
  };

  public getFirms = (cache: boolean = true) => {
    if (!cache || this.usersState$.getValue().firms.firms.length === 0) {
      apiService.get<{ firms: IFirmResponse[] }>(`${API.xpto}/firms`).subscribe((xhr) => {
        const prevState = this.usersState$.getValue();

        this.usersState$.next({
          ...prevState,
          firms: {
            ...prevState.firms,
            firms: xhr.response.firms.map((firm) => ({
              value: firm.firmId,
              label: firm.agentFirm
            }))
          }
        });
      });
    }

    return this.usersState$.asObservable().pipe(map((usersState) => usersState.firms));
  };

  public getRoles = (cache: boolean = true) => {
    if (!cache || this.usersState$.getValue().roles.roles.length === 0) {
      apiService.get<{ roles: IRoleResponse[] }>(`${API.user}/roles`).subscribe((xhr) => {
        const prevState = this.usersState$.getValue();

        this.usersState$.next({
          ...prevState,
          roles: {
            ...prevState.roles,
            roles: xhr.response.roles.map((role) => ({
              value: role.roleId,
              label: role.roleName
            }))
          }
        });
      });
    }

    return this.usersState$.asObservable().pipe(map((usersState) => usersState.roles));
  };
}

const usersService = new UsersService();
export default usersService;
