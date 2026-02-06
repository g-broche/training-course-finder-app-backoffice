import { Component, Input } from '@angular/core';
import { AnnounceDTO } from '../../../../models/announce.model';
import { RecordStatus } from '../../../../models/app.model';
import { AppButtonComponent } from '../../../shared/components/app-button/app-button.component';
import { ChipComponent } from '../../../shared/components/chip/chip.component';
import { AppLinkLabelComponent } from '../../../shared/components/app-link-label/app-link-label.component';

@Component({
  selector: 'app-announce-details',
  standalone: true,
  imports: [
    AppLinkLabelComponent,
    AppButtonComponent,
    ChipComponent
  ],
  templateUrl: './announce-details.component.html',
  styleUrl: './announce-details.component.scss'
})
export class AnnounceDetailsComponent {
  @Input({ required: true }) announce!: AnnounceDTO;
  @Input() isUpdatingStatus = false;
  @Input() showStatusMenu = false;
  @Input() onToggleStatusMenu!: () => void;
  @Input() onChangeRecordStatus!: (status: RecordStatus) => void;
  @Input() availableStatuses: RecordStatus[] = [];

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getTypeChipType(): 'positive' | 'neutral' {
    return this.announce?.type === 'found' ? 'positive' : 'neutral';
  }

  getStatusChipType(): 'positive' | 'warning' {
    return this.announce?.status === 'solved' ? 'positive' : 'warning';
  }

  getRecordStatusChipType(): 'positive' | 'warning' | 'danger' {
    if (!this.announce) return 'neutral' as any;
    switch (this.announce.recordStatus) {
      case 'shown': return 'positive';
      case 'hidden': return 'warning';
      case 'to delete': return 'danger';
      default: return 'neutral' as any;
    }
  }

  getInteractivityChipType(): 'positive' | 'neutral' {
    return this.announce?.interactivityState === 'open' ? 'positive' : 'neutral';
  }

  toggleStatusMenu(): void {
    if (this.onToggleStatusMenu) {
      this.onToggleStatusMenu();
    }
  }

  changeRecordStatus(status: RecordStatus): void {
    if (this.onChangeRecordStatus) {
      this.onChangeRecordStatus(status);
    }
  }
}
