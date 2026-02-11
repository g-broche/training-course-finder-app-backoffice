import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AnnounceDTO } from '../../../../models/announce.model';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { AppRouterButtonComponent } from '../../../shared/components/app-router-button/app-router-button.component';
import { AnnounceTypeChipComponent } from '../../../shared/components/chips/announce-type-chip/announce-type-chip.component';
import { RecordStatusChipComponent } from '../../../shared/components/chips/record-status-chip/record-status-chip.component';

@Component({
  selector: 'app-announce-list',
  standalone: true,
  imports: [CommonModule, RouterModule, LoadingSpinnerComponent, AppRouterButtonComponent, AnnounceTypeChipComponent, RecordStatusChipComponent],
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
}
