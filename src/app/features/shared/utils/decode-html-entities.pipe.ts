import { Pipe, PipeTransform } from '@angular/core';
import { decode } from 'he';

@Pipe({
  name: 'decodeHtmlEntities',
  standalone: true
})
export class DecodeHtmlEntitiesPipe implements PipeTransform {
  transform(content: string | null | undefined): string {
    if (!content) {
      return '';
    }

    // Decode twice to support double-escaped values like &amp;eacute;.
    let decoded = content;
    for (let i = 0; i < 2; i++) {
      const next = decode(decoded);
      if (next === decoded) {
        break;
      }
      decoded = next;
    }

    return decoded;
  }
}