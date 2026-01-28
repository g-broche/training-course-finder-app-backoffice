import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoginCredentials } from '../../../../models/auth.model';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.scss'
})
export class LoginFormComponent {
  @Output() submitLogin = new EventEmitter<LoginCredentials>();
  
  credentials: LoginCredentials = {
    email: '',
    password: ''
  };
  
  errorMessage: string = '';
  isLoading: boolean = false;

  onSubmit(): void {
    // Reset error message
    this.errorMessage = '';

    // Basic validation
    if (!this.credentials.email || !this.credentials.password) {
      this.errorMessage = 'Email and password are required';
      return;
    }

    // Emit the login event to parent component
    this.isLoading = true;
    this.submitLogin.emit(this.credentials);
  }

  setError(message: string): void {
    this.errorMessage = message;
    this.isLoading = false;
  }

  setLoading(loading: boolean): void {
    this.isLoading = loading;
  }
}
