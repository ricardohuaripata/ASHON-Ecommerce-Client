import { Component, OnDestroy, OnInit } from '@angular/core';
import { ProductsService } from 'src/app/services/products.service';
import { Product } from 'src/app/interfaces/product';
import { HttpErrorResponse, HttpParams } from '@angular/common/http';
import { ErrorService } from 'src/app/services/error.service'; // servicio para mostrar mensajes de errores devueltos por el backend
import Swal from 'sweetalert2';
import { FavoritesService } from 'src/app/services/favorites.service';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-genre-collection',
  templateUrl: './genre-collection.component.html',
  styleUrls: ['./genre-collection.component.css'],
})
export class GenreCollectionComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  loading: boolean = false;
  isAddingToFavorites = false;
  genre!: string | null;
  metadata: any;
  selectedLimit: number = 10;
  private routeSubscription!: Subscription;

  constructor(
    private productService: ProductsService,
    private _errorService: ErrorService,
    private favoriteService: FavoritesService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.routeSubscription = this.route.paramMap
      .pipe(
        switchMap((params) => {
          this.loading = true;
          this.genre = params.get('genre');
          return this.route.queryParams;
        }),
        switchMap((queryParams) => {
          const page = queryParams['page'] || 1;
          this.selectedLimit = queryParams['limit'] || 10;
          const sort = queryParams['sort'] || 0;
          const customParams = new HttpParams()
            .set('filter', `{"genre":"${this.genre}"}`)
            .set('page', page.toString())
            .set('limit', this.selectedLimit.toString())
            .set('sort', sort.toString());
          return this.productService.getProducts(customParams);
        })
      )
      .subscribe(
        (data: any) => {
          document.title = `${this.genre!.toUpperCase()}'S COLLECTION - ASHON`;
          this.products = data.products;
          this.metadata = data.metadata;
          this.loading = false;
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
