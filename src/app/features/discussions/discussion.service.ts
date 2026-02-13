import { Injectable } from '@angular/core';
import { ApiService } from '../../core/api.service';
import { DetailedDiscussionDTO, DiscussionDTO } from '../../models/discussion.model';
import { ApiResponse, PaginatedResponse } from '../../models/api.model';
import { InteractivityState } from '../../models/app.model';

@Injectable({
  providedIn: 'root'
})
export class DiscussionService {
  constructor(private apiService: ApiService) {}

  /**
   * Gets paginated list of discussions
   * @param page Page number (0-indexed)
   * @param size Number of items per page
   * @param orderBy Order by 'createdDate' or 'lastMessageDate' (default: 'createdDate')
   * @param onlyReported Optional filter to show only discussions with reported messages
   * @returns Paginated response with discussions
   */
  async getDiscussionsPaginated(
    page: number = 0,
    size: number = 20,
    orderBy: 'createdDate' | 'lastMessageDate' = 'createdDate',
    onlyReported?: boolean
  ): Promise<ApiResponse<PaginatedResponse<DiscussionDTO>>> {
    try {
      let url = `/api/admin/discussions/paginated?page=${page}&size=${size}&orderBy=${orderBy}`;
      if (onlyReported !== undefined) {
        url += `&onlyReported=${onlyReported}`;
      }
      const response = await this.apiService.get<ApiResponse<PaginatedResponse<DiscussionDTO>>>(url);
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

  /**
   * Updates the interactivity state of a discussion
   * @param discussionId The ID of the discussion
   * @param newState The new interactivity state
   */
  async updateInteractivityState(discussionId: string, newState: InteractivityState): Promise<ApiResponse<DetailedDiscussionDTO>> {
    try {
      const response = await this.apiService.put<ApiResponse<DetailedDiscussionDTO>>(`/api/admin/discussions/${discussionId}/interactivity`, { interactivityState: newState });
      return response;
    } catch (error) {
      console.error('Failed to update discussion interactivity state:', error);
      throw error;
    }
  }
}
