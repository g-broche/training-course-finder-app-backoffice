import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserDetailsComponent } from '../../../features/users/components/details/user-details.component';
import { AnnounceListComponent } from '../../../features/announces/components/list/announce-list.component';
import { DiscussionListComponent } from '../../../features/discussions/components/list/discussion-list.component';
import { PaginationComponent } from '../../../features/shared/components/pagination/pagination.component';
import { AppRouterButtonComponent } from '../../../features/shared/components/app-router-button/app-router-button.component';
import { UserService } from '../../../features/users/user.service';
import { NotificationService } from '../../../features/shared/services/notification.service';
import { UserDTO } from '../../../models/user.model';
import { AnnounceDTO } from '../../../models/announce.model';
import { DiscussionDTO } from '../../../models/discussion.model';
import { Role, UserStatus } from '../../../models/app.model';

@Component({
  selector: 'app-user-details-layout',
  standalone: true,
  imports: [
    CommonModule,
    UserDetailsComponent,
    AnnounceListComponent,
    DiscussionListComponent,
    PaginationComponent,
    AppRouterButtonComponent
  ],
  templateUrl: './user-details-layout.component.html',
  styleUrl: './user-details-layout.component.scss'
})
export class UserDetailsLayoutComponent implements OnInit {
  user: UserDTO | null = null;
  announces: AnnounceDTO[] = [];
  discussions: DiscussionDTO[] = [];

  loading = true;
  announcesLoading = false;
  discussionsLoading = false;
  isUpdatingRoles = false;
  isUpdatingStatus = false;

  // Pagination state
  announcesCurrentPage = 0;
  announcesTotalPages = 0;
  announcesPageSize = 10;

  discussionsCurrentPage = 0;
  discussionsTotalPages = 0;
  discussionsPageSize = 10;

  displayName = '';

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.displayName = params['displayName'];
      this.loadUser();
      this.loadUserAnnounces();
      this.loadUserDiscussions();
    });
  }

  async loadUser() {
    this.loading = true;
    try {
      const response = await this.userService.getUserByDisplayName(this.displayName);
      this.user = response.data ?? null;
    } catch (error) {
      this.notificationService.showError('Failed to load user details');
    } finally {
      this.loading = false;
    }
  }

  async loadUserAnnounces() {
    this.announcesLoading = true;
    try {
      const response = await this.userService.getUserAnnouncesPaginated(
        this.displayName,
        this.announcesCurrentPage,
        this.announcesPageSize
      );
      if (response.data) {
        this.announces = response.data.content;
        this.announcesTotalPages = response.data.totalPages;
      }
    } catch (error) {
      this.notificationService.showError('Failed to load user announces');
    } finally {
      this.announcesLoading = false;
    }
  }

  async loadUserDiscussions() {
    this.discussionsLoading = true;
    try {
      const response = await this.userService.getUserDiscussionsPaginated(
        this.displayName,
        this.discussionsCurrentPage,
        this.discussionsPageSize
      );
      if (response.data) {
        this.discussions = response.data.content;
        this.discussionsTotalPages = response.data.totalPages;
      }
    } catch (error) {
      this.notificationService.showError('Failed to load user discussions');
    } finally {
      this.discussionsLoading = false;
    }
  }

  goToAnnouncesPage(page: number) {
    this.announcesCurrentPage = page;
    this.loadUserAnnounces();
  }

  goToDiscussionsPage(page: number) {
    this.discussionsCurrentPage = page;
    this.loadUserDiscussions();
  }

  async handlePromoteToAdmin(): Promise<void> {
    if (!this.user || this.isUpdatingRoles) return;

    this.isUpdatingRoles = true;

    try {
      const response = await this.userService.promoteToAdmin(this.user.id);
      if (response.success && response.data) {
        this.user = response.data;
        this.notificationService.showSuccess('User promoted to admin successfully');
      } else {
        this.notificationService.showError(response.message || 'Failed to promote user to admin');
      }
    } catch (error) {
      this.notificationService.showError('Failed to promote user to admin');
    } finally {
      this.isUpdatingRoles = false;
    }
  }

  async handleRevokeAdminRole(): Promise<void> {
    if (!this.user || this.isUpdatingRoles) return;

    this.isUpdatingRoles = true;

    try {
      const response = await this.userService.revokeAdminRights(this.user.id);
      if (response.success && response.data) {
        this.user = response.data;
        this.notificationService.showSuccess('Admin role revoked successfully');
      } else {
        this.notificationService.showError(response.message || 'Failed to revoke admin role');
      }
    } catch (error) {
      this.notificationService.showError('Failed to revoke admin role');
    } finally {
      this.isUpdatingRoles = false;
    }
  }

  async handleBanUser(): Promise<void> {
    if (!this.user || this.isUpdatingStatus) return;

    this.isUpdatingStatus = true;

    try {
      const response = await this.userService.banUser(this.user.id);
      if (response.success && response.data) {
        this.user = response.data;
        this.notificationService.showSuccess('User banned successfully');
      } else {
        this.notificationService.showError(response.message || 'Failed to ban user');
      }
    } catch (error) {
      this.notificationService.showError('Failed to ban user');
    } finally {
      this.isUpdatingStatus = false;
    }
  }

  async handleUnbanUser(): Promise<void> {
    if (!this.user || this.isUpdatingStatus) return;

    this.isUpdatingStatus = true;

    try {
      const response = await this.userService.unbanUser(this.user.id);
      if (response.success && response.data) {
        this.user = response.data;
        this.notificationService.showSuccess('User unbanned successfully');
      } else {
        this.notificationService.showError(response.message || 'Failed to unban user');
      }
    } catch (error) {
      this.notificationService.showError('Failed to unban user');
    } finally {
      this.isUpdatingStatus = false;
    }
  }
}
