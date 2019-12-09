import { BehaviorSubject } from 'rxjs';

import { IDropdownOption } from '../../interfaces/fields';
import { API } from '../../settings/constants';
import apiService from '../api';
import uiService from '../ui';

interface IState {
  basicTypes: IDropdownOption[];
}

class BasicTypeService {
  private basicTypesState$ = new BehaviorSubject<IState>({
    basicTypes: []
  });

  public getBasicTypes = (cache: boolean = true) => {
    if (!cache || this.basicTypesState$.getValue().basicTypes.length === 0) {
      uiService
        .withUIFeedback(
          apiService.get<{ basicTypes: string[] }>(`${API.reference}/references/basic_type`),
          {
            withToast: false
          }
        )
        .subscribe(xhr => {
          this.basicTypesState$.next({
            basicTypes: (xhr.response.basicTypes || []).map(basicType => ({
              value: basicType,
              label: basicType
            }))
          });
        });
    }

    return this.basicTypesState$.asObservable();
  };
}

const basicTypesService = new BasicTypeService();
export default basicTypesService;
