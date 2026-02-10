import { Injectable } from '@angular/core';
import { ApiService } from '../../core/api.service';
import { AnnounceDTO } from '../../models/announce.model';
import { ApiResponse, PaginatedResponse } from '../../models/api.model';
import { RecordStatus, AnnounceType, AnnounceStatus, InteractivityState } from '../../models/app.model';

@Injectable({
  providedIn: 'root'
})
export class AnnounceService {
  constructor(private apiService: ApiService) {}

  /**
   * Gets paginated list of announces
   * @param page Page number (0-indexed)
   * @param size Number of items per page
   * @returns Paginated response with announces
   */
  async getAnnouncesPaginated(page: number = 0, size: number = 20): Promise<ApiResponse<PaginatedResponse<AnnounceDTO>>> {
    try {
      const response = await this.apiService.get<ApiResponse<PaginatedResponse<AnnounceDTO>>>(
        `/api/admin/announces/paginated?page=${page}&size=${size}`
      );
      return response;
    } catch (error) {
      console.error('Failed to fetch announces:', error);
      throw error;
    }
  }

  /**
   * Gets a single announce by ID
   * @param announceId The ID of the announce
   * @returns The announce details
   */
  async getAnnounceById(announceId: string): Promise<ApiResponse<AnnounceDTO>> {
    try {
      const response = await this.apiService.get<ApiResponse<AnnounceDTO>>(`/api/admin/announces/${announceId}`);
      return response;
    } catch (error) {
      console.error('Failed to fetch announce:', error);
      throw error;
    }
  }

  /**
   * Updates the type of an announce
   * @param announceId The ID of the announce
   * @param newType The new type
   */
  async updateType(announceId: string, newType: AnnounceType): Promise<ApiResponse<AnnounceDTO>> {
    try {
      const response = await this.apiService.put<ApiResponse<AnnounceDTO>>(`/api/admin/announces/${announceId}/type`, { announceType: newType });
      return response;
    } catch (error) {
      console.error('Failed to update announce type:', error);
      throw error;
    }
  }

  /**
   * Updates the status of an announce
   * @param announceId The ID of the announce
   * @param newStatus The new status
   */
  async updateStatus(announceId: string, newStatus: AnnounceStatus): Promise<ApiResponse<AnnounceDTO>> {
    try {
      const response = await this.apiService.put<ApiResponse<AnnounceDTO>>(`/api/admin/announces/${announceId}/status`, { announceStatus: newStatus });
      return response;
    } catch (error) {
      console.error('Failed to update announce status:', error);
      throw error;
    }
  }

  /**
   * Updates the interactivity state of an announce
   * @param announceId The ID of the announce
   * @param newState The new interactivity state
   */
  async updateInteractivityState(announceId: string, newState: InteractivityState): Promise<ApiResponse<AnnounceDTO>> {
    try {
      const response = await this.apiService.put<ApiResponse<AnnounceDTO>>(`/api/admin/announces/${announceId}/interactivity`, { interactivityState: newState });
      return response;
    } catch (error) {
      console.error('Failed to update announce interactivity state:', error);
      throw error;
    }
  }

  /**
   * Updates the record status of an announce
   * @param announceId The ID of the announce
   * @param newStatus The new record status
   */
  async updateRecordStatus(announceId: string, newStatus: RecordStatus): Promise<ApiResponse<AnnounceDTO>> {
    try {
      const response = await this.apiService.put<ApiResponse<AnnounceDTO>>(`/api/admin/announces/${announceId}/recordstatus`, { recordStatus: newStatus });
      return response;
    } catch (error) {
      console.error('Failed to update announce record status:', error);
      throw error;
    }
  }
}
