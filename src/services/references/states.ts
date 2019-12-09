import { BehaviorSubject } from 'rxjs';

import { IDropdownOption } from '../../interfaces/fields';
import { API } from '../../settings/constants';
import apiService from '../api';
import uiService from '../ui';

interface IState {
  states: IDropdownOption[];
}

class StatesService {
  private statesState$ = new BehaviorSubject<IState>({
    states: []
  });

  public getStates = (cache: boolean = true) => {
    if (!cache || this.statesState$.getValue().states.length === 0) {
      uiService
        .withUIFeedback(
          apiService.get<{ states?: Array<{ code: string; name: string }> }>(
            `${API.reference}/references/us_states`
          ),
          {
            withToast: false
          }
        )
        .subscribe(xhr => {
          this.statesState$.next({
            states: (xhr.response.states || []).map(state => ({
              value: state.code,
              label: state.name
            }))
          });
        });
    }

    return this.statesState$.asObservable();
  };
}

const statesService = new StatesService();
export default statesService;
