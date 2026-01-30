export type AnnounceType = "lost" | "found";
export type AnnounceStatus = "solved" | "unsolved";
export type InteractivityState = "open" | "close";
export type RecordStatus = "shown" | "hidden" | "to delete";

export type ChipType = 'positive' | 'warning' | 'danger' | 'neutral';
export type ButtonCategory = 'positive' | 'warning' | 'danger' | 'neutral' | 'action';

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

export interface Notification {
  id: string;
  message: string;
  type: NotificationType;
  duration?: number; // milliseconds, default 5000
}