import { Component, OnInit } from '@angular/core';
import { ProductsService } from 'src/app/services/products.service';
import { Product } from 'src/app/interfaces/product';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorService } from 'src/app/services/error.service'; // servicio para mostrar mensajes de errores devueltos por el backend
import Swal from 'sweetalert2';
import { FavoritesService } from 'src/app/services/favorites.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-genre-collection',
  templateUrl: './genre-collection.component.html',
  styleUrls: ['./genre-collection.component.css'],
})
export class GenreCollectionComponent {
  products: Product[] = [];
  loading: boolean = false;
  isAddingToFavorites = false;
  genre!: string | null;

  constructor(
    private productService: ProductsService,
    private _errorService: ErrorService,
    private favoriteService: FavoritesService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.loading = true;

      this.genre = params.get('genre');

      this.productService.getCollectionByGenre(this.genre!).subscribe(
        (data: any) => {
          if (data.products && data.products.length > 0) {
            document.title = `${this.genre!.toUpperCase()} COLLECTION - ASHON`;
            this.products = data.products;
            this.loading = false;
          } else {
            this.router.navigate(['/']); // Redirigir al usuario
          }
        },
        (error) => {
          this.router.navigate(['/']); // Redirigir al usuario
        }
      );
    });
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
