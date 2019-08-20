import Auth from '@aws-amplify/auth';
import * as rxjs from 'rxjs';
import { fromFetch } from 'rxjs/fetch';
import * as rxjsOperators from 'rxjs/operators';

import usersMock from './users.mock.json';

class ApiService {
  public get = (url: string, customHeaders?: any) => this.request("GET", url, customHeaders);

  public post = (url: string, body: any, customHeaders?: any) =>
    this.request("POST", url, customHeaders, body);

  public put = (url: string, body: any, customHeaders?: any) =>
    this.request("PUT", url, customHeaders, body);

  public delete = (url: string, customHeaders?: any) => this.request("DELETE", url, customHeaders);

  public mock = (url?: string, body?: any, customHeaders?: any) => rxjs.of(usersMock);

  // ------ //

  private mergeHeaders = (headers = {}) => {
    return rxjs.defer(async () => {
      // https://github.com/aws-amplify/amplify-js/wiki/FAQ
      const { getAccessToken, getIdToken } = await Auth.currentSession();

      return {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getAccessToken().getJwtToken()}`,
        idtoken: getIdToken().getJwtToken(),
        ...headers
      };
    });
  };

  private request = (method: string, url: string, customHeaders: any, body?: any) => {
    return this.mergeHeaders(customHeaders).pipe(
      rxjsOperators.switchMap((headers) =>
        fromFetch(url, { method, body: JSON.stringify(body), headers })
      ),
      rxjsOperators.switchMap((response) => {
        if (response.ok) {
          return response.json();
        }

        // Server is returning a status requiring the client to try something else.
        return rxjs.throwError({ message: `Error ${response.status}` });
      }),
      rxjsOperators.catchError((err) => {
        // Network or other error, handle appropriately
        console.error(err);
        return rxjs.throwError({ error: true, message: err.message });
      })
    );
  };
}

const apiService = new ApiService();
export default apiService;
