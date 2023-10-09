import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OAuthService, OAuthSuccessEvent } from 'angular-oauth2-oidc';
import { AuthGoogleService } from 'src/app/services/auth-google.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-social-auth',
  templateUrl: './social-auth.component.html',
  styleUrls: ['./social-auth.component.css'],
})
export class SocialAuthComponent implements OnInit {
  private accessTokenFound: boolean = false;
  constructor(
    private oauthService: OAuthService,
    private authGoogleService: AuthGoogleService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Verificar si el token de acceso está disponible de manera asincrónica
    this.oauthService.events.subscribe((event) => {
      if (event instanceof OAuthSuccessEvent) {
        const accessToken = this.oauthService.getAccessToken();
        if (accessToken) {
          this.accessTokenFound = true;
          this.authGoogleService.handleAccessToken(accessToken);
        }
      }
    });

    setTimeout(() => {
      if (!this.accessTokenFound) {
        this.router.navigate(['/']); // Redirigir aquí si no se encuentra el token
      }
    }, 5000);
  }
}
