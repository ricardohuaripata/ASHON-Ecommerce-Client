import { Component, OnInit } from '@angular/core';
import { ProductsService } from 'src/app/services/products.service';
import { Product } from 'src/app/interfaces/product';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorService } from 'src/app/services/error.service'; // servicio para mostrar mensajes de errores devueltos por el backend
import Swal from 'sweetalert2';
import { Router, ActivatedRoute } from '@angular/router';
import { FavoritesService } from 'src/app/services/favorites.service';

@Component({
  selector: 'app-women-categories',
  templateUrl: './women-categories.component.html',
  styleUrls: ['./women-categories.component.css'],
})
export class WomenCategoriesComponent {
  categoryName!: string | null;
  products: Product[] = [];
  loading: boolean = false;

  constructor(
    private productService: ProductsService,
    private _errorService: ErrorService,
    private route: ActivatedRoute,
    private router: Router,
    private favoriteService: FavoritesService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.categoryName = params.get('categoryName');
      document.title = `${this.categoryName?.toUpperCase()} - ASHON`;

      // Validar el nombre de la categoría
      if (
        !['tshirts', 'shorts', 'sweatshirts', 'joggers'].includes(
          this.categoryName!
        )
      ) {
        this.router.navigate(['/']); // Redirigir al usuario
        return; // Salir del método para evitar la carga de productos no válidos
      }
      this.getMenProductsByCategory(this.categoryName!);
    });
  }

  getMenProductsByCategory(categoryName: string): void {
    this.loading = true;
    this.productService
      .getCollectionByGenreAndCategory('women', categoryName)
      .subscribe(
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
    this.favoriteService.addToFavorites(productId).subscribe({
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
