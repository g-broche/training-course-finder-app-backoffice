import { Component } from '@angular/core';
import {
  Router,
  RouterOutlet,
  NavigationEnd,
  NavigationStart,
  NavigationCancel,
  NavigationError
} from '@angular/router';
import { AppHeaderComponent } from './features/shared/components/app-header/app-header.component';
import { NotificationsComponent } from './features/shared/components/notifications/notifications.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AppHeaderComponent, NotificationsComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'backoffice';
  showHeader = true;
  isNavigating = false;

  constructor(private router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.isNavigating = true;
      }

      if (event instanceof NavigationEnd) {
        this.showHeader = !event.urlAfterRedirects.includes('/login');
        this.isNavigating = false;
      }

      if (event instanceof NavigationCancel || event instanceof NavigationError) {
        this.isNavigating = false;
      }
    });
  }
}
