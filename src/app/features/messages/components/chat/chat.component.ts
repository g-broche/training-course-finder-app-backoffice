import { Component, Input } from '@angular/core';
import { MessageDTO } from '../../../../models/message.model';
import { CommonModule } from '@angular/common';
import { MessageCardComponent } from '../message-card/message-card.component';

@Component({
  selector: 'app-discussion-messages',
  standalone: true,
  imports: [CommonModule, MessageCardComponent],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class DiscussionMessagesComponent {
  @Input({ required: true }) messages!: MessageDTO[];
  @Input({ required: true }) announceAuthorDisplayName!: string;

  isAuthorMessage(message: MessageDTO): boolean {
    return message.author.displayName === this.announceAuthorDisplayName;
  }
}
