import { MessageDTO } from './message.model';
import { UserExcerpt } from './user.model';

export interface DetailedDiscussionDTO {
  discussionId: string;
  announceId: string;
  announceAuthor: UserExcerpt;
  announceResponder: UserExcerpt;
  announceTitle: string;
  interactivityStateName: string;
  messages: MessageDTO[];
  hasReportedMessage: boolean;
  createdAt: string; // ISO timestamp
  editedAt: string;
  lastMessageDate: string;
}
