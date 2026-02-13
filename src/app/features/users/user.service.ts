import { Injectable } from '@angular/core';
import { ApiService } from '../../core/api.service';
import { UserDTO } from '../../models/user.model';
import { ApiResponse, PaginatedResponse } from '../../models/api.model';
import { Role, UserStatus } from '../../models/app.model';
import { AnnounceDTO } from '../../models/announce.model';
import { DiscussionDTO } from '../../models/discussion.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private apiService: ApiService) {}

  /**
   * Gets paginated list of users
   * @param page Page number (0-indexed)
   * @param size Number of items per page
   * @param displayName Optional filter by displayName
   * @returns Paginated response with users
   */
  async getUsersPaginated(
    page: number = 0, 
    size: number = 20, 
    displayName?: string
  ): Promise<ApiResponse<PaginatedResponse<UserDTO>>> {
    try {
      let url = `/api/admin/users/paginated?page=${page}&size=${size}`;
      if (displayName && displayName.trim()) {
        url += `&displayName=${encodeURIComponent(displayName.trim())}`;
      }
      const response = await this.apiService.get<ApiResponse<PaginatedResponse<UserDTO>>>(url);
      return response;
    } catch (error) {
      console.error('Failed to fetch users:', error);
      throw error;
    }
  }

  /**
   * Gets a user by their display name
   * @param displayName The user's display name
   * @returns User details
   */
  async getUserByDisplayName(displayName: string): Promise<ApiResponse<UserDTO>> {
    try {
      const response = await this.apiService.get<ApiResponse<UserDTO>>(
        `/api/admin/users/${displayName}`
      );
      return response;
    } catch (error) {
      console.error('Failed to fetch user:', error);
      throw error;
    }
  }

  /**
   * Gets paginated list of announces posted by a user
   * @param displayName The user's display name
   * @param page Page number (0-indexed)
   * @param size Number of items per page
   * @returns Paginated response with announces
   */
  async getUserAnnouncesPaginated(displayName: string, page: number = 0, size: number = 20): Promise<ApiResponse<PaginatedResponse<AnnounceDTO>>> {
    try {
      const response = await this.apiService.get<ApiResponse<PaginatedResponse<AnnounceDTO>>>(
        `/api/admin/users/${displayName}/announces?page=${page}&size=${size}`
      );
      return response;
    } catch (error) {
      console.error('Failed to fetch user announces:', error);
      throw error;
    }
  }

  /**
   * Gets paginated list of discussions a user was involved in
   * @param displayName The user's display name
   * @param page Page number (0-indexed)
   * @param size Number of items per page
   * @returns Paginated response with discussions
   */
  async getUserDiscussionsPaginated(displayName: string, page: number = 0, size: number = 20): Promise<ApiResponse<PaginatedResponse<DiscussionDTO>>> {
    try {
      const response = await this.apiService.get<ApiResponse<PaginatedResponse<DiscussionDTO>>>(
        `/api/admin/users/${displayName}/discussions?page=${page}&size=${size}`
      );
      return response;
    } catch (error) {
      console.error('Failed to fetch user discussions:', error);
      throw error;
    }
  }


  async revokeAdminRights(uuid: string): Promise<ApiResponse<UserDTO>> {
    try {
      const response = await this.apiService.put<ApiResponse<UserDTO>>(
        `/api/admin/users/${uuid}/revoke-admin`,
      );
      return response;
    } catch (error) {
      console.error('Failed to revoke user admin role:', error);
      throw error;
    }
  }

  async promoteToAdmin(uuid: string): Promise<ApiResponse<UserDTO>> {
    try {
      const response = await this.apiService.put<ApiResponse<UserDTO>>(
        `/api/admin/users/${uuid}/promote-admin`,
      );
      return response;
    } catch (error) {
      console.error('Failed to promote user to admin:', error);
      throw error;
    }
  }

  async banUser(uuid: string): Promise<ApiResponse<UserDTO>> {
    try {
      const response = await this.apiService.put<ApiResponse<UserDTO>>(
        `/api/admin/users/${uuid}/ban`,
      );
      return response;
    } catch (error) {
      console.error('Failed to ban user:', error);
      throw error;
    }
  }

  async unbanUser(uuid: string): Promise<ApiResponse<UserDTO>> {
    try {
      const response = await this.apiService.put<ApiResponse<UserDTO>>(
        `/api/admin/users/${uuid}/unban`,
      );
      return response;
    } catch (error) {
      console.error('Failed to unban user:', error);
      throw error;
    }
  }
}
