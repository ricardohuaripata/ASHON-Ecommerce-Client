import { Component } from '@angular/core';
import { Product } from 'src/app/interfaces/product';
import { ErrorService } from 'src/app/services/error.service';
import { FavoritesService } from 'src/app/services/favorites.service';
import { ProductsService } from 'src/app/services/products.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-favorites',
  templateUrl: './user-favorites.component.html',
  styleUrls: ['./user-favorites.component.css'],
})
export class UserFavoritesComponent {
  favoriteList: string[] = [];
  products: Product[] = [];
  loading: boolean = false;

  constructor(
    private favoriteService: FavoritesService,
    private productsService: ProductsService,
    private _errorService: ErrorService
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.favoriteService.getFavoritesList().subscribe(
      (data: any) => {
        this.favoriteList = data.favorite.products;
        if(this.favoriteList && this.favoriteList.length > 0) {
          this.getProducts(this.favoriteList);
        } else {
          this.loading = false;

        }
      },
      (error) => {
        this.favoriteList = [];
        this.loading = false;

      }
    );

  }

  getProducts(favoriteList: string[]): void {
    this.productsService.getProductsByIds(favoriteList).subscribe(
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

  truncateText(text: string, maxLength: number): string {
    if (text.length > maxLength) {
      return text.substring(0, maxLength - 3) + '...';
    }
    return text;
  }

  removeFromFavorites(productId: string): void {
    Swal.fire({
      title: '¿Deseas eliminar este artículo de favoritos?',
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No',
      customClass: {
        cancelButton: 'cancel-button-class',
        confirmButton: 'confirm-button-class',
      },
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        this.favoriteService
          .removeFromFavorites(productId)
          .subscribe((data: any) => {
            location.reload();
          });
      }
    });
  }
}
