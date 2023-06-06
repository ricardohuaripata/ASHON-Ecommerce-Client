import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { OrderService } from 'src/app/services/order.service';
import { ErrorService } from 'src/app/services/error.service'; // servicio para mostrar mensajes de errores devueltos por el backend
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { Cart  } from 'src/app/interfaces/cart';
import { CartService } from 'src/app/services/cart.service';
import { Product } from 'src/app/interfaces/product';
import { ProductsService } from 'src/app/services/products.service';

@Component({
  selector: 'app-payment-gateway',
  templateUrl: './payment-gateway.component.html',
  styleUrls: ['./payment-gateway.component.css'],
})
export class PaymentGatewayComponent implements OnInit {
  form: FormGroup;
  cart: Cart | null = null;
  products: Product[] = [];
  contentLoaded: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private _errorService: ErrorService,
    private _orderService: OrderService,
    private cartService: CartService,
    private productsService: ProductsService,

  ) {
    this.form = this.fb.group({

      address: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      postalCode: ['', Validators.required],
      phone: ['', Validators.required],

      cardNumber: ['', Validators.required],
      expDate: ['', Validators.required],
      //expMonth: ['', Validators.required],
      //expYear: ['', Validators.required],
      cvc: ['', Validators.required],

    });
  }

  ngOnInit(): void {
    this.getCart();
    // Simulación de tiempo de carga
    setTimeout(() => {
      this.contentLoaded = true;
    }, 1500);
  }

  getCart(): void {
    this.cartService.getCart().subscribe(
      (data: any) => {
        this.cart = data.cart;
        if(this.cart && this.cart.items.length > 0) {
          this.getProducts();
        }
      },
      (error) => {
        this.cart = null;
      }
    );
  }

  truncateText(text: string, maxLength: number): string {
    if (text.length > maxLength) {
      return text.substring(0, maxLength - 3) + '...';
    }
    return text;
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

  submitOrder() {
    if (this.form.invalid) {
      const formulario = document.getElementById('formulario')
      formulario?.classList.add('was-validated')
      return;
    }

    this.form.disable;

    let expDate = this.form.get('expDate')?.value;

    let parts = expDate.split('/'); // Dividir la fecha en dos partes usando la barra como separador
    
    let expMonth = parts[0];
    let expYear = parts[1];

    const body = {
      shippingAddress: {
        address: this.form.get('address')?.value,
        city: this.form.get('city')?.value,
        country: this.form.get('country')?.value,
        postalCode: this.form.get('postalCode')?.value,
      },
      paymentMethod: 'card',
      phone: this.form.get('phone')?.value,
      cardNumber: this.form.get('cardNumber')?.value,
      expMonth: expMonth,
      expYear: expYear,
      cvc: this.form.get('cvc')?.value,

    };

    this._orderService.createOrder(body).subscribe({
      // si la peticion ha tenido exito
      next: (data: any) => {
        Swal.fire({
          icon: 'success',
          title: data.message,
          showConfirmButton: false,
          timer: 1500,
        });
        this.router.navigate(['/account/my-orders/' + data.order._id]);
      },
      // si se produce algun error en la peticion
      error: (event: HttpErrorResponse) => {
          this._errorService.msgError(event);
        
      },
    });


  }

}
