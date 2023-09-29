import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../interfaces/product';
import {
  HttpClient,
  HttpHeaderResponse,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private serverUrl: string;
  private apiUrl: string;

  constructor(private http: HttpClient) {
    // URL del servidor backend
    this.serverUrl = environment.serverURL;
    this.apiUrl = 'api/favorite/';
  }

  addToFavorites(productId: string) {
    const body = {
      productId,
    };
    return this.http.post(this.serverUrl + this.apiUrl, body);

  }

  getFavoritesList(): Observable<any> {
    return this.http.get<any>(this.serverUrl + this.apiUrl); 
  }

  removeFromFavorites(id: string) {
    return this.http.delete<string>(
      this.serverUrl + this.apiUrl + id
    );
  }
}
