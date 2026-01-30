export type UserStatus = "allowed" | "banned";

export interface UserExcerpt {
  id: string;
  displayName: string;
}

export interface UserDetailsDTO {
  uuid: string;
  email: string;
  roles: string[];
  firstName: string;
  lastName: string;
  displayName: string;
  isVerified: boolean;
  hasAcceptedGdpr: boolean;
  userCreatedAt: Date;
}
