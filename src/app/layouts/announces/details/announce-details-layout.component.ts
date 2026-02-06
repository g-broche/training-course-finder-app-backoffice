import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AnnounceService } from '../../../features/announces/announce.service';
import { NotificationService } from '../../../features/shared/services/notification.service';
import { AnnounceDTO } from '../../../models/announce.model';
import { RecordStatus, AnnounceType, AnnounceStatus, InteractivityState } from '../../../models/app.model';
import { LoadingSpinnerComponent } from '../../../features/shared/components/loading-spinner/loading-spinner.component';
import { AnnounceDetailsComponent } from '../../../features/announces/components/details/announce-details.component';
import { ErrorStateComponent } from '../../../features/shared/components/error-state/error-state.component';

@Component({
  selector: 'app-announce-details-layout',
  standalone: true,
  imports: [
    LoadingSpinnerComponent,
    ErrorStateComponent,
    AnnounceDetailsComponent
  ],
  templateUrl: './announce-details-layout.component.html',
  styleUrl: './announce-details-layout.component.scss'
})
export class AnnounceDetailsLayoutComponent implements OnInit {
  announce: AnnounceDTO | null = null;
  isLoading = true;
  error: string | null = null;
  isUpdatingType = false;
  isUpdatingStatus = false;
  isUpdatingInteractivity = false;
  isUpdatingVisibility = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private announceService: AnnounceService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    const announceId = this.route.snapshot.paramMap.get('id');
    if (announceId) {
      this.loadAnnounce(announceId);
    } else {
      const errorMessage = 'No announce ID provided';
      this.notificationService.showError(errorMessage);
      this.error = errorMessage;
      this.router.navigate(['/announces']);
    }
  }

  async loadAnnounce(id: string): Promise<void> {
    this.isLoading = true;
    this.error = null;
    try {
      const response = await this.announceService.getAnnounceById(id);
      this.announce = response.data || null;
      if (!this.announce) {
        const errorMessage = !!response && response.message
        ? response.message
        : 'an error occurred while fetching the announce details';
        this.error = errorMessage;
        this.notificationService.showError(errorMessage);
      }
    } catch (error) {
        console.error('Error loading announce:', error);
        const errorMessage = 'Failed to load announce details'
        this.error = errorMessage;
        this.notificationService.showError(errorMessage);
    } finally {
      this.isLoading = false;
    }
  }

  async changeType(newType: AnnounceType): Promise<void> {
    if (!this.announce || this.isUpdatingType) return;

    this.isUpdatingType = true;

    try {
      const updateResponse = await this.announceService.updateType(this.announce.id, newType);
      if (!updateResponse.success) {
        console.error('Error updating type:', updateResponse.message);
        this.notificationService.showError('Failed to update type');
        return;
      }
      this.announce = updateResponse.data!;
      this.notificationService.showSuccess(`Type updated to "${newType}"`);
    } catch (error) {
      console.error('Error updating type:', error);
      this.notificationService.showError('Failed to update type');
    } finally {
      this.isUpdatingType = false;
    }
  }

  async changeStatus(newStatus: AnnounceStatus): Promise<void> {
    if (!this.announce || this.isUpdatingStatus) return;

    this.isUpdatingStatus = true;

    try {
      const updateResponse = await this.announceService.updateStatus(this.announce.id, newStatus);
      if (!updateResponse.success) {
        console.error('Error updating status:', updateResponse.message);
        this.notificationService.showError('Failed to update status');
        return;
      }
      this.announce = updateResponse.data!;
      this.notificationService.showSuccess(`Status updated to "${newStatus}"`);
    } catch (error) {
      console.error('Error updating status:', error);
      this.notificationService.showError('Failed to update status');
    } finally {
      this.isUpdatingStatus = false;
    }
  }

  async changeInteractivity(newState: InteractivityState): Promise<void> {
    if (!this.announce || this.isUpdatingInteractivity) return;

    this.isUpdatingInteractivity = true;

    try {
      const updateResponse = await this.announceService.updateInteractivityState(this.announce.id, newState);
      if (!updateResponse.success) {
        console.error('Error updating interactivity state:', updateResponse.message);
        this.notificationService.showError('Failed to update interactivity state');
        return;
      }
      this.announce = updateResponse.data!;
      this.notificationService.showSuccess(`Interactivity updated to "${newState}"`);
    } catch (error) {
      console.error('Error updating interactivity state:', error);
      this.notificationService.showError('Failed to update interactivity state');
    } finally {
      this.isUpdatingInteractivity = false;
    }
  }

  async changeVisibility(newStatus: RecordStatus): Promise<void> {
    if (!this.announce || this.isUpdatingVisibility) return;

    this.isUpdatingVisibility = true;

    try {
      const updateResponse = await this.announceService.updateRecordStatus(this.announce.id, newStatus);
      if (!updateResponse.success) {
        console.error('Error updating record status:', updateResponse.message);
        this.notificationService.showError('Failed to update record status');
        return;
      }
      this.announce = updateResponse.data!;
      this.notificationService.showSuccess(`Visibility updated to "${newStatus}"`);
    } catch (error) {
      console.error('Error updating record status:', error);
      this.notificationService.showError('Failed to update record status');
    } finally {
      this.isUpdatingVisibility = false;
    }
  }

  getAvailableTypes(): AnnounceType[] {
    if (!this.announce) return [];
    const allTypes: AnnounceType[] = ['lost', 'found'];
    return allTypes.filter(type => type !== this.announce!.type);
  }

  getAvailableStatuses(): AnnounceStatus[] {
    if (!this.announce) return [];
    const allStatuses: AnnounceStatus[] = ['unsolved', 'solved'];
    return allStatuses.filter(status => status !== this.announce!.status);
  }

  getAvailableInteractivities(): InteractivityState[] {
    if (!this.announce) return [];
    const allStates: InteractivityState[] = ['open', 'close'];
    return allStates.filter(state => state !== this.announce!.interactivityState);
  }

  getAvailableVisibilities(): RecordStatus[] {
    if (!this.announce) return [];
    const allStatuses: RecordStatus[] = ['shown', 'hidden', 'to delete'];
    return allStatuses.filter(status => status !== this.announce!.recordStatus);
  }
}
