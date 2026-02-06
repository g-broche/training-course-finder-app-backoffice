import { Component, Input } from '@angular/core';
import { DetailedDiscussionDTO } from '../../../../models/discussion.model';
import { AppLinkLabelComponent } from '../../../shared/components/app-link-label/app-link-label.component';
import { ChipComponent } from '../../../shared/components/chip/chip.component';

@Component({
  selector: 'app-discussion-details',
  standalone: true,
  imports: [
    AppLinkLabelComponent,
    ChipComponent
  ],
  templateUrl: './discussion-details.component.html',
  styleUrl: './discussion-details.component.scss'
})
export class DiscussionDetailsComponent {
  @Input({ required: true }) discussion!: DetailedDiscussionDTO;

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
