import { Component, OnInit } from '@angular/core'
import { Observable } from 'rxjs'
import { ModuleCompendium } from '../../types/module-compendium'
import { Store } from "@ngrx/store";
import { selectModuleCompendiums } from "../../state/selectors/module-compendiums.selector";
import { ModuleCompendiumsPageActions } from "../../state/actions/module-compendiums.actions";

@Component({
  selector: 'cops-module-compendiums-page',
  templateUrl: './module-compendiums-page.component.html',
  styleUrls: ['./module-compendiums-page.component.css'],
})
export class ModuleCompendiumsPageComponent implements OnInit{

  moduleCompendiums$: Observable<ReadonlyArray<ModuleCompendium>>

  // TODO use ngrx
  constructor(private readonly store: Store) {
    this.moduleCompendiums$ = store.select(selectModuleCompendiums)
  }

  ngOnInit(): void {
    this.store.dispatch(ModuleCompendiumsPageActions.enter())
  }
}
