// @ts-ignore
import Auth from '@aws-amplify/auth';
import { defer, Observable, of, throwError } from 'rxjs';
import { fromFetch } from 'rxjs/fetch';
import { catchError, switchMap } from 'rxjs/operators';

import usersMock from './users.mock.json';

class ApiService {
  public get = <T = any>(url: string, customHeaders?: any): Observable<T> =>
    this.request<T>("GET", url, customHeaders);

  public post = <T = any>(url: string, body: any, customHeaders?: any): Observable<T> =>
    this.request<T>("POST", url, customHeaders, body);

  public put = <T = any>(url: string, body: any, customHeaders?: any): Observable<T> =>
    this.request<T>("PUT", url, customHeaders, body);

  public delete = <T = any>(url: string, customHeaders?: any): Observable<T> =>
    this.request<T>("DELETE", url, customHeaders);

  public mock = (url?: string, body?: any, customHeaders?: any): Observable<any> => of(usersMock);

  // ------ //

  private mergeHeaders = (headers = {}) => {
    return defer(async () => {
      // https://github.com/aws-amplify/amplify-js/wiki/FAQ

      // @ts-ignore
      const { accessToken, idToken } = await Auth.currentSession();

      return {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken.jwtToken}`,
        idtoken: idToken.jwtToken,
        ...headers
      };
    });
  };

  private request = <T>(
    method: string,
    url: string,
    customHeaders: any,
    body?: any
  ): Observable<T> => {
    return this.mergeHeaders(customHeaders).pipe(
      switchMap((headers) => fromFetch(url, { method, body: JSON.stringify(body), headers })),
      switchMap((response) => {
        if (response.ok) {
          return response.json();
        }

        // Server is returning a status requiring the client to try something else.
        return throwError({ message: `Error ${response.status}` });
      }),
      catchError((err) => {
        // Network or other error, handle appropriately
        console.error(err);
        return throwError({ error: true, message: err.message });
      })
    );
  };
}

const apiService = new ApiService();
export default apiService;
