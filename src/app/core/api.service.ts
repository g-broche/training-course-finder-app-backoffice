import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = environment.apiBaseUrl;
  private isRefreshing = false;
  private failedQueue: Array<{
    resolve: (value?: any) => void;
    reject: (error: any) => void;
  }> = [];

  constructor() {}

  /**
   * Makes a GET request to the API
   * @param endpoint - The API endpoint path (e.g., '/api/admin/announces/paginated')
   * @param params - Optional query parameters
   */
  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    const url = this.buildUrl(endpoint, params);
    const makeRequest = () => fetch(url, {
      method: 'GET',
      headers: this.getHeaders(),
      credentials: 'include', // Include cookies for JWT
    });
    
    const response = await makeRequest();
    return this.handleResponse<T>(response, makeRequest);
  }

  /**
   * Makes a POST request to the API
   * @param endpoint - The API endpoint path
   * @param body - The request body
   */
  async post<T>(endpoint: string, body?: any): Promise<T> {
    const url = this.buildUrl(endpoint);
    const makeRequest = () => fetch(url, {
      method: 'POST',
      headers: this.getHeaders(),
      credentials: 'include', // Include cookies for JWT
      body: body ? JSON.stringify(body) : undefined,
    });
    
    const response = await makeRequest();
    return this.handleResponse<T>(response, makeRequest);
  }

  /**
   * Makes a PUT request to the API
   * @param endpoint - The API endpoint path
   * @param body - The request body
   */
  async put<T>(endpoint: string, body?: any): Promise<T> {
    const url = this.buildUrl(endpoint);
    const makeRequest = () => fetch(url, {
      method: 'PUT',
      headers: this.getHeaders(),
      credentials: 'include', // Include cookies for JWT
      body: body ? JSON.stringify(body) : undefined,
    });
    
    const response = await makeRequest();
    return this.handleResponse<T>(response, makeRequest);
  }

  /**
   * Makes a PATCH request to the API
   * @param endpoint - The API endpoint path
   * @param body - The request body
   */
  async patch<T>(endpoint: string, body?: any): Promise<T> {
    const url = this.buildUrl(endpoint);
    const makeRequest = () => fetch(url, {
      method: 'PATCH',
      headers: this.getHeaders(),
      credentials: 'include', // Include cookies for JWT
      body: body ? JSON.stringify(body) : undefined,
    });
    
    const response = await makeRequest();
    return this.handleResponse<T>(response, makeRequest);
  }

  /**
   * Makes a DELETE request to the API
   * @param endpoint - The API endpoint path
   */
  async delete<T>(endpoint: string): Promise<T> {
    const url = this.buildUrl(endpoint);
    const makeRequest = () => fetch(url, {
      method: 'DELETE',
      headers: this.getHeaders(),
      credentials: 'include', // Include cookies for JWT
    });
    
    const response = await makeRequest();
    return this.handleResponse<T>(response, makeRequest);
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
  private async handleResponse<T>(response: Response, originalRequest?: () => Promise<Response>): Promise<T> {
    if (!response.ok) {
      // Handle 401 Unauthorized - token might be expired
      if (response.status === 401 && originalRequest) {
        if (this.isRefreshing) {
          // Wait for the ongoing refresh to complete
          return new Promise((resolve, reject) => {
            this.failedQueue.push({ resolve, reject });
          }).then(() => {
            // Retry the original request with refreshed tokens
            return originalRequest().then(retryResponse => 
              this.handleResponse<T>(retryResponse)
            );
          });
        }

        // Start refresh process
        this.isRefreshing = true;

        try {
          // Attempt to refresh the token
          await this.performRefresh();
          
          // Refresh succeeded - process the queue
          this.processQueue(null);
          
          // Retry the original request with new tokens
          const retryResponse = await originalRequest();
          return this.handleResponse<T>(retryResponse);
        } catch (refreshError) {
          // Refresh failed - reject all queued requests
          this.processQueue(refreshError);
          
          // Throw error for current request
          console.error('Token refresh failed:', refreshError);
          throw new Error('Session expired. Please log in again.');
        } finally {
          this.isRefreshing = false;
        }
      }

      // Handle other error responses
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

  /**
   * Processes the queue of failed requests after token refresh
   * @param error - If present, all queued requests will be rejected with this error
   */
  private processQueue(error: any): void {
    this.failedQueue.forEach(promise => {
      if (error) {
        promise.reject(error);
      } else {
        promise.resolve();
      }
    });
    this.failedQueue = [];
  }

  /**
   * Performs the actual token refresh API call
   */
  private async performRefresh(): Promise<void> {
    const url = this.buildUrl('/api/admin/auth/refresh');
    const response = await fetch(url, {
      method: 'POST',
      headers: this.getHeaders(),
      credentials: 'include', // Send refresh token cookie
    });

    if (!response.ok) {
      throw new Error('Token refresh failed');
    }
  }
}


