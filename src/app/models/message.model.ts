import { UserExcerpt } from "./user.model";

export interface MessageDTO {
  messageId: string;
  discussionId: string;
  announceId: string;
  index: number;
  author: UserExcerpt;
  content: string;
  createdAt: string;
  editedAt: string;
  isReported: boolean;
}
