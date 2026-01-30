import { Component } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
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

  constructor(private router: Router) {
    // Listen to navigation events to conditionally show header
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        // Hide header on login page
        this.showHeader = !event.url.includes('/login');
      });
  }
}
