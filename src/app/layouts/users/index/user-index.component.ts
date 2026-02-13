import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserListComponent } from '../../../features/users/components/list/user-list.component';
import { PaginationComponent } from '../../../features/shared/components/pagination/pagination.component';
import { UserService } from '../../../features/users/user.service';
import { UserDTO } from '../../../models/user.model';
import { ApiResponse, PaginatedResponse } from '../../../models/api.model';
import { NotificationService } from '../../../features/shared/services/notification.service';

@Component({
  selector: 'app-users-index',
  standalone: true,
  imports: [CommonModule, UserListComponent, PaginationComponent],
  templateUrl: './user-index.component.html',
  styleUrl: './user-index.component.scss'
})
export class UsersIndexComponent implements OnInit {
  users: UserDTO[] = [];
  initialLoading: boolean = true;
  paginating: boolean = false;
  currentPage: number = 0;
  pageSize: number = 10;
  totalPages: number = 0;
  totalElements: number = 0;

  constructor(private userService: UserService, private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  async loadUsers(): Promise<void> {
    if (this.initialLoading) {
      this.initialLoading = true;
    } else {
      this.paginating = true;
    }

    try {
      const response: ApiResponse<PaginatedResponse<UserDTO>> = await this.userService.getUsersPaginated(
        this.currentPage,
        this.pageSize
      );
      if (!response.success) {
        throw new Error(response.message || 'Failed to load users');
      }
      this.users = response!.data!.content;
      this.totalPages = response!.data!.totalPages;
      this.totalElements = response!.data!.totalElements;
    } catch (error) {
      this.notificationService.showError('Failed to load users');
    } finally {
      this.initialLoading = false;
      this.paginating = false;
    }
  }

  goToPage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.loadUsers();
    }
  }
}
