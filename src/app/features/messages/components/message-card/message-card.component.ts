import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageDTO } from '../../../../models/message.model';
import { ChipComponent } from '../../../shared/components/chips/chip/chip.component';
import { DecodeHtmlEntitiesPipe } from '../../../shared/utils/decode-html-entities.pipe';
import { toLongDateString } from '../../../shared/utils/pipe';

@Component({
  selector: 'app-message-card',
  standalone: true,
  imports: [CommonModule, ChipComponent, DecodeHtmlEntitiesPipe],
  templateUrl: './message-card.component.html',
  styleUrl: './message-card.component.scss'
})
export class MessageCardComponent {
  @Input({ required: true }) message!: MessageDTO;
  @Input({ required: true }) isAnnounceCreator!: boolean;
  @Input() asChatMessage: boolean = false;

  formatDate(date: string): string {
    return toLongDateString(date);
  }
}
