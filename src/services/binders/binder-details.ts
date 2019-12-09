import { BehaviorSubject } from 'rxjs';

import { IBinderDetailsResponse } from '../../interfaces/models/binders';
import { API } from '../../settings/constants';
import apiService from '../api';
import uiService from '../ui';

interface IState {
  binderDetails: IBinderDetailsResponse | undefined;
}

class BinderDetailsService {
  private binderDetailsState$ = new BehaviorSubject<IState>({
    binderDetails: undefined
  });

  public getBinderDetails = (binderId: number, cache: boolean = true) => {
    uiService
      .withUIFeedback(
        apiService.get<{ binder?: IBinderDetailsResponse }>(`${API.binder}/binders/${binderId}`),
        {
          withToast: false
        }
      )
      .subscribe(xhr => {
        this.binderDetailsState$.next({
          binderDetails: xhr.response.binder
        });
      });

    return this.binderDetailsState$.asObservable();
  };
}

const binderDetailsService = new BinderDetailsService();
export default binderDetailsService;
