export interface ApiResponse<T> {
    success: boolean;
    message?: string;
    data?: T;
}

export interface ApiResponseSuccess<T> {
    success: true;
    message?: string;
    data?: T;
}

export interface ApiResponseError<T> {
    success: false;
    message?: string;
    data?: T;
}

export interface PaginatedResponse<T> {
  content: T[];
  last: boolean;
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}
