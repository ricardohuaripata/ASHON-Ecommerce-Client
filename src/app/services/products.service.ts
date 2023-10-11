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
    const params = new HttpParams().set(
      'select',
      'name, description, price, priceAfterDiscount, mainImage'
    );
    return this.http.get<any>(this.serverUrl + this.apiUrl, { params });
  }

  getCollectionByGenre(genre: string): Observable<any> {
    const params = new HttpParams().set('filter', '{"genre":"' + genre + '"}');
    return this.http.get<any>(this.serverUrl + this.apiUrl, { params });
  }

  getCollectionByGenreAndCategory(
    genre: string,
    categoryId: string
  ): Observable<any> {
    const params = new HttpParams().set(
      'filter',
      '{"genre":"' + genre + '","category":"' + categoryId + '"}'
    );
    return this.http.get<any>(this.serverUrl + this.apiUrl, { params });
  }

  getProductById(productId: string): Observable<any> {
    return this.http.get<any>(this.serverUrl + this.apiUrl + productId);
  }

  getProductsByIds(productIds: string[]): Observable<any> {
    const body = { productIds };
    return this.http.post<any>(this.serverUrl + this.apiUrl + 'ids', body);
  }

  getProductsBySearch(searchParam: string): Observable<any> {
    const body = { searchParam };
    return this.http.post<any>(this.serverUrl + this.apiUrl + 'search', body);
  }

  getProductReviews(id: string): Observable<any> {
    return this.http.get(this.serverUrl + this.apiUrl + id + '/reviews');
  }

  addProductReview(
    id: string,
    review: string,
    rating: number
  ): Observable<any> {
    const body = { review, rating };
    return this.http.post(this.serverUrl + this.apiUrl + id + '/reviews', body);
  }

  deleteProductReview(productId: string, reviewId: string): Observable<any> {
    return this.http.delete(
      this.serverUrl + this.apiUrl + productId + '/reviews/' + reviewId
    );
  }

  updateProductReview(
    productId: string,
    reviewId: string,
    review: string,
    rating: number
  ): Observable<any> {
    const body = { review, rating };

    return this.http.patch(
      this.serverUrl + this.apiUrl + productId + '/reviews/' + reviewId,
      body
    );
  }
}
