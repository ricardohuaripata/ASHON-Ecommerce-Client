import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { OrderService } from 'src/app/services/order.service';
import { ErrorService } from 'src/app/services/error.service'; // servicio para mostrar mensajes de errores devueltos por el backend
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { Order } from 'src/app/interfaces/order';

@Component({
  selector: 'app-user-orders',
  templateUrl: './user-orders.component.html',
  styleUrls: ['./user-orders.component.css'],
})
export class UserOrdersComponent implements OnInit {
  orders: Order[] = [];
  contentLoaded: boolean = false;

  constructor(
    private _errorService: ErrorService,
    private _orderService: OrderService,
  ) {}
  ngOnInit(): void {
    this.getOrders();
    // Simulación de tiempo de carga
    setTimeout(() => {
      this.contentLoaded = true;
    }, 1000);
  }

  getOrders(): void {
    this._orderService.getUserOrders().subscribe({
      next: (data: any) => {
        this.orders = data.orders;

      },
      error: (event: HttpErrorResponse) => {
        this.orders = [];
        this._errorService.msgError(event);
      },
    });
  }

}
