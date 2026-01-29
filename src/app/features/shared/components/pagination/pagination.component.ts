import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss'
})
export class PaginationComponent {
  @Input() currentPage: number = 0;
  @Input() totalPages: number = 0;
  @Input() disabled: boolean = false;
  @Output() pageChange = new EventEmitter<number>();

  directPageInput: number | null = null;

  goToPage(page: number): void {
    if (page >= 0 && page < this.totalPages && page !== this.currentPage) {
      this.pageChange.emit(page);
    }
  }

  previousPage(): void {
    if (this.currentPage > 0) {
      this.pageChange.emit(this.currentPage - 1);
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.pageChange.emit(this.currentPage + 1);
    }
  }

  firstPage(): void {
    this.goToPage(0);
  }

  lastPage(): void {
    this.goToPage(this.totalPages - 1);
  }

  goToDirectPage(): void {
    if (this.directPageInput !== null) {
      const pageIndex = this.directPageInput - 1; // Convert 1-based to 0-based
      if (pageIndex >= 0 && pageIndex < this.totalPages) {
        this.goToPage(pageIndex);
        this.directPageInput = null;
      }
    }
  }

  /**
   * Calculate which page numbers to display
   * Max 9 page buttons centered around current page
   * First and last pages are handled by First/Last buttons when totalPages > 9
   */
  get visiblePages(): number[] {
    const maxVisible = 9;

    if (this.totalPages <= maxVisible) {
      // Show all pages if total is less than or equal to max
      return Array.from({ length: this.totalPages }, (_, i) => i);
    }

    // More than 9 pages: show 9 pages centered around current page
    const halfVisible = Math.floor(maxVisible / 2);
    let start = Math.max(0, this.currentPage - halfVisible);
    let end = Math.min(this.totalPages - 1, start + maxVisible - 1);

    // Adjust start if we're near the end
    if (end - start < maxVisible - 1) {
      start = Math.max(0, end - maxVisible + 1);
    }

    const pages: number[] = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  }
}
