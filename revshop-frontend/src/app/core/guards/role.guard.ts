import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { TokenService } from '../services/token.service';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {

  const router = inject(Router);
  const tokenService = inject(TokenService);

  const storedRole = tokenService.getRole();

  if (!storedRole) {
    return router.createUrlTree(['/login']);
  }

  const cleanRole = storedRole.replace('ROLE_', '');

  // Check current route
  let requiredRole = route.data?.['role'];

  // If not found, check parent route
  if (!requiredRole && route.parent) {
    requiredRole = route.parent.data?.['role'];
  }

  // If still no role required, allow access
  if (!requiredRole) {
    return true;
  }

  if (cleanRole !== requiredRole) {
    return router.createUrlTree(['/login']);
  }

  return true;
};