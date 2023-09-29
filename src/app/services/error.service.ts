import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class ErrorService {
  constructor() {}

  msgError(event: HttpErrorResponse) {
    if (event.error.message != null) {
      // mostrar mensaje de errores programados, por ej: 'contraseña incorrecta'(login), 'ya existe un username'(registro)
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: event.error.message,
        customClass: {
          confirmButton: 'confirm-button-class',
        },
        allowOutsideClick: false,
      });

    } else {
      // mostrar mensaje de errores desconocidos del backend
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Algo ha ido mal.',
        customClass: {
          confirmButton: 'confirm-button-class',
        },
        allowOutsideClick: false,

      });
    }
  }
}
