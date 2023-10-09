import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';
import { AuthGoogleService } from 'src/app/services/auth-google.service';
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
  showPassword: boolean = false; // Variable para alternar entre mostrar y ocultar la contraseña
  showConfirmPassword: boolean = false; // Variable para alternar entre mostrar y ocultar la contraseña
  submited: boolean = false;

  constructor(
    private fb: FormBuilder,
    private _authService: AuthService,
    private router: Router,
    private _errorService: ErrorService,
    private oauthService: OAuthService,
    private _authGoogleService: AuthGoogleService
  ) {
    this.form = this.fb.group({
      // validar campo requerido
      name: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          this.passwordFormatValidator,
        ],
      ],
      passwordConfirmation: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          this.passwordFormatValidator,
        ],
      ],
    });
  }
  ngOnInit(): void {}

  passwordFormatValidator(
    control: AbstractControl
  ): { [key: string]: boolean } | null {
    const password = control.value;

    // Verifica si la contraseña contiene al menos una letra y un número
    if (!/[a-zA-Z]/.test(password) || !/\d/.test(password)) {
      return { invalidPasswordFormat: true };
    }

    return null;
  }

  registerUser() {
    this.submited = true;
    if (this.form.invalid) {
      return;
    }

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
        const userData = {
          name: data.user.name,
          username: data.user.username,
          email: data.user.email,
          isEmailVerified: data.user.isEmailVerified,
          address: data.user.address,
          phone: data.user.phone,
        };
        localStorage.setItem('userData', JSON.stringify(userData));
        localStorage.setItem('token', data.tokens.refreshToken);
        this.router.navigate(['/account']);
      },
      // si se produce algun error en la peticion
      error: (event: HttpErrorResponse) => {
        Swal.close();

        if (event.error.error && event.error.error.errors) {
          switch (true) {
            case !!event.error.error.errors.email:
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Email no válido',
                customClass: {
                  confirmButton: 'confirm-button-class',
                },
                allowOutsideClick: false,
              });
              break;
            case !!event.error.error.errors.password:
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'La contraseña debe tener más de 8 caracteres y contener letras, números y símbolos',
                customClass: {
                  confirmButton: 'confirm-button-class',
                },
                allowOutsideClick: false,
              });
              break;
            case !!event.error.error.errors.passwordConfirmation:
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'La contraseña de confirmación no coincide con la contraseña',
                customClass: {
                  confirmButton: 'confirm-button-class',
                },
                allowOutsideClick: false,
              });
              break;
            default:
              this._errorService.msgError(event);
              break;
          }
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

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  loginWithGoogle() {
    this.oauthService.initLoginFlow();
  }
}
