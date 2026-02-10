import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AnnounceDTO } from '../../../../models/announce.model';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { ChipComponent } from '../../../shared/components/chip/chip.component';
import { AppRouterButtonComponent } from '../../../shared/components/app-router-button/app-router-button.component';

@Component({
  selector: 'app-announce-list',
  standalone: true,
  imports: [CommonModule, RouterModule, LoadingSpinnerComponent, ChipComponent, AppRouterButtonComponent],
  templateUrl: './announce-list.component.html',
  styleUrl: './announce-list.component.scss'
})
export class AnnounceListComponent {
  @Input() announces: AnnounceDTO[] = [];
  @Input() loading: boolean = false;

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  }

  getTypeChipType(type: string): 'positive' | 'warning' {
    return type === 'lost' ? 'warning' : 'positive';
  }

  getStatusChipType(status: string): 'positive' | 'warning' | 'danger' {
    switch (status) {
      case 'shown':
        return 'positive';
      case 'hidden':
        return 'warning';
      case 'to delete':
        return 'danger';
      default:
        return 'warning';
    }
  }
}
