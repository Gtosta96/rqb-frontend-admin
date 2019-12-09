import { BehaviorSubject } from 'rxjs';

import { IDropdownOption } from '../../interfaces/fields';
import { IRoleResponse } from '../../interfaces/models/user';
import { API } from '../../settings/constants';
import apiService from '../api';
import uiService from '../ui';

interface IState {
  roles: IDropdownOption[];
}

class RolesService {
  private rolesState$ = new BehaviorSubject<IState>({
    roles: []
  });

  public getRoles = (cache: boolean = true) => {
    if (!cache || this.rolesState$.getValue().roles.length === 0) {
      uiService
        .withUIFeedback(apiService.get<{ roles?: IRoleResponse[] }>(`${API.user}/roles`), {
          withToast: false
        })
        .subscribe(xhr => {
          this.rolesState$.next({
            roles: (xhr.response.roles || []).map(role => ({
              value: role.roleId,
              label: role.roleName
            }))
          });
        });
    }

    return this.rolesState$.asObservable();
  };
}

const rolesService = new RolesService();
export default rolesService;
