// @ts-ignore
import { defer, Observable, of } from 'rxjs';
import { fromFetch } from 'rxjs/fetch';
import { catchError, switchMap } from 'rxjs/operators';

import sessionService from './session';

export interface IResponse<T> {
  response: T;
  error: boolean;
  message: string;
}

class ApiService {
  public get = <T = any>(url: string, customHeaders?: any) =>
    this.request<T>("GET", url, customHeaders);

  public post = <T = any>(url: string, body: any, customHeaders?: any) =>
    this.request<T>("POST", url, customHeaders, body);

  public put = <T = any>(url: string, body: any, customHeaders?: any) =>
    this.request<T>("PUT", url, customHeaders, body);

  public delete = <T = any>(url: string, customHeaders?: any) =>
    this.request<T>("DELETE", url, customHeaders);

  public mock = (url?: string, body?: any, customHeaders?: any): Observable<any> => of({});

  // ------ //

  private mergeHeaders = (headers = {}) => {
    return defer(async () => {
      // https://github.com/aws-amplify/amplify-js/wiki/FAQ

      try {
        // @ts-ignore
        const { accessToken, idToken } = await sessionService.currentSession();

        return {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken.jwtToken}`,
          idtoken: idToken.jwtToken,
          ...headers
        };
      } catch (e) {
        console.error("ERROR WHILE GETTING USER INFO", e);
      }
    });
  };

  private request = <T>(
    method: string,
    url: string,
    customHeaders: any,
    body?: any
  ): Observable<IResponse<T>> => {
    return this.mergeHeaders(customHeaders).pipe(
      switchMap((headers) => fromFetch(url, { method, body: JSON.stringify(body), headers })),
      switchMap((xhr) => defer(() => xhr.json()).pipe(switchMap((json) => of({ xhr, json })))),
      switchMap(({ xhr, json }) => {
        const error = !xhr.ok;
        const message = json.message || (error ? "NOK" : "OK") + " - " + xhr.status;
        const response = json as T;

        return of({ error, message, response });
      }),
      catchError((err) => {
        // Network or other error, handle appropriately
        console.error(err);
        return of({ error: true, message: err, response: {} as T });
      })
    );
  };
}

const apiService = new ApiService();
export default apiService;
