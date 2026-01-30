import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { AppButtonComponent } from '../../../shared/components/app-button/app-button.component';

@Component({
  selector: 'app-logout-button',
  standalone: true,
  imports: [AppButtonComponent],
  templateUrl: './logout-button.component.html',
  styleUrl: './logout-button.component.scss'
})
export class LogoutButtonComponent {
  constructor(
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  async onLogout(): Promise<void> {
    await this.authService.logout();
    this.notificationService.showInfo('You have been logged out.');
    this.router.navigate(['/login']);
  }
}
