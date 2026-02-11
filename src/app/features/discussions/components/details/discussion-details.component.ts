import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DetailedDiscussionDTO } from '../../../../models/discussion.model';
import { InteractivityState } from '../../../../models/app.model';
import { AppLinkLabelComponent } from '../../../shared/components/app-link-label/app-link-label.component';
import { DropdownMenuComponent, DropdownMenuItem } from '../../../shared/components/dropdown-menu/dropdown-menu.component';
import { InteractivityChipComponent } from '../../../shared/components/chips/interactivity-chip/interactivity-chip.component';
import { ReportedMessageChipComponent } from '../../../shared/components/chips/reported-message-chip/reported-message-chip.component';

@Component({
  selector: 'app-discussion-details',
  standalone: true,
  imports: [
    AppLinkLabelComponent,
    DropdownMenuComponent,
    InteractivityChipComponent,
    ReportedMessageChipComponent
  ],
  templateUrl: './discussion-details.component.html',
  styleUrl: './discussion-details.component.scss'
})
export class DiscussionDetailsComponent {
  @Input({ required: true }) discussion!: DetailedDiscussionDTO;
  @Input() isUpdatingInteractivity = false;
  @Input() availableInteractivities: InteractivityState[] = [];

  @Output() interactivityChanged = new EventEmitter<InteractivityState>();

  get interactivityMenuItems(): DropdownMenuItem<InteractivityState>[] {
    return this.availableInteractivities.map(state => ({
      label: state,
      value: state
    }));
  }

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

  handleInteractivityChange(state: InteractivityState): void {
    this.interactivityChanged.emit(state);
  }
}
