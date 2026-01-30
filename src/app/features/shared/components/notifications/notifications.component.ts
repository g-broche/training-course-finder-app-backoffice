import { Component } from '@angular/core';
import { AsyncPipe, NgClass } from '@angular/common';
import { NotificationService } from '../../services/notification.service';
import { Notification } from '../../../../models/app.model';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [AsyncPipe, NgClass],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.scss'
})
export class NotificationsComponent {
  constructor(private notificationService: NotificationService) {}

  get notifications$() {
    return this.notificationService.notifications$;
  }

  onDismiss(id: string): void {
    this.notificationService.dismiss(id);
  }

  trackById(index: number, notification: Notification): string {
    return notification.id;
  }
}
