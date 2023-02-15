import { Component } from '@angular/core'
import { Router } from '@angular/router'
import { HttpService } from '../http/http.service'
import { Observable } from 'rxjs'
import { Location as AngularLocation } from '@angular/common'

@Component({
  selector: 'sched-module-compendium-html',
  templateUrl: './module-compendium-html.component.html',
  styleUrls: ['./module-compendium-html.component.css']
})
export class ModuleCompendiumHtmlComponent {

  moduleCompendium?: Observable<string>

  constructor(
    private readonly router: Router,
    private readonly http: HttpService,
    private readonly location: AngularLocation,
  ) {
    const id: string | null | undefined = this.router.getCurrentNavigation()?.extras?.state?.['id']
    if (id) {
      this.moduleCompendium = http.moduleCompendiumHtmlFile(id)
    } else {
      location.back()
    }
  }
}
