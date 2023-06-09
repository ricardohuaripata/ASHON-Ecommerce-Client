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
  providedIn: 'root',
})
export class ProductsService {
  private serverUrl: string;
  private apiUrl: string;

  constructor(private http: HttpClient) {
    // URL del servidor backend
    this.serverUrl = environment.serverURL;
    this.apiUrl = 'api/product/';
  }

  getAllProducts(): Observable<any> {
    const params = new HttpParams().set('select', 'name, description, price, priceAfterDiscount, mainImage');
    return this.http.get<any>(this.serverUrl + this.apiUrl, { params }); 
  }

  getCollectionByGenre(genre: string): Observable<any> {
    return this.http.get<any>(this.serverUrl + this.apiUrl + "genre/" + genre);  
  }

  getCollectionByGenreAndCategory(genre: string, categoryName: string): Observable<any> {
    return this.http.get<any>(this.serverUrl + this.apiUrl + "genre/" + genre + "/" + categoryName);  
  }

  getProductById(productId: string): Observable<any> {
    return this.http.get<any>(this.serverUrl + this.apiUrl + productId);  
  }

  getProductsByIds(productIds: string[]): Observable<any> {
    const body = { productIds };
    return this.http.post<any>(this.serverUrl + this.apiUrl + "ids", body);
  }

  getProductsBySearch(searchParam: string): Observable<any> {
    const body = { searchParam };
    return this.http.post<any>(this.serverUrl + this.apiUrl + "search", body);
  }

}
