import { Component, OnInit } from '@angular/core';
import { ProductsService } from 'src/app/services/products.service';
import { Product } from 'src/app/interfaces/product';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorService } from 'src/app/services/error.service'; // servicio para mostrar mensajes de errores devueltos por el backend
import Swal from 'sweetalert2';
import { Router, ActivatedRoute } from '@angular/router';
import { FavoritesService } from 'src/app/services/favorites.service';
import { CategoriesService } from 'src/app/services/categories.service';

@Component({
  selector: 'app-genre-category-collection',
  templateUrl: './genre-category-collection.component.html',
  styleUrls: ['./genre-category-collection.component.css'],
})
export class GenreCategoryCollectionComponent {
  products: Product[] = [];
  loading: boolean = false;
  isAddingToFavorites = false;
  genre!: string | null;
  categoryName!: string | null;
  categoryId!: string | null;

  constructor(
    private productService: ProductsService,
    private categoriesService: CategoriesService,
    private _errorService: ErrorService,
    private route: ActivatedRoute,
    private router: Router,
    private favoriteService: FavoritesService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.loading = true;

      this.genre = params.get('genre');
      this.categoryName = params.get('categoryName');

      this.categoriesService.getCategoryByName(this.categoryName!).subscribe(
        (data: any) => {
          this.categoryId = data.category._id;

          this.productService
            .getCollectionByGenreAndCategory(this.genre!, this.categoryId!)
            .subscribe(
              (data: any) => {
                if (data.products && data.products.length > 0) {
                  document.title = `${this.genre!.toUpperCase()} ${this.categoryName!.toUpperCase()} - ASHON`;
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
        },
        (error) => {
          this.router.navigate(['/']); // Redirigir al usuario
        }
      );
    });
  }

  truncateText(text: string, maxLength: number): string {
    if (text.length > maxLength) {
      return text.substring(0, maxLength - 3) + '...';
    }
    return text;
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
}
