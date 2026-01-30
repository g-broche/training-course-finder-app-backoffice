import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonCategory } from '../../../../models/app.model';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app-button.component.html',
  styleUrl: './app-button.component.scss'
})
export class AppButtonComponent {
  @Input() label: string = '';
  @Input() category: ButtonCategory = 'action';
  @Input() buttonType: 'button' | 'submit' = 'button';
  @Input() isDisabled: boolean = false;
  @Output() callback = new EventEmitter<void>();

  handleClick(): void {
    if (!this.isDisabled) {
      this.callback.emit();
    }
  }
}
