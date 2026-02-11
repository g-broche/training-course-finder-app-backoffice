import { Role, UserStatus } from "./app.model";

export interface UserExcerpt {
  id: string;
  displayName: string;
}

export interface UserDTO {
  id: string;
  email: string;
  roles: Role[];
  status: UserStatus;
  firstName: string;
  lastName: string;
  displayName: string;
  isVerified: boolean;
  hasAcceptedGdpr: boolean;
  hasHadReportedMessages: boolean;
  createdAt: Date;
}