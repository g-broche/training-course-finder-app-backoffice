export type AnnounceType = "lost" | "found";
export type AnnounceStatus = "solved" | "unsolved";
export type InteractivityState = "open" | "close";
export type RecordStatus = "shown" | "hidden" | "to delete";
export type Role = "user" | "admin";
export type UserStatus = "allowed" | "banned";

export type ChipType = 'positive' | 'warning' | 'danger' | 'neutral' | 'fail';

export enum AnnounceTypeChip {
  lost = 'warning',
  found = 'positive',
}

export enum AnnounceStatusChip {
  unsolved = 'warning',
  solved = 'positive',
}

export enum RecordStatusChip {
  shown = 'positive',
  hidden = 'warning',
  'to delete' = 'danger',
}

export enum InteractivityStateChip {
  open = 'positive',
  close = 'danger',
}

export type ButtonCategory = 'positive' | 'warning' | 'danger' | 'neutral' | 'action';

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

export interface Notification {
  id: string;
  message: string;
  type: NotificationType;
  duration?: number; // milliseconds, default 5000
}