import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ProductsService } from 'src/app/services/products.service';
import { Product } from 'src/app/interfaces/product';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorService } from 'src/app/services/error.service'; // servicio para mostrar mensajes de errores devueltos por el backend
import Swal from 'sweetalert2';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  menProducts: Product[] = [];
  womenProducts: Product[] = [];
  contentLoaded: boolean = false;

  constructor(
    private productService: ProductsService,
    private _errorService: ErrorService
  ) {}

  ngOnInit(): void {
    this.productService.getCollectionByGenre('men').subscribe(
      (data: any) => {
        this.menProducts = data.products;
      },
      (error) => {
      }
    );

    this.productService.getCollectionByGenre('women').subscribe(
      (data: any) => {
        this.womenProducts = data.products;
      },
      (error) => {
      }
    );
    
    // Simulación de tiempo de carga
    setTimeout(() => {
      this.contentLoaded = true;
    }, 1000);

  }
}
