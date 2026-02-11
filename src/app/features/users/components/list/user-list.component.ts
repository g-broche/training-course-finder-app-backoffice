import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserDTO } from '../../../../models/user.model';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { AppRouterButtonComponent } from '../../../shared/components/app-router-button/app-router-button.component';
import { UserStatusChipComponent } from '../../../shared/components/chips/user-status-chip/user-status-chip.component';
import { VerifiedChipComponent } from '../../../shared/components/chips/verified-chip/verified-chip.component';
import { GdprChipComponent } from '../../../shared/components/chips/gdpr-chip/gdpr-chip.component';
import { Role } from '../../../../models/app.model';
import { ReportedMessageChipComponent } from '../../../shared/components/chips/reported-message-chip/reported-message-chip.component';


@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    LoadingSpinnerComponent,
    AppRouterButtonComponent,
    UserStatusChipComponent,
    VerifiedChipComponent,
    GdprChipComponent,
    ReportedMessageChipComponent
  ],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})
export class UserListComponent {

  @Input() users: UserDTO[] = [];
  @Input() loading: boolean = false;

  formatDate(dateString: Date | string): string {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  getRolesDisplay(roles: Role[]): string {
    return roles.join(', ');
  }
}
