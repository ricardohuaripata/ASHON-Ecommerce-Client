import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { User } from '../interfaces/user';
import { environment } from 'src/environments/environment.development';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private serverUrl: string;
  private apiUrl: string;

  constructor(private http: HttpClient) {
    this.serverUrl = environment.serverURL;
    this.apiUrl = 'api/auth';
  }

  login(user: User): Observable<string> {
    const headers = new HttpHeaders().set('Accept-Language', 'es');

    return this.http.post<string>(
      this.serverUrl + this.apiUrl + '/login',
      user,
      { headers }
    );
  }

  validateToken(token: string): Observable<boolean> {
    return this.http
      .post<any>(this.serverUrl + this.apiUrl + '/auth-token', { token })
      .pipe(
        map((response: any) => {
          return response.type === 'Success';
        }),
        catchError((error: HttpErrorResponse) => {
          console.error('Token validation error:', error);
          return throwError('Token validation error');
        })
      );
  }

  register(body: any): Observable<string> {
    const headers = new HttpHeaders().set('Accept-Language', 'es');

    return this.http.post<string>(
      this.serverUrl + this.apiUrl + '/register',
      body,
      { headers }
    );
  }

  logout(refreshToken: string): Observable<string> {
    const body = {
      refreshToken,
    };
    return this.http.post<string>(
      this.serverUrl + this.apiUrl + '/logout',
      body
    );
  }

  changeUserPassword(body: any): Observable<string> {
    const headers = new HttpHeaders().set('Accept-Language', 'es');

    return this.http.patch<string>(
      this.serverUrl + this.apiUrl + '/change-password',
      body,
      { headers }
    );
  }

}
