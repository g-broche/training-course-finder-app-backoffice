import { Component, Input } from '@angular/core';
import { ChipType, Role } from '../../../../../models/app.model';
import { ChipComponent } from '../chip/chip.component';

@Component({
  selector: 'app-user-role-chip',
  standalone: true,
  imports: [ChipComponent],
  templateUrl: './user-role-chip.component.html',
  styleUrl: './user-role-chip.component.scss'
})
export class UserRoleChipComponent {
  @Input() role: Role | null = null;

  get chipType(): ChipType {
    switch (this.role) {
      case 'user':
        return 'neutral';
      case 'admin':
        return 'positive';
      default:
        return 'neutral';
    }
  }

  get label(): string {
    return this.role || 'Unknown';
  }
}
