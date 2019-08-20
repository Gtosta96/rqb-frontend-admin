import * as rxjs from 'rxjs';

import { IResponseUser } from '../models/User';
import { API } from '../settings/constants';
import apiService from './api';

class UsersService {
  private users$ = new rxjs.BehaviorSubject<IResponseUser[]>([]);

  public getUsers = (cache: boolean = true) => {
    if (cache && this.users$.getValue().length > 0) {
      return this.users$.asObservable();
    }

    apiService.get(`${API.user}/users`).subscribe((users) => {
      this.users$.next(users.users);
    });

    return this.users$.asObservable();
  };
}

const usersService = new UsersService();
export default usersService;
