import { Component, OnInit } from '@angular/core';
import { ProductsService } from 'src/app/services/products.service';
import { Product } from 'src/app/interfaces/product';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorService } from 'src/app/services/error.service'; // servicio para mostrar mensajes de errores devueltos por el backend
import Swal from 'sweetalert2';
import { FavoritesService } from 'src/app/services/favorites.service';

@Component({
  selector: 'app-men',
  templateUrl: './men.component.html',
  styleUrls: ['./men.component.css'],
})
export class MenComponent {
  products: Product[] = [];
  loading: boolean = false;

  constructor(
    private productService: ProductsService,
    private _errorService: ErrorService,
    private favoriteService: FavoritesService
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.productService.getCollectionByGenre('men').subscribe(
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
    this.favoriteService
    .addToFavorites(productId)
    .subscribe({
      // si la peticion ha tenido exito
      next: (data: any) => {
        Swal.fire({
          icon: 'success',
          title: 'Añadido a tu lista de favoritos',
          showConfirmButton: false,
          timer: 1500,
          allowOutsideClick: false,
        });
      },
      // si se produce algun error en la peticion
      error: (event: HttpErrorResponse) => {
        this._errorService.msgError(event);
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
