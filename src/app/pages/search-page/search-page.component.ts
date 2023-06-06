import { Component, OnInit } from '@angular/core';
import { ProductsService } from 'src/app/services/products.service';
import { Product } from 'src/app/interfaces/product';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorService } from 'src/app/services/error.service'; // servicio para mostrar mensajes de errores devueltos por el backend
import Swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.css'],
})
export class SearchPageComponent {
  products: Product[] = [];
  loading: boolean = false;
  searchParam!: string;

  constructor(
    private productService: ProductsService,
    private _errorService: ErrorService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loading = true;

    this.route.paramMap.subscribe((params) => {
      this.searchParam = params.get('searchParam') ?? '';
      this.getProducts(this.searchParam);
    });
  }

  getProducts(searchParam: string): void {
    this.loading = true;
    this.productService.getProductsBySearch(searchParam).subscribe(
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
