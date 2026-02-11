import { Component, Input } from '@angular/core';
import { ChipType, UserStatus } from '../../../../../models/app.model';
import { ChipComponent } from '../chip/chip.component';

@Component({
  selector: 'app-user-status-chip',
  standalone: true,
  imports: [ChipComponent],
  templateUrl: './user-status-chip.component.html',
  styleUrl: './user-status-chip.component.scss'
})
export class UserStatusChipComponent {
  @Input() userStatus: UserStatus | null = null;

  get chipType(): ChipType {
    switch (this.userStatus) {
      case 'allowed':
        return 'positive';
      case 'banned':
        return 'danger';
      default:
        return 'neutral';
    }
  }

  get label(): string {
    return this.userStatus || 'Unknown';
  }
}
