import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from 'src/app/interfaces/product';
import { ErrorService } from 'src/app/services/error.service';
import { ProductsService } from 'src/app/services/products.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-reviews',
  templateUrl: './user-reviews.component.html',
  styleUrls: ['./user-reviews.component.css'],
})
export class UserReviewsComponent {
  userId: string = '';
  reviews: any[] = [];
  products: Product[] = [];
  productIds: string[] = []; // Array para almacenar los IDs de los productos de las reseñas
  loading: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private productsService: ProductsService,
    private router: Router,
    private _errorService: ErrorService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.userService.getUserByAuthToken().subscribe((data: any) => {
      this.userId = data.user._id;

      this.userService.getUserReviews(this.userId).subscribe(
        (data: any) => {
          this.reviews = data.reviews;

          // Extraer los IDs de los productos de las reseñas
          this.productIds = this.reviews.map((review) => review.product);

          // Llamar a una función para obtener la información detallada de los productos
          this.getProductsDetails();
        },
        (error) => {
          this.loading = false;
        }
      );

    });
  }

  getProductsDetails() {
    this.productsService
      .getProductsByIds(this.productIds)
      .subscribe((data: any) => {
        this.products = data.products;
        this.loading = false;
      });
  }

  getProductById(productId: string): Product | undefined {
    return this.products.find((product) => product._id === productId);
  }

  getStarArray(averageRating: number): number[] {
    const starArray = [];
    for (let i = 1; i <= 5; i++) {
      starArray.push(i <= averageRating ? 100 : 0); // Marcar las estrellas completas y vacías
    }
    return starArray;
  }

  editReview(productId: string, reviewId: string) {
    Swal.fire({
      title: 'Editar reseña',
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
            .updateProductReview(
              productId,
              reviewId,
              textReview,
              parseInt(selectedStars.value, 10)
            )
            .subscribe({
              // si la peticion ha tenido exito
              next: (data: any) => {
                location.reload();
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

  deleteReview(productId: string, reviewId: string) {
    Swal.fire({
      title: '¿Deseas eliminar esta reseña?',
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
        this.productsService
          .deleteProductReview(productId, reviewId)
          .subscribe((data: any) => {
            location.reload();
          });
      }
    });
  }
}
