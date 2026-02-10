import { MessageDTO } from './message.model';
import { UserExcerpt } from './user.model';
import { InteractivityState } from './app.model';

export interface DiscussionDTO {
  discussionId: string;
  announceId: string;
  announceAuthor: UserExcerpt;
  announceResponder: UserExcerpt;
  announceTitle: string;
  interactivityStateName: InteractivityState;
  messageCount: number;
  hasReportedMessage: boolean;
  createdAt: string; // ISO timestamp
  editedAt: string;
  lastMessageDate: string;
}
export interface DetailedDiscussionDTO {
  discussionId: string;
  announceId: string;
  announceAuthor: UserExcerpt;
  announceResponder: UserExcerpt;
  announceTitle: string;
  interactivityStateName: InteractivityState;
  messages: MessageDTO[];
  hasReportedMessage: boolean;
  createdAt: string; // ISO timestamp
  editedAt: string;
  lastMessageDate: string;
}
