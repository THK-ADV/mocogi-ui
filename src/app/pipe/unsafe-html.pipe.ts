import { Pipe, PipeTransform } from '@angular/core'
import { DomSanitizer } from '@angular/platform-browser'

@Pipe({
  name: 'unsafeHtml',
  standalone: false,
})
export class UnsafeHtmlPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(value: unknown): unknown {
    if (typeof value === 'string') {
      return this.sanitizer.bypassSecurityTrustHtml(value)
    }
    return value
  }
}
