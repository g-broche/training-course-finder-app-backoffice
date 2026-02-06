import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-link-label',
  imports: [RouterLink],
  templateUrl: './app-link-label.component.html',
  styleUrl: './app-link-label.component.scss'
})
export class AppLinkLabelComponent {
  @Input() link: string | (string | number)[] = [];
  @Input() label: string = '';
}
