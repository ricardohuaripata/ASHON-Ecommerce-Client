import { Injectable } from '@angular/core';
import { AuthConfig, OAuthService } from 'angular-oauth2-oidc';
import { AuthService } from './auth.service';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGoogleService {
  private accessTokenSubject = new BehaviorSubject<string | null>(null);
  accessToken$ = this.accessTokenSubject.asObservable();

  constructor(
    private oauthService: OAuthService,
    private authService: AuthService,
    private router: Router
  ) {
    this.authConfig();
  }

  authConfig() {
    const config: AuthConfig = {
      issuer: 'https://accounts.google.com',
      strictDiscoveryDocumentValidation: false,
      clientId:
        '244633314601-9s97ahkrrge03f8vvjkpk26u2abj5e6m.apps.googleusercontent.com',
      redirectUri: window.location.origin + '/account/social-authentication',
      scope: 'openid profile email',
    };

    this.oauthService.configure(config);
    this.oauthService.setupAutomaticSilentRefresh();
    this.oauthService.loadDiscoveryDocumentAndTryLogin();
  }

  handleAccessToken(accessToken: string) {
    this.accessTokenSubject.next(accessToken);

    this.authService.googleAuth(accessToken).subscribe({
      next: (data: any) => {
        const userData = {
          name: data.user.name,
          username: data.user.username,
          email: data.user.email,
          isEmailVerified: data.user.isEmailVerified,
          address: data.user.address,
          phone: data.user.phone,
        };
        localStorage.setItem('userData', JSON.stringify(userData));
        localStorage.setItem('token', data.tokens.refreshToken);
        this.router.navigate(['/account']);
      },
      error: (error) => {
        this.router.navigate(['/']);
      },
    });
  }

}
