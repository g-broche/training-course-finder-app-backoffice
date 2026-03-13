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
      // User not authenticated, redirecting to login
      return router.createUrlTree(['/login']);
    }
    return true;
  } catch (error) {
    // Auth guard error, redirecting to login
    return router.createUrlTree(['/login']);
  }
};

/**
 * Login guard that redirects authenticated admins away from login page
 */
export const loginGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  try {
    // Reuses checkAuth() so /api/auth/me is called before deciding redirect
    const isAuthenticated = await authService.checkAuth();
    if (isAuthenticated) {
      return router.createUrlTree(['/announces']);
    }
    // Not authenticated, allow access to login page
    return true;
  } catch (error) {
    // In case of error, allow access to login page
    return true;
  }
};
