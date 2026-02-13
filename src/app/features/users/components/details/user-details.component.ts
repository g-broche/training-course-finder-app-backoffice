import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserDTO } from '../../../../models/user.model';
import { Role, UserStatus } from '../../../../models/app.model';
import { AppButtonComponent } from '../../../shared/components/app-button/app-button.component';
import { VerifiedChipComponent } from '../../../shared/components/chips/verified-chip/verified-chip.component';
import { GdprChipComponent } from '../../../shared/components/chips/gdpr-chip/gdpr-chip.component';
import { UserStatusChipComponent } from '../../../shared/components/chips/user-status-chip/user-status-chip.component';
import { isGivenUserAdmin, isGivenUserBanned } from '../../utils';
import { toLongDateString } from '../../../shared/utils/pipe';
import { UserRoleChipComponent } from '../../../shared/components/chips/user-role-chip/user-role-chip.component';

@Component({
  selector: 'app-user-details',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    AppButtonComponent,
    VerifiedChipComponent,
    GdprChipComponent,
    UserStatusChipComponent,
    UserRoleChipComponent
  ],
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.scss'
})
export class UserDetailsComponent {
  @Input({ required: true }) user!: UserDTO;
  @Input() isUpdatingRoles = false;
  @Input() isUpdatingStatus = false;

  @Output() promoteToAdmin = new EventEmitter<void>();
  @Output() revokeAdminRole = new EventEmitter<void>();
  @Output() banUser = new EventEmitter<void>();
  @Output() unbanUser = new EventEmitter<void>();

  get isUserAdmin(): boolean {return isGivenUserAdmin(this.user); }
  get isUserBanned(): boolean {return isGivenUserBanned(this.user); }

  handlePromoteToAdmin(): void {
    this.promoteToAdmin.emit();
  }

  handleRevokeAdminRole(): void {
    this.revokeAdminRole.emit();
  }

  handleBanUser(): void {
    this.banUser.emit();
  }

  handleUnbanUser(): void {
    this.unbanUser.emit();
  }

  formatDate(date: string): string {
    return toLongDateString(date);
  }
}
