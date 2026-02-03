import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DetailedDiscussionDTO } from '../../../../models/discussion.model';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { AppRouterButtonComponent } from '../../../shared/components/app-router-button/app-router-button.component';
import { ChipComponent } from "../../../shared/components/chip/chip.component";

@Component({
  selector: 'app-discussion-list',
  standalone: true,
  imports: [CommonModule, RouterModule, LoadingSpinnerComponent, AppRouterButtonComponent, ChipComponent],
  templateUrl: './discussion-list.component.html',
  styleUrl: './discussion-list.component.scss'
})
export class DiscussionListComponent {
  @Input() discussions: DetailedDiscussionDTO[] = [];
  @Input() loading: boolean = false;

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  }

  getMessageCount(discussion: DetailedDiscussionDTO): number {
    return discussion.messages?.length || 0;
  }
}
