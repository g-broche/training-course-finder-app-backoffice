import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DiscussionListComponent } from '../../../features/discussions/components/list/discussion-list.component';
import { PaginationComponent } from '../../../features/shared/components/pagination/pagination.component';
import { AppButtonComponent } from '../../../features/shared/components/app-button/app-button.component';
import { DiscussionService } from '../../../features/discussions/discussion.service';
import { DiscussionDTO } from '../../../models/discussion.model';
import { ApiResponse, PaginatedResponse } from '../../../models/api.model';
import { NotificationService } from '../../../features/shared/services/notification.service';

@Component({
  selector: 'app-discussions-index',
  standalone: true,
  imports: [CommonModule, DiscussionListComponent, PaginationComponent, AppButtonComponent],
  templateUrl: './discussion-index.component.html',
  styleUrl: './discussion-index.component.scss'
})
export class DiscussionsIndexComponent implements OnInit {
  discussions: DiscussionDTO[] = [];
  initialLoading: boolean = true;  // Show spinner only on first load
  paginating: boolean = false;     // Track pagination loading
  currentPage: number = 0;
  pageSize: number = 10;
  totalPages: number = 0;
  totalElements: number = 0;
  orderBy: 'createdDate' | 'lastMessageDate' = 'createdDate';

  constructor(private discussionService: DiscussionService, private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.loadDiscussions();
  }

  async loadDiscussions(): Promise<void> {
    // Show spinner only on first load, disable pagination buttons during subsequent loads
    if (this.initialLoading) {
      this.initialLoading = true;
    } else {
      this.paginating = true;
    }

    try {
      const response: ApiResponse<PaginatedResponse<DiscussionDTO>> = await this.discussionService.getDiscussionsPaginated(
        this.currentPage,
        this.pageSize,
        this.orderBy
      );
      if (!response.success) {
        throw new Error(response.message || 'Failed to load discussions');
      }
      this.discussions = response!.data!.content;
      this.totalPages = response!.data!.totalPages;
      this.totalElements = response!.data!.totalElements;
    } catch (error) {
      console.error('Error loading discussions:', error);
      this.notificationService.showError('Failed to load discussions');
    } finally {
      this.initialLoading = false;
      this.paginating = false;
    }
  }

  goToPage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.loadDiscussions();
    }
  }

  toggleOrderBy(): void {
    this.orderBy = this.orderBy === 'createdDate' ? 'lastMessageDate' : 'createdDate';
    this.currentPage = 0; // Reset to first page when changing order
    this.loadDiscussions();
  }

  getOrderByLabel(): string {
    return this.orderBy === 'createdDate' ? 'Creation Date' : 'Latest Message';
  }
}
