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
export class UserService {
  private serverUrl: string;
  private apiUrl: string;

  constructor(private http: HttpClient) {
    this.serverUrl = environment.serverURL;
    this.apiUrl = 'api/user';
  }

  getUserByAuthToken(): Observable<string> {
    return this.http.get<string>(this.serverUrl + this.apiUrl + '/token/user');
  }

  updateUserDetails(body: any): Observable<string> {
    const headers = new HttpHeaders().set('Accept-Language', 'es');

    return this.http.patch<string>(
      this.serverUrl + this.apiUrl + '/update-details',
      body,
      { headers }
    );
  }

  getUserReviews(id: string): Observable<any> {
    return this.http.get(this.serverUrl + this.apiUrl + '/' + id + '/reviews');
  }

  verifyDiscountCode(discountCode: string): Observable<string> {
    const body = {
      discountCode,
    };
    return this.http.post<string>(this.serverUrl + 'api/discount/verify', body);
  }

  cancelDiscountCode(): Observable<any> {
    return this.http.delete<string>(this.serverUrl + 'api/discount/cancel');
  }

  findDiscountCode(): Observable<any> {
    return this.http.get<string>(this.serverUrl + 'api/discount/find');
  }
}
