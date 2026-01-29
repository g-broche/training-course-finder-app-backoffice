export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message?: string;
}

export interface DecodedToken {
  sub: string; // email
  uuid: string;
  roles: string[];
  firstName: string;
  lastName: string;
  displayName: string;
  isVerified: boolean;
  hasAcceptedGdpr: boolean;
  userCreatedAt: number; // timestamp in milliseconds
  iat: number; // issued at
  exp: number; // expiration
}

export interface CurrentUser {
  uuid: string;
  email: string;
  roles: Role[];
  firstName: string;
  lastName: string;
  displayName: string;
  isVerified: boolean;
  hasAcceptedGdpr: boolean;
  userCreatedAt: Date;
}

export interface Role {
  name: string;
}
