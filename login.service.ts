import {Injectable} from '@angular/core';
import {Headers, Http, Response, RequestOptionsArgs} from '@angular/http';
import {AuthHttp} from 'angular2-jwt';

import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import {LoginRequest} from './models/LoginRequest';
import {environment} from 'environments/environment';
import {CommonResponse} from 'app/core/api/CommonResponse';


export class TokenResponse {
  token: string;
}


/**
 * Login service.
 * Use for calling authentication API.
 */
@Injectable()
export class LoginService {
  constructor(private http: Http,
              private authHttp: AuthHttp
  ) {

  }

  /**
   * Obtain token using credentials (loginData)
   *
   * @param loginData - must be pair phone+password or email+password
   * @returns {Observable<R|T>}
   */
  login(loginData: LoginRequest): Observable<TokenResponse> {
    const body = JSON.stringify(loginData);
    const options: RequestOptionsArgs = <RequestOptionsArgs>{};
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    options.headers = headers;

    return this.http.post(environment.server + '/api-token-auth/', body, options)
      .map((r: Response) => r.json() as TokenResponse)
      .catch(this.handleObservableError);
  }

  /**
   * Obtain temporary authentication token
   * @returns {Observable<R|T>}
   */
  temporaryLogin(): Observable<TokenResponse> {
    const body = JSON.stringify({});
    const options: RequestOptionsArgs = <RequestOptionsArgs>{};
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    options.headers = headers;

    return this.http.post(environment.server + '/lazy-user-token/', body, options)
      .map((r: Response) => r.json() as TokenResponse)
      .catch(this.handleObservableError);
  }

  /**
   * Authenticate using Facebook oauth token
   *
   * @param token
   * @returns {Observable<R|T>}
   */
  socialLogin(token: string): Observable<TokenResponse> {
    const options: RequestOptionsArgs = <RequestOptionsArgs>{};
    options.headers = new Headers();
    options.headers.append('Content-Type', 'application/json');
    options.headers.append('Authorization', `Bearer facebook ${token}`);

    return this.http.post(environment.server + '/social-token-auth/', '', options)
      .map((r: Response) => r.json() as TokenResponse)
      .catch(this.handleObservableError);
  }

  getLoginStatus(): Observable<CommonResponse> {
    const options: RequestOptionsArgs = <RequestOptionsArgs>{};

    return this.authHttp.get(environment.server + '/status', options)
      .map((r: Response) => r.json() as CommonResponse)
      .catch(this.handleObservableError);
  }

  handleObservableError(error: any) {
    return Observable.throw(error.json().error || error.json());
  }
}
