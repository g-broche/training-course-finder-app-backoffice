import { Injectable } from '@angular/core';
import { ApiService } from '../../core/api.service';
import { UserDTO } from '../../models/user.model';
import { ApiResponse, PaginatedResponse } from '../../models/api.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private apiService: ApiService) {}

  /**
   * Gets paginated list of users
   * @param page Page number (0-indexed)
   * @param size Number of items per page
   * @returns Paginated response with users
   */
  async getUsersPaginated(page: number = 0, size: number = 20): Promise<ApiResponse<PaginatedResponse<UserDTO>>> {
    try {
      const response = await this.apiService.get<ApiResponse<PaginatedResponse<UserDTO>>>(
        `/api/admin/users/paginated?page=${page}&size=${size}`
      );
      return response;
    } catch (error) {
      console.error('Failed to fetch users:', error);
      throw error;
    }
  }
}
