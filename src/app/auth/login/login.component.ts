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
  submited: boolean = false;

  constructor(
    private fb: FormBuilder,
    private _authService: AuthService,
    private router: Router,
    private _errorService: ErrorService
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  ngOnInit(): void {}

  loginUser() {
    this.submited = true;
    if (this.form.invalid) {
      return;
    }

    this.form.disable;

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
      html:
        '<p>Introduce tu dirección de correo electrónico y te enviaremos las instrucciones para restablecerla.</p>' +
        '<form>' +
        '<input id="swal-input1" class="form-control my-1 mx-auto custom-large-input" placeholder="Correo electrónico" type="email">' +
        '</form>',
      showCancelButton: true,
      confirmButtonText: 'Enviar',
      cancelButtonText: 'Cancelar',
      customClass: {
        cancelButton: 'cancel-button-class',
        confirmButton: 'confirm-button-class',
      },
      allowOutsideClick: false,

      preConfirm: () => {
        const email = (
          document.getElementById('swal-input1') as HTMLInputElement
        ).value;

        if (!email) {
          Swal.showValidationMessage(
            'Por favor, introduce tu correo electrónico.'
          );
        } else {
          const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

          if (!emailRegex.test(email)) {
            Swal.showValidationMessage(
              'Por favor, introduce un correo electrónico válido.'
            );
          } else {
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
          }
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
