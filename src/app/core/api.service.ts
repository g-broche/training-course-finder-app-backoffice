import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = environment.apiBaseUrl;

  constructor() {}

  /**
   * Makes a GET request to the API
   * @param endpoint - The API endpoint path (e.g., '/api/admin/announces/paginated')
   * @param params - Optional query parameters
   */
  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    const url = this.buildUrl(endpoint, params);
    const response = await fetch(url, {
      method: 'GET',
      headers: this.getHeaders(),
      credentials: 'include', // Include cookies for JWT
    });

    return this.handleResponse<T>(response);
  }

  /**
   * Makes a POST request to the API
   * @param endpoint - The API endpoint path
   * @param body - The request body
   */
  async post<T>(endpoint: string, body?: any): Promise<T> {
    const url = this.buildUrl(endpoint);
    const response = await fetch(url, {
      method: 'POST',
      headers: this.getHeaders(),
      credentials: 'include', // Include cookies for JWT
      body: body ? JSON.stringify(body) : undefined,
    });

    return this.handleResponse<T>(response);
  }

  /**
   * Makes a PUT request to the API
   * @param endpoint - The API endpoint path
   * @param body - The request body
   */
  async put<T>(endpoint: string, body?: any): Promise<T> {
    const url = this.buildUrl(endpoint);
    const response = await fetch(url, {
      method: 'PUT',
      headers: this.getHeaders(),
      credentials: 'include', // Include cookies for JWT
      body: body ? JSON.stringify(body) : undefined,
    });

    return this.handleResponse<T>(response);
  }

  /**
   * Makes a DELETE request to the API
   * @param endpoint - The API endpoint path
   */
  async delete<T>(endpoint: string): Promise<T> {
    const url = this.buildUrl(endpoint);
    const response = await fetch(url, {
      method: 'DELETE',
      headers: this.getHeaders(),
      credentials: 'include', // Include cookies for JWT
    });

    return this.handleResponse<T>(response);
  }

  /**
   * Builds the full URL from base URL and endpoint
   */
  private buildUrl(endpoint: string, params?: Record<string, any>): string {
    let url = `${this.baseUrl}${endpoint}`;
    
    if (params) {
      const queryString = Object.entries(params)
        .filter(([_, value]) => value !== undefined && value !== null)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join('&');
      
      if (queryString) {
        url += `?${queryString}`;
      }
    }
    
    return url;
  }

  /**
   * Gets the default headers for requests
   */
  private getHeaders(): HeadersInit {
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
  }

  /**
   * Handles the API response and error cases
   */
  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      // Handle error responses
      let errorMessage = `HTTP error! status: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch (e) {
        // Response body might not be JSON
      }
      throw new Error(errorMessage);
    }

    // Parse successful response
    try {
      return await response.json();
    } catch (e) {
      // Response might be empty or not JSON
      return {} as T;
    }
  }
}

//TODO: fix api 


