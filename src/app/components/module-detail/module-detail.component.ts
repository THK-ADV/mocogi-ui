import { Component } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { HttpService } from '../../http/http.service'
import { Location as AngularLocation } from '@angular/common'
import { EMPTY, Observable } from 'rxjs'

@Component({
  selector: 'cops-module-detail',
  templateUrl: './module-detail.component.html',
  styleUrls: ['./module-detail.component.css'],
})
export class ModuleDetailComponent {
  readonly source: string
  readonly moduleHtml$: Observable<string> = EMPTY

  constructor(
    private readonly route: ActivatedRoute,
    private readonly http: HttpService,
    private readonly location: AngularLocation,
  ) {
    const sourceParam = route.snapshot.queryParamMap.get('source')
    this.source = sourceParam && sourceParam === 'latest' ? 'Preview' : 'Live'
    const moduleId: string | null = route.snapshot.paramMap.get('moduleId')
    if (moduleId) {
      this.moduleHtml$ =
        this.source === 'Preview'
          ? this.http.latestModuleHtmlFile(moduleId)
          : this.http.moduleHtmlFile(moduleId)
    } else {
      location.back()
    }
  }
}
