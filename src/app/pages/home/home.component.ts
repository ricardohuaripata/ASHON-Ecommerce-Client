import { Component, OnInit } from '@angular/core';
import { ProductsService } from 'src/app/services/products.service';
import { Product } from 'src/app/interfaces/product';
import { HttpErrorResponse, HttpParams } from '@angular/common/http';
import { ErrorService } from 'src/app/services/error.service'; // servicio para mostrar mensajes de errores devueltos por el backend
import Swal from 'sweetalert2';
import { FavoritesService } from 'src/app/services/favorites.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  menProducts: Product[] = [];
  womenProducts: Product[] = [];
  contentLoaded: boolean = false;
  isAddingToFavorites = false;

  constructor(
    private productService: ProductsService,
    private _errorService: ErrorService,
    private favoriteService: FavoritesService
  ) {}

  ngOnInit(): void {
    // Mostrar 20 producos para hombre más vendidos
    this.productService.getProducts(new HttpParams().set('filter', '{"genre":"men"}').set('limit', '20').set('sort', '-1,sold')).subscribe(
      (data: any) => {
        this.menProducts = data.products;
      },
      (error) => {
        this.menProducts = [];
      }
    );
    // Mostrar 20 producos para mujer más vendidos
    this.productService.getProducts(new HttpParams().set('filter', '{"genre":"women"}').set('limit', '20').set('sort', '-1,sold')).subscribe(
      (data: any) => {
        this.womenProducts = data.products;
        this.contentLoaded = true;
      },
      (error) => {
        this.womenProducts = [];
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
