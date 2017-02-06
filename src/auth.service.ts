import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { UserManager, Log, MetadataService, User } from 'oidc-client';

@Injectable()
export class AuthService {
  mgr: UserManager;

  constructor(
    private _client_id: string = '',
    private _redirect_uri: string = '',
    private _silent_redirect_uri: string = '',
    private _post_logout_redirect_uri: string = '',
    private _acr_values: string = ''
  ) {

    this.mgr = new UserManager({
      authority: 'http://auth.f1.ethereal.engineering/.well-known/openid-configuration',
      client_id: this._client_id,
      redirect_uri: this._redirect_uri,
      post_logout_redirect_uri: this._post_logout_redirect_uri,
      response_type: 'id_token token',
      scope: 'openid',
      silent_redirect_uri: this._silent_redirect_uri,
      automaticSilentRenew: true,
      acr_values: this._acr_values,
      filterProtocolClaims: true,
      loadUserInfo: true
    });

    this.clearState();
    this.mgr.events.addAccessTokenExpired((e) => {
      this.clearState()
        .then(() => {
          this.silentRefesh();
        })
    });
  }

  clearState(): Promise<void> {
    return this.mgr.clearStaleState();
  }

  getUser(): Observable<User> {
    return Observable.fromPromise( this.mgr.getUser() );
  }

  removeUser(): Observable<void> {
    return Observable.fromPromise( this.mgr.removeUser() );
  }

  login(): Observable<any> {
    return Observable.fromPromise( this.mgr.signinRedirect() );
  }

  loginCallback(): Observable<User> {
    return Observable.fromPromise( this.mgr.signinRedirectCallback() );
  }

  logout(): Observable<any> {
    return Observable.fromPromise( this.mgr.signoutRedirect() );
  };

  logoutCallback(): Observable<any> {
    return Observable.fromPromise( this.mgr.signoutRedirectCallback() );
  };

  silentRefesh(): Observable<any> {
    return Observable.fromPromise( this.mgr.signinSilent() );
  };
}

export function provideAuthService(
    _client_id: string,
    _redirect_uri: string,
    _silent_redirect_uri: string,
    _post_logout_redirect_uri: string,
    _acr_values: string
) {
  return { 
    provide: AuthService, 
    useFactory: () => new AuthService(
      _client_id,
      _redirect_uri,
      _silent_redirect_uri,
      _post_logout_redirect_uri,
      _acr_values
    ) 
  }
}
