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
export class CartService {
  private serverUrl: string;
  private apiUrl: string;

  constructor(private http: HttpClient) {
    // URL del servidor backend
    this.serverUrl = environment.serverURL;
    this.apiUrl = 'api/cart/';
  }

  addToCart(
    productId: string,
    quantity: number,
    selectedColor: string,
    selectedSize: string
  ): Observable<any> {
    // Agrega los parámetros al cuerpo de la solicitud
    const body = {
      productId,
      quantity,
      selectedColor,
      selectedSize,
    };

    // Realiza la solicitud HTTP POST
    return this.http.post(this.serverUrl + this.apiUrl, body);
  }

  getCart(): Observable<any> {
    return this.http.get(this.serverUrl + this.apiUrl);
  }

  removeFromCart(
    productId: string,
    selectedColor: string,
    selectedSize: string
  ): Observable<any> {
    const options = {
      body: {
        selectedColor,
        selectedSize,
      },
    };

    return this.http.delete(this.serverUrl + this.apiUrl + productId, options);
  }

  deleteCart(): Observable<any> {
    return this.http.delete(this.serverUrl + this.apiUrl);
  }

  increaseQuantity(
    productId: string,
    selectedColor: string,
    selectedSize: string
  ): Observable<any> {
    // Agrega los parámetros al cuerpo de la solicitud
    const body = {
      productId,
      selectedColor,
      selectedSize,
    };
    return this.http.patch(this.serverUrl + this.apiUrl + "increase-one", body);
  }

  decreaseQuantity(
    productId: string,
    selectedColor: string,
    selectedSize: string
  ): Observable<any> {
    // Agrega los parámetros al cuerpo de la solicitud
    const body = {
      productId,
      selectedColor,
      selectedSize,
    };
    return this.http.patch(this.serverUrl + this.apiUrl + "reduce-one", body);
  }

}
