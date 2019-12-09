import { isEmpty } from 'lodash';
import { Subject } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

import { IUserRequest, IUserResponse } from '../../interfaces/models/user';
import { API } from '../../settings/constants';
import apiService, { IResponse } from '../api';
import State from '../state';
import uiService from '../ui';

/**
 * Users Service.
 *
 * This Service is responsible to handle the main requests and visual feedbacks
 * the Users page has.
 */
class UsersService extends State<IUserResponse[]> {
  private handleUser$ = new Subject<IResponse<IUserResponse>>();

  constructor() {
    super();

    this.onGetUsers();
  }

  // Responsible for getting the users. If the force flag is true, it will invalidate the cache
  public getUsers = (force: boolean = true) => {
    this.next(null, force);
  };

  // Responsible for listen the changes when a user is created/updated to be used in order to update the UI
  // Check out the Users page for a better understanding (src/components/pages/Users)
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

  // Responsible to execute the already filtered request (preventing cache if necessary)
  // and populating the state with the response from the back-end.
  private onGetUsers = () => {
    this.onNext()
      .pipe(
        tap(() => this.setLoadingState(true)),
        switchMap(() =>
          uiService.withSnackbarFeedback(
            apiService.get<{ users?: IUserResponse[] }>(`${API.user}/users`)
          )
        )
      )
      .subscribe(xhr => {
        this.setState({
          loading: false,
          error: xhr.error,
          empty: isEmpty(xhr.response.users),
          payload: xhr.response.users || []
        });
      });
  };
}

const usersService = new UsersService();
export default usersService;
