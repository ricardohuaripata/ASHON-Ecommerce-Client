import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/services/auth.service';
import { ErrorService } from 'src/app/services/error.service'; // servicio para mostrar mensajes de errores devueltos por el backend
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  showPassword: boolean = false; // Variable para alternar entre mostrar y ocultar la contraseña

  constructor(
    private fb: FormBuilder,
    private _authService: AuthService,
    private router: Router,
    private _errorService: ErrorService
  ) {
    this.form = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  ngOnInit(): void {}

  loginUser() {
    const user: User = {
      email: this.form.value.email,
      password: this.form.value.password,
    };

    this._authService.login(user).subscribe({
      // si la peticion ha tenido exito
      next: (data: any) => {
        localStorage.setItem('token', data.tokens.refreshToken);
        this.router.navigate(['/']);
      },
      // si se produce algun error en la peticion
      error: (event: HttpErrorResponse) => {
        this._errorService.msgError(event);
      },
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  forgotPassword() {
    Swal.fire({
      title: '¿Has olvidado tu contraseña?',
      text: 'Introduce tu dirección de correo electrónico y te enviaremos un correo electrónico para restablecerla',
      input: 'email',
      showCancelButton: true,
      showLoaderOnConfirm: true,
      confirmButtonText: 'Enviar',
      cancelButtonText: 'Cancelar',
      allowOutsideClick: false,
      customClass: {
        cancelButton: 'cancel-button-class',
        confirmButton: 'confirm-button-class',
      },
      preConfirm: (email) => {
        this.mostrarEsperaCarga();
        this._authService.forgotPassword(email).subscribe({
          // si la peticion ha tenido exito
          next: (data: any) => {
            Swal.close();
            Swal.fire({
              icon: 'success',
              title: '¡Enviado! Ahora por favor, revisa tu correo',
              customClass: {
                confirmButton: 'confirm-button-class',
              },
              allowOutsideClick: false,
            });
          },
          // si se produce algun error en la peticion
          error: (event: HttpErrorResponse) => {
            Swal.close();
            this._errorService.msgError(event);
          },
        });
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
