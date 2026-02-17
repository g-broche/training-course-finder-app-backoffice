import { Component, Input } from '@angular/core';
import { ChipType, RecordStatus } from '../../../../../models/app.model';
import { ChipComponent } from '../chip/chip.component';

@Component({
  selector: 'app-record-status-chip',
  standalone: true,
  imports: [ChipComponent],
  templateUrl: './record-status-chip.component.html',
  styleUrl: './record-status-chip.component.scss'
})
export class RecordStatusChipComponent {
  @Input() recordStatus: RecordStatus | null = null;

  get chipType(): ChipType {
    switch (this.recordStatus) {
      case 'shown':
        return 'positive';
      case 'hidden':
        return 'warning';
      case 'to delete':
        return 'danger';
      default:
        return 'neutral';
    }
  }

  get label(): string {
    return this.recordStatus || 'Unknown';
  }
}
