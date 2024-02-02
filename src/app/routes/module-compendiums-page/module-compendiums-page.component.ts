import { Component } from '@angular/core'
import { Observable } from 'rxjs'
import { ModuleCompendium } from '../../types/module-compendium'
import { Store } from "@ngrx/store";
import { selectModuleCompendiums } from "../../state/selectors/module-compendiums.selector";

@Component({
  selector: 'cops-module-compendiums-page',
  templateUrl: './module-compendiums-page.component.html',
  styleUrls: ['./module-compendiums-page.component.css'],
})
export class ModuleCompendiumsPageComponent {

  moduleCompendiums$: Observable<ReadonlyArray<ModuleCompendium>>

  // TODO use ngrx
  constructor(private readonly store: Store) {
    this.moduleCompendiums$ = store.select(selectModuleCompendiums)
  }
}
