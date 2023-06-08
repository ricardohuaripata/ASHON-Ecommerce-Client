import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { OrderService } from 'src/app/services/order.service';
import { ErrorService } from 'src/app/services/error.service'; // servicio para mostrar mensajes de errores devueltos por el backend
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from 'src/app/interfaces/product';
import { Order } from 'src/app/interfaces/order';
import { ProductsService } from 'src/app/services/products.service';

@Component({
  selector: 'app-user-order-details',
  templateUrl: './user-order-details.component.html',
  styleUrls: ['./user-order-details.component.css'],
})
export class UserOrderDetailsComponent {
  contentLoaded: boolean = false;
  products: Product[] = [];
  orderId!: string | null;
  order: Order | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private _errorService: ErrorService,
    private _orderService: OrderService,
    private productsService: ProductsService,
    private route: ActivatedRoute
  ) {}
  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.orderId = params.get('orderId');
      this.getOrder(this.orderId!);
    });

    setTimeout(() => {
      this.contentLoaded = true;
    }, 1500);
  }

  getOrder(orderId: string): void {
    this._orderService.getUserOrderById(orderId).subscribe({
      next: (data: any) => {
        this.order = data.order;
        this.getProducts();

      },
      error: (event: HttpErrorResponse) => {
        this.router.navigate(['/']); // Redirigir al usuario
      },
    });
  }

  getProducts(): void {
    const productIds = this.order?.products.map((item) => item.product) || [];
    this.productsService.getProductsByIds(productIds).subscribe(
      (data: any) => {
        this.products = data.products;
        console.log(this.products);
      },
      (error) => {
        this.products = [];
      }
    );
  }

  getProductById(productId: string): Product | undefined {
    return this.products.find((product) => product._id === productId);
  }

}
