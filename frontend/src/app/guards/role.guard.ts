import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { UserService } from '../services/user.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const usersService = inject(UserService);
  const router = inject(Router);

  const expectedRole = route.data?.['expectedRole'];
  const currentRole = usersService.getRole();

  if (usersService.loggedIn() && currentRole === expectedRole) {
    return true;
  } else if (expectedRole === 'admin') {
    router.navigate(['/admin-login']);
    return false;
  } else {
    router.navigate(['/login']);
    return false;
  }
};
