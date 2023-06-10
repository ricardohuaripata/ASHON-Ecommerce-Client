import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorService } from 'src/app/services/error.service'; // servicio para mostrar mensajes de errores devueltos por el backend
import Swal from 'sweetalert2';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-email-verification',
  templateUrl: './email-verification.component.html',
  styleUrls: ['./email-verification.component.css'],
})
export class EmailVerificationComponent implements OnInit {
  verificationSuccess: boolean = false;
  verificationError: boolean = false;
  loading: boolean = false;

  constructor(
    private authService: AuthService,
    private _errorService: ErrorService,
    private route: ActivatedRoute,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.mostrarEsperaCarga();
    this.route.paramMap.subscribe((params) => {
      const token = params.get('token');

      if (token) {
        this.authService.verifyEmail(token).subscribe(
          (data: any) => {
            // Verificación exitosa
            this.verificationSuccess = true;
            this.loading = false;
            Swal.close();
          },
          (error: HttpErrorResponse) => {
            // Verificación fallida
            this.verificationError = true;
            this.loading = false;
            Swal.close();
          }
        );
      } else {
        this.router.navigate(['/']); // Redirigir al usuario
        return;
      }
    });
  }

  mostrarEsperaCarga() {
    this.loading = true;

    Swal.fire({
      title: 'Loading...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
  }
}
