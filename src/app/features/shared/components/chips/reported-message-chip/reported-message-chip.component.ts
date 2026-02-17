import { Component, Input } from '@angular/core';
import { ChipType } from '../../../../../models/app.model';
import { ChipComponent } from '../chip/chip.component';

@Component({
  selector: 'app-reported-message-chip',
  standalone: true,
  imports: [ChipComponent],
  templateUrl: './reported-message-chip.component.html',
  styleUrl: './reported-message-chip.component.scss'
})
export class ReportedMessageChipComponent {
  @Input() hasReportedMessage: boolean = false;

  get chipType(): ChipType {
    return this.hasReportedMessage ? 'danger' : 'positive';
  }

  get label(): string {
    return this.hasReportedMessage ? 'Yes' : 'No';
  }
}
