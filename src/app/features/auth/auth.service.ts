import { Injectable, signal } from '@angular/core';
import { ApiService } from '../../core/api.service';
import { LoginCredentials, LoginResponse, CurrentUser } from '../../models/auth.model';
import { ApiResponse } from '../../models/api.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSignal = signal<CurrentUser | null>(null);
  public currentUser = this.currentUserSignal.asReadonly();

  constructor(private apiService: ApiService) {}

  /**
   * Attempts to log in with the provided credentials
   * API will return an httpOnly cookie containing JWT with user claims
   */
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const response = await this.apiService.post<LoginResponse>('/api/admin/auth/signin', credentials);
      console.log('Login response:', response);
      
      // If login successful, fetch and set current user from JWT claims
      if (response.success) {
        await this.loadUserFromToken();
      }
      
      return response;
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Login failed'
      };
    }
  }

  /**
   * Checks if user is authenticated and has admin role
   * @returns true if authenticated with admin role, false otherwise
   */
  async checkAuth(): Promise<boolean> {
    try {
      // Call API endpoint to validate JWT cookie and get user data
      const response = await this.apiService.get<ApiResponse<CurrentUser>>('/api/auth/me');
      const user = response.data || null;
      const isAdmin = doesUserHaveAdminRole(user);
      if (isAdmin) {
        this.currentUserSignal.set(user);
        return true;
      }
      
      // No admin role, clear user immediately and logout in background
      this.currentUserSignal.set(null);
      void this.logout();
      return false;
    } catch (error) {
      console.error('Auth check failed:', error);
      this.currentUserSignal.set(null);
      void this.logout();
      return false;
    }
  }

  /**
   * Loads user data from JWT claims via API
   */
  private async loadUserFromToken(): Promise<void> {
    try {
      const response = await this.apiService.get<ApiResponse<CurrentUser>>('/api/auth/me');
      const user = response.data || null;
      const isAdmin = doesUserHaveAdminRole(user);
      if (isAdmin) {
        this.currentUserSignal.set(user);
      } else {
        console.error('User does not have admin role');
        await this.logout();
      }
    } catch (error) {
      console.error('Failed to load user from token:', error);
      await this.logout();
    }
  }

  /**
   * Gets the current user value (synchronous)
   */
  getCurrentUser(): CurrentUser | null {
    return this.currentUserSignal();
  }

  /**
   * Manually refreshes the access token
   * Note: This is usually handled automatically by ApiService
   */
  async refreshToken(): Promise<void> {
    try {
      await this.apiService.post('/api/admin/auth/refresh', {});
      // Tokens are automatically updated via httpOnly cookies
      console.log('Token refreshed successfully');
    } catch (error) {
      console.error('Token refresh failed:', error);
      // If refresh fails, log out the user
      await this.logout();
      throw error;
    }
  }

  /**
   * Logs out the user by clearing the JWT cookie and user state
   */
  async logout(): Promise<void> {
    try {
      // Call logout endpoint to clear httpOnly cookie
      await this.apiService.post('/api/admin/auth/logout', {});
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      // Clear user state regardless of API result
      this.currentUserSignal.set(null);
      console.log('User logged out');
    }
  }
}

const doesUserHaveAdminRole = (user: CurrentUser | null): boolean => {
    console.log('Checking admin role for user:', {
    user,
    roles: user?.roles
    });
  return !!user && !!user.roles && user.roles.some(role => role.name.toLowerCase() === 'admin');
}
