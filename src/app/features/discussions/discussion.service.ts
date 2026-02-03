import { Injectable } from '@angular/core';
import { ApiService } from '../../core/api.service';
import { DetailedDiscussionDTO } from '../../models/discussion.model';
import { ApiResponse, PaginatedResponse } from '../../models/api.model';

@Injectable({
  providedIn: 'root'
})
export class DiscussionService {
  constructor(private apiService: ApiService) {}

  /**
   * Gets paginated list of discussions
   * @param page Page number (0-indexed)
   * @param size Number of items per page
   * @returns Paginated response with discussions
   */
  async getDiscussionsPaginated(page: number = 0, size: number = 20): Promise<ApiResponse<PaginatedResponse<DetailedDiscussionDTO>>> {
    try {
      const response = await this.apiService.get<ApiResponse<PaginatedResponse<DetailedDiscussionDTO>>>(
        `/api/admin/discussions/paginated?page=${page}&size=${size}`
      );
      return response;
    } catch (error) {
      console.error('Failed to fetch discussions:', error);
      throw error;
    }
  }

  /**
   * Gets a single discussion by ID
   * @param discussionId The ID of the discussion
   * @returns The discussion details
   */
  async getDiscussionById(discussionId: string): Promise<ApiResponse<DetailedDiscussionDTO>> {
    try {
      const response = await this.apiService.get<ApiResponse<DetailedDiscussionDTO>>(`/api/admin/discussions/${discussionId}`);
      return response;
    } catch (error) {
      console.error('Failed to fetch discussion:', error);
      throw error;
    }
  }
}
