import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Account } from './account';

/** Only Artemis administrators reach /admin; everyone else goes home. */
export const adminGuard: CanActivateFn = async () => {
  const me = await inject(Account).load().catch(() => null);
  return me?.platformAdmin ? true : inject(Router).parseUrl('/');
};
