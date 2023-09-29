import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from 'src/app/services/products.service';
import { Product } from 'src/app/interfaces/product';
import { CartService } from 'src/app/services/cart.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorService } from 'src/app/services/error.service'; // servicio para mostrar mensajes de errores devueltos por el backend
import { FavoritesService } from 'src/app/services/favorites.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css'],
})
export class ProductDetailComponent implements OnInit {
  productId!: string;
  product!: Product;
  loading: boolean = false;
  selectedSize: string = '';
  selectedColor: string = '';
  disableAddToCartButton = false;

  constructor(
    private route: ActivatedRoute,
    private productsService: ProductsService,
    private cartService: CartService,
    private router: Router,
    private _errorService: ErrorService,
    private favoriteService: FavoritesService
  ) {}

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id') as string;
    this.getProductDetails();
  }

  getProductDetails(): void {
    this.loading = true;
    this.productsService.getProductById(this.productId).subscribe(
      (data: any) => {
        this.product = data.product;
        document.title = `${this.product.name?.toUpperCase()} - ASHON`;
        this.loading = false;
      },
      (error) => {
        this.loading = false;
        this.router.navigate(['/']); // Redirigir al usuario
      }
    );
  }

  addToCart(): void {
    if (this.selectedSize !== '' && this.selectedColor !== '') {
      this.disableAddToCartButton = true;

      this.cartService
        .addToCart(this.product._id, 1, this.selectedColor, this.selectedSize)
        .subscribe({
          // si la peticion ha tenido exito
          next: (data: any) => {
            Swal.fire({
              icon: 'success',
              title: data.message,
              showConfirmButton: false,
              timer: 1500,
            });

            this.disableAddToCartButton = false;
          },
          // si se produce algun error en la peticion
          error: () => {
            this.disableAddToCartButton = false;
          },
        });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Por favor, seleccione talla y color',
        showConfirmButton: false,
        timer: 1500,
        allowOutsideClick: false,
      });
    }
  }

  addToFavorites(productId: string): void {
    this.favoriteService
    .addToFavorites(productId)
    .subscribe({
      // si la peticion ha tenido exito
      next: (data: any) => {
        Swal.fire({
          icon: 'success',
          title: data.message,
          showConfirmButton: false,
          timer: 1500,
        });
      },
      // si se produce algun error en la peticion
      error: (event: HttpErrorResponse) => {
        this._errorService.msgError(event);
      },
    });
  }

}
