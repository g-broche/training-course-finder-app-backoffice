import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageDTO } from '../../../../models/message.model';
import { AppRouterButtonComponent } from '../../../shared/components/app-router-button/app-router-button.component';
import { ChipComponent } from '../../../shared/components/chip/chip.component';

@Component({
  selector: 'app-message-card',
  standalone: true,
  imports: [CommonModule, AppRouterButtonComponent, ChipComponent],
  templateUrl: './message-card.component.html',
  styleUrl: './message-card.component.scss'
})
export class MessageCardComponent {
  @Input({ required: true }) message!: MessageDTO;
  @Input({ required: true }) isAnnounceCreator!: boolean;
  @Input() asChatMessage: boolean = false;

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
