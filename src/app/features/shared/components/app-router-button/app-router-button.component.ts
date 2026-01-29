import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ButtonCategory } from '../../../../models/app.model';

@Component({
  selector: 'app-router-button',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './app-router-button.component.html',
  styleUrl: './app-router-button.component.scss'
})
export class AppRouterButtonComponent {
  @Input() label: string = '';
  @Input() path: string | string[] = '';
  @Input() params?: { [key: string]: any };
  @Input() category: ButtonCategory = 'action';
  @Input() isDisabled: boolean = false;

  get routerLink(): string | string[] {
    if (Array.isArray(this.path)) {
      return this.path;
    }
    return this.path.split('/').filter(segment => segment.length > 0);
  }

  get queryParams(): { [key: string]: any } | undefined {
    return this.params;
  }
}
