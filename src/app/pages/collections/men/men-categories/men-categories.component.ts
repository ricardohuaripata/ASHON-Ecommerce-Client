import { Component, OnInit } from '@angular/core';
import { ProductsService } from 'src/app/services/products.service';
import { Product } from 'src/app/interfaces/product';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorService } from 'src/app/services/error.service'; // servicio para mostrar mensajes de errores devueltos por el backend
import Swal from 'sweetalert2';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-men-categories',
  templateUrl: './men-categories.component.html',
  styleUrls: ['./men-categories.component.css'],
})
export class MenCategoriesComponent {
  categoryName!: string | null;
  products: Product[] = [];
  loading: boolean = false;

  constructor(
    private productService: ProductsService,
    private _errorService: ErrorService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.categoryName = params.get('categoryName');

      // Validar el nombre de la categoría
      if (
        !['tshirts', 'shorts', 'sweatshirts', 'joggers'].includes(
          this.categoryName!
        )
      ) {
        this.router.navigate(['**']); // Redirigir al usuario a PageNotFoundComponent
        return; // Salir del método para evitar la carga de productos no válidos
      }
      this.getMenProductsByCategory(this.categoryName!);
    });
  }

  getMenProductsByCategory(categoryName: string): void {
    this.loading = true;
    this.productService
      .getCollectionByGenreAndCategory('men', categoryName)
      .subscribe(
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
}
