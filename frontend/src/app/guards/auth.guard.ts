import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { UserService } from '../services/user.service';

export const authGuard: CanActivateFn = (route, state) => {
  const usersService = inject(UserService);
  const router = inject(Router);

  if (usersService.loggedIn()) {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};
