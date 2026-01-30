import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { LogoutButtonComponent } from '../../../auth/components/logout-button/logout-button.component';
import { AuthService } from '../../../auth/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, LogoutButtonComponent, AsyncPipe],
  templateUrl: './app-header.component.html',
  styleUrl: './app-header.component.scss'
})
export class AppHeaderComponent {
  constructor(private authService: AuthService) {}

  get currentUser$() {
    return this.authService.currentUser$;
  }
}
