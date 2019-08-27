import { BehaviorSubject, Subject } from 'rxjs';

import { ISnackbarPayload } from '../models/ui';

class UiService {
  private loader$ = new BehaviorSubject<boolean>(false);
  private snackbar$ = new Subject<ISnackbarPayload>();

  public listenLoader = () => {
    return this.loader$.asObservable();
  };

  public startLoader = () => {
    this.loader$.next(true);
  };

  public stopLoader = () => {
    this.loader$.next(false);
  };

  // ----- //

  public listenSnackbar = () => {
    return this.snackbar$.asObservable();
  };

  public enqueueMessage = (payload: ISnackbarPayload) => {
    this.snackbar$.next(payload);
  };
}

const uiService = new UiService();
export default uiService;
