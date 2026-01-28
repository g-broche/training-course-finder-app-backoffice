import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginFormComponent } from '../../../features/auth/components/login-form/login-form.component';
import { AuthService } from '../../../features/auth/auth.service';
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

  constructor(private authService: AuthService) {}

  async handleLogin(credentials: LoginCredentials): Promise<void> {
    console.log('Login attempt with:', { email: credentials.email });
    
    const response = await this.authService.login(credentials);
    
    if (response.success) {
      console.log('✅ Login successful!');
      console.log('📝 Response:', response);
      console.log('🍪 JWT cookie has been set by the browser (check DevTools > Application > Cookies)');
      console.log('⏭️  Next step will implement redirect to announces page and admin role validation');
      
      // Reset form loading state
      if (this.loginForm) {
        this.loginForm.setLoading(false);
      }
    } else {
      console.error('❌ Login failed:', response.message);
      
      // Show error in form
      if (this.loginForm) {
        this.loginForm.setError(response.message || 'Login failed. Please try again.');
      }
    }
  }
}
