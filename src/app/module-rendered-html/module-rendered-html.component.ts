import { Component, ElementRef, ViewChild } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { HttpService } from '../http/http.service'
import { Observable } from 'rxjs'
import { Location as AngularLocation } from '@angular/common'
import { ModuleDescription } from '../types/module'

@Component({
  selector: 'cops-module-rendered-html',
  templateUrl: './module-rendered-html.component.html',
  styleUrls: ['./module-rendered-html.component.css'],
})
export class ModuleRenderedHtmlComponent {
  @ViewChild('shadowRootContainer') shadowRootDiv?: ElementRef
  moduleCompendiumHtml?: Observable<string>
  moduleCompendium?: Observable<ModuleDescription>

  constructor(
    private readonly route: ActivatedRoute,
    private readonly http: HttpService,
    private readonly location: AngularLocation,
  ) {
    const moduleId: string | null | undefined = this.route.snapshot.paramMap.get('moduleId')
    if (moduleId) {
      http.moduleCompendiumHtmlFile(moduleId).subscribe((value) => {
        (this.shadowRootDiv?.nativeElement as HTMLElement).attachShadow({mode: 'open'}).innerHTML= value
      })
      this.moduleCompendium = http.moduleCompendiumById(moduleId)
    } else {
      location.back()
    }
  }
}
