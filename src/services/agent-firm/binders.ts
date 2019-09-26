import { BehaviorSubject } from 'rxjs';

import { IDropdownOption } from '../../interfaces/fields';
import { IBinderResponse } from '../../interfaces/models/agent-commissions';
import { API } from '../../settings/constants';
import apiService from '../api';
import uiService from '../ui';

interface IState {
  binders: IDropdownOption[];
}

class BindersService {
  private bindersState$ = new BehaviorSubject<IState>({
    binders: []
  });

  public getBinders = (cache: boolean = true) => {
    if (!cache || this.bindersState$.getValue().binders.length === 0) {
      uiService
        .withUIFeedback(apiService.get<{ binders?: IBinderResponse[] }>(`${API.binder}/binders`), {
          withToasty: false
        })
        .subscribe(xhr => {
          this.bindersState$.next({
            binders: (xhr.response.binders || []).map(binder => ({
              value: binder.binderId,
              label: binder.binderUiName
            }))
          });
        });
    }

    return this.bindersState$.asObservable();
  };
}

const bindersService = new BindersService();
export default bindersService;
