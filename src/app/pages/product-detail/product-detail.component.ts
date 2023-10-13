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
import { Cart } from 'src/app/interfaces/cart';
declare const bootstrap: any; // Declarar Bootstrap globalmente

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css'],
})
export class ProductDetailComponent implements OnInit {
  productId!: string;
  product!: Product;
  loading: boolean = false;
  cartLoading: boolean = false;
  selectedSize: string = '';
  selectedColor: string = '';
  disableAddToCartButton = false;
  reviews: any[] = [];
  cart: Cart | null = null;
  products: Product[] = [];
  isAddingToFavorites = false;

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
        this.getProductReviews();
      },
      (error) => {
        this.loading = false;
        this.router.navigate(['/']); // Redirigir al usuario
      }
    );
  }

  getProductReviews(): void {
    this.productsService.getProductReviews(this.productId).subscribe(
      (data: any) => {
        this.reviews = data.reviews;
        this.loading = false;
      },
      (error) => {
        this.loading = false;
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
            const cartSidebar = document.getElementById('cartSidebar');
            const bsOffcanvas = new bootstrap.Offcanvas(cartSidebar);
            bsOffcanvas.show();

            this.getCart();
            this.disableAddToCartButton = false;
          },
          // si se produce algun error en la peticion
          error: () => {
            this.disableAddToCartButton = false;
          },
        });
    } else {
      Swal.fire({
        icon: 'info',
        text: 'Por favor, selecciona talla y color',
        showConfirmButton: false,
        timer: 1500,
        allowOutsideClick: false,
      });
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
      error: (error: HttpErrorResponse) => {
        if (error.status === 400) {
          Swal.fire({
            icon: 'info',
            text: 'Este artículo ya está en tu lista de favoritos',
            showConfirmButton: false,
            timer: 1500,
            allowOutsideClick: false,
          });
        }
        this.isAddingToFavorites = false;
      },
    });
  }

  getStarArray(averageRating: number): number[] {
    const starArray = [];
    for (let i = 1; i <= 5; i++) {
      starArray.push(i <= averageRating ? 100 : 0); // Marcar las estrellas completas y vacías
    }
    return starArray;
  }

  addReview() {
    Swal.fire({
      title: 'Añadir reseña',
      html:
        '  <label>Selecciona el número de estrellas:</label><br>' +
        '  <div class="form-check form-check-inline">' +
        '    <input type="radio" class="form-check-input" id="star1" name="stars" value="1">' +
        '    <label class="form-check-label" for="star1">1</label>' +
        '  </div>' +
        '  <div class="form-check form-check-inline">' +
        '    <input type="radio" class="form-check-input" id="star2" name="stars" value="2">' +
        '    <label class="form-check-label" for="star2">2</label>' +
        '  </div>' +
        '  <div class="form-check form-check-inline">' +
        '    <input type="radio" class="form-check-input" id="star3" name="stars" value="3">' +
        '    <label class="form-check-label" for="star3">3</label>' +
        '  </div>' +
        '  <div class="form-check form-check-inline">' +
        '    <input type="radio" class="form-check-input" id="star4" name="stars" value="4">' +
        '    <label class="form-check-label" for="star4">4</label>' +
        '  </div>' +
        '  <div class="form-check form-check-inline">' +
        '    <input type="radio" class="form-check-input" id="star5" name="stars" value="5">' +
        '    <label class="form-check-label" for="star5">5</label>' +
        '  </div>' +
        '<textarea id="swal-input2" class="form-control mt-3 mb-2 mx-auto custom-textarea-input" placeholder="Escribe aquí tu opinión...">',
      showCancelButton: true,
      confirmButtonText: 'Publicar',
      cancelButtonText: 'Cancelar',
      customClass: {
        cancelButton: 'cancel-button-class',
        confirmButton: 'confirm-button-class',
      },
      allowOutsideClick: false,

      preConfirm: () => {
        const selectedStars = document.querySelector(
          'input[name="stars"]:checked'
        ) as HTMLInputElement;
        const textReview = (
          document.getElementById('swal-input2') as HTMLInputElement
        ).value;

        if (!selectedStars || !textReview) {
          Swal.showValidationMessage(
            'Por favor, selecciona el número de estrellas y escribe tu opinión.'
          );
        } else {
          this.productsService
            .addProductReview(
              this.productId,
              textReview,
              parseInt(selectedStars.value, 10)
            )
            .subscribe({
              // si la peticion ha tenido exito
              next: (data: any) => {
                Swal.fire({
                  icon: 'success',
                  text: 'Tu reseña ha sido publicada',
                  showConfirmButton: false,
                  timer: 1500,
                  allowOutsideClick: false,
                });

                // Recarga la página después de 1.5 segundos
                setTimeout(() => {
                  location.reload();
                }, 1500);
              },
              // si se produce algun error en la peticion
              error: (event: HttpErrorResponse) => {
                this._errorService.msgError(event);
              },
            });
        }
      },
    });
  }

  getCart(): void {
    this.cartLoading = true;
    this.cartService.getCart().subscribe(
      (data: any) => {
        this.cart = data.cart;
        if (this.cart && this.cart.items.length > 0) {
          this.getProducts();
        } else {
          this.cartLoading = false;
        }
      },
      (error) => {
        this.cart = null;
        this.cartLoading = false;
      }
    );
  }

  getProducts(): void {
    const productIds = this.cart?.items.map((item) => item.product) || [];
    this.productsService.getProductsByIds(productIds).subscribe(
      (data: any) => {
        this.products = data.products;
        this.cartLoading = false;
      },
      (error) => {
        this.products = [];
        this.cartLoading = false;
      }
    );
  }

  getProductById(productId: string): Product | undefined {
    return this.products.find((product) => product._id === productId);
  }
}
