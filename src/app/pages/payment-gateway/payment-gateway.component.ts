import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { OrderService } from 'src/app/services/order.service';
import { ErrorService } from 'src/app/services/error.service'; // servicio para mostrar mensajes de errores devueltos por el backend
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { Cart } from 'src/app/interfaces/cart';
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
  submited: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private _errorService: ErrorService,
    private _orderService: OrderService,
    private cartService: CartService,
    private productsService: ProductsService
  ) {
    this.form = this.fb.group({
      address: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      postalCode: ['', [Validators.required, this.postalCodeValidator]],
      phone: ['', [Validators.required, this.phoneNumberValidator]],

      cardNumber: ['', [Validators.required, this.creditCardValidator]],
      expDate: ['', [Validators.required, this.expDateValidator]],
      cvc: ['', [Validators.required, this.cvcValidator]],
    });
  }

  postalCodeValidator(control: AbstractControl): { [key: string]: any } | null {
    const value = control.value;

    // Verificar si el código postal consiste solo en dígitos y tiene una longitud válida
    if (!/^\d+$/.test(value) || value.length !== 5) {
      return { invalidPostalCode: true };
    }

    return null;
  }

  phoneNumberValidator(
    control: AbstractControl
  ): { [key: string]: any } | null {
    const value = control.value;

    // Verificar si el número de teléfono consiste en dígitos, permitiendo el signo más (+) al principio
    if (!/^\+?\d+$/.test(value)) {
      return { invalidPhoneNumber: true };
    }

    // Verificar si la longitud del número de teléfono es válida (generalmente entre 10 y 15 dígitos)
    if (value.length < 10 || value.length > 15) {
      return { invalidPhoneNumber: true };
    }

    return null;
  }

  creditCardValidator(control: AbstractControl): { [key: string]: any } | null {
    const value = control.value;

    // Eliminar espacios en blanco y guiones (si los hay) del número de tarjeta
    const sanitizedValue = value.replace(/[\s-]/g, '');

    // Verificar si el número de tarjeta contiene solo dígitos
    if (!/^\d+$/.test(sanitizedValue)) {
      return { invalidCreditCard: true };
    }

    // Verificar si la longitud del número de tarjeta es válida (generalmente 13-19 dígitos)
    if (sanitizedValue.length < 13 || sanitizedValue.length > 19) {
      return { invalidCreditCard: true };
    }

    // Aplicar el algoritmo de Luhn para verificar la validez del número de tarjeta
    let sum = 0;
    let doubleDigit = false;

    for (let i = sanitizedValue.length - 1; i >= 0; i--) {
      let digit = parseInt(sanitizedValue.charAt(i), 10);

      if (doubleDigit) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }

      sum += digit;
      doubleDigit = !doubleDigit;
    }

    if (sum % 10 !== 0) {
      return { invalidCreditCard: true };
    }

    return null;
  }

  expDateValidator(control: AbstractControl): { [key: string]: any } | null {
    const value = control.value;
    // Validación de fecha de vencimiento en formato "MM/YY"
    const expDateRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    if (!expDateRegex.test(value)) {
      return { invalidExpDate: true };
    }
    const currentDate = new Date();
    const [month, year] = value.split('/').map(Number);
    // Verifica si la fecha de vencimiento es posterior al mes y año actuales
    if (
      year < currentDate.getFullYear() % 100 ||
      (year === currentDate.getFullYear() % 100 &&
        month < currentDate.getMonth() + 1)
    ) {
      return { expiredExpDate: true };
    }
    return null;
  }

  cvcValidator(control: AbstractControl): { [key: string]: any } | null {
    const value = control.value;

    // Verificar si el CVC consiste solo en dígitos
    if (!/^\d+$/.test(value)) {
      return { invalidCvc: true };
    }

    // Verificar la longitud válida para CVC (generalmente 3 o 4 dígitos)
    if (value.length !== 3 && value.length !== 4) {
      return { invalidCvc: true };
    }

    return null;
  }

  ngOnInit(): void {
    this.getCart();

    const userDataJSON = localStorage.getItem('userData');

    if (userDataJSON) {
      const userData = JSON.parse(userDataJSON);

      this.form.patchValue({
        address: userData.address,
        phone: userData.phone,
      });
    }
  }

  getCart(): void {
    this.cartService.getCart().subscribe(
      (data: any) => {
        this.cart = data.cart;
        if (this.cart && this.cart.items.length > 0) {
          this.getProducts();
        } else {
          this.contentLoaded = true;
        }
      },
      (error) => {
        this.cart = null;
        this.contentLoaded = true;
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
        this.contentLoaded = true;
      },
      (error) => {
        this.products = [];
        this.contentLoaded = true;
      }
    );
  }

  getProductById(productId: string): Product | undefined {
    return this.products.find((product) => product._id === productId);
  }

  submitOrder() {
    this.submited = true;
    if (this.form.invalid) {
      return;
    }

    this.form.disable;
    this.mostrarEsperaCarga();

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
        Swal.close();

        Swal.fire({
          icon: 'success',
          title: data.message,
          showConfirmButton: false,
          allowOutsideClick: false,
          timer: 1500,
        });

        this.router.navigate(['/account/my-orders/' + data.order._id]);
      },
      // si se produce algun error en la peticion
      error: (event: HttpErrorResponse) => {
        Swal.close();
        this._errorService.msgError(event);
      },
    });
  }

  mostrarEsperaCarga() {
    Swal.fire({
      title: 'Loading...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
  }
}
