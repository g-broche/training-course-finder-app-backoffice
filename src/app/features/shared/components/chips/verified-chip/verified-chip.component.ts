import { Component, Input } from '@angular/core';
import { ChipType } from '../../../../../models/app.model';
import { ChipComponent } from '../chip/chip.component';

@Component({
  selector: 'app-verified-chip',
  standalone: true,
  imports: [ChipComponent],
  templateUrl: './verified-chip.component.html',
  styleUrl: './verified-chip.component.scss'
})
export class VerifiedChipComponent {
  @Input() isVerified: boolean = false;

  get chipType(): ChipType {
    return this.isVerified ? 'positive' : 'warning';
  }

  get label(): string {
    return this.isVerified ? 'Yes' : 'No';
  }
}
