import { Component, Input, Output, EventEmitter } from '@angular/core';
import { AnnounceDTO } from '../../../../models/announce.model';
import { AnnounceStatus, AnnounceType, InteractivityState, RecordStatus } from '../../../../models/app.model';
import { AppLinkLabelComponent } from '../../../shared/components/app-link-label/app-link-label.component';
import { DropdownMenuComponent, DropdownMenuItem } from '../../../shared/components/dropdown-menu/dropdown-menu.component';
import { AnnounceTypeChipComponent } from '../../../shared/components/chips/announce-type-chip/announce-type-chip.component';
import { AnnounceStatusChipComponent } from '../../../shared/components/chips/announce-status-chip/announce-status-chip.component';
import { InteractivityChipComponent } from '../../../shared/components/chips/interactivity-chip/interactivity-chip.component';
import { RecordStatusChipComponent } from '../../../shared/components/chips/record-status-chip/record-status-chip.component';

@Component({
  selector: 'app-announce-details',
  standalone: true,
  imports: [
    AppLinkLabelComponent,
    DropdownMenuComponent,
    AnnounceTypeChipComponent,
    AnnounceStatusChipComponent,
    InteractivityChipComponent,
    RecordStatusChipComponent
  ],
  templateUrl: './announce-details.component.html',
  styleUrl: './announce-details.component.scss'
})
export class AnnounceDetailsComponent {
  @Input({ required: true }) announce!: AnnounceDTO;
  @Input() isUpdatingType = false;
  @Input() isUpdatingStatus = false;
  @Input() isUpdatingInteractivity = false;
  @Input() isUpdatingVisibility = false;
  @Input() availableTypes: AnnounceType[] = [];
  @Input() availableStatuses: AnnounceStatus[] = [];
  @Input() availableInteractivities: InteractivityState[] = [];
  @Input() availableVisibilities: RecordStatus[] = [];

  @Output() typeChanged = new EventEmitter<AnnounceType>();
  @Output() statusChanged = new EventEmitter<AnnounceStatus>();
  @Output() interactivityChanged = new EventEmitter<InteractivityState>();
  @Output() visibilityChanged = new EventEmitter<RecordStatus>();

  get typeMenuItems(): DropdownMenuItem<AnnounceType>[] {
    return this.availableTypes.map(type => ({
      label: type,
      value: type
    }));
  }

  get statusMenuItems(): DropdownMenuItem<AnnounceStatus>[] {
    return this.availableStatuses.map(status => ({
      label: status,
      value: status
    }));
  }

  get interactivityMenuItems(): DropdownMenuItem<InteractivityState>[] {
    return this.availableInteractivities.map(interactivityState => ({
      label: interactivityState,
      value: interactivityState
    }));
  }

  get visibilityMenuItems(): DropdownMenuItem<RecordStatus>[] {
    return this.availableVisibilities.map(status => ({
      label: status,
      value: status
    }));
  }

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

  handleTypeChange(type: AnnounceType): void {
    this.typeChanged.emit(type);
  }

  handleStatusChange(status: AnnounceStatus): void {
    this.statusChanged.emit(status);
  }

  handleInteractivityChange(state: InteractivityState): void {
    this.interactivityChanged.emit(state);
  }

  handleVisibilityChange(status: RecordStatus): void {
    this.visibilityChanged.emit(status);
  }
}
