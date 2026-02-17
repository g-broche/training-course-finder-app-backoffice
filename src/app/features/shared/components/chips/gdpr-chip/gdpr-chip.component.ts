import { Component, Input } from '@angular/core';
import { ChipType } from '../../../../../models/app.model';
import { ChipComponent } from '../chip/chip.component';

@Component({
  selector: 'app-gdpr-chip',
  standalone: true,
  imports: [ChipComponent],
  templateUrl: './gdpr-chip.component.html',
  styleUrl: './gdpr-chip.component.scss'
})
export class GdprChipComponent {
  @Input() hasAcceptedGdpr: boolean = false;

  get chipType(): ChipType {
    return this.hasAcceptedGdpr ? 'positive' : 'warning';
  }

  get label(): string {
    return this.hasAcceptedGdpr ? 'Yes' : 'No';
  }
}
