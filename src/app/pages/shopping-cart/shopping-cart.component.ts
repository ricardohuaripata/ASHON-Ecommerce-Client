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
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/interfaces/user';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css'],
})
export class ShoppingCartComponent implements OnInit {
  cart: Cart | null = null;
  products: Product[] = [];
  loading: boolean = false;
  discountCode: string = '';
  sending: boolean = false;
  user: User | null = null;
  discount: number = 0;

  constructor(
    private route: ActivatedRoute,
    private productsService: ProductsService,
    private cartService: CartService,
    private router: Router,
    private _errorService: ErrorService,
    private _userService: UserService
  ) {}

  ngOnInit(): void {
    this.loadUser();
    this.getCart();
  }

  getCart(): void {
    this.loading = true;
    this.cartService.getCart().subscribe(
      (data: any) => {
        this.cart = data.cart;
        if (this.cart && this.cart.items.length > 0) {
          this.getProducts();
        } else {
          this.loading = false;
        }
      },
      (error) => {
        this.cart = null;
        this.loading = false;
      }
    );
  }

  loadUser() {
    this._userService.getUserByAuthToken().subscribe((data: any) => {
      this.user = data.user;
      this._userService.findDiscountCode().subscribe(
        (data: any) => {
          this.discount = data.discount;
        },
        (error) => {
          this.discount = 0;
        }
      );
    });
  }

  getProducts(): void {
    const productIds = this.cart?.items.map((item) => item.product) || [];
    this.productsService.getProductsByIds(productIds).subscribe(
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

  getProductById(productId: string): Product | undefined {
    return this.products.find((product) => product._id === productId);
  }

  removeFromCart(
    itemId: string,
    selectedColor: string,
    selectedSize: string
  ): void {
    Swal.fire({
      title: '¿Desea eliminar este artículo?',
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
      title: '¿Desea vaciar el carrito?',
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
    if (this.discountCode) {
      this.sending = true;
      this._userService.verifyDiscountCode(this.discountCode).subscribe({
        next: (data: any) => {
          Swal.fire({
            icon: 'success',
            text: 'Código de descuento aplicado',
            showConfirmButton: false,
            allowOutsideClick: false,
            timer: 1500,
          });
          this.sending = false;
          setTimeout(() => {
            location.reload();
          }, 1500);
        },
        error: (event: HttpErrorResponse) => {
          Swal.fire({
            icon: 'error',
            text: event.error.message,
            showConfirmButton: false,
            allowOutsideClick: false,
            timer: 1500,
          });
          this.sending = false;
        },
      });
    }
  }

  cancelDiscount() {
    Swal.fire({
      title: '¿Estás seguro?',
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
        this._userService.cancelDiscountCode().subscribe({
          next: (data: any) => {
            this.discount = 0;
            location.reload();
          },
          error: (event: HttpErrorResponse) => {
            Swal.fire({
              icon: 'error',
              text: event.error.message,
              showConfirmButton: false,
              allowOutsideClick: false,
              timer: 1500,
            });
          },
        });
      }
    });
  }
}
