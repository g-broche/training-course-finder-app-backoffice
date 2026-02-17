import { Injectable } from '@angular/core';
import { ApiService } from '../../core/api.service';
import { Category } from '../../models/category.model';
import { ApiResponse } from '../../models/api.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  constructor(private apiService: ApiService) {}

  /**
   * Gets all categories
   * @returns List of categories
   */
  async getCategories(): Promise<ApiResponse<Category[]>> {
    try {
      const response = await this.apiService.get<ApiResponse<Category[]>>('/api/categories');
      return response;
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      throw error;
    }
  }
}
