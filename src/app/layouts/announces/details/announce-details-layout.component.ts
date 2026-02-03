import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AnnounceService } from '../../../features/announces/announce.service';
import { NotificationService } from '../../../features/shared/services/notification.service';
import { AnnounceDTO } from '../../../models/announce.model';
import { RecordStatus } from '../../../models/app.model';
import { LoadingSpinnerComponent } from '../../../features/shared/components/loading-spinner/loading-spinner.component';
import { AppRouterButtonComponent } from '../../../features/shared/components/app-router-button/app-router-button.component';
import { AnnounceDetailsComponent } from '../../../features/announces/components/details/announce-details.component';

@Component({
  selector: 'app-announce-details-layout',
  standalone: true,
  imports: [
    LoadingSpinnerComponent,
    AppRouterButtonComponent,
    AnnounceDetailsComponent
  ],
  templateUrl: './announce-details-layout.component.html',
  styleUrl: './announce-details-layout.component.scss'
})
export class AnnounceDetailsLayoutComponent implements OnInit {
  announce: AnnounceDTO | null = null;
  isLoading = true;
  isUpdatingStatus = false;
  showStatusMenu = false;

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
      this.notificationService.showError('No announce ID provided');
      this.router.navigate(['/announces']);
    }
  }

  async loadAnnounce(id: string): Promise<void> {
    this.isLoading = true;
    try {
      const response = await this.announceService.getAnnounceById(id);
      this.announce = response.data || null;
      if (!this.announce) {
        this.notificationService.showError('Announce not found');
        this.router.navigate(['/announces']);
      }
    } catch (error) {
      console.error('Error loading announce:', error);
      this.notificationService.showError('Failed to load announce details');
      this.router.navigate(['/announces']);
    } finally {
      this.isLoading = false;
    }
  }

  toggleStatusMenu(): void {
    this.showStatusMenu = !this.showStatusMenu;
  }

  async changeRecordStatus(newStatus: RecordStatus): Promise<void> {
    if (!this.announce || this.isUpdatingStatus) return;

    this.isUpdatingStatus = true;
    this.showStatusMenu = false;

    try {
      console.log('Updating record status to:', newStatus);
      const updateResponse = await this.announceService.updateRecordStatus(this.announce.id, newStatus);
        if (!updateResponse.success) {
            console.error('Error updating record status:', updateResponse.message);
            this.notificationService.showError('Failed to update record status');
            return;
        }
      const newStatusValue = updateResponse.data!.recordStatus;
      this.announce = updateResponse.data!;
      this.notificationService.showSuccess(`Record status updated to "${newStatusValue}"`);
    } catch (error) {
      console.error('Error updating record status:', error);
      this.notificationService.showError('Failed to update record status');
    } finally {
      this.isUpdatingStatus = false;
    }
  }

  getAvailableStatuses(): RecordStatus[] {
    if (!this.announce) return [];
    const allStatuses: RecordStatus[] = ['shown', 'hidden', 'to delete'];
    return allStatuses.filter(status => status !== this.announce!.recordStatus);
  }

  onToggleStatusMenu = (): void => {
    this.toggleStatusMenu();
  };

  onChangeRecordStatus = (status: RecordStatus): void => {
    this.changeRecordStatus(status);
  };
}
