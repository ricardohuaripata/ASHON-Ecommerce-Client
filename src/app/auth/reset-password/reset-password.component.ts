import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ErrorService } from 'src/app/services/error.service'; // servicio para mostrar mensajes de errores devueltos por el backend
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
})
export class ResetPasswordComponent implements OnInit {
  form: FormGroup;
  showPassword: boolean = false; // Variable para alternar entre mostrar y ocultar la contraseña
  showConfirmPassword: boolean = false; // Variable para alternar entre mostrar y ocultar la contraseña
  submited: boolean = false;
  resetPasswordToken: string | null = '';
  constructor(
    private fb: FormBuilder,
    private _authService: AuthService,
    private router: Router,
    private _errorService: ErrorService,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
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

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.resetPasswordToken = params.get('token');
    });
  }

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

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  resetPassword() {
    this.submited = true;
    if (this.form.invalid) {
      return;
    }

    this.form.disable;
    this.mostrarEsperaCarga();

    const body = {
      password: this.form.get('password')?.value,
      passwordConfirmation: this.form.get('passwordConfirmation')?.value,
    };

    this._authService.resetPassword(this.resetPasswordToken!, body).subscribe({
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

        this.router.navigate(['/account/login']);
      },
      // si se produce algun error en la peticion
      error: (event: HttpErrorResponse) => {
        Swal.close();
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'No se ha podido restablecer la contraseña',
          customClass: {
            confirmButton: 'confirm-button-class',
          },
          allowOutsideClick: false,
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
