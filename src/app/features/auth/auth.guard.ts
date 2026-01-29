import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from './auth.service';

/**
 * Auth guard that checks if user is authenticated and has admin role
 * Redirects to login if not authenticated or missing admin role
 */
export const authGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  try {
    // Check if user is authenticated and has valid admin role
    const isAuthenticated = await authService.checkAuth();
    
    if (!isAuthenticated) {
      console.log('User not authenticated, redirecting to login');
      router.navigate(['/login']);
      return false;
    }
    return true;
  } catch (error) {
    console.error('Auth guard error:', error);
    router.navigate(['/login']);
    return false;
  }
};
