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
  contentLoaded: boolean = false;

  constructor(
    private favoriteService: FavoritesService,
    private productsService: ProductsService,
    private _errorService: ErrorService
  ) {}

  ngOnInit(): void {
    this.favoriteService.getFavoritesList().subscribe(
      (data: any) => {
        this.favoriteList = data.favorite.products;
        this.getProducts(this.favoriteList);
      },
      (error) => {
        this.favoriteList = [];
      }
    );
    // Simulación de tiempo de carga
    setTimeout(() => {
      this.contentLoaded = true;
    }, 1000);
  }

  getProducts(favoriteList: string[]): void {
    this.productsService.getProductsByIds(favoriteList).subscribe(
      (data: any) => {
        this.products = data.products;
      },
      (error) => {
        this.products = [];
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
      title: '¿Desea eliminar este artículo de favoritos?',
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
