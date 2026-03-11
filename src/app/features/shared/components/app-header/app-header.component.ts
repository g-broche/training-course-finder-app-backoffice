import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LogoutButtonComponent } from '../../../auth/components/logout-button/logout-button.component';
import { AuthService } from '../../../auth/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, LogoutButtonComponent],
  templateUrl: './app-header.component.html',
  styleUrl: './app-header.component.scss'
})
export class AppHeaderComponent {
  currentUser = inject(AuthService).currentUser;
}
