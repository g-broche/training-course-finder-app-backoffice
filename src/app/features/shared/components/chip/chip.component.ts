import { Component, Input } from '@angular/core';

export type ChipType = 'positive' | 'warning' | 'danger' | 'neutral';

@Component({
  selector: 'app-chip',
  imports: [],
  templateUrl: './chip.component.html',
  styleUrl: './chip.component.scss'
})
export class ChipComponent {
  @Input() label: string = '';
  @Input() type: ChipType = 'neutral';
}
