import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from 'src/app/services/products.service';
import { Product } from 'src/app/interfaces/product';
import { CartService } from 'src/app/services/cart.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorService } from 'src/app/services/error.service'; // servicio para mostrar mensajes de errores devueltos por el backend
import { Cart } from 'src/app/interfaces/cart';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css'],
})
export class ShoppingCartComponent implements OnInit {
  cart: Cart | null = null;
  products: Product[] = [];
  loading: boolean = false;
  contentLoaded: boolean = false;
  discountCode: string = '';

  constructor(
    private route: ActivatedRoute,
    private productsService: ProductsService,
    private cartService: CartService,
    private router: Router,
    private _errorService: ErrorService
  ) {}

  ngOnInit(): void {
    this.getCart();
    // Simulación de tiempo de carga
    setTimeout(() => {
      this.contentLoaded = true;
    }, 1500);
  }

  getCart(): void {
    this.loading = true;
    this.cartService.getCart().subscribe(
      (data: any) => {
        this.cart = data.cart;
        if (this.cart && this.cart.items.length > 0) {
          this.getProducts();
        }
        this.loading = false;
      },
      (error) => {
        this.cart = null;
        this.loading = false;
      }
    );
  }

  getProducts(): void {
    const productIds = this.cart?.items.map((item) => item.product) || [];
    this.productsService.getProductsByIds(productIds).subscribe(
      (data: any) => {
        this.products = data.products;
      },
      (error) => {
        this.products = [];
      }
    );
  }

  getProductById(productId: string): Product | undefined {
    return this.products.find((product) => product._id === productId);
  }

  removeFromCart(
    itemId: string,
    selectedColor: string,
    selectedSize: string
  ): void {
    Swal.fire({
      title: '¿Está seguro de eliminar este artículo?',
      showCancelButton: true,
      confirmButtonColor: '#000000',
      cancelButtonColor: '#ffffff',
      confirmButtonText: 'Si',
      cancelButtonText: 'No',
      customClass: {
        cancelButton: 'cancel-button-class',
        confirmButton: 'confirm-button-class',
      },
    }).then((result) => {
      if (result.isConfirmed) {
        if (!this.cart) return;

        this.loading = true;
        this.cartService
          .removeFromCart(itemId, selectedColor, selectedSize)
          .subscribe({
            next: (data: any) => {
              // Item removed successfully, update cart
              this.getCart();
            },
            error: (event: HttpErrorResponse) => {
              this.loading = false;
            },
          });
      }
    });
  }

  clearCart(): void {
    Swal.fire({
      title: '¿Está seguro de vaciar el carrito?',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No',
      customClass: {
        cancelButton: 'cancel-button-class',
        confirmButton: 'confirm-button-class',
      },
    }).then((result) => {
      if (result.isConfirmed) {
        if (!this.cart) return;

        this.loading = true;
        this.cartService.deleteCart().subscribe({
          next: (data: any) => {
            this.getCart();
          },
          error: (event: HttpErrorResponse) => {
            this.loading = false;
          },
        });
      }
    });
  }

  decreaseQuantity(
    itemId: string,
    selectedColor: string,
    selectedSize: string
  ): void {
    this.loading = true;
    this.cartService
      .decreaseQuantity(itemId, selectedColor, selectedSize)
      .subscribe({
        next: (data: any) => {
          this.getCart();
        },
        error: (event: HttpErrorResponse) => {
          this.loading = false;
        },
      });
  }

  increaseQuantity(
    itemId: string,
    selectedColor: string,
    selectedSize: string
  ): void {
    this.loading = true;
    this.cartService
      .increaseQuantity(itemId, selectedColor, selectedSize)
      .subscribe({
        next: (data: any) => {
          this.getCart();
        },
        error: (event: HttpErrorResponse) => {
          this.loading = false;
        },
      });
  }

  applyDiscount(): void {
    if (this.discountCode === 'TESTCODE') {
      Swal.fire({
        icon: 'success',
        title: 'Código de descuento aplicado.',
        showConfirmButton: false,
        timer: 1500,
      });

      // TODO
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Código de descuento inválido.',
        showConfirmButton: false,
        timer: 1500,
      });
    }
  }
}
