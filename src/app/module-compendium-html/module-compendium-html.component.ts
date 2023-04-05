import { Component } from '@angular/core'
import { Router } from '@angular/router'
import { HttpService } from '../http/http.service'
import { Observable, tap } from 'rxjs'
import { Location as AngularLocation } from '@angular/common'
import { ModuleCompendium } from '../types/module-compendium'

@Component({
  selector: 'sched-module-compendium-html',
  templateUrl: './module-compendium-html.component.html',
  styleUrls: ['./module-compendium-html.component.css']
})
export class ModuleCompendiumHtmlComponent {

  moduleCompendiumHtml?: Observable<string>
  moduleCompendium?: Observable<ModuleCompendium>

  constructor(
    private readonly router: Router,
    private readonly http: HttpService,
    private readonly location: AngularLocation,
  ) {
    const id: string | null | undefined = this.router.getCurrentNavigation()?.extras?.state?.['id']
    if (id) {
      this.moduleCompendiumHtml = http.moduleCompendiumHtmlFile(id)
      this.moduleCompendium = http.moduleCompendiumById(id)
    } else {
      location.back()
    }
  }
}
