import { BehaviorSubject } from 'rxjs';

import { IResponseUser } from '../models/User';
import { API } from '../settings/constants';
import apiService from './api';

class UsersService {
  private users$ = new BehaviorSubject<IResponseUser[]>([]);

  public getUsers = (cache: boolean = true) => {
    if (cache && this.users$.getValue().length > 0) {
      return this.users$.asObservable();
    }

    apiService.get<{ users: IResponseUser[] }>(`${API.user}/users`).subscribe((response) => {
      this.users$.next(response.users);
    });

    return this.users$.asObservable();
  };
}

const usersService = new UsersService();
export default usersService;
