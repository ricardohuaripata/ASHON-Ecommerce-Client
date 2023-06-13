import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ErrorService } from 'src/app/services/error.service'; // servicio para mostrar mensajes de errores devueltos por el backend
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private _authService: AuthService,
    private router: Router,
    private _errorService: ErrorService
  ) {
    this.form = this.fb.group({
      // validar campo requerido
      name: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
      passwordConfirmation: ['', Validators.required],
    });
  }
  ngOnInit(): void {}

  registerUser() {
    this.form.disable;
    this.mostrarEsperaCarga();

    const body = {
      name: this.form.get('name')?.value,
      username: this.form.get('username')?.value,
      email: this.form.get('email')?.value,
      password: this.form.get('password')?.value,
      passwordConfirmation: this.form.get('passwordConfirmation')?.value,
      role: 'user',
    };

    // AGREGAR
    this._authService.register(body).subscribe({
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
        localStorage.setItem('token', data.tokens.refreshToken);
        this.router.navigate(['/']);
      },
      // si se produce algun error en la peticion
      error: (event: HttpErrorResponse) => {
        Swal.close();

        if (event.error.error.errors.email) {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Email no válido',
            confirmButtonColor: '#000000',
          });
        } else if (event.error.error.errors.password) {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'La contraseña debe tener más de 8 caracteres y contener letras, números y símbolos.',
            confirmButtonColor: '#000000',
          });
        } else if (event.error.error.errors.passwordConfirmation) {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'La contraseña y la contraseña de confirmación deben ser iguales.',
            confirmButtonColor: '#000000',
          });
        } else {
          this._errorService.msgError(event);
        }
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
