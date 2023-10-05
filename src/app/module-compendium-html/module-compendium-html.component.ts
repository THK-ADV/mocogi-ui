import { Component, ElementRef, ViewChild } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { HttpService } from '../http/http.service'
import { Observable } from 'rxjs'
import { Location as AngularLocation } from '@angular/common'
import { ModuleCompendium } from '../types/module-compendium'

@Component({
  selector: 'cops-module-compendium-html',
  templateUrl: './module-compendium-html.component.html',
  styleUrls: ['./module-compendium-html.component.css'],
})
export class ModuleCompendiumHtmlComponent {
  @ViewChild('shadowRootContainer') shadowRootDiv?: ElementRef
  moduleCompendiumHtml?: Observable<string>
  moduleCompendium?: Observable<ModuleCompendium>

  constructor(
    private readonly route: ActivatedRoute,
    private readonly http: HttpService,
    private readonly location: AngularLocation,
  ) {
    const moduleId: string | null | undefined = this.route.snapshot.paramMap.get('moduleId')
    if (moduleId) {
      http.moduleCompendiumHtmlFile(moduleId).subscribe((value) => {
        console.log(this.shadowRootDiv?.nativeElement);
        (this.shadowRootDiv?.nativeElement as HTMLElement).attachShadow({mode: 'open'}).innerHTML= value
      })
      // this.moduleCompendiumHtml = http.moduleCompendiumHtmlFile(id)
      this.moduleCompendium = http.moduleCompendiumById(moduleId)
    } else {
      location.back()
    }
  }
}
