import { Component, ElementRef, ViewChild } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { HttpService } from '../http/http.service'
import { Location as AngularLocation } from '@angular/common'

@Component({
  selector: 'cops-module-rendered-html',
  templateUrl: './module-rendered-html.component.html',
  styleUrls: ['./module-rendered-html.component.css'],
})
export class ModuleRenderedHtmlComponent {
  @ViewChild('shadowRootContainer') shadowRootDiv?: ElementRef
  source = 'Live'
  loading = false

  constructor(
    private readonly route: ActivatedRoute,
    private readonly http: HttpService,
    private readonly location: AngularLocation,
  ) {
    const sourceParam = route.snapshot.queryParamMap.get('source')
    if (sourceParam && sourceParam === 'latest') {
      this.loading = true
      this.source = 'Preview'
    }

    const moduleId: string | null = route.snapshot.paramMap.get('moduleId')
    if (moduleId) {
      const moduleHtmlFile$ =
        this.source === 'Preview'
          ? http.latestModuleHtmlFile(moduleId)
          : http.moduleHtmlFile(moduleId)
      moduleHtmlFile$.subscribe(
        (value) => {
          this.loading = false;
          (this.shadowRootDiv?.nativeElement as HTMLElement).attachShadow({mode: 'open'}).innerHTML = value
        }
      )
    } else {
      location.back()
    }
  }
}
