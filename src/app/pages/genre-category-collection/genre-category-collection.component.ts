import { Component, OnInit } from '@angular/core';
import { ProductsService } from 'src/app/services/products.service';
import { Product } from 'src/app/interfaces/product';
import { HttpErrorResponse, HttpParams } from '@angular/common/http';
import { ErrorService } from 'src/app/services/error.service'; // servicio para mostrar mensajes de errores devueltos por el backend
import Swal from 'sweetalert2';
import { Router, ActivatedRoute } from '@angular/router';
import { FavoritesService } from 'src/app/services/favorites.service';
import { CategoriesService } from 'src/app/services/categories.service';
import { switchMap } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-genre-category-collection',
  templateUrl: './genre-category-collection.component.html',
  styleUrls: ['./genre-category-collection.component.css'],
})
export class GenreCategoryCollectionComponent implements OnInit {
  products: Product[] = [];
  loading: boolean = false;
  isAddingToFavorites = false;
  genre!: string | null;
  categoryName!: string | null;
  categoryId!: string | null;
  metadata: any;
  selectedLimit: number = 10;
  page: number = 1;
  sort: string = '';
  private routeSubscription!: Subscription;
  private productsSubscription!: Subscription;

  constructor(
    private productService: ProductsService,
    private categoriesService: CategoriesService,
    private _errorService: ErrorService,
    private route: ActivatedRoute,
    private router: Router,
    private favoriteService: FavoritesService
  ) {}

  ngOnInit(): void {
    this.routeSubscription = this.route.paramMap
      .pipe(
        switchMap((params) => {
          this.loading = true;
          this.genre = params.get('genre');
          this.categoryName = params.get('categoryName');
          return this.route.queryParams;
        }),
        switchMap((queryParams) => {
          this.page = queryParams['page'] || 1;
          this.selectedLimit = queryParams['limit'] || 10;
          this.sort = queryParams['sort'] || '';

          return this.categoriesService.getCategoryByName(this.categoryName!);
        })
      )
      .subscribe(
        (data: any) => {
          this.categoryId = data.category._id;

          const customParams = new HttpParams()
            .set(
              'filter',
              `{"genre":"${this.genre}","category":"${this.categoryId}"}`
            )
            .set('page', this.page.toString())
            .set('limit', this.selectedLimit.toString())
            .set('sort', this.sort);

          this.productsSubscription = this.productService
            .getProducts(customParams)
            .subscribe(
              (data: any) => {
                document.title = `${this.genre!.toUpperCase()}'S ${this.categoryName!.toUpperCase()} - ASHON`;
                this.products = data.products;
                this.metadata = data.metadata;
                this.loading = false;
              },
              (error) => {
                this.router.navigate(['/']); // Redirigir al usuario
              }
            );
        },
        (error) => {
          this.router.navigate(['/']);
        }
      );
  }

  ngOnDestroy(): void {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }

    if (this.productsSubscription) {
      this.productsSubscription.unsubscribe();
    }
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

  generatePageArray(totalPages: number): number[] {
    return Array(totalPages)
      .fill(0)
      .map((x, i) => i + 1);
  }
  generatePageLink(page: number): string {
    const currentUrlTree = this.router.createUrlTree([], {
      relativeTo: this.route,
      queryParams: { page: page },
      queryParamsHandling: 'merge',
    });

    return this.router.serializeUrl(currentUrlTree);
  }

  onLimitChange() {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { limit: this.selectedLimit },
      queryParamsHandling: 'merge',
    });
  }

  sortBy(sort: string) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { sort: sort },
      queryParamsHandling: 'merge',
    });
  }
}
