import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LoginFormComponent } from '../../../features/auth/components/login-form/login-form.component';
import { AuthService } from '../../../features/auth/auth.service';
import { NotificationService } from '../../../features/shared/services/notification.service';
import { LoginCredentials } from '../../../models/auth.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, LoginFormComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  @ViewChild(LoginFormComponent) loginForm?: LoginFormComponent;

  constructor(
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  async handleLogin(credentials: LoginCredentials): Promise<void> {
    console.log('Login attempt with:', { email: credentials.email });
    
    try {
      const response = await this.authService.login(credentials);
      
      if (response.success) {
        const userName = this.authService.getCurrentUser()?.displayName;
        const message = `Login successful, welcome ${userName}!`;
        this.notificationService.showSuccess(message);
        
        // Redirect to announces page
        this.router.navigate(['/announces']);
      } else {
        // Show error in form
        if (this.loginForm) {
          this.loginForm.setError(response.message || 'Login failed. Please try again.');
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      
      // Show error notification
      this.notificationService.showError('An unexpected error occurred. Please try again.');
      
      // Show error in form
      if (this.loginForm) {
        this.loginForm.setError('An unexpected error occurred. Please try again.');
      }
    }
  }
}
