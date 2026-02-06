import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DetailedDiscussionDTO } from '../../../models/discussion.model';
import { DiscussionService } from '../../../features/discussions/discussion.service';
import { DiscussionDetailsComponent } from '../../../features/discussions/components/details/discussion-details.component';
import { DiscussionMessagesComponent } from '../../../features/messages/components/chat/chat.component';
import { LoadingSpinnerComponent } from '../../../features/shared/components/loading-spinner/loading-spinner.component';
import { NotificationService } from '../../../features/shared/services/notification.service';
import { ErrorStateComponent } from '../../../features/shared/components/error-state/error-state.component';

@Component({
  selector: 'app-discussion-details-layout',
  standalone: true,
  imports: [
    DiscussionDetailsComponent,
    DiscussionMessagesComponent,
    ErrorStateComponent,
    LoadingSpinnerComponent
  ],
  templateUrl: './discussion-details-layout.component.html',
  styleUrl: './discussion-details-layout.component.scss'
})
export class DiscussionDetailsLayoutComponent implements OnInit {
  discussion: DetailedDiscussionDTO | null = null;
  isLoading = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private discussionService: DiscussionService,
    private notificationService: NotificationService
  ) {}

  async ngOnInit(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      await this.loadDiscussion(id);
    } else {
      this.error = 'No discussion ID provided';
      this.isLoading = false;
    }
  }

  async loadDiscussion(id: string): Promise<void> {
    this.isLoading = true;
    this.error = null;

    try {
      const response = await this.discussionService.getDiscussionById(id);
      
      if (response.success && response.data) {
        this.discussion = response.data;
        
        // Sort messages by index
        if (this.discussion.messages) {
          this.discussion.messages.sort((a, b) => a.index - b.index);
        }
      } else {
        this.error = response.message || 'Failed to load discussion';
        this.notificationService.showError(this.error);
      }
    } catch (error) {
      console.error('Error loading discussion:', error);
      this.error = 'An error occurred while loading the discussion';
      this.notificationService.showError(this.error);
    } finally {
      this.isLoading = false;
    }
  }
}
