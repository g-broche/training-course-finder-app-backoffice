import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AnnounceListComponent } from '../../../features/announces/components/list/announce-list.component';
import { PaginationComponent } from '../../../features/shared/components/pagination/pagination.component';
import { AppButtonComponent } from '../../../features/shared/components/app-button/app-button.component';
import { AnnounceService } from '../../../features/announces/announce.service';
import { CategoryService } from '../../../features/categories/category.service';
import { AnnounceDTO } from '../../../models/announce.model';
import { ApiResponse, PaginatedResponse } from '../../../models/api.model';
import { NotificationService } from '../../../features/shared/services/notification.service';
import { Category } from '../../../models/category.model';

@Component({
  selector: 'app-announces-index-layout',
  standalone: true,
  imports: [CommonModule, FormsModule, AnnounceListComponent, PaginationComponent, AppButtonComponent],
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
  
  // Filter properties
  filterTitle: string = '';
  filterCity: string = '';
  filterCategoryId: number | null = null;
  
  // Categories
  categories: Category[] = [];
  categoriesLoading: boolean = true;

  constructor(
    private announceService: AnnounceService,
    private categoryService: CategoryService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadAnnounces();
  }

  async loadCategories(): Promise<void> {
    try {
      const response: ApiResponse<Category[]> = await this.categoryService.getCategories();
      if (!response.success) {
        throw new Error(response.message || 'Failed to load categories');
      }
      this.categories = response.data || [];
    } catch (error) {
      this.notificationService.showError('Failed to load categories filter');
    } finally {
      this.categoriesLoading = false;
    }
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
        this.pageSize,
        this.filterTitle,
        this.filterCity,
        this.filterCategoryId !== null ? this.filterCategoryId : undefined
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

  applyFilters(): void {
    this.currentPage = 0;
    this.loadAnnounces();
  }
  
  clearFilters(): void {
    this.filterTitle = '';
    this.filterCity = '';
    this.filterCategoryId = null;
    this.currentPage = 0;
    this.loadAnnounces();
  }

  goToPage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.loadAnnounces();
    }
  }
}
