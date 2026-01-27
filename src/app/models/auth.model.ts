export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message?: string;
}

export interface DecodedToken {
  roles: string[];
  exp: number;
  [key: string]: any;
}
