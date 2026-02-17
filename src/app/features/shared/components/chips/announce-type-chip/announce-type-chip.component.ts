import { Component, Input } from '@angular/core';
import { ChipType, AnnounceType } from '../../../../../models/app.model';
import { ChipComponent } from '../chip/chip.component';

@Component({
  selector: 'app-announce-type-chip',
  standalone: true,
  imports: [ChipComponent],
  templateUrl: './announce-type-chip.component.html',
  styleUrl: './announce-type-chip.component.scss'
})
export class AnnounceTypeChipComponent {
  @Input() announceType: AnnounceType | null = null;

  get chipType(): ChipType {
    return this.announceType === 'lost' ? 'warning' : 'positive';
  }

  get label(): string {
    return this.announceType || 'Unknown';
  }
}
