import { Component, Input } from '@angular/core';
import { ChipType, AnnounceStatus } from '../../../../../models/app.model';
import { ChipComponent } from '../chip/chip.component';

@Component({
  selector: 'app-announce-status-chip',
  standalone: true,
  imports: [ChipComponent],
  templateUrl: './announce-status-chip.component.html',
  styleUrl: './announce-status-chip.component.scss'
})
export class AnnounceStatusChipComponent {
  @Input() announceStatus: AnnounceStatus | null = null;

  get chipType(): ChipType {
    return this.announceStatus === 'solved' ? 'positive' : 'warning';
  }

  get label(): string {
    return this.announceStatus || 'Unknown';
  }
}
