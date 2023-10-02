import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/interfaces/user';
import Swal from 'sweetalert2';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ErrorService } from 'src/app/services/error.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
})
export class UserProfileComponent implements OnInit {
  userDetails: User | null = null;
  form: FormGroup;

  constructor(
    private userService: UserService,
    private _authService: AuthService,
    private router: Router,
    private fb: FormBuilder,
    private _errorService: ErrorService
  ) {
    this.form = this.fb.group({
      // validar campo requerido
      name: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', Validators.required],
      address: [''],
      phone: [''],
    });
  }

  ngOnInit(): void {
    this.userService.getUserByAuthToken().subscribe(
      (data: any) => {
        this.userDetails = data.user;
        this.form.patchValue({
          name: this.userDetails!.name,
          username: this.userDetails!.username,
          email: this.userDetails!.email,
          address: this.userDetails!.address,
          phone: this.userDetails!.phone,
        });
      }
    );
  }

  logout() {
    Swal.fire({
      title: '¿Desea cerrar sesión?',
      showCancelButton: true,
      confirmButtonColor: '#000000',
      cancelButtonColor: '#ffffff',
      confirmButtonText: 'Si',
      cancelButtonText: 'No',
      customClass: {
        cancelButton: 'cancel-button-class',
        confirmButton: 'confirm-button-class',
      },
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        const token = localStorage.getItem('token');

        this._authService.logout(token!).subscribe({
          next: (data: any) => {
            localStorage.removeItem('token');
            this.router.navigate(['/account/login']);
          },
          error: (event: HttpErrorResponse) => {},
        });
      }
    });
  }

  updateUserDetails() {
    Swal.fire({
      title: '¿Desea actualizar su información?',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No',
      customClass: {
        cancelButton: 'cancel-button-class',
        confirmButton: 'confirm-button-class',
      },
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        const body = {
          name: this.form.get('name')?.value,
          username: this.form.get('username')?.value,
          email: this.form.get('email')?.value,
          address: this.form.get('address')?.value,
          phone: this.form.get('phone')?.value,
        };

        this.userService.updateUserDetails(body).subscribe({
          // si la peticion ha tenido exito
          next: (data: any) => {
            Swal.fire({
              icon: 'success',
              title: data.message,
              showConfirmButton: false,
              allowOutsideClick: false,
              timer: 1500,
            });
          },
          // si se produce algun error en la peticion
          error: (event: HttpErrorResponse) => {
            this._errorService.msgError(event);
          },
        });
      }
    });
  }

  changePassword(
    currentPassword: string,
    newPassword: string,
    confirmNewPassword: string
  ) {
    const body = {
      currentPassword: currentPassword,
      password: newPassword,
      passwordConfirmation: confirmNewPassword,
    };

    this._authService.changeUserPassword(body).subscribe({
      // si la peticion ha tenido exito
      next: (data: any) => {
        Swal.fire({
          icon: 'success',
          title: data.message,
          showConfirmButton: false,
          allowOutsideClick: false,
          timer: 1500,
        });
      },
      // si se produce algun error en la peticion
      error: (event: HttpErrorResponse) => {
        this._errorService.msgError(event);
      },
    });
  }

  openChangePasswordModal() {
    Swal.fire({
      title: 'Cambiar contraseña',
      html:
        '<input id="swal-input1" class="form-control my-1 mx-auto custom-input" placeholder="Contraseña actual" type="password">' +
        '<input id="swal-input2" class="form-control my-1 mx-auto custom-input" placeholder="Nueva contraseña" type="password">' +
        '<input id="swal-input3" class="form-control my-1 mx-auto custom-input" placeholder="Confirmar contraseña" type="password">',
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      customClass: {
        cancelButton: 'cancel-button-class',
        confirmButton: 'confirm-button-class',
      },
      allowOutsideClick: false,

      preConfirm: () => {
        const currentPassword = (
          document.getElementById('swal-input1') as HTMLInputElement
        ).value;
        const newPassword = (
          document.getElementById('swal-input2') as HTMLInputElement
        ).value;
        const confirmNewPassword = (
          document.getElementById('swal-input3') as HTMLInputElement
        ).value;

        if (!currentPassword || !newPassword || !confirmNewPassword) {
          Swal.showValidationMessage('Por favor, rellena todos los campos.');
        } else {
          // Llama a la función para cambiar la contraseña con los datos ingresados
          this.changePassword(currentPassword, newPassword, confirmNewPassword);
        }
      },
    });
  }

  sendVerificationEmail() {
    Swal.fire({
      title: '¿Desea recibir un email de verificación',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No',
      customClass: {
        cancelButton: 'cancel-button-class',
        confirmButton: 'confirm-button-class',
      },
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        this._authService.sendVerificationEmail().subscribe({
          // si la peticion ha tenido exito
          next: (data: any) => {
            Swal.fire({
              icon: 'success',
              title: data.message,
              showConfirmButton: false,
              allowOutsideClick: false,
              timer: 1500,
            });
          },
          // si se produce algun error en la peticion
          error: (event: HttpErrorResponse) => {
            this._errorService.msgError(event);
          },
        });
      }
    });
  }
}
