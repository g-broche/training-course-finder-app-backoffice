import { Injectable } from '@angular/core';
import { ApiService } from '../../core/api.service';
import { LoginCredentials, LoginResponse } from '../../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private apiService: ApiService) {}

  /**
   * Attempts to log in with the provided credentials
   * API will return an httpOnly cookie containing JWT with user claims
   */
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const response = await this.apiService.post<LoginResponse>('/api/admin/auth/signin', credentials);
      console.log('Login response:', response);
      
      // The JWT cookie is automatically set by the browser from the Set-Cookie header
      // The cookie contains: uuid, roles, firstName, lastName, displayName, isVerified, hasAcceptedGdpr, userCreatedAt
      
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
   * Placeholder for logout - will be implemented in later steps
   */
  async logout(): Promise<void> {
    console.log('Logout called - to be implemented in next steps');
  }
}
