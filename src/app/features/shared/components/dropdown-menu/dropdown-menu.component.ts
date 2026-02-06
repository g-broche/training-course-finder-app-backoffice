import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppButtonComponent } from '../app-button/app-button.component';
import { ButtonCategory } from '../../../../models/app.model';

export interface DropdownMenuItem<T = any> {
  label: string;
  value: T;
  disabled?: boolean;
}

@Component({
  selector: 'app-dropdown-menu',
  standalone: true,
  imports: [CommonModule, AppButtonComponent],
  templateUrl: './dropdown-menu.component.html',
  styleUrl: './dropdown-menu.component.scss'
})
export class DropdownMenuComponent<T = any> {
  @Input() buttonLabel: string = 'Select';
  @Input() loadingLabel: string = 'Loading...';
  @Input() isLoading: boolean = false;
  @Input() isDisabled: boolean = false;
  @Input() buttonCategory: ButtonCategory = 'action';
  @Input() menuItems: DropdownMenuItem<T>[] = [];
  @Output() itemSelected = new EventEmitter<T>();

  showMenu: boolean = false;

  toggleMenu(): void {
    if (!this.isLoading && !this.isDisabled) {
      this.showMenu = !this.showMenu;
    }
  }

  selectItem(item: DropdownMenuItem<T>): void {
    if (!item.disabled) {
      this.showMenu = false;
      this.itemSelected.emit(item.value);
    }
  }

  getButtonLabel(): string {
    return this.isLoading ? this.loadingLabel : this.buttonLabel;
  }
}
