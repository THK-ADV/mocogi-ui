import { Component } from '@angular/core'
import { HttpService } from '../../http/http.service'
import { Observable } from 'rxjs'
import { ModuleCompendiumList } from '../../types/module-compendium-list'

@Component({
  selector: 'cops-module-compendium-lists-page',
  templateUrl: './module-compendium-lists-page.component.html',
  styleUrls: ['./module-compendium-lists-page.component.css'],
})
export class ModuleCompendiumListsPageComponent {

  moduleCompendiumLists$: Observable<ReadonlyArray<ModuleCompendiumList>>

  // TODO use ngrx
  constructor(private readonly http: HttpService) {
    this.moduleCompendiumLists$ = http.getModuleCompendiumList('wise_2023') // TODO use real semester data
  }
}
