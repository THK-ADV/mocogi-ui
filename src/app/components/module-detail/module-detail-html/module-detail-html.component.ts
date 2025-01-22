import {
  AfterViewInit,
  Component,
  ElementRef,
  input,
  viewChild,
} from '@angular/core'
import { MatCardContent } from '@angular/material/card'

@Component({
  selector: 'cops-module-detail-html',
  imports: [MatCardContent],
  templateUrl: './module-detail-html.component.html',
  styleUrl: './module-detail-html.component.css',
})
export class ModuleDetailHtmlComponent implements AfterViewInit {
  readonly html = input.required<string>()
  readonly shadowDiv = viewChild.required<ElementRef>('shadowRootContainer')

  ngAfterViewInit() {
    const htmlElement = this.shadowDiv().nativeElement as HTMLElement
    htmlElement.attachShadow({ mode: 'open' }).innerHTML = this.html()
  }
}
