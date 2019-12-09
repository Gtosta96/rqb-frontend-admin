import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';

import { ISnackbarPayload } from '../interfaces/ui';
import { IResponse } from './api';

/**
 * UI Service.
 *
 * Responsible for handling the global UI updates, such as Loader and Snackbar.
 */
class UiService {
  private loader$ = new BehaviorSubject<number>(0);
  private snackbar$ = new Subject<ISnackbarPayload>();

  public listenLoader = () => {
    return this.loader$.asObservable().pipe(map(buffer => buffer > 0));
  };

  public startLoader = () => {
    this.loader$.next(this.loader$.getValue() + 1);
  };

  public stopLoader = () => {
    this.loader$.next(this.loader$.getValue() - 1);
  };

  // ----- //

  public listenSnackbar = () => {
    return this.snackbar$.asObservable();
  };

  public enqueueMessage = (payload: ISnackbarPayload) => {
    this.snackbar$.next(payload);
  };

  // ----- //

  public withSnackbarFeedback = <T = any>(
    action: Observable<IResponse<T>>,
    opts: { withToast?: boolean } = {}
  ) => {
    return action.pipe(
      tap(response => {
        if (response.error) {
          uiService.enqueueMessage({ variant: "error", message: response.message });
        } else if (opts.withToast) {
          uiService.enqueueMessage({ variant: "success", message: response.message });
        }
      })
    );
  };

  public withUIFeedback = <T = any>(
    action: Observable<IResponse<T>>,
    opts: { withLoader?: boolean; withToast?: boolean } = {}
  ) => {
    const options = { withLoader: true, withToast: true, ...opts };

    return of(true).pipe(
      tap(() => options.withLoader && this.startLoader()),
      switchMap(() => action),
      tap(() => {
        if (options.withLoader) {
          this.stopLoader();
        }
      }),
      switchMap(response => this.withSnackbarFeedback(of(response), options))
    );
  };
}

const uiService = new UiService();
export default uiService;
