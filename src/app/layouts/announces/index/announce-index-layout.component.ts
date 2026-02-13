import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnnounceListComponent } from '../../../features/announces/components/list/announce-list.component';
import { PaginationComponent } from '../../../features/shared/components/pagination/pagination.component';
import { AnnounceService } from '../../../features/announces/announce.service';
import { AnnounceDTO } from '../../../models/announce.model';
import { ApiResponse, PaginatedResponse } from '../../../models/api.model';
import { NotificationService } from '../../../features/shared/services/notification.service';

@Component({
  selector: 'app-announces-index-layout',
  standalone: true,
  imports: [CommonModule, AnnounceListComponent, PaginationComponent],
  templateUrl: './announce-index-layout.component.html',
  styleUrl: './announce-index-layout.component.scss'
})
export class AnnouncesIndexLayoutComponent implements OnInit {
  announces: AnnounceDTO[] = [];
  initialLoading: boolean = true;  // Show spinner only on first load
  paginating: boolean = false;     // Track pagination loading
  currentPage: number = 0;
  pageSize: number = 10;
  totalPages: number = 0;
  totalElements: number = 0;

  constructor(private announceService: AnnounceService, private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.loadAnnounces();
  }

  async loadAnnounces(): Promise<void> {
    // Show spinner only on first load, disable pagination buttons during subsequent loads
    if (this.initialLoading) {
      this.initialLoading = true;
    } else {
      this.paginating = true;
    }

    try {
      const response: ApiResponse<PaginatedResponse<AnnounceDTO>> = await this.announceService.getAnnouncesPaginated(
        this.currentPage,
        this.pageSize
      );
      if (!response.success) {
        throw new Error(response.message || 'Failed to load announces');
      }
      this.announces = response!.data!.content;
      this.totalPages = response!.data!.totalPages;
      this.totalElements = response!.data!.totalElements;
    } catch (error) {
      this.notificationService.showError('Failed to load announces');

    } finally {
      this.initialLoading = false;
      this.paginating = false;
    }
  }

  goToPage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.loadAnnounces();
    }
  }
}
