import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TokenService } from '../services/token.service';

export const authGuard: CanActivateFn = () => {

  const router = inject(Router);
  const tokenService = inject(TokenService);

  const token = tokenService.getToken();

  if (!token) {
    return router.createUrlTree(['/login']);
  }

  return true;
};