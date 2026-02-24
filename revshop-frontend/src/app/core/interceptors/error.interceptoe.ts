import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { TokenService } from '../services/token.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {

  const router = inject(Router);
  const tokenService = inject(TokenService);

  return next(req).pipe(
    catchError((error) => {

      if (error.status === 401) {
        tokenService.clear();
        router.navigate(['/login']);
      }

      if (error.status === 403) {
        alert('Access denied');
      }

      if (error.status === 500) {
        alert('Server error. Please try again later.');
      }

      return throwError(() => error);
    })
  );
};