import { Component, OnInit } from '@angular/core';
import { ProductsService } from 'src/app/services/products.service';
import { Product } from 'src/app/interfaces/product';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorService } from 'src/app/services/error.service'; // servicio para mostrar mensajes de errores devueltos por el backend
import Swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';
import { FavoritesService } from 'src/app/services/favorites.service';

@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.css'],
})
export class SearchPageComponent {
  products: Product[] = [];
  loading: boolean = false;
  searchParam!: string;
  isAddingToFavorites = false;

  constructor(
    private productService: ProductsService,
    private _errorService: ErrorService,
    private route: ActivatedRoute,
    private favoriteService: FavoritesService
  ) {}

  ngOnInit(): void {

    this.route.paramMap.subscribe((params) => {
      this.searchParam = params.get('searchParam') ?? '';
      document.title = `"${this.searchParam}" - ASHON`;
      this.getProducts(this.searchParam);
    });
  }

  getProducts(searchParam: string): void {
    this.loading = true;
    this.productService.getProductsBySearch(searchParam).subscribe(
      (data: any) => {
        this.products = data.products;
        this.loading = false;
      },
      (error) => {
        this.products = [];
        this.loading = false;
      }
    );
  }

  addToFavorites(productId: string): void {

    if (this.isAddingToFavorites) {
      return;
    }
  
    this.isAddingToFavorites = true;

    this.favoriteService.addToFavorites(productId).subscribe({
      // si la peticion ha tenido exito
      next: (data: any) => {
        Swal.fire({
          icon: 'success',
          text: 'Añadido a tu lista de favoritos',
          showConfirmButton: false,
          timer: 1500,
          allowOutsideClick: false,
        });
        this.isAddingToFavorites = false;

      },
      // si se produce algun error en la peticion
      error: (event: HttpErrorResponse) => {
        this._errorService.msgError(event);
        this.isAddingToFavorites = false;

      },
    });
  }

  truncateText(text: string, maxLength: number): string {
    if (text.length > maxLength) {
      return text.substring(0, maxLength - 3) + '...';
    }
    return text;
  }
}
