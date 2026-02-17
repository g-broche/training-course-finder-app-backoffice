import { Component, Input } from '@angular/core';
import { ChipType } from '../../../../../models/app.model';

@Component({
  selector: 'app-chip',
  standalone: true,
  imports: [],
  templateUrl: './chip.component.html',
  styleUrl: './chip.component.scss'
})
export class ChipComponent {
  @Input() label: string = '';
  @Input() type: ChipType = 'neutral';
}
