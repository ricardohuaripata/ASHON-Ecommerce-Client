import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const token = localStorage.getItem('token');

    if (!token) {
      this.router.navigate(['/account/login']);
      return false;
    }

    return this.authService.validateToken(token).pipe(
      map((isValid: boolean) => {
        if (!isValid) {
          this.router.navigate(['/account/login']);
          return false;
        }
        return true;
      }),
      catchError(() => {
        this.router.navigate(['/account/login']);
        return of(false);
      })
    );
  }
}
