import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Notification, NotificationType } from '../../../models/app.model';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  public notifications$: Observable<Notification[]> = this.notificationsSubject.asObservable();

  private readonly DEFAULT_DURATION = 3000;
  private notificationIdCounter = 0;

  /**
   * Show a notification to the user
   */
  private show(message: string, type: NotificationType, duration?: number): void {
    const notificationDuration = duration ?? this.DEFAULT_DURATION;
    
    const notification: Notification = {
      id: this.generateId(),
      message,
      type,
      duration: notificationDuration
    };

    const currentNotifications = this.notificationsSubject.value;
    this.notificationsSubject.next([...currentNotifications, notification]);

    // Auto-dismiss after duration
    if (notificationDuration > 0) {
      setTimeout(() => {
        this.dismiss(notification.id);
      }, notificationDuration);
    }
  }

  /**
   * Show a success notification
   */
  showSuccess(message: string, duration?: number): void {
    this.show(message, 'success', duration);
  }

  /**
   * Show an error notification
   */
  showError(message: string, duration?: number): void {
    this.show(message, 'error', duration);
  }

  /**
   * Show an info notification
   */
  showInfo(message: string, duration?: number): void {
    this.show(message, 'info', duration);
  }

  /**
   * Show a warning notification
   */
  showWarning(message: string, duration?: number): void {
    this.show(message, 'warning', duration);
  }

  /**
   * Dismiss a notification by ID
   */
  dismiss(id: string): void {
    const currentNotifications = this.notificationsSubject.value;
    this.notificationsSubject.next(
      currentNotifications.filter(notification => notification.id !== id)
    );
  }

  /**
   * Clear all notifications
   */
  clearAll(): void {
    this.notificationsSubject.next([]);
  }

  /**
   * Generate a unique ID for notifications
   */
  private generateId(): string {
    return `notification_${++this.notificationIdCounter}`;
  }
}
