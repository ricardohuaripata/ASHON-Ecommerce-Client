import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  HttpClient,
  HttpHeaderResponse,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';

import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private serverUrl: string;
  private apiUrl: string;

  constructor(private http: HttpClient) {
    // URL del servidor backend
    this.serverUrl = environment.serverURL;
    this.apiUrl = 'api/order/';
  }

  createOrder(body: any): Observable<any> {
    const headers = new HttpHeaders().set('Accept-Language', 'es');
    // Realiza la solicitud HTTP POST
    return this.http.post(this.serverUrl + this.apiUrl, body, { headers });
  }

  getUserOrders(): Observable<any> {
    return this.http.get(this.serverUrl + this.apiUrl);
  }

  getUserOrderById(orderId: string): Observable<any> {
    return this.http.get(this.serverUrl + this.apiUrl + orderId);
  }

}
