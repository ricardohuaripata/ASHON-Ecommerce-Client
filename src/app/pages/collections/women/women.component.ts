import { Component, OnInit } from '@angular/core';
import { ProductsService } from 'src/app/services/products.service';
import { Product } from 'src/app/interfaces/product';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorService } from 'src/app/services/error.service'; // servicio para mostrar mensajes de errores devueltos por el backend
import Swal from 'sweetalert2';

@Component({
  selector: 'app-women',
  templateUrl: './women.component.html',
  styleUrls: ['./women.component.css'],
})
export class WomenComponent {
  products: Product[] = [];
  loading: boolean = false;

  constructor(
    private productService: ProductsService,
    private _errorService: ErrorService
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.productService.getCollectionByGenre('women').subscribe(
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
