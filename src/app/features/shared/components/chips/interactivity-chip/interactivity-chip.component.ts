import { Component, Input } from '@angular/core';
import { ChipType, InteractivityState } from '../../../../../models/app.model';
import { ChipComponent } from '../chip/chip.component';

@Component({
  selector: 'app-interactivity-chip',
  standalone: true,
  imports: [ChipComponent],
  templateUrl: './interactivity-chip.component.html',
  styleUrl: './interactivity-chip.component.scss'
})
export class InteractivityChipComponent {
  @Input() interactivityState: InteractivityState | null = null;

  get chipType(): ChipType {
    return this.interactivityState === 'open' ? 'positive' : 'danger';
  }

  get label(): string {
    return this.interactivityState || 'Unknown';
  }
}
