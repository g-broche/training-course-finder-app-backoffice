import { AnnounceType, InteractivityState, RecordStatus, AnnounceStatus } from "./app.model";
import { UserExcerpt } from "./user.model";

export interface AnnounceDTO {
  id: string;
  title: string;
  description: string;
  photo: string | null;
  city: string;
  country: string;
  latitude: string;
  longitude: string;
  relevantDate: string; // ISO format (e.g., '2025-07-23')
  type: AnnounceType;
  author: UserExcerpt;
  interactivityState: InteractivityState;
  recordStatus: RecordStatus;
  status: AnnounceStatus;
  category: string;
  createdAt: string; // ISO timestamp (e.g., '2025-07-23T14:35:00Z')
  editedAt: string;
}
